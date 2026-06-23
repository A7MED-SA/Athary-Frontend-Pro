import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { studentRefundService } from '../services/studentRefund.service';

export function useRefunds() {
  const queryClient = useQueryClient();

  const refundsQuery = useQuery({
    queryKey: ['student', 'refunds'],
    queryFn: () => studentRefundService.getMyRefunds(),
  });

  const requestMutation = useMutation({
    mutationFn: (data: { orderId: string; courseId: string; reason: string }) =>
      studentRefundService.requestRefund(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', 'refunds'] });
    },
  });

  return {
    refunds: refundsQuery.data?.data ?? [],
    isLoading: refundsQuery.isLoading,
    requestRefund: requestMutation.mutate,
    isRequestPending: requestMutation.isPending,
  };
}
