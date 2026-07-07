import { Routes } from '@/lib/routes';
import type { MenuItemConfig } from '../types';
import { websiteConfig } from './website';

export function getNavbarLinks(): MenuItemConfig[] {
  const links: MenuItemConfig[] = [
    {
      title: 'Product',
      items: [
        {
          title: 'Start here',
          items: [
            {
              title: 'Free AEO Checker',
              description: 'Audit one page before AI search edits',
              href: '/tools/aeo-checker',
            },
            {
              title: 'AI Crawler Checker',
              description: 'Check which AI crawlers can reach your site',
              href: '/tools/ai-crawler-checker',
            },
            {
              title: 'LLMs.txt Checker',
              description: 'Validate your LLMs.txt file',
              href: '/tools/llms-txt-checker',
            },
            {
              title: 'Query Fan-out Tool',
              description: 'Find content gaps for AI answers',
              href: '/tools/query-fan-out-tool',
            },
          ],
        },
        {
          title: 'Fix workflow',
          items: [
            {
              title: 'Sample Fix Pack',
              description: 'Preview what a repair plan looks like',
              href: '/sample-aeo-report',
            },
            {
              title: '$19 Fix Pack Guide',
              description: 'How the repair plan works',
              href: '/compare/ai-search-readiness-report-worth-it',
            },
            {
              title: 'Manual Audit',
              description: 'Human review for one important page',
              href: '/ai-search-audit',
            },
          ],
        },
        {
          title: 'Platform',
          items: [
            {
              title: 'Methodology',
              description: 'How we score AI search readiness',
              href: '/methodology',
            },
            {
              title: 'Playbooks',
              description: 'Step-by-step AI search guides',
              href: '/playbooks',
            },
            {
              title: 'Compare tools',
              description: 'AEO checker vs alternatives',
              href: '/compare/aeo-checker-alternatives',
            },
          ],
        },
      ],
    },
    {
      title: 'Resources',
      items: [
        {
          title: 'Learn',
          items: [
            {
              title: 'AI Search Readiness Checklist',
              description: 'Complete pre-flight checklist',
              href: '/guides/ai-search-readiness-checklist',
            },
            {
              title: 'AEO Audit Guide',
              description: 'How to audit a page for AI search',
              href: '/guides/aeo-audit',
            },
            {
              title: 'LLMs.txt Guide',
              description: 'Everything about LLMs.txt files',
              href: '/guides/llms-txt-file',
            },
            {
              title: 'Query Fan-out Guide',
              description: 'Map queries to page content',
              href: '/guides/query-fan-out',
            },
          ],
        },
        {
          title: 'Compare',
          items: [
            {
              title: 'AEO checker alternatives',
              description: 'How we compare to other tools',
              href: '/compare/aeo-checker-alternatives',
            },
            {
              title: 'AEO checker vs SEO tools',
              description: 'Why this is not an SEO audit',
              href: '/compare/aeo-checker-vs-seo-tools',
            },
            {
              title: 'Is the Fix Pack worth it',
              description: 'What $19 gets you',
              href: '/compare/ai-search-readiness-report-worth-it',
            },
          ],
        },
        {
          title: 'Company',
          items: [
            {
              title: 'About',
              description: 'Who builds AEOCheck',
              href: '/about',
            },
            {
              title: 'Contact',
              description: 'Get in touch',
              href: '/contact',
            },
            {
              title: 'Privacy / Terms',
              description: 'How we handle your data',
              href: '/privacy',
            },
          ],
        },
      ],
    },
    { title: 'Pricing', href: Routes.Pricing, external: false },
  ];
  if (websiteConfig.blog?.enable) {
    links.push({ title: 'Blog', href: Routes.Blog, external: false });
  }
  return links;
}
