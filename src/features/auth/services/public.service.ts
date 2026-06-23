import api from '@/lib/api';
import type { ApiResponse } from '@/types/api/envelope';
import type { LandingDto } from '@/types/api/landing';

export interface CategoryResponseDto {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  courseCount: number;
}

export const publicService = {
  async getLanding(): Promise<ApiResponse<LandingDto>> {
    const { data } = await api.get<ApiResponse<LandingDto>>('/public/landing');
    return data;
  },

  async getCategories(): Promise<ApiResponse<CategoryResponseDto[]>> {
    const { data } = await api.get<ApiResponse<CategoryResponseDto[]>>('/categories');
    return data;
  },
};
