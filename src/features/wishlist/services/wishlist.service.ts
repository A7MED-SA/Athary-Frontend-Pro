import api from '@/lib/api';
import type { ApiResponse } from '@/types/api/envelope';
import type { WishlistResponseDto } from '@/types/api/wishlist';

export const wishlistService = {
  getMyWishlist: () =>
    api.get<ApiResponse<WishlistResponseDto>>('/wishlist').then((r) => r.data),

  addToWishlist: (courseId: string) =>
    api.post<ApiResponse>(`/wishlist/${courseId}`).then((r) => r.data),

  removeFromWishlist: (courseId: string) =>
    api.delete<ApiResponse>(`/wishlist/${courseId}`).then((r) => r.data),

  isInWishlist: (courseId: string) =>
    api
      .get<ApiResponse<boolean>>(`/wishlist/check/${courseId}`)
      .then((r) => r.data),
};
