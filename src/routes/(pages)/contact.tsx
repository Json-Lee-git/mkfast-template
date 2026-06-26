import { m } from '@/locale/paraglide/messages';
import { createFileRoute } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { ContactFormCard } from '@/components/contact/contact-form-card';
import { websiteConfig } from '@/config/website';
import { seo } from '@/lib/seo';
import { jsonLd } from '@/lib/ai-visibility-schema';
import { getCanonicalUrl } from '@/lib/urls';

export const Route = createFileRoute('/(pages)/contact')({
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
  return (
    <Container className="py-16 px-4">
      <div className="mx-auto max-w-4xl space-y-8 pb-16">
        <div className="space-y-4">
          <h1 className="text-center text-3xl font-bold tracking-tight">
            {m.contact_title()}
          </h1>
          <p className="text-center text-lg text-muted-foreground">
            {m.contact_description()}
          </p>
          <p className="mx-auto max-w-2xl text-center text-muted-foreground">
            Use this form for product questions, correction requests, outdated
            crawler guidance, report issues, and partnership inquiries.
          </p>
        </div>
        <ContactFormCard />
      </div>
    </Container>
  );
}
