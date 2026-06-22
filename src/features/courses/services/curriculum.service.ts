import api from '@/lib/api';
import type { ApiResponse } from '@/types/api/envelope';

export interface SectionResponseDto {
  id: string;
  title: string;
  sortOrder: number;
  lessons: LessonResponseDto[];
}

export interface LessonResponseDto {
  id: string;
  title: string;
  contentType: string;
  durationMinutes: number;
  sortOrder: number;
  isFreePreview: boolean;
}

export interface CreateSectionRequest {
  title: string;
  sortOrder?: number;
}

export interface UpdateSectionRequest {
  title?: string;
  sortOrder?: number;
}

export interface UpdateSectionsOrderRequest {
  sectionOrders: { id: string; sortOrder: number }[];
}

export const curriculumService = {
  getCourseSections: (courseId: string) =>
    api
      .get<ApiResponse<SectionResponseDto[]>>(`/courses/${courseId}/curriculum/sections`)
      .then((r) => r.data),

  createSection: (courseId: string, data: CreateSectionRequest) =>
    api
      .post<ApiResponse<SectionResponseDto>>(`/courses/${courseId}/curriculum/sections`, data)
      .then((r) => r.data),

  updateSection: (
    courseId: string,
    sectionId: string,
    data: UpdateSectionRequest,
  ) =>
    api
      .put<ApiResponse>(
        `/courses/${courseId}/curriculum/sections/${sectionId}`,
        data,
      )
      .then((r) => r.data),

  deleteSection: (courseId: string, sectionId: string) =>
    api
      .delete<ApiResponse>(`/courses/${courseId}/curriculum/sections/${sectionId}`)
      .then((r) => r.data),

  updateSectionsOrder: (courseId: string, data: UpdateSectionsOrderRequest) =>
    api
      .put<ApiResponse>(`/courses/${courseId}/curriculum/sections/order`, data)
      .then((r) => r.data),
};
