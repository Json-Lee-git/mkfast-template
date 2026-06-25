import { PlausibleAnalytics } from './plausible-analytics';

export function Analytics() {
  if (!import.meta.env.PROD) return null;

  return <PlausibleAnalytics />;
}
