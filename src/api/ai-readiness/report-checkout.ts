import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { getDb } from '@/db';
import { reportTokens } from '@/db/app.schema';
import { Creem } from 'creem';
import { getBaseUrl } from '@/lib/urls';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';
import type { AeoAuditResult } from './aeo';

const checkoutInputSchema = z.object({
  resultJson: z.string().min(1),
  websiteUrl: z.string().min(1),
  email: z.string().email().optional(),
});

/**
 * Creates a Creem checkout session for the $19 Full AEO Report.
 * Stores report data in D1 with a pending token, then returns
 * the Creem checkout URL. On successful payment, the webhook
 * activates the token.
 */
export const createReportCheckout = createServerFn({ method: 'POST' })
  .inputValidator(checkoutInputSchema)
  .handler(async ({ data }) => {
    const apiKey = process.env.CREEM_API_KEY;
    if (!apiKey) {
      throw new Error('Payment is not configured');
    }

    const productId = process.env.CREEM_PRODUCT_FULL_REPORT;
    if (!productId) {
      throw new Error('Report product is not configured');
    }

    const token = nanoid(32);
    const baseUrl = getBaseUrl().replace(/\/$/, '');
    const successUrl = `${baseUrl}/report/${token}`;
    const now = new Date();

    // Store report data with pending token
    const db = getDb();
    await db.insert(reportTokens).values({
      id: crypto.randomUUID(),
      token,
      status: 'pending',
      resultJson: data.resultJson,
      email: data.email ?? null,
      websiteUrl: data.websiteUrl,
      createdAt: now,
    });

    // Create Creem checkout
    const isDebug = process.env.CREEM_DEBUG === 'true';
    const client = new Creem({
      apiKey,
      serverIdx: isDebug ? 1 : 0,
    });

    const checkout = await client.checkouts.create({
      productId,
      successUrl,
      requestId: crypto.randomUUID(),
      metadata: {
        reportToken: token,
        websiteUrl: data.websiteUrl,
      },
      ...(data.email ? { customer: { email: data.email } } : {}),
    });

    return {
      url: checkout.checkoutUrl ?? '',
    };
  });

const tokenInputSchema = z.object({
  token: z.string().min(1),
});

export interface ReportData {
  token: string;
  status: 'pending' | 'active';
  websiteUrl: string;
  email: string | null;
  createdAt: string;
  activatedAt: string | null;
  result: AeoAuditResult | null;
}

/**
 * Fetch report by token. Returns null if not found.
 * result is null when status is 'pending' (payment not confirmed).
 */
export const getReportByToken = createServerFn({ method: 'GET' })
  .inputValidator(tokenInputSchema)
  .handler(async ({ data }): Promise<ReportData | null> => {
    const db = getDb();
    const rows = await db
      .select()
      .from(reportTokens)
      .where(eq(reportTokens.token, data.token))
      .limit(1);

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      token: row.token,
      status: row.status,
      websiteUrl: row.websiteUrl,
      email: row.email,
      createdAt: row.createdAt.toISOString(),
      activatedAt: row.activatedAt?.toISOString() ?? null,
      result: row.status === 'active' ? JSON.parse(row.resultJson) : null,
    };
  });
