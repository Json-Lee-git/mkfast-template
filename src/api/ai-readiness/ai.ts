import { env } from 'cloudflare:workers';
import { getDb } from '@/db';
import { aiUsage } from '@/db/app.schema';
import { gte, and, eq } from 'drizzle-orm';

// Workers AI free tier model — fast, capable, zero cost
const DEFAULT_MODEL = '@cf/meta/llama-4-scout-17b-16e-instruct';

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
          gte(aiUsage.createdAt, today)
        )
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
    console.log(
      `AI daily limit reached for ${feature} (${count}/${DAILY_LIMIT})`
    );
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
 * Parse a JSON response from AI, handling various markdown wrapping patterns.
 * Tries multiple extraction strategies before giving up.
 */
export function parseAiJson(text: string): unknown | null {
  let cleaned = text.trim();

  // Strategy 1: extract JSON from markdown code fences anywhere in response
  const fenceMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  // Strategy 2: find first { } or [ ] block
  if (!fenceMatch) {
    const firstBrace = cleaned.indexOf('{');
    const firstBracket = cleaned.indexOf('[');
    if (firstBrace >= 0 || firstBracket >= 0) {
      const start =
        firstBrace >= 0 && (firstBrace < firstBracket || firstBracket < 0)
          ? firstBrace
          : firstBracket;
      cleaned = cleaned.slice(start);
      // Try to find matching end
      let depth = 0;
      let end = -1;
      for (let i = 0; i < cleaned.length; i++) {
        const ch = cleaned[i];
        if (ch === '{' || ch === '[') depth++;
        else if (ch === '}' || ch === ']') {
          depth--;
          if (depth === 0) {
            end = i + 1;
            break;
          }
        }
      }
      if (end > 0) cleaned = cleaned.slice(0, end);
    }
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}
