import { createFileRoute } from '@tanstack/react-router';
import {
  formatWebhookErrorMessage,
  shouldExposeManualAuditSmokeErrorDetail,
} from './-creem-diagnostics';
import { handleWebhookEvent, isPaymentEnabled } from '@/payment';
import { getDb } from '@/db';
import { reportTokens, webhookEvents } from '@/db/app.schema';
import { verifyCreemWebhookSignature } from '@/lib/creem-webhook';
import { normalizeEmail } from '@/api/ai-readiness/report-url';
import { trackServerConversionEvent } from '@/lib/conversion-events-server';
import { and, eq } from 'drizzle-orm';

/**
 * Creem webhook endpoint
 * Configure in Creem Dashboard: Settings -> Webhooks -> Add endpoint
 * Endpoint URL: https://your-domain.com/api/webhooks/creem
 * Events: checkout.completed, subscription.paid, subscription.canceled,
 *         subscription.expired, subscription.trialing, subscription.paused
 */
export const Route = createFileRoute('/api/webhooks/creem')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const payload = await request.text();
        const signature = request.headers.get('creem-signature') ?? '';

        if (!payload || !signature) {
          console.warn('Creem webhook: missing payload or signature');
          return Response.json(
            { error: 'Missing payload or signature' },
            { status: 400 }
          );
        }

        const raw = safeParseJson(payload);
        if (raw?.eventType === 'checkout.completed') {
          const metadata = raw.object?.metadata;
          if (metadata?.reportToken) {
            let event: ClaimedWebhookEvent | undefined;
            try {
              await verifySignature(payload, signature);
              event = await claimCreemWebhookEvent(
                raw,
                payload,
                'report-checkout'
              );
              if (!event.shouldProcess) {
                return Response.json(
                  { received: true, duplicate: true },
                  { status: 200 }
                );
              }
              const customerEmail = normalizeOptionalEmail(
                raw.object?.customer?.email
              );
              const token = String(metadata.reportToken);
              const activated = await activateReportToken(token, customerEmail);
              if (!activated) {
                throw new Error('Report token not found');
              }
              await sendReportConfirmationEmail(
                token,
                customerEmail,
                metadata.websiteUrl
              );
              await markCreemWebhookEventProcessed(event.eventId);

              await trackServerConversionEvent('report_activated', {
                emailDomain: customerEmail?.split('@')[1] ?? null,
                websiteHost: optionalStringToHost(metadata.websiteUrl),
              });

              return Response.json({ received: true }, { status: 200 });
            } catch (err) {
              console.error('Report checkout webhook error:', err);
              if (event) await markCreemWebhookEventFailed(event.eventId, err);
              return Response.json(
                { error: 'Report webhook processing failed' },
                { status: 500 }
              );
            }
          }
          if (metadata?.service === 'manual-audit') {
            let event: ClaimedWebhookEvent | undefined;
            try {
              await verifySignature(payload, signature);
              event = await claimCreemWebhookEvent(
                raw,
                payload,
                'manual-audit'
              );
              if (!event.shouldProcess) {
                return Response.json(
                  { received: true, duplicate: true },
                  { status: 200 }
                );
              }
              const { completeManualAuditOrder } = await import(
                '@/api/ai-readiness/manual-audit-orders'
              );
              await completeManualAuditOrder({
                checkoutId: optionalString(raw.object?.id),
                orderId: optionalString(metadata.manualAuditOrderId),
                requestId:
                  optionalString(raw.object?.request_id) ??
                  optionalString(raw.object?.requestId) ??
                  optionalString(metadata.requestId),
                order: {
                  websiteUrl: String(metadata.websiteUrl ?? ''),
                  email: String(metadata.email ?? ''),
                  competitors: String(metadata.competitors ?? ''),
                  notes: String(metadata.notes ?? ''),
                },
              });
              await markCreemWebhookEventProcessed(event.eventId);
              return Response.json({ received: true }, { status: 200 });
            } catch (err) {
              console.error('Manual audit webhook error:', err);
              if (event) await markCreemWebhookEventFailed(event.eventId, err);
              if (shouldExposeManualAuditSmokeErrorDetail(raw)) {
                return Response.json(
                  {
                    error: 'Manual audit webhook processing failed',
                    detail: formatWebhookErrorMessage(err),
                  },
                  { status: 500 }
                );
              }
              return Response.json(
                { error: 'Manual audit webhook processing failed' },
                { status: 500 }
              );
            }
          }
        }

        if (!isPaymentEnabled()) {
          return Response.json({ received: true }, { status: 200 });
        }
        let event: ClaimedWebhookEvent | undefined;
        try {
          await verifySignature(payload, signature);
          event = await claimCreemWebhookEvent(raw, payload, 'payment');
          if (!event.shouldProcess) {
            return Response.json(
              { received: true, duplicate: true },
              { status: 200 }
            );
          }
          await handleWebhookEvent(payload, signature);
          await markCreemWebhookEventProcessed(event.eventId);
          return Response.json({ received: true }, { status: 200 });
        } catch (err) {
          console.error('Creem webhook error:', err);
          if (event) await markCreemWebhookEventFailed(event.eventId, err);
          return Response.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
          );
        }
      },
    },
  },
});

