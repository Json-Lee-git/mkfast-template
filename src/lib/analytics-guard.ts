const SUPPRESS_STORAGE_KEY = 'aeocheck_no_analytics';
const SUPPRESS_QUERY_KEYS = ['aeocheck_no_analytics', 'no_analytics'];
const SUPPRESS_UTM_SOURCES = new Set([
  'agent_qa',
  'codex',
  'smoke',
  'playwright',
  'qa',
]);

function readSessionFlag() {
  try {
    return window.sessionStorage.getItem(SUPPRESS_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function persistSessionFlag() {
  try {
    window.sessionStorage.setItem(SUPPRESS_STORAGE_KEY, '1');
  } catch {
    // Ignore storage failures; the current page view is still suppressed.
  }
}

export function shouldSuppressClientAnalytics() {
  if (typeof window === 'undefined') return false;

  const params = new URLSearchParams(window.location.search);
  const hasSuppressParam = SUPPRESS_QUERY_KEYS.some(
    (key) => params.get(key) === '1'
  );
  const utmSource = params.get('utm_source')?.toLowerCase() ?? '';
  const hasSuppressedUtmSource = SUPPRESS_UTM_SOURCES.has(utmSource);

  if (hasSuppressParam || hasSuppressedUtmSource) {
    persistSessionFlag();
    return true;
  }

  if (readSessionFlag()) return true;
  if (window.navigator.webdriver) return true;

  return false;
}
