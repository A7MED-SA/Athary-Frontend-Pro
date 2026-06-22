import { describe, it, expect, vi, beforeEach } from 'vitest';
import { courseService } from './course.service';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api);

describe('courseService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAdminCourses', () => {
    it('should fetch admin courses', async () => {
      mockedApi.get.mockResolvedValue({
        data: {
          success: true,
          data: { items: [{ id: '1', title: 'Course' }], page: 1, pageSize: 10, totalCount: 1, totalPages: 1, hasPrevious: false, hasNext: false },
        },
      });

      const result = await courseService.getAdminCourses();

      expect(mockedApi.get).toHaveBeenCalledWith('/courses', { params: undefined });
      expect(result.data.items).toHaveLength(1);
    });
  });

  describe('createCourse', () => {
    it('should create a new course', async () => {
      mockedApi.post.mockResolvedValue({
        data: { success: true, data: { id: '1', title: 'New Course' } },
      });

      const result = await courseService.createCourse({
        title: 'New Course',
        price: 100,
        isFree: false,
        level: 'Beginner',
        language: 'Ar',
        categoryId: 'cat-1',
      });

      expect(mockedApi.post).toHaveBeenCalledWith('/courses', expect.objectContaining({ title: 'New Course' }));
      expect(result.data.id).toBe('1');
    });
  });

  describe('publishCourse', () => {
    it('should publish a course', async () => {
      mockedApi.put.mockResolvedValue({
        data: { success: true, data: { id: '1', status: 'Published' } },
      });

      const result = await courseService.publishCourse('1');

      expect(mockedApi.put).toHaveBeenCalledWith('/courses/1/publish');
      expect(result.data.status).toBe('Published');
    });
  });

  describe('deleteCourse', () => {
    it('should delete a course', async () => {
      mockedApi.delete.mockResolvedValue({
        data: { success: true, data: undefined },
      });

      await courseService.deleteCourse('1');

      expect(mockedApi.delete).toHaveBeenCalledWith('/courses/1');
    });
  });
});
