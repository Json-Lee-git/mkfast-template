import { createServerFn } from '@tanstack/react-start';
import { csrfMiddleware } from '@/lib/csrf';
import { z } from 'zod';
import { getBaseUrl } from '@/lib/urls';
import { normalizeUrlKeepPath } from './shared';

const manualAuditCheckoutInputSchema = z.object({
  websiteUrl: z.string().min(1).max(500),
  email: z.email(),
  competitors: z.string().max(1000).optional(),
  notes: z.string().max(1000).optional(),
});

/**
 * Creates a Creem checkout session for the manual AI Search Readiness Audit.
 * A pending order is written before redirecting so paid work never depends on
 * webhook metadata as the only durable record.
 */
export const createManualAuditCheckout = createServerFn({ method: 'POST' })
  .middleware([csrfMiddleware])
  .inputValidator(manualAuditCheckoutInputSchema)
  .handler(async ({ data }) => {
    const apiKey = process.env.CREEM_API_KEY;
    if (!apiKey) {
      throw new Error('Payment is not configured');
    }

    const productId = process.env.CREEM_PRODUCT_MANUAL_AUDIT;
    if (!productId) {
      throw new Error('Manual audit product is not configured');
    }

    const normalizedUrl = normalizeUrlKeepPath(data.websiteUrl);
    const {
      createPendingManualAuditOrder,
      markManualAuditCheckoutFailed,
      recordManualAuditCheckoutId,
    } = await import('./manual-audit-orders');
    const { order, orderId, requestId } = await createPendingManualAuditOrder({
      ...data,
      websiteUrl: normalizedUrl,
    });

    const baseUrl = getBaseUrl().replace(/\/$/, '');
    const successUrl = `${baseUrl}/ai-search-audit/thanks?site=${encodeURIComponent(
      normalizedUrl
    )}`;

    const isDebug = process.env.CREEM_DEBUG === 'true';
    const apiBase = isDebug
      ? 'https://test-api.creem.io'
      : 'https://api.creem.io';

    const body: Record<string, unknown> = {
      product_id: productId,
      success_url: successUrl,
      request_id: requestId,
      customer: { email: order.email },
      metadata: {
        service: 'manual-audit',
        manualAuditOrderId: orderId,
        requestId,
        websiteUrl: order.websiteUrl,
        email: order.email,
        competitors: order.competitors ?? '',
        notes: order.notes ?? '',
      },
    };

    const res = await fetch(`${apiBase}/v1/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[manual-audit-checkout] Creem API error:', {
        status: res.status,
        body: errorText,
      });
      await markManualAuditCheckoutFailed(
        orderId,
        `Creem API error (${res.status}): ${errorText.slice(0, 1000)}`
      );
      throw new Error(`Payment service error (${res.status})`);
    }

    const checkout = (await res.json()) as {
      id?: string;
      checkout_url?: string;
    };
    if (!checkout.checkout_url) {
      await markManualAuditCheckoutFailed(
        orderId,
        'Creem checkout URL was not returned'
      );
      throw new Error('Checkout URL was not returned');
    }

    if (checkout.id) {
      await recordManualAuditCheckoutId(orderId, checkout.id);
    }

    return {
      url: checkout.checkout_url,
    };
  });
