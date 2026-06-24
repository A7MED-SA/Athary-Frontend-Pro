import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/features/cart/services/cart.service';
import { queryKeys } from '@/lib/query-keys';
import { tokenStorage } from '@/lib/token-storage';

export function useCart() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.cart.all,
    queryFn: () => cartService.getCart(),
    enabled: !!tokenStorage.getAccessToken(),
  });

  const addItemMutation = useMutation({
    mutationFn: (courseId: string) => cartService.addItem({ courseId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (courseId: string) => cartService.removeItem(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });

  const applyCouponMutation = useMutation({
    mutationFn: (code: string) => cartService.applyCoupon({ code }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });

  return {
    cart: query.data?.data,
    itemCount: query.data?.data?.items.length ?? 0,
    isLoading: query.isLoading,
    error: query.error,
    addItem: addItemMutation.mutate,
    isAddPending: addItemMutation.isPending,
    removeItem: removeItemMutation.mutate,
    isRemovePending: removeItemMutation.isPending,
    clearCart: clearCartMutation.mutate,
    isClearPending: clearCartMutation.isPending,
    applyCoupon: applyCouponMutation.mutate,
    couponError: applyCouponMutation.error,
    isCouponPending: applyCouponMutation.isPending,
  };
}
