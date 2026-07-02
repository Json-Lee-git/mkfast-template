import { ManualAuditOrdersContent } from '@/components/admin/manual-audit-orders/manual-audit-orders-content';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/manual-audit-orders')({
  component: ManualAuditOrdersPage,
});

function ManualAuditOrdersPage() {
  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Manual audits' },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <ManualAuditOrdersContent />
      </div>
    </>
  );
}
