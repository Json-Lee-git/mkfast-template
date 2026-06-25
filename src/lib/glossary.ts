import { allGlossaries } from 'content-collections';
import type { Glossary } from 'content-collections';
import { getLocale, type Locale } from '@/lib/locale';

export type GlossaryTerm = Glossary & { locale: Locale; slug: string };

export function getGlossaryTerms(locale: Locale = getLocale()): GlossaryTerm[] {
  return [...(allGlossaries as GlossaryTerm[])]
    .filter((t) => t.locale === locale)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getGlossaryBySlug(
  slug: string,
  locale: Locale = getLocale()
): GlossaryTerm | undefined {
  const terms = allGlossaries as GlossaryTerm[];
  return terms.find((t) => t.slug === slug && t.locale === locale);
}
