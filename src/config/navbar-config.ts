import { Routes } from '@/lib/routes';
import type { MenuItemConfig } from '../types';
import { websiteConfig } from './website';

export function getNavbarLinks(): MenuItemConfig[] {
  const links: MenuItemConfig[] = [
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
    { title: 'Playbooks', href: '/playbooks', external: false },
    { title: 'Manual Audit', href: '/ai-search-audit', external: false },
    {
      title: 'Query Fan-Out',
      href: '/tools/query-fan-out-tool',
      external: false,
    },
    { title: 'Guides', href: '/guides/llms-txt-file', external: false },
    { title: 'Pricing', href: Routes.Pricing, external: false },
  ];
  if (websiteConfig.blog?.enable) {
    links.push({ title: 'Blog', href: Routes.Blog, external: false });
  }
  return links;
}
