import { getDb } from '@/db';
import { monitorRequests } from '@/db/app.schema';
import { enforceRateLimit } from '@/lib/rate-limit';
import { adminApiMiddleware } from '@/middlewares/admin-middleware';
import { createServerFn } from '@tanstack/react-start';
import { and, count as countFn, desc, eq, or, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { z } from 'zod';

export const monitorRequestStatusSchema = z.enum([
  'new',
  'reviewing',
  'accepted',
  'rejected',
  'active',
  'paused',
]);

export type MonitorRequestStatus = z.infer<typeof monitorRequestStatusSchema>;

const createMonitorRequestInputSchema = z.object({
  name: z.string().trim().max(80).optional().or(z.literal('')),
  email: z.string().trim().email().max(254),
  url: z.string().trim().url().max(2000),
  source: z.string().trim().max(80).optional(),
  notes: z.string().trim().max(1000).optional().or(z.literal('')),
});

const listMonitorRequestsInputSchema = z.object({
  pageIndex: z.number().int().min(0),
  pageSize: z.number().int().min(1).max(100),
  search: z.string().optional(),
  status: monitorRequestStatusSchema.optional(),
});

export const createMonitorRequest = createServerFn({ method: 'POST' })
  .inputValidator(createMonitorRequestInputSchema)
  .handler(async ({ data }) => {
    await enforceRateLimit('contact');

    const now = new Date();
    const id = `mon_${crypto.randomUUID()}`;
    const name = data.name?.trim() || null;
    const notes = data.notes?.trim() || null;
    const source = data.source?.trim() || 'contact';

    await getDb().insert(monitorRequests).values({
      id,
      status: 'new',
      email: data.email.trim().toLowerCase(),
      name,
      url: data.url.trim(),
      source,
      notes,
      createdAt: now,
      updatedAt: now,
    });

    return { id, success: true };
  });

export const listMonitorRequests = createServerFn({ method: 'GET' })
  .inputValidator(listMonitorRequestsInputSchema)
  .middleware([adminApiMiddleware])
  .handler(async ({ data }) => {
    const db = getDb();
    const { pageIndex, pageSize, status } = data;
    const search = data.search?.trim() ?? '';
    const offset = pageIndex * pageSize;
    const conditions: SQL[] = [];

    if (status) {
      conditions.push(eq(monitorRequests.status, status));
    }

    if (search) {
      const pattern = `%${escapeLike(search)}%`;
      conditions.push(
        or(
          sql`lower(${monitorRequests.email}) like lower(${pattern}) escape '\\'`,
          sql`lower(${monitorRequests.url}) like lower(${pattern}) escape '\\'`,
          sql`lower(${monitorRequests.name}) like lower(${pattern}) escape '\\'`,
          sql`lower(${monitorRequests.source}) like lower(${pattern}) escape '\\'`,
          sql`lower(${monitorRequests.notes}) like lower(${pattern}) escape '\\'`
        )!
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const selectQuery = db
      .select()
      .from(monitorRequests)
      .where(where)
      .orderBy(desc(monitorRequests.createdAt))
      .limit(pageSize)
      .offset(offset);
    const countQuery = db
      .select({ count: countFn() })
      .from(monitorRequests)
      .where(where);

    const [items, [{ count }]] = await Promise.all([selectQuery, countQuery]);

    return {
      items,
      total: Number(count),
    };
  });

function escapeLike(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
}
