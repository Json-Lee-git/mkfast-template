import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const schema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  websiteUrl: z.string().trim().min(1, 'Please enter a website URL'),
});

function parseWebhookUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    return url.href;
  } catch {
    return null;
  }
}

export const submitLeadCapture = createServerFn({ method: 'POST' })
  .inputValidator(schema)
  .handler(async ({ data }) => {
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;

    if (!webhookUrl) {
      return {
        success: false,
        message: 'Report request received. Webhook is not configured yet.',
      };
    }

    const parsedWebhookUrl = parseWebhookUrl(webhookUrl);
    if (!parsedWebhookUrl) {
      return {
        success: false,
        message:
          'Report request received, but the webhook URL is not valid yet.',
      };
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch(parsedWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          websiteUrl: data.websiteUrl,
          submittedAt: new Date().toISOString(),
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        return {
          success: false,
          message:
            'Unable to send the report at this time. Please try again later.',
        };
      }

      return {
        success: true,
        message: "Thanks! We'll send the report to your email.",
      };
    } catch {
      return {
        success: false,
        message:
          'Unable to send the report at this time. Please try again later.',
      };
    } finally {
      clearTimeout(timer);
    }
  });
