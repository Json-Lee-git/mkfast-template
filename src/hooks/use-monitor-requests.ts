import {
  listMonitorRequests,
  type MonitorRequestStatus,
} from '@/api/ai-readiness/monitor-requests';
import { useQuery } from '@tanstack/react-query';

export type { MonitorRequestStatus };

export const monitorRequestKeys = {
  all: ['monitor-requests'] as const,
  lists: () => [...monitorRequestKeys.all, 'list'] as const,
  list: (filters: MonitorRequestListFilters) =>
    [...monitorRequestKeys.lists(), filters] as const,
};

export interface MonitorRequestListFilters {
  pageIndex: number;
  pageSize: number;
  search?: string;
  status?: MonitorRequestStatus;
}

export function useMonitorRequests(filters: MonitorRequestListFilters) {
  return useQuery({
    queryKey: monitorRequestKeys.list(filters),
    queryFn: () => listMonitorRequests({ data: filters }),
  });
}
