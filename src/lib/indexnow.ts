const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const INDEXNOW_KEY = 'aeocheckxyz';
const SEARCH_ENGINES = [
  'https://www.bing.com/indexnow',
  'https://search.seznam.cz/indexnow',
  'https://www.yandex.com/indexnow',
  'https://yep.com/indexnow',
];

/**
 * Submit a single URL to IndexNow.
 * Falls back to individual search engine endpoints if the keyless endpoint fails.
 */
export async function submitUrl(url: string): Promise<boolean> {
  const origin = new URL(url).origin;
  const body = JSON.stringify({
    host: new URL(url).hostname,
    key: INDEXNOW_KEY,
    keyLocation: `${origin}/indexnow-key.txt`,
    urlList: [url],
  });

  // Try the shared endpoint first
  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body,
    });
    if (res.ok || res.status === 202) return true;
  } catch {
    // Fall through to individual engines
  }

  // Fallback: ping each engine individually
  const results = await Promise.allSettled(
    SEARCH_ENGINES.map((endpoint) =>
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body,
      })
    )
  );

  return results.some(
    (r) => r.status === 'fulfilled' && (r.value.ok || r.value.status === 202)
  );
}

/**
 * Submit multiple URLs to IndexNow (batch up to 10,000).
 */
export async function submitUrls(urls: string[]): Promise<number> {
  let successCount = 0;

  // IndexNow limit: 10,000 URLs per request
  for (let i = 0; i < urls.length; i += 10000) {
    const batch = urls.slice(i, i + 10000);
    const origin = new URL(batch[0]).origin;
    const body = JSON.stringify({
      host: new URL(batch[0]).hostname,
      key: INDEXNOW_KEY,
      keyLocation: `${origin}/indexnow-key.txt`,
      urlList: batch,
    });

    try {
      const res = await fetch(INDEXNOW_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body,
      });
      if (res.ok || res.status === 202) {
        successCount += batch.length;
      }
    } catch {
      // Try individual engines for this batch
      const results = await Promise.allSettled(
        SEARCH_ENGINES.map((endpoint) =>
          fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body,
          })
        )
      );
      if (
        results.some(
          (r) =>
            r.status === 'fulfilled' && (r.value.ok || r.value.status === 202)
        )
      ) {
        successCount += batch.length;
      }
    }
  }

  return successCount;
}

/**
 * Key file content for IndexNow verification.
 * Place at /indexnow-key.txt to validate ownership.
 */
export function indexNowKeyFile(_host: string): string {
  return INDEXNOW_KEY;
}
