import {
  type ManualAuditOrderStatus,
  useDeliverManualAuditOrder,
  useManualAuditOrders,
  useRetryManualAuditOrderNotification,
} from '@/hooks/use-manual-audit-orders';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDateTime } from '@/lib/formatter';
import { cn } from '@/lib/utils';
import {
  IconChevronLeft,
  IconChevronRight,
  IconRefresh,
  IconSearch,
  IconX,
} from '@tabler/icons-react';
import {
  parseAsIndex,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from 'nuqs';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

const STATUS_OPTIONS: Array<{
  label: string;
  value: ManualAuditOrderStatus;
}> = [
  { label: 'Pending', value: 'pending' },
  { label: 'Checkout failed', value: 'checkout_failed' },
  { label: 'Paid', value: 'paid' },
  { label: 'Notified', value: 'notified' },
  { label: 'Notification failed', value: 'notification_failed' },
  { label: 'Delivered', value: 'delivered' },
];

type ManualAuditOrderRow = {
  id: string;
  status: ManualAuditOrderStatus;
  checkoutId: string | null;
  requestId: string;
  websiteUrl: string;
  email: string;
  notificationError: string | null;
  reportUrl: string | null;
  deliveryNotes: string | null;
  createdAt: Date;
  paidAt: Date | null;
  notifiedAt: Date | null;
  deliveredAt: Date | null;
};

export function ManualAuditOrdersContent() {
  const [, startTransition] = useTransition();
  const [deliveryDrafts, setDeliveryDrafts] = useState<
    Record<string, { reportUrl: string; deliveryNotes: string }>
  >({});
  const [state, setQueryStates] = useQueryStates(
    {
      page: parseAsIndex.withDefault(0),
      size: parseAsInteger.withDefault(20),
      search: parseAsString.withDefault(''),
      status: parseAsString.withDefault(''),
    },
    { startTransition, history: 'replace' }
  );
  const status = isManualAuditOrderStatus(state.status)
    ? state.status
    : undefined;
  const { data, isLoading } = useManualAuditOrders(
    state.page,
    state.size,
    state.search,
    status
  );
  const retryNotification = useRetryManualAuditOrderNotification();
  const deliverOrder = useDeliverManualAuditOrder();
  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / state.size));
  const rows = (data?.items ?? []) as ManualAuditOrderRow[];

  const handleRetry = (orderId: string) => {
    retryNotification.mutate(orderId, {
      onSuccess: () => toast.success('Manual audit notification resent'),
      onError: (error) => {
        const message = error instanceof Error ? error.message : String(error);
        toast.error(message);
      },
    });
  };

  const updateDeliveryDraft = (
    orderId: string,
    field: 'reportUrl' | 'deliveryNotes',
    value: string
  ) => {
    setDeliveryDrafts((current) => ({
      ...current,
      [orderId]: {
        reportUrl: current[orderId]?.reportUrl ?? '',
        deliveryNotes: current[orderId]?.deliveryNotes ?? '',
        [field]: value,
      },
    }));
  };

  const handleDeliver = (row: ManualAuditOrderRow) => {
    const draft = deliveryDrafts[row.id];
    deliverOrder.mutate(
      {
        orderId: row.id,
        reportUrl: draft?.reportUrl || row.reportUrl || undefined,
        deliveryNotes: draft?.deliveryNotes || row.deliveryNotes || undefined,
      },
      {
        onSuccess: () => {
          setDeliveryDrafts((current) => {
            const next = { ...current };
            delete next[row.id];
            return next;
          });
          toast.success('Manual audit delivery email sent');
        },
        onError: (error) => {
          const message =
            error instanceof Error ? error.message : String(error);
          toast.error(message);
        },
      }
    );
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[260px] flex-1 sm:max-w-sm">
          <IconSearch className="-translate-y-1/2 absolute top-1/2 left-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search email, website, request, checkout"
            value={state.search}
            onChange={(event) =>
              setQueryStates({ search: event.target.value, page: 0 })
            }
            className="h-8 pr-8 pl-8"
          />
          {state.search ? (
            <button
              type="button"
              aria-label="Clear search"
              className="-translate-y-1/2 absolute top-1/2 right-2 text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setQueryStates({ search: '', page: 0 })}
            >
              <IconX className="size-3.5" />
            </button>
          ) : null}
        </div>
        <NativeSelect
          value={state.status}
          onChange={(event) =>
            setQueryStates({ status: event.target.value, page: 0 })
          }
          className="min-w-45"
        >
          <NativeSelectOption value="">All statuses</NativeSelectOption>
          {STATUS_OPTIONS.map((option) => (
            <NativeSelectOption key={option.value} value={option.value}>
              {option.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Checkout</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  Loading manual audit orders...
                </TableCell>
              </TableRow>
            ) : rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.id} className="align-top">
                  <TableCell className="whitespace-nowrap text-sm">
                    {formatOptionalDate(row.createdAt)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[220px] truncate font-medium">
                      {row.email}
                    </div>
                    <div className="max-w-[220px] truncate text-muted-foreground text-xs">
                      {row.requestId}
                    </div>
                  </TableCell>
                  <TableCell>
                    <a
                      href={row.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block max-w-[260px] truncate underline-offset-4 hover:underline"
                    >
                      {row.websiteUrl}
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[180px] truncate text-muted-foreground text-xs">
                      {row.checkoutId ?? '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div className="whitespace-nowrap">
                        Paid: {formatOptionalDate(row.paidAt)}
                      </div>
                      <div className="whitespace-nowrap text-muted-foreground">
                        Notified: {formatOptionalDate(row.notifiedAt)}
                      </div>
                      <div className="whitespace-nowrap text-muted-foreground">
                        Delivered: {formatOptionalDate(row.deliveredAt)}
                      </div>
                    </div>
                    {row.reportUrl ? (
                      <a
                        href={row.reportUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block max-w-[260px] truncate text-xs underline-offset-4 hover:underline"
                      >
                        {row.reportUrl}
                      </a>
                    ) : null}
                    {row.notificationError ? (
                      <div className="mt-1 max-w-[260px] text-destructive text-xs">
                        {row.notificationError}
                      </div>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-right">
                    <DeliveryAction
                      draft={deliveryDrafts[row.id]}
                      isDelivering={deliverOrder.isPending}
                      isRetrying={retryNotification.isPending}
                      row={row}
                      onDeliver={handleDeliver}
                      onRetry={handleRetry}
                      onUpdateDraft={updateDeliveryDraft}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No manual audit orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <div className="text-muted-foreground">
          {total} orders · page {state.page + 1} of {pageCount}
        </div>
        <div className="flex items-center gap-2">
          <NativeSelect
            value={String(state.size)}
            onChange={(event) =>
              setQueryStates({
                size: Number(event.target.value),
                page: 0,
              })
            }
          >
            {[10, 20, 50, 100].map((size) => (
              <NativeSelectOption key={size} value={String(size)}>
                {size} / page
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={state.page <= 0}
            onClick={() =>
              setQueryStates({ page: Math.max(0, state.page - 1) })
            }
          >
            <IconChevronLeft />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={state.page + 1 >= pageCount}
            onClick={() => setQueryStates({ page: state.page + 1 })}
          >
            <IconChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

function DeliveryAction({
  draft,
  isDelivering,
  isRetrying,
  row,
  onDeliver,
  onRetry,
  onUpdateDraft,
}: {
  draft?: { reportUrl: string; deliveryNotes: string };
  isDelivering: boolean;
  isRetrying: boolean;
  row: ManualAuditOrderRow;
  onDeliver: (row: ManualAuditOrderRow) => void;
  onRetry: (orderId: string) => void;
  onUpdateDraft: (
    orderId: string,
    field: 'reportUrl' | 'deliveryNotes',
    value: string
  ) => void;
}) {
  const reportUrl = draft?.reportUrl ?? row.reportUrl ?? '';
  const deliveryNotes = draft?.deliveryNotes ?? row.deliveryNotes ?? '';

  return (
    <div className="ml-auto flex max-w-[280px] flex-col items-end gap-2">
      {canDeliver(row.status) ? (
        <div className="w-full space-y-2 text-left">
          <Input
            aria-label="Report URL"
            className="h-8 text-xs"
            placeholder="Report URL required"
            value={reportUrl}
            onChange={(event) =>
              onUpdateDraft(row.id, 'reportUrl', event.target.value)
            }
          />
          <Textarea
            aria-label="Delivery notes"
            className="min-h-16 text-xs"
            placeholder="Delivery notes"
            value={deliveryNotes}
            onChange={(event) =>
              onUpdateDraft(row.id, 'deliveryNotes', event.target.value)
            }
          />
          <Button
            type="button"
            size="sm"
            disabled={isDelivering || !reportUrl.trim()}
            onClick={() => onDeliver(row)}
          >
            Send delivery
          </Button>
        </div>
      ) : null}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!canRetry(row.status) || isRetrying}
        onClick={() => onRetry(row.id)}
      >
        <IconRefresh />
        Retry
      </Button>
    </div>
  );
}

function StatusBadge({ status }: { status: ManualAuditOrderStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'border-transparent px-1.5',
        status === 'delivered' &&
          'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
        status === 'notified' &&
          'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
        status === 'notification_failed' &&
          'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
        status === 'paid' &&
          'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
        status === 'pending' &&
          'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
        status === 'checkout_failed' && 'bg-secondary text-secondary-foreground'
      )}
    >
      {statusLabel(status)}
    </Badge>
  );
}

function statusLabel(status: ManualAuditOrderStatus) {
  return (
    STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status
  );
}

function canRetry(status: ManualAuditOrderStatus) {
  return status === 'paid' || status === 'notification_failed';
}

function canDeliver(status: ManualAuditOrderStatus) {
  return (
    status === 'paid' ||
    status === 'notified' ||
    status === 'notification_failed' ||
    status === 'delivered'
  );
}

function isManualAuditOrderStatus(
  value: string
): value is ManualAuditOrderStatus {
  return STATUS_OPTIONS.some((option) => option.value === value);
}

function formatOptionalDate(value: Date | null) {
  return value ? formatDateTime(new Date(value)) : '-';
}
