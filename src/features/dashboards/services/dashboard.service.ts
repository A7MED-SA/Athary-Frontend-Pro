import api from '@/lib/api';
import type { ApiResponse, PagedList } from '@/types/api/envelope';
import type {
  StudentOverviewDto,
  InstructorOverviewDto,
  AdminOverviewDto,
  InstructorRevenueDto,
  InstructorStudentDto,
  StudentCertificatesDto,
  StudentWishlistDto,
  StudentPaymentsDto,
} from '@/types/api/dashboard';

export const dashboardService = {
  getStudentOverview: () =>
    api
      .get<ApiResponse<StudentOverviewDto>>('/student/dashboard/overview')
      .then((r) => r.data),

  getInstructorOverview: () =>
    api
      .get<ApiResponse<InstructorOverviewDto>>('/instructor/dashboard/overview')
      .then((r) => r.data),

  getAdminOverview: () =>
    api
      .get<ApiResponse<AdminOverviewDto>>('/admin/dashboard/overview')
      .then((r) => r.data),

  getInstructorRevenue: () =>
    api
      .get<ApiResponse<InstructorRevenueDto>>('/instructor/dashboard/revenue')
      .then((r) => r.data),

  getInstructorStudents: () =>
    api
      .get<ApiResponse<PagedList<InstructorStudentDto>>>('/instructor/dashboard/students')
      .then((r) => r.data),

  getStudentCertificates: () =>
    api
      .get<ApiResponse<StudentCertificatesDto>>('/student/dashboard/certificates')
      .then((r) => r.data),

  getStudentWishlist: () =>
    api
      .get<ApiResponse<StudentWishlistDto>>('/student/dashboard/wishlist')
      .then((r) => r.data),

  getStudentPayments: () =>
    api
      .get<ApiResponse<StudentPaymentsDto>>('/student/dashboard/payments')
      .then((r) => r.data),
};
