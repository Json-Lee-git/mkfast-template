import { eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { manualAuditOrders } from '@/db/app.schema';
import { normalizeUrlKeepPath } from './shared';

export type ManualAuditOrder = {
  websiteUrl: string;
  email: string;
  competitors?: string;
  notes?: string;
};

type ManualAuditOrderRecord = typeof manualAuditOrders.$inferSelect;

export async function createPendingManualAuditOrder(input: ManualAuditOrder) {
  const order = normalizeOrder(input);
  const orderId = crypto.randomUUID();
  const requestId = crypto.randomUUID();
  const now = new Date();

  await getDb().insert(manualAuditOrders).values({
    id: orderId,
    status: 'pending',
    requestId,
    websiteUrl: order.websiteUrl,
    email: order.email,
    competitors: order.competitors,
    notes: order.notes,
    createdAt: now,
    updatedAt: now,
  });

  return { order, orderId, requestId };
}

export async function recordManualAuditCheckoutId(
  orderId: string,
  checkoutId: string
) {
  await getDb()
    .update(manualAuditOrders)
    .set({ checkoutId, updatedAt: new Date() })
    .where(eq(manualAuditOrders.id, orderId));
}

export async function markManualAuditCheckoutFailed(
  orderId: string,
  reason: string
) {
  await getDb()
    .update(manualAuditOrders)
    .set({
      status: 'checkout_failed',
      notificationError: reason,
      updatedAt: new Date(),
    })
    .where(eq(manualAuditOrders.id, orderId));
}

export async function completeManualAuditOrder(data: {
  checkoutId?: string;
  orderId?: string;
  requestId?: string;
  order: ManualAuditOrder;
}) {
  const db = getDb();
  const existing = await findManualAuditOrder({
    orderId: data.orderId,
    requestId: data.requestId,
    checkoutId: data.checkoutId,
  });
  const order = normalizeOrder(
    existing
      ? {
          websiteUrl: existing.websiteUrl,
          email: existing.email,
          competitors: existing.competitors ?? undefined,
          notes: existing.notes ?? undefined,
        }
      : data.order
  );

  if (existing?.status === 'notified' || existing?.status === 'delivered') {
    return;
  }

  const now = new Date();
  const orderId = existing?.id ?? data.orderId ?? crypto.randomUUID();
  const requestId =
    existing?.requestId ?? data.requestId ?? crypto.randomUUID();

  if (existing) {
    await db
      .update(manualAuditOrders)
      .set({
        status: 'paid',
        checkoutId: data.checkoutId ?? existing.checkoutId,
        paidAt: existing.paidAt ?? now,
        notificationError: null,
        updatedAt: now,
      })
      .where(eq(manualAuditOrders.id, existing.id));
  } else {
    await db.insert(manualAuditOrders).values({
      id: orderId,
      status: 'paid',
      checkoutId: data.checkoutId,
      requestId,
      websiteUrl: order.websiteUrl,
      email: order.email,
      competitors: order.competitors,
      notes: order.notes,
      createdAt: now,
      paidAt: now,
      updatedAt: now,
    });
  }

  try {
    await notifyManualAuditOrder({
      checkoutId: data.checkoutId,
      orderId,
      order,
    });
    await db
      .update(manualAuditOrders)
      .set({
        status: 'notified',
        notifiedAt: new Date(),
        notificationError: null,
        updatedAt: new Date(),
      })
      .where(eq(manualAuditOrders.id, orderId));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await db
      .update(manualAuditOrders)
      .set({
        status: 'notification_failed',
        notificationError: message.slice(0, 1000),
        updatedAt: new Date(),
      })
      .where(eq(manualAuditOrders.id, orderId));
    throw error;
  }
}

export async function markManualAuditOrderDelivered(data: {
  orderId: string;
  reportUrl?: string;
  deliveryNotes?: string;
}) {
  const existing = await findManualAuditOrder({ orderId: data.orderId });

  if (!existing) {
    throw new Error('Manual audit order not found');
  }

  if (existing.status === 'pending' || existing.status === 'checkout_failed') {
    throw new Error('Only paid manual audit orders can be delivered');
  }

  const now = new Date();
  await getDb()
    .update(manualAuditOrders)
    .set({
      status: 'delivered',
      reportUrl: trimOptional(data.reportUrl) ?? null,
      deliveryNotes: trimOptional(data.deliveryNotes) ?? null,
      deliveredAt: existing.deliveredAt ?? now,
      notificationError: null,
      updatedAt: now,
    })
    .where(eq(manualAuditOrders.id, existing.id));
}

export async function resendManualAuditOrderNotification(orderId: string) {
  const db = getDb();
  const existing = await findManualAuditOrder({ orderId });

  if (!existing) {
    throw new Error('Manual audit order not found');
  }

  const order = normalizeOrder({
    websiteUrl: existing.websiteUrl,
    email: existing.email,
    competitors: existing.competitors ?? undefined,
    notes: existing.notes ?? undefined,
  });

  try {
    await notifyManualAuditOrder({
      checkoutId: existing.checkoutId ?? undefined,
      orderId: existing.id,
      order,
    });
    await db
      .update(manualAuditOrders)
      .set({
        status: 'notified',
        notifiedAt: new Date(),
        notificationError: null,
        updatedAt: new Date(),
      })
      .where(eq(manualAuditOrders.id, existing.id));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await db
      .update(manualAuditOrders)
      .set({
        status: 'notification_failed',
        notificationError: message.slice(0, 1000),
        updatedAt: new Date(),
      })
      .where(eq(manualAuditOrders.id, existing.id));
    throw error;
  }
}

async function notifyManualAuditOrder(data: {
  checkoutId?: string;
  orderId: string;
  order: ManualAuditOrder;
}) {
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  const payload = {
    type: 'manual-audit-order',
    orderId: data.orderId,
    checkoutId: data.checkoutId ?? '',
    websiteUrl: data.order.websiteUrl.trim(),
    email: data.order.email.trim(),
    competitors: data.order.competitors?.trim() ?? '',
    notes: data.order.notes?.trim() ?? '',
    submittedAt: new Date().toISOString(),
  };

  if (!webhookUrl) {
    if (!isConsoleFallbackEnabled()) {
      throw new Error('CONTACT_WEBHOOK_URL environment variable is not set');
    }
    console.log('Manual audit order:', payload);
    return;
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(
      `Manual audit notification failed (${response.status}): ${body.slice(
        0,
        1000
      )}`
    );
  }
}

function isConsoleFallbackEnabled() {
  const baseUrl = process.env.VITE_BASE_URL ?? '';
  return (
    process.env.MANUAL_AUDIT_LOG_FALLBACK === 'true' ||
    baseUrl.includes('localhost') ||
    baseUrl.includes('127.0.0.1')
  );
}

async function findManualAuditOrder(data: {
  orderId?: string;
  requestId?: string;
  checkoutId?: string;
}): Promise<ManualAuditOrderRecord | undefined> {
  const db = getDb();
  if (data.orderId) {
    const [order] = await db
      .select()
      .from(manualAuditOrders)
      .where(eq(manualAuditOrders.id, data.orderId))
      .limit(1);
    if (order) return order;
  }
  if (data.requestId) {
    const [order] = await db
      .select()
      .from(manualAuditOrders)
      .where(eq(manualAuditOrders.requestId, data.requestId))
      .limit(1);
    if (order) return order;
  }
  if (data.checkoutId) {
    const [order] = await db
      .select()
      .from(manualAuditOrders)
      .where(eq(manualAuditOrders.checkoutId, data.checkoutId))
      .limit(1);
    if (order) return order;
  }
}

function normalizeOrder(order: ManualAuditOrder): ManualAuditOrder {
  return {
    websiteUrl: normalizeUrlKeepPath(order.websiteUrl),
    email: order.email.trim().toLowerCase(),
    competitors: trimOptional(order.competitors),
    notes: trimOptional(order.notes),
  };
}

function trimOptional(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}
