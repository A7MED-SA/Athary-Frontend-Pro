import api from '@/lib/api';
import type { ApiResponse } from '@/types/api/envelope';
import type {
  PaymentMethodResponse,
  PaymentResponseDto,
  PaymentIntentResponse,
} from '@/types/api/payment';

export interface CreatePaymentIntentRequest {
  orderId: string;
  paymentMethodId: string;
}

export const paymentService = {
  getPaymentMethods: () =>
    api
      .get<ApiResponse<PaymentMethodResponse[]>>('/payments/methods')
      .then((r) => r.data),

  createPaymentIntent: (data: CreatePaymentIntentRequest) =>
    api
      .post<ApiResponse<PaymentIntentResponse>>('/payments/create-intent', data)
      .then((r) => r.data),

  confirmPayment: (paymentId: string) =>
    api
      .post<ApiResponse>(`/payments/${paymentId}/confirm`)
      .then((r) => r.data),

  getOrderPayments: (orderId: string) =>
    api
      .get<ApiResponse<PaymentResponseDto[]>>(`/payments/order/${orderId}`)
      .then((r) => r.data),

  getPaymentDetails: (id: string) =>
    api
      .get<ApiResponse<PaymentResponseDto>>(`/payments/${id}`)
      .then((r) => r.data),

  webhook: (data: unknown) =>
    api.post<ApiResponse>('/payments/webhook', data).then((r) => r.data),
};
