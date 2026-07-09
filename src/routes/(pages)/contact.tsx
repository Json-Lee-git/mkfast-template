import { ContactFormCard } from '@/components/contact/contact-form-card';
import Container from '@/components/layout/container';
import { websiteConfig } from '@/config/website';
import { jsonLd } from '@/lib/ai-visibility-schema';
import { seo } from '@/lib/seo';
import { getCanonicalUrl } from '@/lib/urls';
import { m } from '@/locale/paraglide/messages';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(pages)/contact')({
  validateSearch: (search: Record<string, unknown>) => ({
    intent: typeof search.intent === 'string' ? search.intent : '',
    url: typeof search.url === 'string' ? search.url : '',
  }),
  head: () => {
    const metadata = seo('/contact', {
      title: `${m.contact_title()} | ${websiteConfig.metadata?.name}`,
      description: m.contact_description(),
    });
    return {
      ...metadata,
      scripts: [
        jsonLd({
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: m.contact_title(),
          description: m.contact_description(),
          url: getCanonicalUrl('/contact'),
          mainEntity: {
            '@type': 'Organization',
            name: websiteConfig.metadata?.name,
            url: getCanonicalUrl('/'),
          },
        }),
      ],
    };
  },
  component: ContactPage,
});

function ContactPage() {
  const { intent, url } = Route.useSearch();
  const supportEmail =
    websiteConfig.metadata?.supportEmail ?? 'support@aeocheck.xyz';
  const isMonitorRequest = intent === 'monitor';
  const monitorMessage =
    'Please review this URL and send setup instructions for the $29/mo managed monitoring MVP.';

  return (
    <Container className="py-16 px-4">
      <div className="mx-auto max-w-4xl space-y-8 pb-16">
        <div className="space-y-4">
          <h1 className="text-center text-3xl font-bold tracking-tight">
            {isMonitorRequest ? 'Request managed Monitor' : m.contact_title()}
          </h1>
          <p className="text-center text-lg text-muted-foreground">
            {isMonitorRequest
              ? 'Managed monitoring is available as early access for important published pages.'
              : m.contact_description()}
          </p>
          <p className="mx-auto max-w-2xl text-center text-muted-foreground">
            {isMonitorRequest
              ? 'We will review the URL and send setup instructions. During the MVP, monitored pages are reviewed manually before the full self-serve dashboard is available.'
              : 'Use this form for product questions, correction requests, outdated crawler guidance, report issues, and partnership inquiries.'}
          </p>
          <p className="mx-auto max-w-2xl text-center text-sm text-muted-foreground">
            Direct support email:{' '}
            <a
              href={`mailto:${supportEmail}`}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {supportEmail}
            </a>
          </p>
        </div>
        <ContactFormCard
          defaultMessage={isMonitorRequest ? monitorMessage : undefined}
          defaultUrl={isMonitorRequest ? url : undefined}
          monitorRequest={isMonitorRequest}
          monitorSource="contact:monitor"
          successMessage={
            isMonitorRequest
              ? 'We will review the URL and send setup instructions.'
              : undefined
          }
          submitLabel={isMonitorRequest ? 'Request managed monitor' : undefined}
          title={isMonitorRequest ? 'Monitor request' : undefined}
        />
      </div>
    </Container>
  );
}
