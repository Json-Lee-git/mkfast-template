import { m } from '@/locale/paraglide/messages';
import { createFileRoute, useSearch } from '@tanstack/react-router';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { PaymentCard } from '@/components/payment/payment-card';
import { websiteConfig } from '@/config/website';

export const Route = createFileRoute('/settings/payment')({
  validateSearch: (
    s
  ): {
    session_id?: string;
    callback?: string;
  } => ({
    session_id: typeof s?.session_id === 'string' ? s.session_id : undefined,
    callback: typeof s?.callback === 'string' ? s.callback : undefined,
  }),
  component: PaymentPage,
});

function PaymentPage() {
  const search = useSearch({ from: '/settings/payment' });
  const supportEmail =
    websiteConfig.metadata?.supportEmail ?? 'support@aeocheck.xyz';
  const breadcrumbs = [
    { label: m.common_settings(), isCurrentPage: false },
    { label: m.settings_billing_breadcrumb(), isCurrentPage: true },
  ];
  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 lg:gap-6 lg:py-6">
            <div className="px-4 lg:px-6">
              <PaymentCard
                sessionId={search.session_id}
                callback={search.callback ?? '/settings/billing'}
              />
              <div className="mt-6 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <h2 className="text-lg font-semibold">Need help?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  For checkout, receipt, refund, or report access questions,
                  email support directly.
                </p>
                <a
                  href={`mailto:${supportEmail}`}
                  className="mt-4 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  {supportEmail}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
