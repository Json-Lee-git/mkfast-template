import { clientEnv } from '@/env/client';
import { websiteConfig } from '@/config/website';
import {
  deLocalizeHref,
  getLocale,
  localizeHref,
  type Locale,
} from '@/lib/locale';

/**
 * Site origin.
 *
 * Priority:
 *  1. PUBLIC_SITE_URL — Worker runtime var (see wrangler.jsonc `vars`).
 *     Requires `nodejs_compat` + `nodejs_compat_populate_process_env`.
 *  2. VITE_BASE_URL — build-time inlined import.meta.env.VITE_BASE_URL,
 *     used for client-side hydration and local dev (defaults to localhost:3000).
 *
 * No code path reads process.env.VITE_BASE_URL.
 * Server runtime + production → 1; client / dev / preview → 2.
 *
 * Security: CI deploy gate (deploy.yml) validates PUBLIC_SITE_URL before
 * deploying to production. If it is still missing at Worker runtime in
 * production, this function throws — the site must not serve pages with
 * incorrect canonical / OG / sitemap URLs.
 */
export function getBaseUrl(): string {
  // Worker runtime: prefer the explicitly-set production URL
  if (typeof process !== 'undefined' && typeof process.env !== 'undefined') {
    if (process.env.PUBLIC_SITE_URL) return process.env.PUBLIC_SITE_URL;
  }

  // Production SSR safety net: PUBLIC_SITE_URL is missing at runtime.
  // This should never happen — CI deploy gate enforces it.
  if (import.meta.env.PROD && import.meta.env.SSR) {
    throw new Error(
      '[getBaseUrl] CRITICAL: PUBLIC_SITE_URL is not set at Worker runtime. ' +
        'Canonical, sitemap, OG, and social metadata URLs cannot be generated correctly. ' +
        'Set PUBLIC_SITE_URL via wrangler.jsonc vars, wrangler deploy --var, or Cloudflare Dashboard.'
    );
  }

  // Fallback: build-time inlined (client side, local dev, preview)
  return clientEnv.VITE_BASE_URL;
}

/**
 * Build canonical URL for a path (e.g. /about -> https://example.com/about)
 * @param path - The path to build the canonical URL for
 * @returns The canonical URL
 */
export function getCanonicalUrl(path: string): string {
  const base = getBaseUrl().replace(/\/$/, '');
  const rawPath = path.startsWith('/') ? path : `/${path}`;
  const p = localizeHref(rawPath, { locale: getLocale() });
  return `${base}${p}`;
}

export function getCanonicalUrlForLocale(path: string, locale: Locale): string {
  const base = getBaseUrl().replace(/\/$/, '');
  const rawPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${localizeHref(rawPath, { locale })}`;
}

/**
 * Get the path with the current or provided locale applied.
 * e.g. getPathWithLocale('/dashboard', 'zh') => '/zh/dashboard'
 * e.g. getPathWithLocale('/dashboard', 'en') => '/dashboard'
 */
export function getPathWithLocale(
  path: string,
  locale: Locale = getLocale()
): string {
  return localizeHref(deLocalizeHref(path), { locale });
}

/**
 * Get the URL of the image, if the image is a relative path, it will be prefixed with the base URL
 * @param image - The image URL
 * @returns The URL of the image
 */
export function getImageUrl(image: string): string {
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  if (image.startsWith('/')) {
    return `${getBaseUrl()}${image}`;
  }
  return `${getBaseUrl()}/${image}`;
}

/**
 * OG image absolute URL from website config.
 */
export function getOgImage(): string | undefined {
  const path = websiteConfig.metadata?.images?.ogImage;
  return path ? getImageUrl(path) : undefined;
}

/**
 * Get the Stripe customer dashboard URL
 * @param customerId - The Stripe customer ID
 * @returns The Stripe customer dashboard URL
 */
export function getStripeCustomerDashboardUrl(customerId: string): string {
  if (import.meta.env.DEV) {
    return `https://dashboard.stripe.com/test/customers/${customerId}`;
  }
  return `https://dashboard.stripe.com/customers/${customerId}`;
}

/**
 * Get the access URL for a file stored in R2
 * @param r2Key - The R2 storage key
 * @returns The file access URL
 */
export function getFileAccessUrl(r2Key: string): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}/api/storage/file?key=${encodeURIComponent(r2Key)}`;
}

/**
 * Convert email string to mailto href. Supports "Name <email>" format.
 * @param email - Plain email or "Display Name <email>"
 * @returns mailto href, or undefined if email is empty
 */
export function getMailtoUrl(
  email: string | undefined | null
): string | undefined {
  if (!email?.trim()) return undefined;
  const trimmed = email.trim();
  return trimmed.includes('<')
    ? trimmed.replace(/^[^<]*<([^>]*)>.*$/, 'mailto:$1')
    : `mailto:${trimmed}`;
}

/**
 * Extract @handle from twitter/x profile URL, e.g. https://twitter.com/Me -> @Me
 */
export function twitterHandleFromUrl(href: string): string | null {
  try {
    const u = new URL(href);
    if (u.hostname !== 'twitter.com' && u.hostname !== 'x.com') return null;
    const segment = u.pathname.replace(/^\/+|\/+$/g, '').split('/')[0];
    return segment ? `@${segment}` : null;
  } catch {
    return null;
  }
}

/**
 * Whether the current pathname exactly matches the given link.
 * Anchor links (e.g. /#features) are never considered active when only pathname
 * is compared, so the homepage root does not highlight "Features" / "Faqs" etc.
 */
export function isLinkActive(
  href: string | undefined,
  pathname: string
): boolean {
  if (!href) return false;
  if (href.includes('#')) return false;
  const path = href.split('#')[0] ?? '/';
  const normalizedHref = path === '/' ? '/' : path.replace(/\/$/, '') || '/';
  const normalizedPath =
    pathname === '/' ? '/' : pathname.replace(/\/$/, '') || '/';
  return normalizedPath === normalizedHref;
}
