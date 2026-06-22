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
      .get<ApiResponse<StudentOverviewDto>>('/dashboards/student/overview')
      .then((r) => r.data),

  getInstructorOverview: () =>
    api
      .get<ApiResponse<InstructorOverviewDto>>('/dashboards/instructor/overview')
      .then((r) => r.data),

  getAdminOverview: () =>
    api
      .get<ApiResponse<AdminOverviewDto>>('/dashboards/admin/overview')
      .then((r) => r.data),

  getInstructorRevenue: () =>
    api
      .get<ApiResponse<InstructorRevenueDto>>('/dashboards/instructor/revenue')
      .then((r) => r.data),

  getInstructorStudents: () =>
    api
      .get<ApiResponse<PagedList<InstructorStudentDto>>>('/dashboards/instructor/students')
      .then((r) => r.data),

  getStudentCertificates: () =>
    api
      .get<ApiResponse<StudentCertificatesDto>>('/dashboards/student/certificates')
      .then((r) => r.data),

  getStudentWishlist: () =>
    api
      .get<ApiResponse<StudentWishlistDto>>('/dashboards/student/wishlist')
      .then((r) => r.data),

  getStudentPayments: () =>
    api
      .get<ApiResponse<StudentPaymentsDto>>('/dashboards/student/payments')
      .then((r) => r.data),
};
