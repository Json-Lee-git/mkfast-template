import { afterEach, describe, expect, it, vi } from 'vitest';

import { shouldSuppressClientAnalytics } from '../analytics-guard';

function createSessionStorage() {
  const store = new Map<string, string>();

  return {
    clear: () => store.clear(),
    getItem: (key: string) => store.get(key) ?? null,
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    removeItem: (key: string) => store.delete(key),
    setItem: (key: string, value: string) => store.set(key, value),
    get length() {
      return store.size;
    },
  };
}

function stubBrowserWindow(search = '', webdriver = false) {
  const browserWindow = {
    location: { search },
    navigator: { webdriver },
    sessionStorage: createSessionStorage(),
  };

  vi.stubGlobal('window', browserWindow);

  return browserWindow;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('shouldSuppressClientAnalytics', () => {
  it('allows analytics outside the browser', () => {
    vi.stubGlobal('window', undefined);

    expect(shouldSuppressClientAnalytics()).toBe(false);
  });

  it('allows normal browser traffic', () => {
    stubBrowserWindow();

    expect(shouldSuppressClientAnalytics()).toBe(false);
  });

  it('suppresses explicit no-analytics sessions', () => {
    const browserWindow = stubBrowserWindow('?aeocheck_no_analytics=1');

    expect(shouldSuppressClientAnalytics()).toBe(true);

    browserWindow.location.search = '';

    expect(shouldSuppressClientAnalytics()).toBe(true);
  });

  it('suppresses known QA campaign sources', () => {
    stubBrowserWindow('?utm_source=Playwright');

    expect(shouldSuppressClientAnalytics()).toBe(true);
  });

  it('suppresses webdriver traffic', () => {
    stubBrowserWindow('', true);

    expect(shouldSuppressClientAnalytics()).toBe(true);
  });
});
