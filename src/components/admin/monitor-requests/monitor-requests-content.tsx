import {
  type MonitorRequestStatus,
  useMonitorRequests,
} from '@/hooks/use-monitor-requests';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  IconSearch,
  IconX,
} from '@tabler/icons-react';
import {
  parseAsIndex,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from 'nuqs';
import { useTransition } from 'react';

const STATUS_OPTIONS: Array<{
  label: string;
  value: MonitorRequestStatus;
}> = [
  { label: 'New', value: 'new' },
  { label: 'Reviewing', value: 'reviewing' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Active', value: 'active' },
  { label: 'Paused', value: 'paused' },
];

type MonitorRequestRow = {
  id: string;
  status: MonitorRequestStatus;
  email: string;
  name: string | null;
  url: string;
  source: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function MonitorRequestsContent() {
  const [, startTransition] = useTransition();
  const [state, setQueryStates] = useQueryStates(
    {
      page: parseAsIndex.withDefault(0),
      size: parseAsInteger.withDefault(20),
      search: parseAsString.withDefault(''),
      status: parseAsString.withDefault(''),
    },
    { startTransition, history: 'replace' }
  );
  const status = isMonitorRequestStatus(state.status)
    ? state.status
    : undefined;
  const { data, isLoading } = useMonitorRequests({
    pageIndex: state.page,
    pageSize: state.size,
    search: state.search,
    status,
  });
  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / state.size));
  const rows = (data?.items ?? []) as MonitorRequestRow[];

  const updateSearch = (value: string) => {
    setQueryStates({ page: 0, search: value });
  };

  const updateStatus = (value: string) => {
    setQueryStates({ page: 0, status: value });
  };

  const clearFilters = () => {
    setQueryStates({ page: 0, search: '', status: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Monitor requests</h2>
          <p className="text-sm text-muted-foreground">
            Managed Monitor early access requests submitted from the funnel.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <IconSearch className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="w-64 pl-8"
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Search email or URL"
              value={state.search}
            />
          </div>
          <NativeSelect
            onChange={(event) => updateStatus(event.target.value)}
            value={state.status}
          >
            <NativeSelectOption value="">All statuses</NativeSelectOption>
            {STATUS_OPTIONS.map((option) => (
              <NativeSelectOption key={option.value} value={option.value}>
                {option.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          {state.search || state.status ? (
            <Button onClick={clearFilters} size="sm" variant="ghost">
              <IconX className="size-4" />
              Clear
            </Button>
          ) : null}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  className="h-24 text-center text-muted-foreground"
                  colSpan={6}
                >
                  Loading monitor requests...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  className="h-24 text-center text-muted-foreground"
                  colSpan={6}
                >
                  No monitor requests found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="text-muted-foreground">
                    {formatOptionalDate(row.createdAt)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{row.name || '-'}</div>
                      <a
                        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                        href={`mailto:${row.email}`}
                      >
                        {row.email}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-sm whitespace-normal">
                    <a
                      className="break-all text-primary underline-offset-4 hover:underline"
                      href={row.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {row.url}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{row.source}</Badge>
                  </TableCell>
                  <TableCell className="max-w-sm whitespace-normal text-muted-foreground">
                    {row.notes || '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>
          {total} requests - page {state.page + 1} of {pageCount}
        </span>
        <div className="flex items-center gap-2">
          <Button
            disabled={state.page <= 0}
            onClick={() =>
              setQueryStates({ page: Math.max(0, state.page - 1) })
            }
            size="sm"
            variant="outline"
          >
            <IconChevronLeft className="size-4" />
            Previous
          </Button>
          <Button
            disabled={state.page + 1 >= pageCount}
            onClick={() =>
              setQueryStates({
                page: Math.min(pageCount - 1, state.page + 1),
              })
            }
            size="sm"
            variant="outline"
          >
            Next
            <IconChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: MonitorRequestStatus }) {
  return (
    <Badge
      className={cn(statusClassName(status), 'capitalize')}
      variant="outline"
    >
      {status}
    </Badge>
  );
}

function statusClassName(status: MonitorRequestStatus) {
  switch (status) {
    case 'new':
      return 'border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300';
    case 'reviewing':
      return 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300';
    case 'accepted':
    case 'active':
      return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
    case 'rejected':
      return 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300';
    case 'paused':
      return 'border-zinc-500/40 bg-zinc-500/10 text-zinc-700 dark:text-zinc-300';
  }
}

function isMonitorRequestStatus(value: string): value is MonitorRequestStatus {
  return STATUS_OPTIONS.some((option) => option.value === value);
}

function formatOptionalDate(value: Date | string | null | undefined) {
  return value ? formatDateTime(new Date(value)) : '-';
}
