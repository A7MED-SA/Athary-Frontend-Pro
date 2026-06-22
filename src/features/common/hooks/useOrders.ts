import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/features/cart/services/order.service';
import { queryKeys } from '@/lib/query-keys';

export function useOrders() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.orders.all,
    queryFn: () => orderService.getOrders(),
  });

  const checkoutMutation = useMutation({
    mutationFn: (data: { paymentMethodId: string; couponCode?: string }) =>
      orderService.checkout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });

  return {
    orders: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
    checkout: checkoutMutation.mutate,
    isCheckoutPending: checkoutMutation.isPending,
    checkoutError: checkoutMutation.error,
  };
}

export function useOrderDetail(id: string) {
  const query = useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => orderService.getOrderDetail(id),
    enabled: !!id,
  });

  return {
    order: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}
