import api from '@/lib/api';
import type { ApiResponse, PagedList } from '@/types/api/envelope';
import type {
  PublicCourseDto,
  PublicCourseDetailDto,
  PublicCourseFilterDto,
  CourseSectionResponseDto,
  CourseFaqDto,
} from '@/types/api/course';
import type { PublicProfileDto } from '@/types/api/profile';
import type { LandingDto } from '@/types/api/landing';

export const publicService = {
  getCourses: (filters?: PublicCourseFilterDto) =>
    api
      .get<ApiResponse<PagedList<PublicCourseDto>>>('/public/courses', { params: filters })
      .then((r) => r.data),

  getCourseDetail: (id: string) =>
    api.get<ApiResponse<PublicCourseDetailDto>>(`/public/courses/${id}`).then((r) => r.data),

  getRelatedCourses: (id: string) =>
    api.get<ApiResponse<PublicCourseDto[]>>(`/public/courses/${id}/related-courses`).then((r) => r.data),

  getCourseSections: (id: string) =>
    api
      .get<ApiResponse<CourseSectionResponseDto[]>>(`/public/courses/${id}/curriculum/sections`)
      .then((r) => r.data),

  getCourseFaq: (id: string) =>
    api.get<ApiResponse<CourseFaqDto[]>>(`/public/courses/${id}/faq`).then((r) => r.data),

  getPublicProfile: (slug: string) =>
    api.get<ApiResponse<PublicProfileDto>>(`/public/profiles/${slug}`).then((r) => r.data),

  getPublicProfileById: (id: string) =>
    api.get<ApiResponse<PublicProfileDto>>(`/public/profiles/id/${id}`).then((r) => r.data),

  getPublicCourses: (instructorId: string) =>
    api
      .get<ApiResponse<PublicCourseDto[]>>(`/public/instructor/courses/${instructorId}`)
      .then((r) => r.data),

  getTestimonials: () =>
    api.get<ApiResponse>('/public/testimonials').then((r) => r.data),

  getLanding: () =>
    api.get<ApiResponse<LandingDto>>('/public/landing').then((r) => r.data),
};
