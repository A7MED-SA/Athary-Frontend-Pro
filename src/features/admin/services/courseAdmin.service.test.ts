import { describe, it, expect, vi, beforeEach } from 'vitest';
import { courseAdminService } from './courseAdmin.service';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    put: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api);

describe('courseAdminService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('approveCourse', () => {
    it('should approve a course', async () => {
      mockedApi.put.mockResolvedValue({
        data: { success: true, data: undefined },
      });

      await courseAdminService.approveCourse('course-1');

      expect(mockedApi.put).toHaveBeenCalledWith('/admin/courses/course-1/approve');
    });
  });

  describe('rejectCourse', () => {
    it('should reject a course', async () => {
      mockedApi.put.mockResolvedValue({
        data: { success: true, data: undefined },
      });

      await courseAdminService.rejectCourse('course-1', { reason: 'Not ready' });

      expect(mockedApi.put).toHaveBeenCalledWith('/admin/courses/course-1/reject', { reason: 'Not ready' });
    });
  });
});
