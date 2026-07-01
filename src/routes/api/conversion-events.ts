import { getDb } from '@/db';
import { conversionEvents } from '@/db/app.schema';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const payloadValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);

const conversionEventSchema = z.object({
  event: z.string().trim().min(1).max(120),
  path: z.string().trim().max(500).optional(),
  pageUrl: z.string().trim().max(1000).optional(),
  referrer: z.string().trim().max(1000).optional(),
  sessionId: z.string().trim().max(100).optional(),
  variant: z.string().trim().max(120).optional(),
  payload: z.record(z.string(), payloadValueSchema.optional()).optional(),
});

export const Route = createFileRoute('/api/conversion-events')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let raw: unknown;

        try {
          raw = await request.json();
        } catch {
          return Response.json({ error: 'Invalid JSON' }, { status: 400 });
        }

        const parsed = conversionEventSchema.safeParse(raw);
        if (!parsed.success) {
          return Response.json({ error: 'Invalid event' }, { status: 400 });
        }

        const data = parsed.data;
        const payloadJson = data.payload
          ? JSON.stringify(data.payload).slice(0, 4000)
          : null;

        await getDb()
          .insert(conversionEvents)
          .values({
            event: data.event,
            path: data.path ?? null,
            pageUrl: data.pageUrl ?? null,
            referrer: data.referrer ?? null,
            sessionId: data.sessionId ?? null,
            variant: data.variant ?? null,
            payloadJson,
            createdAt: new Date(),
          });

        return Response.json({ ok: true });
      },
    },
  },
});
