import { Routes } from '@/lib/routes';
import type { MenuItemConfig } from '../types';
import { websiteConfig } from './website';

export function getFooterLinks(): MenuItemConfig[] {
  return [
    {
      title: 'Tools',
      items: [
        {
          title: 'ChatGPT Visibility Checker',
          href: '/tools/chatgpt-visibility-checker',
          external: false,
        },
        {
          title: 'AEO Checker',
          href: '/tools/aeo-checker',
          external: false,
        },
        {
          title: 'LLMs.txt Checker',
          href: '/tools/llms-txt-checker',
          external: false,
        },
        {
          title: 'LLMs.txt Generator',
          href: '/tools/llms-txt-generator',
          external: false,
        },
        {
          title: 'AI Crawler Checker',
          href: '/tools/ai-crawler-checker',
          external: false,
        },
        {
          title: 'AI Overview Checker',
          href: '/tools/ai-overview-readiness-checker',
          external: false,
        },
        {
          title: 'GEO Audit Tool',
          href: '/tools/geo-audit',
          external: false,
        },
        {
          title: 'Query Fan-Out Tool',
          href: '/tools/query-fan-out-tool',
          external: false,
        },
      ],
    },
    {
      title: 'Guides',
      items: [
        {
          title: 'AI Search Playbooks',
          href: '/playbooks',
          external: false,
        },
        {
          title: 'Manual Audit',
          href: '/ai-search-audit',
          external: false,
        },
        {
          title: 'Sample AI Visibility Report',
          href: '/sample-aeo-report',
          external: false,
        },
        {
          title: 'AI Search Readiness Checklist',
          href: '/guides/ai-search-readiness-checklist',
          external: false,
        },
        {
          title: 'AEO Checker Alternatives',
          href: '/compare/aeo-checker-alternatives',
          external: false,
        },
        {
          title: 'AEO Checker vs SEO Tools',
          href: '/compare/aeo-checker-vs-seo-tools',
          external: false,
        },
        {
          title: 'LLMs.txt File',
          href: '/guides/llms-txt-file',
          external: false,
        },
        {
          title: 'LLMs.txt SEO',
          href: '/guides/llms-txt-seo',
          external: false,
        },
        {
          title: 'GPTBot vs OAI-SearchBot',
          href: '/blog/gptbot-vs-oai-searchbot',
          external: false,
        },
        {
          title: 'LLMs.txt for Google AI Overviews',
          href: '/blog/llms-txt-google-ai-overviews',
          external: false,
        },
        {
          title: 'LLMs-full.txt',
          href: '/guides/llms-full-txt',
          external: false,
        },
        {
          title: 'AEO Audit',
          href: '/guides/aeo-audit',
          external: false,
        },
        {
          title: 'Query Fan-Out',
          href: '/guides/query-fan-out',
          external: false,
        },
        ...(websiteConfig.blog?.enable
          ? [{ title: 'Blog', href: Routes.Blog, external: false }]
          : []),
      ],
    },
    {
      title: 'Company',
      items: [
        { title: 'About', href: '/about', external: false },
        { title: 'Methodology', href: '/methodology', external: false },
        { title: 'References', href: '/references', external: false },
        { title: 'Press', href: '/press', external: false },
        { title: 'Contact', href: Routes.Contact, external: false },
      ],
    },
    {
      title: 'Legal',
      items: [
        { title: 'Cookie Policy', href: Routes.CookiePolicy, external: false },
        {
          title: 'Privacy Policy',
          href: Routes.PrivacyPolicy,
          external: false,
        },
        {
          title: 'Terms of Service',
          href: Routes.TermsOfService,
          external: false,
        },
      ],
    },
  ];
}
