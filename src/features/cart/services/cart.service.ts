import api from '@/lib/api';
import type { ApiResponse, PagedList } from '@/types/api/envelope';
import type { CartResponseDto, ApplyCouponResponse } from '@/types/api/cart';

export interface AddCartItemRequest {
  courseId: string;
}

export interface ApplyCouponRequest {
  code: string;
}

export const cartService = {
  getCart: () =>
    api.get<ApiResponse<CartResponseDto>>('/cart').then((r) => r.data),

  addItem: (data: AddCartItemRequest) =>
    api
      .post<ApiResponse<CartResponseDto>>('/cart/items', data)
      .then((r) => r.data),

  removeItem: (courseId: string) =>
    api
      .delete<ApiResponse<CartResponseDto>>(`/cart/items/${courseId}`)
      .then((r) => r.data),

  clearCart: () =>
    api.delete<ApiResponse>('/cart').then((r) => r.data),

  applyCoupon: (data: ApplyCouponRequest) =>
    api
      .post<ApiResponse<ApplyCouponResponse>>('/cart/coupon', data)
      .then((r) => r.data),
};
