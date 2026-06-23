import api from '@/lib/api';
import type { ApiResponse, PagedList } from '@/types/api/envelope';
import type { CouponResponseDto } from '@/types/api/coupon';
import type { RefundResponseDto } from '@/types/api/refund';
import type { PaymentMethodResponse } from '@/types/api/payment';
import type { InstructorRequestDto } from '@/types/api/instructorRequest';

export interface CreateCouponRequest {
  code: string;
  description?: string;
  discountType: string;
  discountValue: number;
  maxUses?: number;
  validFrom: string;
  validUntil: string;
}

export interface AdminUserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
}

export const adminService = {
  // Courses
  approveCourse: (id: string) =>
    api.put<ApiResponse>(`/admin/courses/${id}/approve`).then((r) => r.data),

  rejectCourse: (id: string, data: { reason: string }) =>
    api.put<ApiResponse>(`/admin/courses/${id}/reject`, data).then((r) => r.data),

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

  // Instructor Requests
  getInstructorRequests: () =>
    api.get<ApiResponse<InstructorRequestDto[]>>('/admin/instructor-requests').then((r) => r.data),

  approveInstructorRequest: (id: string) =>
    api.put<ApiResponse>(`/admin/instructor-requests/${id}/approve`).then((r) => r.data),

  rejectInstructorRequest: (id: string, data: { reason: string }) =>
    api.put<ApiResponse>(`/admin/instructor-requests/${id}/reject`, data).then((r) => r.data),

  // Users
  getUsers: () =>
    api.get<ApiResponse<AdminUserDto[]>>('/admin/users').then((r) => r.data),

  toggleUserBlock: (id: string) =>
    api.put<ApiResponse>(`/admin/users/${id}/toggle-block`).then((r) => r.data),
};
