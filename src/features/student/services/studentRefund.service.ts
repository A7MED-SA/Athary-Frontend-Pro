import api from '@/lib/api';
import type { ApiResponse } from '@/types/api/envelope';
import type { RefundResponseDto } from '@/types/api/refund';

export const studentRefundService = {
  requestRefund: (data: { orderId: string; courseId: string; reason: string }) =>
    api
      .post<ApiResponse<RefundResponseDto>>('/refunds', data)
      .then((r) => r.data),

  getMyRefunds: () =>
    api
      .get<ApiResponse<RefundResponseDto[]>>('/refunds/my')
      .then((r) => r.data),
};
