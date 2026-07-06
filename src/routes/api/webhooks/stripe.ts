import { createFileRoute } from '@tanstack/react-router';
import { handleWebhookEvent, isPaymentEnabled } from '@/payment';

/**
 * Stripe webhook endpoint
 * Configure in Stripe Dashboard: Webhooks -> Add endpoint
 * Endpoint URL: https://your-domain.com/api/webhooks/stripe
 * Events: checkout.session.completed, customer.subscription.*, invoice.paid
 */
export const Route = createFileRoute('/api/webhooks/stripe')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isPaymentEnabled()) {
          return Response.json({ received: true }, { status: 200 });
        }
        const payload = await request.text();
        const signature = request.headers.get('stripe-signature') ?? '';
        if (!payload || !signature) {
          console.warn('Stripe webhook: missing payload or signature');
          return Response.json(
            { error: 'Missing payload or signature' },
            { status: 400 }
          );
        }
        try {
          await handleWebhookEvent(payload, signature);
          return Response.json({ received: true }, { status: 200 });
        } catch (err) {
          console.error('Stripe webhook error:', err);
          // Signature verification failures → 400 (bad request, don't retry)
          // Stripe's constructEventAsync throws errors with `type` field
          const isSignatureError =
            err instanceof Error &&
            'type' in err &&
            (err as Record<string, unknown>).type ===
              'StripeSignatureVerificationError';
          // Processing failures → 500 (Stripe will retry with backoff)
          return Response.json(
            { error: 'Webhook processing failed', received: true },
            { status: isSignatureError ? 400 : 500 }
          );
        }
      },
    },
  },
});
