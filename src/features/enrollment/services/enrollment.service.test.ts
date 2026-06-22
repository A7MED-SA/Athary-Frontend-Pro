import { describe, it, expect, vi, beforeEach } from 'vitest';
import { enrollmentService } from './enrollment.service';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api);

describe('enrollmentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getEnrollments', () => {
    it('should fetch enrollments', async () => {
      mockedApi.get.mockResolvedValue({
        data: { success: true, data: [{ id: '1', courseId: 'c1', status: 'InProgress' }] },
      });

      const result = await enrollmentService.getEnrollments();

      expect(mockedApi.get).toHaveBeenCalledWith('/enrollments');
      expect(result.data).toHaveLength(1);
    });
  });

  describe('getEnrollmentProgress', () => {
    it('should fetch enrollment progress', async () => {
      mockedApi.get.mockResolvedValue({
        data: {
          success: true,
          data: { enrollmentId: '1', totalContent: 10, completedContent: 5, progressPercentage: 50, contents: [] },
        },
      });

      const result = await enrollmentService.getEnrollmentProgress('1');

      expect(mockedApi.get).toHaveBeenCalledWith('/enrollments/1/progress');
      expect(result.data.progressPercentage).toBe(50);
    });
  });

  describe('checkAndCompleteIfEligible', () => {
    it('should check and complete if eligible', async () => {
      mockedApi.post.mockResolvedValue({
        data: { success: true, data: undefined },
      });

      await enrollmentService.checkAndCompleteIfEligible('1');

      expect(mockedApi.post).toHaveBeenCalledWith('/enrollments/1/check-and-complete-if-eligible');
    });
  });
});
