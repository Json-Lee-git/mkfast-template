import { env } from 'cloudflare:workers';
import { getDb } from '@/db';
import { aiUsage } from '@/db/app.schema';
import { gte, and, eq } from 'drizzle-orm';

// Workers AI free tier model — fast, capable, zero cost
const DEFAULT_MODEL = '@cf/meta/llama-3.1-8b-instruct';

const DAILY_LIMIT = 100;

/**
 * Track AI call in D1. Non-blocking — failures are silently ignored
 * so usage tracking never breaks the user experience.
 */
function trackUsage(feature: string, success: boolean) {
  const db = getDb();
  db.insert(aiUsage)
    .values({
      feature,
      success,
      createdAt: new Date(),
    })
    .run()
    .catch(() => {});
}

/**
 * Count today's successful AI calls for a feature.
 * Returns Infinity if D1 is unavailable (fails open).
 */
async function todayUsage(feature: string): Promise<number> {
  try {
    const db = getDb();
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const rows = await db
      .select()
      .from(aiUsage)
      .where(
        and(
          eq(aiUsage.feature, feature),
          eq(aiUsage.success, true),
          gte(aiUsage.createdAt, today),
        ),
      );
    return rows.length;
  } catch {
    return 0; // Fails open — allow the call if tracking is down
  }
}

interface AiCallOptions {
  feature: string;
  model?: string;
  systemPrompt?: string;
  userPrompt: string;
  maxTokens?: number;
}

interface AiCallResult {
  text: string;
}

/**
 * Call Workers AI with daily limit enforcement and graceful degradation.
 * Returns null when AI is unavailable, over limit, or errors — callers
 * must fall back to rule-based logic.
 */
export async function runAi(opts: AiCallOptions): Promise<AiCallResult | null> {
  const feature = opts.feature;

  // Daily limit check
  const count = await todayUsage(feature);
  if (count >= DAILY_LIMIT) {
    console.log(`AI daily limit reached for ${feature} (${count}/${DAILY_LIMIT})`);
    return null;
  }

  try {
    const messages: Array<{ role: string; content: string }> = [];
    if (opts.systemPrompt) {
      messages.push({ role: 'system', content: opts.systemPrompt });
    }
    messages.push({ role: 'user', content: opts.userPrompt });

    const response = await env.AI.run(opts.model || DEFAULT_MODEL, {
      messages,
      max_tokens: opts.maxTokens || 1024,
    });

    trackUsage(feature, true);

    // Workers AI response can be a string or { response: string }
    const text =
      typeof response === 'string'
        ? response
        : (response as { response?: string }).response || '';

    return { text };
  } catch (err) {
    console.error(`AI call failed for ${feature}:`, err);
    trackUsage(feature, false);
    return null;
  }
}

/**
 * Parse a JSON response from AI, handling markdown code fences.
 */
export function parseAiJson(text: string): unknown | null {
  // Strip markdown fences
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}
