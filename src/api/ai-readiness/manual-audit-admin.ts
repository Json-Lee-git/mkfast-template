import { getDb } from '@/db';
import { manualAuditOrders } from '@/db/app.schema';
import { adminApiMiddleware } from '@/middlewares/admin-middleware';
import { createServerFn } from '@tanstack/react-start';
import { and, count as countFn, desc, eq, or, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { z } from 'zod';
import { resendManualAuditOrderNotification } from './manual-audit-orders';

const manualAuditOrderStatusSchema = z.enum([
  'pending',
  'checkout_failed',
  'paid',
  'notified',
  'notification_failed',
]);

const listManualAuditOrdersInputSchema = z.object({
  pageIndex: z.number().int().min(0),
  pageSize: z.number().int().min(1).max(100),
  search: z.string().optional(),
  status: manualAuditOrderStatusSchema.optional(),
});

const retryManualAuditOrderNotificationInputSchema = z.object({
  orderId: z.string().min(1),
});

export const listManualAuditOrders = createServerFn({ method: 'GET' })
  .inputValidator(listManualAuditOrdersInputSchema)
  .middleware([adminApiMiddleware])
  .handler(async ({ data }) => {
    const db = getDb();
    const { pageIndex, pageSize, status } = data;
    const search = data.search?.trim() ?? '';
    const offset = pageIndex * pageSize;
    const conditions: SQL[] = [];

    if (status) {
      conditions.push(eq(manualAuditOrders.status, status));
    }

    if (search) {
      const pattern = `%${escapeLike(search)}%`;
      conditions.push(
        or(
          sql`lower(${manualAuditOrders.email}) like lower(${pattern}) escape '\\'`,
          sql`lower(${manualAuditOrders.websiteUrl}) like lower(${pattern}) escape '\\'`,
          sql`lower(${manualAuditOrders.requestId}) like lower(${pattern}) escape '\\'`,
          sql`lower(${manualAuditOrders.checkoutId}) like lower(${pattern}) escape '\\'`
        )!
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const selectQuery = db
      .select()
      .from(manualAuditOrders)
      .where(where)
      .orderBy(desc(manualAuditOrders.createdAt))
      .limit(pageSize)
      .offset(offset);
    const countQuery = db
      .select({ count: countFn() })
      .from(manualAuditOrders)
      .where(where);

    const [items, [{ count }]] = await Promise.all([selectQuery, countQuery]);

    return {
      items,
      total: Number(count),
    };
  });

export const retryManualAuditOrderNotification = createServerFn({
  method: 'POST',
})
  .inputValidator(retryManualAuditOrderNotificationInputSchema)
  .middleware([adminApiMiddleware])
  .handler(async ({ data }) => {
    await resendManualAuditOrderNotification(data.orderId);
    return { success: true };
  });

function escapeLike(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
}
