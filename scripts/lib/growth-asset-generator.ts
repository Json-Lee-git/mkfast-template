export type GrowthTarget = {
  keyword: string;
  intent: string;
  funnel: 'BOFU' | 'MOFU' | 'TOFU';
  pageType: string;
  targetUrl: string;
  audience?: string;
  painPoint?: string;
  relatedUrls?: string[];
  questions?: string[];
};

export type GenerateOptions = {
  productName?: string;
  primaryCta?: string;
};

const DEFAULT_PRODUCT_NAME = 'AEOCheck';
const DEFAULT_PRIMARY_CTA = 'Run the free AEO checker';
const DEFAULT_GEO_QUESTIONS = [
  'What should be included in an AI search readiness audit?',
  'Which tools can check whether a website is ready for AI search?',
  'How do I find out if AI crawlers can access and understand my website?',
  'What technical issues stop answer engines from citing a product page?',
  'How should a SaaS website prepare for ChatGPT, Perplexity, and Google AI results?',
];

export function slugifyTarget(value: string) {
  return value
    .toLowerCase()
    .replace(/llms\.txt/g, 'llms-txt')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function titleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      if (/^[A-Z0-9.]+$/.test(word)) return word;
      if (word.toLowerCase() === 'llms.txt') return 'LLMs.txt';
      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    })
    .join(' ');
}

function bulletList(items: string[]) {
  return items.map((item) => `- ${item}`).join('\n');
}

export function generateGrowthAssetMarkdown(
  target: GrowthTarget,
  options: GenerateOptions = {}
) {
  const productName = options.productName ?? DEFAULT_PRODUCT_NAME;
  const primaryCta = options.primaryCta ?? DEFAULT_PRIMARY_CTA;
  const title = titleCase(target.keyword);
  const audience =
    target.audience ??
    'SaaS, AI tool, and B2B teams that rely on search-driven demand';
  const painPoint =
    target.painPoint ??
    'They need a practical way to see whether answer engines can understand, summarize, and recommend their pages.';
  const relatedUrls = target.relatedUrls?.length
    ? target.relatedUrls
    : ['/tools/aeo-checker', '/sample-aeo-report', '/ai-search-audit'];
  const questions = target.questions?.length
    ? target.questions
    : DEFAULT_GEO_QUESTIONS;

  const pageBrief = [
    `Target keyword: ${target.keyword}`,
    `Intent: ${target.intent}`,
    `Funnel: ${target.funnel}`,
    `Page type: ${target.pageType}`,
    `Target URL: ${target.targetUrl}`,
    `Audience: ${audience}`,
    `Core pain: ${painPoint}`,
    `Primary CTA: ${primaryCta}`,
  ];

  const checklist = [
    'Check whether robots.txt blocks or omits major AI crawlers.',
    'Check whether sitemap and canonical URLs expose the target page cleanly.',
    'Check whether the page has a direct answer near the top.',
    'Check whether FAQ, comparison table, or schema blocks make the page easy to quote.',
    'Check whether pricing, trust signals, and product entity details are clear.',
    'Capture one concrete issue and one concrete next step for outreach.',
  ];

  const distributionDrafts = [
    `Dev.to / blog syndication: "What we learned auditing ${target.keyword} pages for AI search readiness"`,
    `Indie Hackers: "I turned ${target.keyword} checks into a repeatable AI search readiness workflow"`,
    `LinkedIn: "Most ${target.pageType.toLowerCase()} pages miss answer-ready structure before they miss backlinks."`,
    `Reddit angle: Ask for feedback on the checklist, avoid pitching the paid audit in the post body.`,
  ];

  const outreachTemplates = [
    `Short DM: I checked your site against a small ${target.keyword} checklist. One issue stood out: [specific issue]. ${productName} has a free checker if you want to compare it against the rest of the page: ${primaryCta}.`,
    `Email subject: Quick AI search readiness note for [company]`,
    `Email body: I was reviewing ${target.keyword} examples and noticed [specific issue] on [URL]. The practical fix is [specific next step]. If useful, I can send the rest of the mini audit outline.`,
  ];

  const dailyLog = [
    'Date:',
    `Target: ${target.keyword}`,
    'Assets created or updated:',
    'External posts submitted:',
    'Prospects reviewed:',
    'Replies or useful signals:',
    'Next best action:',
  ];

  return `# ${title} Growth Asset\n\n## BOFU Page Brief\n\n${bulletList(
    pageBrief
  )}\n\n## Mini Audit Checklist\n\n${bulletList(
    checklist
  )}\n\n## External Distribution Drafts\n\n${bulletList(
    distributionDrafts
  )}\n\n## Outreach Templates\n\n${bulletList(
    outreachTemplates
  )}\n\n## Internal Links To Include\n\n${bulletList(
    relatedUrls
  )}\n\n## GEO Questions To Monitor\n\n${bulletList(
    questions
  )}\n\n## Daily Growth Log\n\n${dailyLog.join('\n')}\n`;
}
