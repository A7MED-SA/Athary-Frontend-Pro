import api from '@/lib/api';
import type { ApiResponse, PagedList } from '@/types/api/envelope';
import type {
  CourseResponseDto,
  CourseDetailResponseDto,
  CreateCourseRequestDto,
  UpdateCourseRequestDto,
  GetCoursesFilterDto,
} from '@/types/api/course';

export const courseService = {
  getAdminCourses: (filters?: GetCoursesFilterDto) =>
    api
      .get<ApiResponse<PagedList<CourseResponseDto>>>('/courses', { params: filters })
      .then((r) => r.data),

  getInstructorCourses: (filters?: GetCoursesFilterDto) =>
    api
      .get<ApiResponse<PagedList<CourseResponseDto>>>('/courses/instructor-courses', { params: filters })
      .then((r) => r.data),

  getInstructorCoursesPublic: (instructorId: string) =>
    api
      .get<ApiResponse<CourseResponseDto[]>>(`/courses/instructor-courses/${instructorId}`)
      .then((r) => r.data),

  getCourseDetail: (id: string) =>
    api.get<ApiResponse<CourseDetailResponseDto>>(`/courses/${id}`).then((r) => r.data),

  getInstructorCourseDetail: (id: string) =>
    api
      .get<ApiResponse<CourseDetailResponseDto>>(`/courses/${id}/instructor`)
      .then((r) => r.data),

  createCourse: (data: CreateCourseRequestDto) =>
    api.post<ApiResponse<CourseResponseDto>>('/courses', data).then((r) => r.data),

  updateCourse: (id: string, data: UpdateCourseRequestDto) =>
    api.put<ApiResponse>(`/courses/${id}`, data).then((r) => r.data),

  publishCourse: (id: string) =>
    api.put<ApiResponse<CourseResponseDto>>(`/courses/${id}/publish`).then((r) => r.data),

  archiveCourse: (id: string) =>
    api.put<ApiResponse>(`/courses/${id}/archive`).then((r) => r.data),

  deleteCourse: (id: string) =>
    api.delete<ApiResponse>(`/courses/${id}`).then((r) => r.data),

  deleteImage: (id: string) =>
    api.delete<ApiResponse>(`/courses/${id}/delete-image`).then((r) => r.data),
};
