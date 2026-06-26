import api from '@/lib/api';
import type { ApiResponse, PagedList } from '@/types/api/envelope';
import type { CouponResponseDto } from '@/types/api/coupon';
import type { RefundResponseDto } from '@/types/api/refund';
import type { PaymentMethodResponse } from '@/types/api/payment';
import type { InstructorRequestDetailDto, InstructorRequestDto } from '@/types/api/instructorRequest';
import type { AdminUserListItemDto } from '@/types/api/admin';

export interface CreateCouponRequest {
  code: string;
  description?: string;
  discountType: string;
  discountValue: number;
  maxUses?: number;
  validFrom: string;
  validUntil: string;
}

export const adminService = {
  // Courses
  approveCourse: (id: string) =>
    api.post<ApiResponse>(`/admin/courses/${id}/approve`).then((r) => r.data),

  rejectCourse: (id: string, data: { reason: string }) =>
    api.post<ApiResponse>(`/admin/courses/${id}/reject`, data).then((r) => r.data),

  archiveCourse: (id: string) =>
    api.put<ApiResponse>(`/admin/courses/${id}/archive`).then((r) => r.data),

  // Coupons
  getCoupons: () =>
    api.get<ApiResponse<CouponResponseDto[]>>('/admin/coupons').then((r) => r.data),

  createCoupon: (data: CreateCouponRequest) =>
    api.post<ApiResponse<CouponResponseDto>>('/admin/coupons', data).then((r) => r.data),

  toggleCoupon: (id: string) =>
    api.put<ApiResponse>(`/admin/coupons/${id}/toggle`).then((r) => r.data),

  deleteCoupon: (id: string) =>
    api.delete<ApiResponse>(`/admin/coupons/${id}`).then((r) => r.data),

  // Payment Methods
  getPaymentMethods: () =>
    api.get<ApiResponse<PaymentMethodResponse[]>>('/admin/payment-methods').then((r) => r.data),

  togglePaymentMethod: (id: string) =>
    api.put<ApiResponse>(`/admin/payment-methods/${id}/toggle`).then((r) => r.data),

  // Refunds
  getRefunds: () =>
    api.get<ApiResponse<RefundResponseDto[]>>('/admin/refunds').then((r) => r.data),

  approveRefund: (id: string) =>
    api.put<ApiResponse>(`/admin/refunds/${id}/approve`).then((r) => r.data),

  rejectRefund: (id: string, data: { reason: string }) =>
    api.put<ApiResponse>(`/admin/refunds/${id}/reject`, data).then((r) => r.data),

  // Instructor Requests (admin endpoints on /instructor-requests)
  getInstructorRequests: () =>
    api.get<ApiResponse<InstructorRequestDto[]>>('/instructor-requests/pending').then((r) => r.data),

  approveInstructorRequest: (id: string) =>
    api.put<ApiResponse>(`/instructor-requests/${id}/process`, { Status: 'Approved' }).then((r) => r.data),

  rejectInstructorRequest: (id: string, data: { reason: string }) =>
    api.put<ApiResponse>(`/instructor-requests/${id}/process`, { Status: 'Rejected', RejectionReason: data.reason }).then((r) => r.data),

  getInstructorRequestDetails: (id: string) =>
    api.get<ApiResponse<InstructorRequestDetailDto>>(`/instructor-requests/${id}`).then((r) => r.data),

  // Users
  getUsers: () =>
    api.get<ApiResponse<PagedList<AdminUserListItemDto>>>('/admin/users').then((r) => r.data),

  toggleUserActive: (id: string) =>
    api.patch<ApiResponse<boolean>>(`/admin/users/${id}/toggle-active`).then((r) => r.data),
};
