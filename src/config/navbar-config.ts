import { Routes } from '@/lib/routes';
import {
  IconBuilding,
  IconBulb,
  IconCookie,
  IconFileText,
  IconLanguage,
  IconListCheck,
  IconMail,
  IconMailbox,
  IconMicrophone,
  IconPhoto,
  IconPhotoEdit,
  IconPhotoScan,
  IconRoute,
  IconShieldCheck,
  IconSparkles,
  IconWand,
} from '@tabler/icons-react';
import type { MenuItemConfig } from '../types';
import { websiteConfig } from './website';
/**
 * Navbar links
 */
export function getNavbarLinks(): MenuItemConfig[] {
  const links: MenuItemConfig[] = [
    { title: "Tools Directory", href: "/best-ai-visibility-tools", external: false },
    { title: "Pricing", href: "/ai-visibility-tools-pricing", external: false },
    { title: "Free Checker", href: "/ai-visibility-checker", external: false },
    { title: "Features", href: Routes.Features, external: false },
  ];
  if (websiteConfig.payment?.enable) {
    links.push({ title: "Pricing", href: Routes.Pricing, external: false });
  }
  if (websiteConfig.blog?.enable) {
    links.push({ title: "Blog", href: Routes.Blog, external: false });
  }
  links.push({
    title: "AI Tools",
    items: [
      { title: "AI Summarization", description: "Summarize text with AI", href: Routes.AiSummarization, icon: IconWand, external: false },
      { title: "AI Translation", description: "Translate text", href: Routes.AiTranslation, icon: IconLanguage, external: false },
      { title: "AI Tagline Generator", description: "Generate taglines", href: Routes.AiTagline, icon: IconBulb, external: false },
      { title: "Text to Speech", description: "Convert text to speech", href: Routes.AiTts, icon: IconMicrophone, external: false },
      { title: "AI Caption", description: "Generate image captions", href: Routes.AiCaption, icon: IconPhotoScan, external: false },
      { title: "AI Image (CF)", description: "Generate images via Cloudflare", href: Routes.AiImageCf, icon: IconSparkles, external: false },
      { title: "AI Image (Fal)", description: "Generate images via Fal.ai", href: Routes.AiImageFal, icon: IconPhoto, external: false },
      { title: "AI Image Edit", description: "Edit images with AI", href: Routes.AiImageEdit, icon: IconPhotoEdit, external: false },
    ],
  });
  links.push({
    title: "Pages",
    items: [
      { title: "About", description: "About this site", href: Routes.About, icon: IconBuilding, external: false },
      { title: "Contact", description: "Get in touch", href: Routes.Contact, icon: IconMail, external: false },
      { title: "Waitlist", description: "Join the waitlist", href: Routes.Waitlist, icon: IconMailbox, external: false },
      { title: "Changelog", description: "Product updates", href: Routes.Changelog, icon: IconListCheck, external: false },
      { title: "Roadmap", description: "Planned features", href: Routes.Roadmap, icon: IconRoute, external: false },
      { title: "Cookie Policy", description: "Cookie usage", href: Routes.CookiePolicy, icon: IconCookie, external: false },
      { title: "Privacy Policy", description: "Privacy policy", href: Routes.PrivacyPolicy, icon: IconShieldCheck, external: false },
      { title: "Terms of Service", description: "Terms and conditions", href: Routes.TermsOfService, icon: IconFileText, external: false },
    ],
  });
  return links;
}
