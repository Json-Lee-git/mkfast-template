const args = process.argv.slice(2);
const baseArg = args
  .find((arg) => arg.startsWith('--base='))
  ?.slice('--base='.length);
const baseUrl = (
  baseArg ??
  process.env.SMOKE_BASE_URL ??
  'http://localhost:3000'
).replace(/\/$/, '');
const canonicalBaseArg = args
  .find((arg) => arg.startsWith('--canonical-base='))
  ?.slice('--canonical-base='.length);
const canonicalBaseUrl = (
  canonicalBaseArg ??
  process.env.SMOKE_CANONICAL_BASE ??
  baseUrl
).replace(/\/$/, '');

type CheckResult = {
  name: string;
  ok: boolean;
  detail: string;
};

const results: CheckResult[] = [];

function pass(name: string, detail: string) {
  results.push({ name, ok: true, detail });
}

function fail(name: string, detail: string) {
  results.push({ name, ok: false, detail });
}

async function fetchText(path: string) {
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: { 'user-agent': 'aeocheck-smoke-test/1.0' },
    });
    const text = await response.text();
    return { response, text };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Unable to fetch ${baseUrl}${path}: ${message}`);
  }
}

function assertIncludes(name: string, text: string, expected: string) {
  if (text.includes(expected)) {
    pass(name, `found ${expected}`);
  } else {
    fail(name, `missing ${expected}`);
  }
}

function assertNotIncludes(name: string, text: string, unexpected: string) {
  if (text.includes(unexpected)) {
    fail(name, `unexpected ${unexpected}`);
  } else {
    pass(name, `did not find ${unexpected}`);
  }
}

async function checkPage(
  path: string,
  expected: string,
  opts?: { noIndex?: boolean }
) {
  const { response, text } = await fetchText(path);
  if (response.ok) {
    pass(`${path} status`, String(response.status));
  } else {
    fail(`${path} status`, String(response.status));
  }

  assertIncludes(`${path} content`, text, expected);

  const hasNoIndex =
    /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(text);
  if (opts?.noIndex) {
    if (hasNoIndex) pass(`${path} noindex`, 'present');
    else fail(`${path} noindex`, 'missing');
  } else if (hasNoIndex) {
    fail(`${path} noindex`, 'public page is marked noindex');
  } else {
    pass(`${path} noindex`, 'not present');
  }
}

await checkPage('/ai-search-audit', 'Manual AI Search Readiness Audit');
await checkPage('/sample-aeo-report', 'Sample Fix Pack');
await checkPage('/blog/ai-search-readiness-audit', 'AI Search Readiness Audit');
await checkPage('/methodology', 'Methodology');
await checkPage(
  '/ai-search-audit/thanks?site=https%3A%2F%2Fexample.com',
  'Payment received',
  {
    noIndex: true,
  }
);

const { response: robotsResponse, text: robots } =
  await fetchText('/robots.txt');
if (robotsResponse.ok)
  pass('/robots.txt status', String(robotsResponse.status));
else fail('/robots.txt status', String(robotsResponse.status));
assertIncludes(
  '/robots.txt sitemap',
  robots,
  `Sitemap: ${canonicalBaseUrl}/sitemap.xml`
);
assertNotIncludes('/robots.txt pricing', robots, 'Disallow: /pricing');
assertNotIncludes(
  '/robots.txt manual audit',
  robots,
  'Disallow: /ai-search-audit'
);
assertIncludes('/robots.txt admin blocked', robots, 'Disallow: /admin');

const { response: sitemapResponse, text: sitemap } =
  await fetchText('/sitemap.xml');
if (sitemapResponse.ok)
  pass('/sitemap.xml status', String(sitemapResponse.status));
else fail('/sitemap.xml status', String(sitemapResponse.status));
assertIncludes(
  '/sitemap.xml manual audit',
  sitemap,
  `<loc>${canonicalBaseUrl}/ai-search-audit</loc>`
);
assertIncludes(
  '/sitemap.xml sample report',
  sitemap,
  `<loc>${canonicalBaseUrl}/sample-aeo-report</loc>`
);
assertIncludes(
  '/sitemap.xml audit blog',
  sitemap,
  `<loc>${canonicalBaseUrl}/blog/ai-search-readiness-audit</loc>`
);
assertNotIncludes(
  '/sitemap.xml thanks page',
  sitemap,
  `<loc>${canonicalBaseUrl}/ai-search-audit/thanks</loc>`
);

const failed = results.filter((result) => !result.ok);
for (const result of results) {
  console.log(
    `${result.ok ? 'PASS' : 'FAIL'} ${result.name}: ${result.detail}`
  );
}

if (failed.length > 0) {
  console.error(`\n${failed.length} smoke check(s) failed for ${baseUrl}`);
  process.exitCode = 1;
} else {
  console.log(`\nAll ${results.length} smoke checks passed for ${baseUrl}`);
}

export {};
