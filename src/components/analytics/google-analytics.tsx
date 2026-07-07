import { ClientScript } from '@/components/shared/client-script';
import { clientEnv } from '@/env/client';

export function GoogleAnalytics() {
  if (!import.meta.env.PROD) return null;

  const measurementId = clientEnv.VITE_GOOGLE_ANALYTICS_ID;
  if (!measurementId) return null;

  const encodedId = encodeURIComponent(measurementId);
  const serializedId = JSON.stringify(measurementId);
  const inlineHtml = `
    window.dataLayer=window.dataLayer||[];
    function gtag(){dataLayer.push(arguments)}
    gtag('js',new Date());
    gtag('config',${serializedId});
  `;

  return (
    <>
      <ClientScript
        id="google-analytics"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodedId}`}
        async
        respectAnalyticsGuard
      />
      <ClientScript
        id="google-analytics-init"
        inlineHtml={inlineHtml}
        respectAnalyticsGuard
      />
    </>
  );
}
