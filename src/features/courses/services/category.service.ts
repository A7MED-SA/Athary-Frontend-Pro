import api from '@/lib/api';
import type { ApiResponse } from '@/types/api/envelope';

export interface CategoryResponseDto {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  courseCount: number;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  iconName: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  iconName?: string;
}

export const categoryService = {
  getCategories: () =>
    api.get<ApiResponse<CategoryResponseDto[]>>('/categories').then((r) => r.data),

  createCategory: (data: CreateCategoryRequest) =>
    api.post<ApiResponse<CategoryResponseDto>>('/categories', data).then((r) => r.data),

  updateCategory: (id: string, data: UpdateCategoryRequest) =>
    api.put<ApiResponse>(`/categories/${id}`, data).then((r) => r.data),

  deleteCategory: (id: string) =>
    api.delete<ApiResponse>(`/categories/${id}`).then((r) => r.data),
};
