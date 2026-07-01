import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { getBaseUrl } from '@/lib/urls';

const manualAuditCheckoutInputSchema = z.object({
  websiteUrl: z.string().min(1).max(500),
  email: z.email(),
  competitors: z.string().max(1000).optional(),
  notes: z.string().max(1000).optional(),
});

type ManualAuditOrder = z.infer<typeof manualAuditCheckoutInputSchema>;

/**
 * Creates a Creem checkout session for the manual AI Search Readiness Audit.
 * The order details are kept in checkout metadata and sent through the
 * webhook after payment succeeds.
 */
export const createManualAuditCheckout = createServerFn({ method: 'POST' })
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

    const normalizedUrl = normalizeUrl(data.websiteUrl);
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
      request_id: crypto.randomUUID(),
      customer: { email: data.email.trim() },
      metadata: {
        service: 'manual-audit',
        websiteUrl: normalizedUrl,
        email: data.email.trim(),
        competitors: data.competitors?.trim() ?? '',
        notes: data.notes?.trim() ?? '',
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
      throw new Error(`Payment service error (${res.status})`);
    }

    const checkout = (await res.json()) as { checkout_url?: string };
    return {
      url: checkout.checkout_url ?? '',
    };
  });

export async function notifyManualAuditOrder(data: {
  checkoutId?: string;
  order: ManualAuditOrder;
}) {
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  const payload = {
    type: 'manual-audit-order',
    checkoutId: data.checkoutId ?? '',
    websiteUrl: data.order.websiteUrl.trim(),
    email: data.order.email.trim(),
    competitors: data.order.competitors?.trim() ?? '',
    notes: data.order.notes?.trim() ?? '',
    submittedAt: new Date().toISOString(),
  };

  if (!webhookUrl) {
    console.log('Manual audit order:', payload);
    return;
  }

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

function normalizeUrl(input: string) {
  const value = input.trim();
  if (!value) return value;
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}
