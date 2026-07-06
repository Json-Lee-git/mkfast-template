import { authApiMiddleware } from '@/middlewares/auth-middleware';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { getDb } from '@/db';
import { aiVisibilitySnapshots } from '@/db/app.schema';
import { desc, eq, and, gte } from 'drizzle-orm';

// ─── Save snapshot (client calls after each audit) ──────────

const saveInput = z.object({
  url: z.string().trim().min(1),
  resultJson: z.string().min(1),
  score: z.number().int().min(0).max(100),
  scoreLabel: z.string(),
});

/** Save an AI visibility snapshot after a completed audit. */
export const saveVisibilitySnapshot = createServerFn({ method: 'POST' })
  .middleware([authApiMiddleware])
  .inputValidator(saveInput)
  .handler(async ({ data, context }) => {
    await getDb().insert(aiVisibilitySnapshots).values({
      id: crypto.randomUUID(),
      userId: context.userId,
      url: data.url,
      score: data.score,
      scoreLabel: data.scoreLabel,
      resultJson: data.resultJson,
      createdAt: new Date(),
    });
    return { success: true };
  });

// ─── Query history ────────────────────────────────────────────

const historyInput = z.object({
  url: z.string().trim().min(1).optional(),
  days: z.number().int().min(7).max(365).default(90),
});

export interface SnapshotSummary {
  id: string;
  url: string;
  score: number;
  scoreLabel: string;
  createdAt: string;
}

/** Get visibility trend for the authenticated user. */
export const getVisibilityHistory = createServerFn({ method: 'GET' })
  .middleware([authApiMiddleware])
  .inputValidator(historyInput)
  .handler(async ({ data, context }): Promise<SnapshotSummary[]> => {
    const db = getDb();
    const since = new Date(Date.now() - data.days * 86_400_000);

    const conditions = [
      eq(aiVisibilitySnapshots.userId, context.userId),
      gte(aiVisibilitySnapshots.createdAt, since),
    ];
    if (data.url) conditions.push(eq(aiVisibilitySnapshots.url, data.url));

    const rows = await db
      .select({
        id: aiVisibilitySnapshots.id,
        url: aiVisibilitySnapshots.url,
        score: aiVisibilitySnapshots.score,
        scoreLabel: aiVisibilitySnapshots.scoreLabel,
        createdAt: aiVisibilitySnapshots.createdAt,
      })
      .from(aiVisibilitySnapshots)
      .where(and(...conditions))
      .orderBy(desc(aiVisibilitySnapshots.createdAt))
      .limit(200);

    return rows.map((r) => ({
      id: r.id,
      url: r.url,
      score: r.score,
      scoreLabel: r.scoreLabel,
      createdAt: new Date(r.createdAt).toISOString(),
    }));
  });
