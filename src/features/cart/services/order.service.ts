import api from '@/lib/api';
import type { ApiResponse } from '@/types/api/envelope';
import type { OrderResponseDto, OrderDetailDto } from '@/types/api/order';

export interface CheckoutRequest {
  paymentMethodId: string;
  couponCode?: string;
}

export const orderService = {
  checkout: (data: CheckoutRequest) =>
    api
      .post<ApiResponse<OrderDetailDto>>('/orders/checkout', data)
      .then((r) => r.data),

  getOrders: () =>
    api
      .get<ApiResponse<OrderResponseDto[]>>('/orders')
      .then((r) => r.data),

  getOrderDetail: (id: string) =>
    api.get<ApiResponse<OrderDetailDto>>(`/orders/${id}`).then((r) => r.data),
};
