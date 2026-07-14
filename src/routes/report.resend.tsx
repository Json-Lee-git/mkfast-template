import { createFileRoute } from '@tanstack/react-router';
import { seo } from '@/lib/seo';
import { resendReportLink } from '@/api/ai-readiness/report-checkout';
import Container from '@/components/layout/container';
import { IconMail, IconLoader2, IconArrowRight } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { trackConversionEvent } from '@/lib/conversion-events';

function ReportResendPage() {
  const [email, setEmail] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackConversionEvent('resend_opened');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.trim() || !websiteUrl.trim()) {
      setError('Please enter both your email and the website URL.');
      return;
    }

    setLoading(true);
    try {
      const res = await resendReportLink({
        data: {
          email: email.trim(),
          websiteUrl: websiteUrl.trim(),
        },
      });
      trackConversionEvent('resend_submitted', {
        emailDomain: email.trim().split('@')[1] ?? null,
      });
      setMessage(res.message);
      setEmail('');
      setWebsiteUrl('');
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again or contact support@aeocheck.xyz.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="py-16 lg:py-24">
        <Container className="px-4">
          <div className="mx-auto max-w-lg text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <IconMail size={28} className="text-primary" />
            </div>
            <h1 className="mt-6 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Find your Fix Pack link
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Enter the email and website URL you used when purchasing the Fix
              Pack. If we find a matching report, we'll email you the link.
            </p>

            {message ? (
              <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900/30 dark:bg-emerald-950/20">
                <p className="text-sm text-emerald-700 dark:text-emerald-400">
                  {message}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  If you don't receive an email within a few minutes, check your
                  spam folder or contact{' '}
                  <a
                    href="mailto:support@aeocheck.xyz"
                    className="text-primary hover:underline"
                  >
                    support@aeocheck.xyz
                  </a>
                  .
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                {error ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
                    {error}
                  </div>
                ) : null}

                <label className="block text-left">
                  <span className="text-sm font-medium text-foreground">
                    Email
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={loading}
                    className="mt-1.5 min-h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary/50 disabled:opacity-50"
                  />
                </label>

                <label className="block text-left">
                  <span className="text-sm font-medium text-foreground">
                    Website URL
                  </span>
                  <input
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="example.com/pricing"
                    disabled={loading}
                    className="mt-1.5 min-h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary/50 disabled:opacity-50"
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <IconLoader2 size={16} className="animate-spin" />
                      Looking up...
                    </>
                  ) : (
                    <>
                      Send me the link <IconArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}

            <p className="mt-8 text-xs text-muted-foreground">
              For privacy, we don't confirm whether an email address has a
              purchase. If you need help, contact{' '}
              <a
                href="mailto:support@aeocheck.xyz"
                className="text-primary hover:underline"
              >
                support@aeocheck.xyz
              </a>
              .
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}

export const Route = createFileRoute('/report/resend')({
  head: () => ({
    ...seo('/report/resend', {
      title: 'Find Your Fix Pack Report - AEOCheck',
      description:
        'Lost your AI Visibility Fix Pack link? Enter your email and website URL to receive the report link again.',
      noIndex: true,
    }),
  }),
  component: ReportResendPage,
});
