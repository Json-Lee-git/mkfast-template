import { createServerFn } from '@tanstack/react-start';
import { csrfMiddleware } from '@/lib/csrf';
import { z } from 'zod';
import { getDb } from '@/db';
import { reportTokens } from '@/db/app.schema';
import { getBaseUrl } from '@/lib/urls';
import { nanoid } from 'nanoid';
import { eq, and, desc } from 'drizzle-orm';
import { enforceRateLimit } from '@/lib/rate-limit';
import { trackServerConversionEvent } from '@/lib/conversion-events-server';
import type { AeoActionPriority, AeoAuditResult } from './aeo';
import { AI_ANALYSIS_PROMPT } from './aeo';
import { runAi, parseAiJson } from './ai';
import { normalizeEmail, normalizeWebsiteUrl } from './report-url';

const checkoutInputSchema = z.object({
  resultJson: z.string().min(1),
  websiteUrl: z.string().min(1),
  email: z.string().email().min(1).optional(),
});

/**
 * Creates a Creem checkout session for the $19 Full AEO Report.
 * Stores report data in D1 with a pending token, then returns
 * the Creem checkout URL. On successful payment, the webhook
 * activates the token.
 */
export const createReportCheckout = createServerFn({ method: 'POST' })
  .middleware([csrfMiddleware])
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

    // Enrich with AI analysis if the free audit's AI call failed
    let resultJson = data.resultJson;
    try {
      const parsed = JSON.parse(data.resultJson) as AeoAuditResult;
      if (!parsed.aiAnalysis && parsed.pageText) {
        const aiResult = await runAi({
          feature: 'aeo-analysis',
          systemPrompt: AI_ANALYSIS_PROMPT,
          userPrompt: [
            `URL: ${parsed.normalizedUrl}`,
            `Brand/Inferred Name: ${parsed.entityClarity?.inferredBrandName || 'N/A'}`,
            `Title: ${parsed.page?.title || 'N/A'}`,
            `Meta Description: ${parsed.page?.metaDescription || 'N/A'}`,
            `Schema types detected: ${parsed.structuredData?.schemaTypes?.join(', ') || 'none'}`,
            `Has JSON-LD: ${parsed.structuredData?.hasJsonLd ? 'yes' : 'no'}`,
            `Has FAQ section: ${parsed.answerReadyContent?.hasFaqSection ? 'yes' : 'no'}`,
            `Has author: ${parsed.trustSignals?.hasAuthor ? 'yes' : 'no'}`,
            `Has published date: ${parsed.trustSignals?.hasPublishedDate ? 'yes' : 'no'}`,
            `Has About link: ${parsed.trustSignals?.hasAboutLink ? 'yes' : 'no'}`,
            `Has Contact link: ${parsed.trustSignals?.hasContactLink ? 'yes' : 'no'}`,
            `Has Privacy link: ${parsed.trustSignals?.hasPrivacyLink ? 'yes' : 'no'}`,
            `External links found: ${parsed.trustSignals?.externalLinkCount ?? 0}`,
            `Issues to fix:`,
            ...(parsed.recommendations || []).map((r) => `- ${r}`),
            `--- PAGE CONTENT ---`,
            parsed.pageText,
          ].join('\n'),
          maxTokens: 2048,
        });

        if (aiResult) {
          try {
            const aiParsed = parseAiJson(aiResult.text) as Record<
              string,
              unknown
            > | null;
            if (aiParsed && typeof aiParsed.summary === 'string') {
              parsed.aiAnalysis = {
                summary: String(aiParsed.summary || ''),
                strengths: Array.isArray(aiParsed.strengths)
                  ? aiParsed.strengths.map(String)
                  : [],
                quickWins: Array.isArray(aiParsed.quickWins)
                  ? aiParsed.quickWins.map(String)
                  : [],
                actionPlan: Array.isArray(aiParsed.actionPlan)
                  ? aiParsed.actionPlan.map((a: Record<string, unknown>) => ({
                      priority: (['critical', 'high', 'medium', 'low'].includes(
                        String(a.priority)
                      )
                        ? String(a.priority)
                        : 'medium') as AeoActionPriority,
                      effort: String(a.effort || ''),
                      title: String(a.title || ''),
                      whatToDo: String(a.whatToDo || ''),
                      why: String(a.why || ''),
                    }))
                  : [],
                contentSuggestions: Array.isArray(aiParsed.contentSuggestions)
                  ? aiParsed.contentSuggestions.map(String)
                  : [],
                schemaSuggestions: Array.isArray(aiParsed.schemaSuggestions)
                  ? aiParsed.schemaSuggestions.map(String)
                  : [],
                missingTopics: Array.isArray(aiParsed.missingTopics)
                  ? aiParsed.missingTopics.map(String)
                  : [],
                customLlmsTxt: String(aiParsed.customLlmsTxt || ''),
                customLlmsFullTxt: String(aiParsed.customLlmsFullTxt || ''),
                customSchemaJson: String(aiParsed.customSchemaJson || ''),
              };
              resultJson = JSON.stringify(parsed);
            }
          } catch {
            // AI returned non-JSON or unexpected structure — keep original resultJson
          }
        }
      }
    } catch {
      // If JSON parse fails, keep original resultJson
    }

    // Store report data with pending token
    const normalizedEmail = data.email ? normalizeEmail(data.email) : null;
    const normalizedUrl = normalizeWebsiteUrl(data.websiteUrl);
    const db = getDb();
    await db.insert(reportTokens).values({
      id: crypto.randomUUID(),
      token,
      status: 'pending',
      resultJson,
      email: normalizedEmail,
      websiteUrl: normalizedUrl,
      createdAt: now,
    });

    // Create Creem checkout via REST API (snake_case, not SDK)
    const isDebug = process.env.CREEM_DEBUG === 'true';
    const apiBase = isDebug
      ? 'https://test-api.creem.io'
      : 'https://api.creem.io';

    const body: Record<string, unknown> = {
      product_id: productId,
      success_url: successUrl,
      request_id: crypto.randomUUID(),
      metadata: {
        reportToken: token,
        websiteUrl: normalizedUrl,
      },
    };
    if (normalizedEmail) {
      body.customer = { email: normalizedEmail };
    }

    const res = await fetch(`${apiBase}/v1/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error('[checkout] Creem API error:', res.status);
      await trackServerConversionEvent('checkout_failed', {
        status: res.status,
        websiteHost: new URL(normalizedUrl).hostname,
      });
      throw new Error(`Payment service error (${res.status})`);
    }

    const checkout = (await res.json()) as { checkout_url: string };

    await trackServerConversionEvent('checkout_created', {
      websiteHost: new URL(normalizedUrl).hostname,
      emailDomain: normalizedEmail?.split('@')[1] ?? null,
    });

    return {
      url: checkout.checkout_url ?? '',
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

const resendInputSchema = z.object({
  email: z.string().email().min(1),
  websiteUrl: z.string().min(1),
});

/**
 * Look up an active report by email + websiteUrl and resend the link.
 * Always returns the same neutral message to avoid leaking whether an
 * email address has a purchase.
 */
export const resendReportLink = createServerFn({ method: 'POST' })
  .inputValidator(resendInputSchema)
  .handler(async ({ data }) => {
    await enforceRateLimit('reportResend');

    const normalizedEmail = normalizeEmail(data.email);

    // Normalize websiteUrl for matching; if the user typed something
    // invalid, treat it as not-found rather than throwing.
    let normalizedUrl: string;
    try {
      normalizedUrl = normalizeWebsiteUrl(data.websiteUrl);
    } catch {
      return {
        message:
          "If a matching report exists, we'll email the link. If you don't see it, contact support@aeocheck.xyz.",
      };
    }

    const db = getDb();
    const rows = await db
      .select()
      .from(reportTokens)
      .where(
        and(
          eq(reportTokens.email, normalizedEmail),
          eq(reportTokens.websiteUrl, normalizedUrl),
          eq(reportTokens.status, 'active')
        )
      )
      .orderBy(desc(reportTokens.createdAt))
      .limit(1);

    const reportUrl =
      rows.length > 0
        ? `${getBaseUrl().replace(/\/$/, '')}/report/${rows[0].token}`
        : null;

    if (reportUrl) {
      try {
        const { sendEmail } = await import('@/mail');
        await sendEmail({
          to: normalizedEmail,
          subject: 'Your AI Visibility Fix Pack link',
          text: [
            `Your AI Visibility Fix Pack for ${data.websiteUrl} is here:`,
            '',
            reportUrl,
            '',
            'If you have any questions, contact support@aeocheck.xyz.',
          ].join('\n'),
          html: [
            `<p>Your AI Visibility Fix Pack for <strong>${data.websiteUrl}</strong> is here:</p>`,
            `<p><a href="${reportUrl}">${reportUrl}</a></p>`,
            '<p>If you have any questions, contact <a href="mailto:support@aeocheck.xyz">support@aeocheck.xyz</a>.</p>',
          ].join('\n'),
        });
      } catch (err) {
        console.error('[resendReportLink] Email send failed:', err);
        console.log(
          '[resendReportLink] Manual recovery info:',
          JSON.stringify({
            emailDomain: normalizedEmail.split('@')[1] ?? null,
            websiteHost: new URL(normalizedUrl).hostname,
            reportFound: true,
          })
        );
      }
    }

    return {
      message:
        "If a matching report exists, we'll email the link. If you don't see it, contact support@aeocheck.xyz.",
    };
  });
