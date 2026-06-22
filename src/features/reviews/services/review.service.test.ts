import { describe, it, expect, vi, beforeEach } from 'vitest';
import { reviewService } from './review.service';
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

describe('reviewService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCourseReviews', () => {
    it('should fetch course reviews', async () => {
      mockedApi.get.mockResolvedValue({
        data: {
          success: true,
          data: { items: [{ id: '1', rating: 5, comment: 'Great' }], page: 1, pageSize: 10, totalCount: 1, totalPages: 1, hasPrevious: false, hasNext: false },
        },
      });

      const result = await reviewService.getCourseReviews('course-1');

      expect(mockedApi.get).toHaveBeenCalledWith('/reviews/course/course-1', { params: undefined });
      expect(result.data.items).toHaveLength(1);
    });
  });

  describe('createReview', () => {
    it('should create a review', async () => {
      mockedApi.post.mockResolvedValue({
        data: { success: true, data: { id: '1', rating: 5, comment: 'Great' } },
      });

      const result = await reviewService.createReview('course-1', { rating: 5, comment: 'Great' });

      expect(mockedApi.post).toHaveBeenCalledWith('/reviews/course/course-1', { rating: 5, comment: 'Great' });
      expect(result.data.rating).toBe(5);
    });
  });
});
