/**
 * D1-backed rate limiter for Cloudflare Workers server functions.
 *
 * Uses the ai_usage table for counting since it already has feature/createdAt
 * columns. Each "feature" namespace tracks its own window.
 *
 * Design choices:
 * - Fails open: if D1 is unavailable, the request is allowed through.
 *   A broken rate limiter should never block legitimate traffic.
 * - Sliding window: counts requests in the last N seconds using the
 *   ai_usage.createdAt timestamp.
 * - Lightweight: uses COUNT(*) with a single WHERE filter — no extra
 *   tables or migrations needed for basic rate limiting. If you need
 *   IP-based limits, add ip_hash / session_id columns to ai_usage.
 */

import { getDb } from '@/db';
import { aiUsage } from '@/db/app.schema';
import { TooManyRequestsError } from '@/lib/errors';
import { sql } from 'drizzle-orm';

/** Default limits per endpoint type */
export const RATE_LIMITS = {
  contact: { max: 5, windowSec: 300 },
  leadCapture: { max: 10, windowSec: 300 },
  aeoCheck: { max: 20, windowSec: 60 },
  llmsTxtCheck: { max: 30, windowSec: 60 },
  queryFanOut: { max: 30, windowSec: 60 },
  llmsGenerate: { max: 10, windowSec: 60 },
  conversionEvent: { max: 60, windowSec: 60 },
  reportResend: { max: 3, windowSec: 300 },
} as const;

export type RateLimitKey = keyof typeof RATE_LIMITS;

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

/**
 * Check whether a request should be rate-limited.
 *
 * @param key     Identifies the endpoint being rate-limited.
 * @returns       { allowed, remaining, resetAt }
 */
export async function checkRateLimit(
  key: RateLimitKey
): Promise<RateLimitResult> {
  const limit = RATE_LIMITS[key];
  if (!limit) return { allowed: true, remaining: -1, resetAt: new Date() };

  try {
    const db = getDb();
    const windowStart = new Date(Date.now() - limit.windowSec * 1000);

    const [row] = await db
      .select({ count: sql<number>`count(*)` })
      .from(aiUsage)
      .where(
        sql`${aiUsage.feature} = ${`ratelimit:${key}`} AND ${aiUsage.createdAt} >= ${windowStart.getTime()}`
      );

    const count = row?.count ?? 0;
    const remaining = Math.max(0, limit.max - count - 1); // -1 for the current request

    // Record this request (fire-and-forget — don't block on insert)
    db.insert(aiUsage)
      .values({
        feature: `ratelimit:${key}`,
        success: true,
        createdAt: new Date(),
      })
      .run()
      .catch(() => {});

    const resetAt = new Date(windowStart.getTime() + limit.windowSec * 1000);

    return { allowed: count < limit.max, remaining, resetAt };
  } catch {
    // Fails open — never block a request because the rate limiter is down
    return { allowed: true, remaining: -1, resetAt: new Date() };
  }
}

/**
 * Helpers that throw a friendly rate-limit error when the limit is exceeded.
 * Use in server function handlers.
 */

/**
 * Enforce rate limit: throws TooManyRequestsError if limit exceeded.
 *
 * @param key Identifies the endpoint being rate-limited.
 * @returns  { remaining, resetAt } on success.
 * @throws   TooManyRequestsError when the limit is exceeded.
 */
export async function enforceRateLimit(key: RateLimitKey) {
  const result = await checkRateLimit(key);
  if (!result.allowed) {
    throw new TooManyRequestsError(
      `Rate limit exceeded for ${key}. Try again in ${RATE_LIMITS[key].windowSec}s.`,
      RATE_LIMITS[key].windowSec
    );
  }
  return result;
}

export function rateLimitHeaders(
  result: RateLimitResult
): Record<string, string> {
  return {
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': result.resetAt.toISOString(),
  };
}
