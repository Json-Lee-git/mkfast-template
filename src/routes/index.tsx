import { AIHomePage } from '@/components/blocks/ai-home';
import { seo } from '@/lib/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  head: () => ({
    ...seo('/', {
      title: 'AI Visibility Tools Directory — Find & Compare AI Search Visibility Tools',
      description: 'Compare the best AI visibility tools for tracking brand mentions across ChatGPT, Perplexity, Gemini, Claude and Google AI Overviews.',
    }),
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'AI Visibility Tools Directory',
          description: 'Compare the best AI visibility tools for tracking brand mentions across AI search platforms.',
          url: 'https://mkfast-template.s01071233604.workers.dev',
        }),
      },
    ],
  }),
  component: AIHomePage,
});
