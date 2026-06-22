import { describe, it, expect, vi, beforeEach } from 'vitest';
import { publicService } from './public.service';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api);

describe('publicService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCourses', () => {
    it('should fetch courses with filters', async () => {
      mockedApi.get.mockResolvedValue({
        data: {
          success: true,
          data: {
            items: [{ id: '1', title: 'Course 1' }],
            page: 1,
            pageSize: 10,
            totalCount: 1,
            totalPages: 1,
            hasPrevious: false,
            hasNext: false,
          },
        },
      });

      const result = await publicService.getCourses({ page: 1, pageSize: 10 });

      expect(mockedApi.get).toHaveBeenCalledWith('/public/courses', { params: { page: 1, pageSize: 10 } });
      expect(result.data.items).toHaveLength(1);
    });
  });

  describe('getCourseDetail', () => {
    it('should fetch course detail by id', async () => {
      mockedApi.get.mockResolvedValue({
        data: { success: true, data: { id: '1', title: 'Course 1' } },
      });

      const result = await publicService.getCourseDetail('1');

      expect(mockedApi.get).toHaveBeenCalledWith('/public/courses/1');
      expect(result.data.title).toBe('Course 1');
    });
  });

  describe('getRelatedCourses', () => {
    it('should fetch related courses', async () => {
      mockedApi.get.mockResolvedValue({
        data: { success: true, data: [{ id: '2', title: 'Related' }] },
      });

      const result = await publicService.getRelatedCourses('1');

      expect(mockedApi.get).toHaveBeenCalledWith('/public/courses/1/related-courses');
      expect(result.data).toHaveLength(1);
    });
  });

  describe('getLanding', () => {
    it('should fetch landing page data', async () => {
      mockedApi.get.mockResolvedValue({
        data: { success: true, data: { stats: { totalStudents: 100 } } },
      });

      const result = await publicService.getLanding();

      expect(mockedApi.get).toHaveBeenCalledWith('/public/landing');
      expect(result.data.stats.totalStudents).toBe(100);
    });
  });
});