type ClaimedWebhookEvent = {
  eventId: string;
  shouldProcess: boolean;
};

async function activateReportToken(
  token: string,
  customerEmail?: string
): Promise<boolean> {
  const db = getDb();
  const result = await db
    .select()
    .from(reportTokens)
    .where(eq(reportTokens.token, token))
    .limit(1);

  if (result.length === 0) {
    console.warn('Report token not found');
    return false;
  }

  const row = result[0];

  if (row.status === 'active') {
    // Still backfill email if it was missing and webhook has it
    if (!row.email && customerEmail) {
      await db
        .update(reportTokens)
        .set({ email: customerEmail })
        .where(eq(reportTokens.token, token));
      console.log('Report token email backfilled');
    }
    console.log('Report token already active');
    return true;
  }

  const updates: Record<string, unknown> = {
    status: 'active',
    activatedAt: new Date(),
  };
  if (!row.email && customerEmail) {
    updates.email = customerEmail;
  }

  await db
    .update(reportTokens)
    .set(updates)
    .where(eq(reportTokens.token, token));

  console.log('Report token activated');
  return true;
}

async function claimCreemWebhookEvent(
  raw: ReturnType<typeof safeParseJson>,
  payload: string,
  target: string
): Promise<ClaimedWebhookEvent> {
  const db = getDb();
  const now = new Date();
  const eventId = await getCreemWebhookEventId(raw, payload);
  const eventType =
    optionalString(raw?.eventType) ?? optionalString(raw?.type) ?? 'unknown';
  const where = and(
    eq(webhookEvents.provider, 'creem'),
    eq(webhookEvents.eventId, eventId)
  );
  const [existing] = await db
    .select()
    .from(webhookEvents)
    .where(where)
    .limit(1);

  if (existing?.status === 'processed' || existing?.status === 'processing') {
    return { eventId, shouldProcess: false };
  }

  if (existing) {
    await db
      .update(webhookEvents)
      .set({
        eventType,
        target,
        status: 'processing',
        error: null,
        updatedAt: now,
      })
      .where(where);
    return { eventId, shouldProcess: true };
  }

  try {
    await db.insert(webhookEvents).values({
      id: crypto.randomUUID(),
      provider: 'creem',
      eventId,
      eventType,
      target,
      status: 'processing',
      createdAt: now,
      updatedAt: now,
    });
  } catch (error) {
    if (!isUniqueConstraintError(error)) throw error;

    const [conflict] = await db
      .select()
      .from(webhookEvents)
      .where(where)
      .limit(1);

    if (conflict?.status === 'processed' || conflict?.status === 'processing') {
      return { eventId, shouldProcess: false };
    }

    await db
      .update(webhookEvents)
      .set({
        eventType,
        target,
        status: 'processing',
        error: null,
        updatedAt: now,
      })
      .where(where);
  }

  return { eventId, shouldProcess: true };
}

