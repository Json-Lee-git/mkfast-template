/**
 * Mail provider interface.
 *
 * Decouples email transport from business logic so implementations
 * (Resend, Cloudflare Email, etc.) can be swapped without changing
 * the code that sends emails.
 */

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
  from?: string;
  replyTo?: string;
}

export interface MailProvider {
  /** Send a single email. Throws on transport failure. */
  sendEmail(params: SendEmailParams): Promise<void>;
}
