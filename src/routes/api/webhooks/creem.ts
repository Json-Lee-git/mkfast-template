import { createFileRoute } from '@tanstack/react-router';
import { handleWebhookEvent, isPaymentEnabled } from '@/payment';
import { getDb } from '@/db';
import { reportTokens } from '@/db/app.schema';
import { eq } from 'drizzle-orm';

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

        // Handle report checkout (lightweight, no full payment provider needed)
        if (payload) {
          try {
            const raw = JSON.parse(payload);
            if (raw.eventType === 'checkout.completed') {
              const metadata = raw.object?.metadata;
              if (metadata?.reportToken) {
                await activateReportToken(metadata.reportToken);
                return Response.json({ received: true }, { status: 200 });
              }
            }
          } catch {
            // Fall through to normal payment handling
          }
        }

        if (!isPaymentEnabled()) {
          return Response.json({ received: true }, { status: 200 });
        }
        if (!payload || !signature) {
          console.warn('Creem webhook: missing payload or signature');
          return Response.json(
            { error: 'Missing payload or signature' },
            { status: 400 }
          );
        }
        try {
          await handleWebhookEvent(payload, signature);
          return Response.json({ received: true }, { status: 200 });
        } catch (err) {
          console.error('Creem webhook error:', err);
          return Response.json(
            { error: 'Webhook processing failed', received: true },
            { status: 200 }
          );
        }
      },
    },
  },
});

async function activateReportToken(token: string) {
  const db = getDb();
  const result = await db
    .select()
    .from(reportTokens)
    .where(eq(reportTokens.token, token))
    .limit(1);

  if (result.length === 0) {
    console.warn('Report token not found:', token);
    return;
  }

  if (result[0].status === 'active') {
    console.log('Report token already active:', token);
    return;
  }

  await db
    .update(reportTokens)
    .set({ status: 'active', activatedAt: new Date() })
    .where(eq(reportTokens.token, token));

  console.log('Report token activated:', token);
}
