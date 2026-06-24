import { Routes } from '@/lib/routes';
import type { MenuItemConfig } from '../types';
import { websiteConfig } from './website';

/**
 * Footer links, grouped by section
 */
export function getFooterLinks(): MenuItemConfig[] {
  const productItems: MenuItemConfig[] = [
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
  ];

  const resourcesItems: MenuItemConfig[] = [
    {
      title: 'LLMs.txt Guide',
      href: '/guides/llms-txt-file',
      external: false,
    },
    {
      title: 'LLMs.txt SEO Guide',
      href: '/guides/llms-txt-seo',
      external: false,
    },
    {
      title: 'LLMs-full.txt Guide',
      href: '/guides/llms-full-txt',
      external: false,
    },
  ];

  if (websiteConfig.blog?.enable) {
    resourcesItems.push({
      title: 'Blog',
      href: Routes.Blog,
      external: false,
    });
  }

  const companyItems: MenuItemConfig[] = [
    { title: 'About', href: Routes.About, external: false },
    { title: 'Contact', href: Routes.Contact, external: false },
  ];

  const legalItems: MenuItemConfig[] = [
    {
      title: 'Cookie Policy',
      href: Routes.CookiePolicy,
      external: false,
    },
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
  ];

  return [
    { title: 'Tools', items: productItems },
    { title: 'Guides', items: resourcesItems },
    { title: 'Company', items: companyItems },
    { title: 'Legal', items: legalItems },
  ];
}
