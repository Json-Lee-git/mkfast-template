import { GoogleAnalytics } from './google-analytics';
import { PlausibleAnalytics } from './plausible-analytics';

export function Analytics() {
  if (!import.meta.env.PROD) return null;

  return (
    <>
      <GoogleAnalytics />
      <PlausibleAnalytics />
    </>
  );
}
