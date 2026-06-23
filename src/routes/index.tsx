import { AIHomePage } from '@/components/blocks/ai-home';
import { seo } from '@/lib/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  head: () =>
    seo('/', {
      title: 'AI Visibility Tools Directory — Find & Compare AI Search Visibility Tools',
      description: 'Compare the best AI visibility tools for tracking brand mentions across ChatGPT, Perplexity, Gemini, Claude and Google AI Overviews. Find free checkers, pricing, and reviews.',
    }),
  component: AIHomePage,
});
