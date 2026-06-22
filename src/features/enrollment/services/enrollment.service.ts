import api from '@/lib/api';
import type { ApiResponse } from '@/types/api/envelope';
import type {
  EnrollmentResponseDto,
  EnrollmentProgressResponse,
} from '@/types/api/enrollment';

export const enrollmentService = {
  getEnrollments: () =>
    api
      .get<ApiResponse<EnrollmentResponseDto[]>>('/enrollments')
      .then((r) => r.data),

  getCourseEnrollments: (courseId: string) =>
    api
      .get<ApiResponse<EnrollmentResponseDto[]>>(`/enrollments/course/${courseId}`)
      .then((r) => r.data),

  getStudentEnrollments: (studentId: string) =>
    api
      .get<ApiResponse<EnrollmentResponseDto[]>>(`/enrollments/student/${studentId}`)
      .then((r) => r.data),

  getEnrollmentDetail: (id: string) =>
    api
      .get<ApiResponse<EnrollmentResponseDto>>(`/enrollments/${id}`)
      .then((r) => r.data),

  getEnrollmentProgress: (id: string) =>
    api
      .get<ApiResponse<EnrollmentProgressResponse>>(`/enrollments/${id}/progress`)
      .then((r) => r.data),

  checkProgress: (id: string) =>
    api.post<ApiResponse>(`/enrollments/${id}/check-progress`).then((r) => r.data),

  checkAndCompleteIfEligible: (id: string) =>
    api
      .post<ApiResponse>(`/enrollments/${id}/check-and-complete-if-eligible`)
      .then((r) => r.data),

  requestCompletion: (id: string) =>
    api
      .post<ApiResponse>(`/enrollments/${id}/request-completion`)
      .then((r) => r.data),

  markExpired: () =>
    api.post<ApiResponse>('/enrollments/mark-expired').then((r) => r.data),
};