async function markCreemWebhookEventProcessed(eventId: string) {
  await getDb()
    .update(webhookEvents)
    .set({
      status: 'processed',
      error: null,
      processedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(webhookEvents.provider, 'creem'),
        eq(webhookEvents.eventId, eventId)
      )
    );
}

async function markCreemWebhookEventFailed(eventId: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  await getDb()
    .update(webhookEvents)
    .set({
      status: 'failed',
      error: message.slice(0, 1000),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(webhookEvents.provider, 'creem'),
        eq(webhookEvents.eventId, eventId)
      )
    );
}

async function getCreemWebhookEventId(
  raw: ReturnType<typeof safeParseJson>,
  payload: string
) {
  const explicitId =
    optionalString(raw?.id) ??
    optionalString(raw?.eventId) ??
    optionalString(raw?.event_id);
  if (explicitId) return explicitId;

  const eventType =
    optionalString(raw?.eventType) ?? optionalString(raw?.type) ?? 'unknown';
  const objectId =
    optionalString(raw?.object?.id) ??
    optionalString(raw?.data?.object?.id) ??
    optionalString(raw?.data?.id);
  if (objectId) return `${eventType}:${objectId}`;

  return `${eventType}:${await sha256Hex(payload)}`;
}

async function sha256Hex(value: string) {
  const buffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(value)
  );
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function isUniqueConstraintError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return message.toLowerCase().includes('unique constraint failed');
}

/** Thin wrapper: reads CREEM_WEBHOOK_SECRET from env and delegates to shared utility. */
async function verifySignature(payload: string, signature: string) {
  const secret = process.env.CREEM_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('CREEM_WEBHOOK_SECRET environment variable is not set');
  }
  await verifyCreemWebhookSignature(payload, signature, secret);
}

function safeParseJson(payload: string) {
  try {
    return JSON.parse(payload);
  } catch {
    return undefined;
  }
}

function optionalString(value: unknown) {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeOptionalEmail(value: unknown) {
  const email = optionalString(value);
  return email ? normalizeEmail(email) : undefined;
}

function optionalStringToHost(value: unknown): string | null {
  const s = optionalString(value);
  if (!s) return null;
  try {
    return new URL(s).hostname;
  } catch {
    return null;
  }
}

async function sendReportConfirmationEmail(
  token: string,
  customerEmail?: string,
  websiteUrl?: unknown
) {
  const email = customerEmail;
  if (!email) {
    console.log('[report-email] No customer email available');
    return;
  }

  const url = String(websiteUrl ?? 'your page');
  const baseUrl = process.env.PUBLIC_SITE_URL ?? 'https://aeocheck.xyz';
  const reportUrl = `${baseUrl.replace(/\/$/, '')}/report/${token}`;

  try {
    const { sendEmail } = await import('@/mail');
    await sendEmail({
      to: email,
      subject: 'Your AI Visibility Fix Pack is ready',
      text: [
        `Your AI Visibility Fix Pack for ${url} is ready:`,
        '',
        reportUrl,
        '',
        'If you lose this link, visit /report/resend to recover it.',
        'Questions? Contact support@aeocheck.xyz.',
      ].join('\n'),
      html: [
        `<p>Your AI Visibility Fix Pack for <strong>${url}</strong> is ready:</p>`,
        `<p><a href="${reportUrl}">${reportUrl}</a></p>`,
        '<p>If you lose this link, visit the <a href="',
        `${baseUrl.replace(/\/$/, '')}/report/resend`,
        '">report recovery page</a>.</p>',
        '<p>Questions? Contact <a href="mailto:support@aeocheck.xyz">support@aeocheck.xyz</a>.</p>',
      ].join('\n'),
    });
    console.log('[report-email] Confirmation sent:', {
      emailDomain: email.split('@')[1] ?? null,
    });
  } catch (err) {
    console.error('[report-email] Failed to send confirmation:', err);
    console.log(
      '[report-email] Manual recovery info:',
      JSON.stringify({
        emailDomain: email.split('@')[1] ?? null,
        websiteHost: optionalStringToHost(url),
        reportReady: true,
      })
    );
  }
}
