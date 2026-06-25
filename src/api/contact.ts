import { m } from '@/locale/paraglide/messages';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
const schema = z.object({
  name: z.string().min(3, m.contact_name_min()).max(30, m.contact_name_max()),
  email: z.email(m.contact_email_invalid()),
  message: z
    .string()
    .min(10, m.contact_message_min())
    .max(500, m.contact_message_max()),
});
export const sendContactMessage = createServerFn({ method: 'POST' })
  .inputValidator(schema)
  .handler(async ({ data }) => {
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    if (!webhookUrl) {
      console.log('Contact message:', data);
      return;
    }
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name.trim(),
        email: data.email.trim(),
        message: data.message.trim(),
        submittedAt: new Date().toISOString(),
      }),
    });
  });
