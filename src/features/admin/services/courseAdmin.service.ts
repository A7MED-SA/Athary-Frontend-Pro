import api from '@/lib/api';
import type { ApiResponse } from '@/types/api/envelope';

export interface RejectCourseRequest {
  reason: string;
}

export interface UpdateCourseFeaturedStatusRequest {
  isFeatured: boolean;
}

export const courseAdminService = {
  approveCourse: (id: string) =>
    api.put<ApiResponse>(`/admin/courses/${id}/approve`).then((r) => r.data),

  rejectCourse: (id: string, data: RejectCourseRequest) =>
    api.put<ApiResponse>(`/admin/courses/${id}/reject`, data).then((r) => r.data),

  archiveCourse: (id: string) =>
    api.put<ApiResponse>(`/admin/courses/${id}/archive`).then((r) => r.data),

  updateFeaturedStatus: (id: string, data: UpdateCourseFeaturedStatusRequest) =>
    api.put<ApiResponse>(`/admin/courses/${id}/featured`, data).then((r) => r.data),
};
