import { describe, it, expect, vi, beforeEach } from 'vitest';
import { curriculumService } from './curriculum.service';
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

describe('curriculumService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCourseSections', () => {
    it('should fetch course sections', async () => {
      mockedApi.get.mockResolvedValue({
        data: { success: true, data: [{ id: '1', title: 'Section 1', sortOrder: 1, lessons: [] }] },
      });

      const result = await curriculumService.getCourseSections('course-1');

      expect(mockedApi.get).toHaveBeenCalledWith('/courses/course-1/curriculum/sections');
      expect(result.data).toHaveLength(1);
    });
  });

  describe('createSection', () => {
    it('should create a section', async () => {
      mockedApi.post.mockResolvedValue({
        data: { success: true, data: { id: '1', title: 'New Section', sortOrder: 1, lessons: [] } },
      });

      const result = await curriculumService.createSection('course-1', { title: 'New Section' });

      expect(mockedApi.post).toHaveBeenCalledWith('/courses/course-1/curriculum/sections', { title: 'New Section' });
      expect(result.data.title).toBe('New Section');
    });
  });
});
