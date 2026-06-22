import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '@/features/cart/services/payment.service';
import { queryKeys } from '@/lib/query-keys';

export function usePayment() {
  const queryClient = useQueryClient();

  const methodsQuery = useQuery({
    queryKey: queryKeys.payments.methods(),
    queryFn: () => paymentService.getPaymentMethods(),
  });

  const createIntentMutation = useMutation({
    mutationFn: (data: { orderId: string; paymentMethodId: string }) =>
      paymentService.createPaymentIntent(data),
  });

  const confirmPaymentMutation = useMutation({
    mutationFn: (paymentId: string) => paymentService.confirmPayment(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });

  return {
    methods: methodsQuery.data?.data,
    isMethodsLoading: methodsQuery.isLoading,
    createIntent: createIntentMutation.mutate,
    createIntentAsync: createIntentMutation.mutateAsync,
    isCreateIntentPending: createIntentMutation.isPending,
    confirmPayment: confirmPaymentMutation.mutate,
    isConfirmPending: confirmPaymentMutation.isPending,
  };
}
