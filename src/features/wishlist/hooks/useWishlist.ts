import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { wishlistService } from '../services/wishlist.service';
import { queryKeys } from '@/lib/query-keys';

export function useWishlist() {
  const queryClient = useQueryClient();

  const wishlistQuery = useQuery({
    queryKey: queryKeys.wishlist.all,
    queryFn: () => wishlistService.getMyWishlist(),
  });

  const addMutation = useMutation({
    mutationFn: (courseId: string) => wishlistService.addToWishlist(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (courseId: string) => wishlistService.removeFromWishlist(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
    },
  });

  return {
    items: wishlistQuery.data?.data?.items ?? [],
    totalCount: wishlistQuery.data?.data?.totalCount ?? 0,
    isLoading: wishlistQuery.isLoading,
    addToWishlist: addMutation.mutate,
    removeFromWishlist: removeMutation.mutate,
    isAddPending: addMutation.isPending,
    isRemovePending: removeMutation.isPending,
  };
}
