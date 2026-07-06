import { eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { manualAuditOrders } from '@/db/app.schema';
import { websiteConfig } from '@/config/website';
import { buildManualAuditNotificationPayload } from './manual-audit-notification';
import { sendEmail } from '@/mail';
import { getBaseUrl } from '@/lib/urls';
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

  const reportUrl = trimOptional(data.reportUrl) ?? existing.reportUrl;
  const deliveryNotes =
    trimOptional(data.deliveryNotes) ?? existing.deliveryNotes;

  if (!reportUrl) {
    throw new Error('Report URL is required before delivery');
  }

  const db = getDb();
  const now = new Date();

  try {
    await sendManualAuditDeliveryEmail({
      deliveryNotes: deliveryNotes ?? undefined,
      email: existing.email,
      orderId: existing.id,
      reportUrl,
      websiteUrl: existing.websiteUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await db
      .update(manualAuditOrders)
      .set({
        reportUrl,
        deliveryNotes: deliveryNotes ?? null,
        notificationError: message.slice(0, 1000),
        updatedAt: now,
      })
      .where(eq(manualAuditOrders.id, existing.id));
    throw error;
  }

  await db
    .update(manualAuditOrders)
    .set({
      status: 'delivered',
      reportUrl,
      deliveryNotes: deliveryNotes ?? null,
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
  const payload = buildManualAuditNotificationPayload({
    checkoutId: data.checkoutId,
    order: data.order,
    orderId: data.orderId,
    webhookUrl: webhookUrl ?? '',
  });

  if (!webhookUrl) {
    if (!isConsoleFallbackEnabled()) {
      throw new Error('CONTACT_WEBHOOK_URL environment variable is not set');
    }
    console.log('Manual audit order:', payload);
    return;
  }

  await fetchWithRetry(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

// ─── Retry helpers ──────────────────────────────────────────

/** Max attempts for webhook delivery (1 initial + 2 retries). */
const NOTIFY_MAX_ATTEMPTS = 3;
/** Base delay in ms for exponential backoff. */
const NOTIFY_RETRY_BASE_MS = 1000;

/**
 * Fetch with exponential backoff retry for transient failures.
 *
 * Retries on: network errors (fetch throws) and 5xx responses.
 * Does NOT retry on: 4xx responses (bad request, won't become valid).
 */
async function fetchWithRetry(
  url: string,
  init: RequestInit
): Promise<Response> {
  let lastError: unknown;
  for (let i = 0; i < NOTIFY_MAX_ATTEMPTS; i++) {
    try {
      const response = await fetch(url, init);
      if (response.ok) return response;

      // 4xx errors are not retryable — they indicate a client-side problem
      if (response.status >= 400 && response.status < 500) {
        const body = await response.text().catch(() => '');
        throw new Error(
          `Manual audit notification failed (${response.status}): ${body.slice(0, 1000)}`
        );
      }

      // 5xx: log and retry
      const body = await response.text().catch(() => '');
      lastError = new Error(
        `Manual audit notification failed (${response.status}): ${body.slice(0, 1000)}`
      );
      console.warn(
        `Webhook attempt ${i + 1}/${NOTIFY_MAX_ATTEMPTS} failed (${response.status}), retrying...`
      );
    } catch (err) {
      // Don't retry if the error is already a "not retryable" 4xx error
      if (
        err instanceof Error &&
        err.message.startsWith('Manual audit notification failed (4')
      ) {
        throw err;
      }
      lastError = err;
      console.warn(
        `Webhook attempt ${i + 1}/${NOTIFY_MAX_ATTEMPTS} error, retrying...`
      );
    }

    if (i < NOTIFY_MAX_ATTEMPTS - 1) {
      await sleep(NOTIFY_RETRY_BASE_MS * 2 ** i);
    }
  }

  throw (
    lastError ?? new Error('Manual audit notification failed after all retries')
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendManualAuditDeliveryEmail(data: {
  deliveryNotes?: string;
  email: string;
  orderId: string;
  reportUrl: string;
  websiteUrl: string;
}) {
  const fromEmail =
    process.env.RESEND_FROM_EMAIL ??
    websiteConfig.mail?.fromEmail ??
    'AEOCheck <support@aeocheck.xyz>';
  const supportEmail =
    websiteConfig.mail?.supportEmail ??
    websiteConfig.metadata?.supportEmail ??
    'support@aeocheck.xyz';
  const subject = `Your AI Search Readiness Audit is ready: ${data.websiteUrl}`;
  const text = buildManualAuditDeliveryText({ ...data, supportEmail });
  const html = buildManualAuditDeliveryHtml({ ...data, supportEmail });

  await sendEmail({
    from: fromEmail,
    to: data.email,
    replyTo: supportEmail,
    subject,
    html,
    text,
  });
}

function buildManualAuditDeliveryText(data: {
  deliveryNotes?: string;
  orderId: string;
  reportUrl: string;
  supportEmail: string;
  websiteUrl: string;
}) {
  return [
    `Your AI Search Readiness Audit for ${data.websiteUrl} is ready.`,
    '',
    `Report: ${data.reportUrl}`,
    data.deliveryNotes ? `Notes: ${data.deliveryNotes}` : undefined,
    '',
    `Order ID: ${data.orderId}`,
    `Questions? Reply to this email or contact ${data.supportEmail}.`,
  ]
    .filter(Boolean)
    .join('\n');
}

function buildManualAuditDeliveryHtml(data: {
  deliveryNotes?: string;
  orderId: string;
  reportUrl: string;
  supportEmail: string;
  websiteUrl: string;
}) {
  const notes = data.deliveryNotes
    ? `<p style="margin:16px 0 0;color:#334155;"><strong>Notes:</strong> ${escapeHtml(
        data.deliveryNotes
      )}</p>`
    : '';

  return `<!doctype html>
<html>
  <body style="margin:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <div style="max-width:640px;margin:0 auto;padding:32px 20px;">
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;padding:28px;">
        <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Your AI Search Readiness Audit for <strong>${escapeHtml(
          data.websiteUrl
        )}</strong> is ready.</p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#334155;">You can access the report using the link below.</p>
        <p style="margin:0 0 24px;"><a href="${escapeAttribute(
          data.reportUrl
        )}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;border-radius:6px;padding:12px 18px;font-weight:600;">Open report</a></p>
        <p style="margin:0;font-size:13px;line-height:1.6;color:#64748b;word-break:break-all;">${escapeHtml(
          data.reportUrl
        )}</p>
        ${notes}
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
        <p style="margin:0;font-size:13px;line-height:1.6;color:#64748b;">Order ID: ${escapeHtml(
          data.orderId
        )}</p>
        <p style="margin:8px 0 0;font-size:13px;line-height:1.6;color:#64748b;">Questions? Reply to this email or contact ${escapeHtml(
          data.supportEmail
        )}.</p>
      </div>
    </div>
  </body>
</html>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replace(/`/g, '&#96;');
}

function isConsoleFallbackEnabled() {
  const baseUrl = getBaseUrl();
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
