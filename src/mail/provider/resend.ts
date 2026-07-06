import type { MailProvider, SendEmailParams } from '../types';

/**
 * Resend mail provider.
 *
 * Sends emails via the Resend API (https://resend.com).
 * Requires RESEND_API_KEY environment variable.
 *
 * Falls back to console.log when running locally without an API key
 * and MANUAL_AUDIT_LOG_FALLBACK is enabled.
 */
export class ResendProvider implements MailProvider {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY;
  }

  async sendEmail(params: SendEmailParams): Promise<void> {
    const from = params.from ?? 'AEOCheck <support@aeocheck.xyz>';

    if (!this.apiKey) {
      if (!this.isConsoleFallbackEnabled()) {
        throw new Error('RESEND_API_KEY environment variable is not set');
      }
      console.log('Resend email (console fallback):', {
        from,
        to: params.to,
        subject: params.subject,
        text: params.text,
      });
      return;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: params.to,
        reply_to: params.replyTo,
        subject: params.subject,
        html: params.html,
        text: params.text,
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(
        `Resend API error (${response.status}): ${body.slice(0, 1000)}`
      );
    }
  }

  private isConsoleFallbackEnabled(): boolean {
    const baseUrl = process.env.VITE_BASE_URL ?? '';
    return (
      process.env.MANUAL_AUDIT_LOG_FALLBACK === 'true' ||
      baseUrl.includes('localhost') ||
      baseUrl.includes('127.0.0.1')
    );
  }
}
