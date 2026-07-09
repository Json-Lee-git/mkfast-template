import { MonitorRequestsContent } from '@/components/admin/monitor-requests/monitor-requests-content';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/monitor-requests')({
  component: MonitorRequestsPage,
});

function MonitorRequestsPage() {
  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Monitor requests' },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <MonitorRequestsContent />
      </div>
    </>
  );
}
