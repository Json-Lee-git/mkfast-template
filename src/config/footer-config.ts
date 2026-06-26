import { Routes } from '@/lib/routes';
import type { MenuItemConfig } from '../types';
import { websiteConfig } from './website';

export function getFooterLinks(): MenuItemConfig[] {
  return [
    {
      title: 'Tools',
      items: [
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
        { title: 'AEO Checker', href: '/tools/aeo-checker', external: false },
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
