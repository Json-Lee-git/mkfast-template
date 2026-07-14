import { getMessageList } from '@/lib/locale';
import { m } from '@/locale/paraglide/messages';
import { clientEnv } from '@/env/client';
import type { WebsiteConfig } from '../types';

// Payment provider controlled by env var: 'stripe' | 'creem' | '' (empty means disabled)
const paymentProvider = clientEnv.VITE_PAYMENT_PROVIDER;
const isPaymentEnabled = paymentProvider !== '';
const isCreemPayment = paymentProvider === 'creem';
// Resolve price/product IDs based on the active payment provider
const priceIds = isPaymentEnabled
  ? {
      proMonthly: isCreemPayment
        ? (clientEnv.VITE_CREEM_PRODUCT_PRO_MONTHLY ?? '')
        : (clientEnv.VITE_STRIPE_PRICE_PRO_MONTHLY ?? ''),
      proYearly: isCreemPayment
        ? (clientEnv.VITE_CREEM_PRODUCT_PRO_YEARLY ?? '')
        : (clientEnv.VITE_STRIPE_PRICE_PRO_YEARLY ?? ''),
      lifetime: isCreemPayment
        ? (clientEnv.VITE_CREEM_PRODUCT_LIFETIME ?? '')
        : (clientEnv.VITE_STRIPE_PRICE_LIFETIME ?? ''),
    }
  : { proMonthly: '', proYearly: '', lifetime: '' };

/**
 * Website config
 */
export const websiteConfig: WebsiteConfig = {
  ui: {
    mode: {
      defaultMode: 'dark',
      enableSwitch: true,
    },
  },
  metadata: {
    name: 'AEOCheck',
    title: 'AEOCheck - AI Visibility Audit and ChatGPT Visibility Checker',
    description:
      'Run a free AI visibility audit to check whether ChatGPT-style answers can understand, trust, and recommend your brand. Get a prioritized fix path.',
    supportEmail: 'support@aeocheck.xyz',
    images: {
      ogImage: '/og.png',
      logoLight: '/logo.png',
      logoDark: '/logo-dark.png',
    },
  },
  social: {
    github: '',
    discord: '',
    twitter: '',
    youtube: '',
  },
  auth: {
    enable: true,
    enableGoogleLogin: true,
    enableCredentialLogin: true,
    enableDeleteAccount: true,
  },
  blog: {
    enable: true,
    paginationSize: 6,
  },
  payment: {
    enable: isPaymentEnabled,
    provider: isPaymentEnabled ? paymentProvider : undefined,
    price: {
      plans: {
        free: {
          id: 'free',
          prices: [],
          isFree: true,
          isLifetime: false,
          get name() {
            return m.pricing_plans_free_name();
          },
          get description() {
            return m.pricing_plans_free_description();
          },
          get features() {
            return [...getMessageList(m.pricing_plans_free_features())];
          },
          get limits() {
            return [...getMessageList(m.pricing_plans_free_limits())];
          },
        },
        pro: {
          id: 'pro',
          prices: [
            {
              type: 'subscription',
              priceId: priceIds.proMonthly,
              amount: 2900,
              currency: 'USD',
              interval: 'month',
            },
            {
              type: 'subscription',
              priceId: priceIds.proYearly,
              amount: 29000,
              currency: 'USD',
              interval: 'year',
            },
          ],
          isFree: false,
          isLifetime: false,
          popular: true,
          get name() {
            return m.pricing_plans_pro_name();
          },
          get description() {
            return m.pricing_plans_pro_description();
          },
          get features() {
            return [...getMessageList(m.pricing_plans_pro_features())];
          },
          get limits() {
            return [...getMessageList(m.pricing_plans_pro_limits())];
          },
        },
        lifetime: {
          id: 'lifetime',
          prices: [
            {
              type: 'one_time',
              priceId: priceIds.lifetime,
              amount: 19900,
              currency: 'USD',
              allowPromotionCode: true,
            },
          ],
          isFree: false,
          isLifetime: true,
          get name() {
            return m.pricing_plans_lifetime_name();
          },
          get description() {
            return m.pricing_plans_lifetime_description();
          },
          get features() {
            return [...getMessageList(m.pricing_plans_lifetime_features())];
          },
          get limits() {
            return [...getMessageList(m.pricing_plans_lifetime_limits())];
          },
        },
      },
    },
  },
};
