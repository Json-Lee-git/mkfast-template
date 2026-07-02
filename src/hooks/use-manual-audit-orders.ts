import {
  listManualAuditOrders,
  retryManualAuditOrderNotification,
} from '@/api/ai-readiness/manual-audit-admin';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type ManualAuditOrderStatus =
  | 'pending'
  | 'checkout_failed'
  | 'paid'
  | 'notified'
  | 'notification_failed';

export const manualAuditOrdersKeys = {
  all: ['manual-audit-orders'] as const,
  lists: () => [...manualAuditOrdersKeys.all, 'lists'] as const,
  list: (params: {
    pageIndex: number;
    pageSize: number;
    search: string;
    status?: ManualAuditOrderStatus;
  }) => [...manualAuditOrdersKeys.lists(), params] as const,
};

export function useManualAuditOrders(
  pageIndex: number,
  pageSize: number,
  search: string,
  status?: ManualAuditOrderStatus
) {
  return useQuery({
    queryKey: manualAuditOrdersKeys.list({
      pageIndex,
      pageSize,
      search,
      status,
    }),
    queryFn: async () =>
      listManualAuditOrders({
        data: {
          pageIndex,
          pageSize,
          search,
          status,
        },
      }),
  });
}

export function useRetryManualAuditOrderNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) =>
      retryManualAuditOrderNotification({ data: { orderId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: manualAuditOrdersKeys.all,
      });
    },
  });
}
