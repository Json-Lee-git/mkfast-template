import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const schema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  websiteUrl: z.string().trim().min(1, 'Please enter a website URL'),
});

export const submitLeadCapture = createServerFn({ method: 'POST' })
  .inputValidator(schema)
  .handler(async ({ data }) => {
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;

    if (!webhookUrl) {
      return {
        success: false,
        message: 'Report request saved locally is not enabled yet.',
      };
    }

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          websiteUrl: data.websiteUrl,
          submittedAt: new Date().toISOString(),
        }),
        signal: controller.signal,
      });

      clearTimeout(timer);

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
    }
  });
