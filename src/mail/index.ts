import { ResendProvider } from './provider/resend';
import type { MailProvider } from './types';

export type { MailProvider, SendEmailParams } from './types';

let mailProvider: MailProvider | null = null;

/**
 * Get the mail provider instance (lazy-init singleton).
 */
export function getMailProvider(): MailProvider {
  if (!mailProvider) {
    mailProvider = new ResendProvider();
  }
  return mailProvider;
}

/**
 * Convenience: send a single email through the configured provider.
 */
export async function sendEmail(
  params: import('./types').SendEmailParams
): Promise<void> {
  const provider = getMailProvider();
  await provider.sendEmail(params);
}
