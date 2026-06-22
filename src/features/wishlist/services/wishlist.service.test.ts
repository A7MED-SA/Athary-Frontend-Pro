import { describe, it, expect, vi, beforeEach } from 'vitest';
import { wishlistService } from './wishlist.service';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api);

describe('wishlistService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMyWishlist', () => {
    it('should fetch wishlist', async () => {
      mockedApi.get.mockResolvedValue({
        data: { success: true, data: { items: [], totalCount: 0 } },
      });

      const result = await wishlistService.getMyWishlist();

      expect(mockedApi.get).toHaveBeenCalledWith('/wishlist');
      expect(result.data.totalCount).toBe(0);
    });
  });

  describe('addToWishlist', () => {
    it('should add course to wishlist', async () => {
      mockedApi.post.mockResolvedValue({
        data: { success: true, data: undefined },
      });

      await wishlistService.addToWishlist('course-1');

      expect(mockedApi.post).toHaveBeenCalledWith('/wishlist/course-1');
    });
  });

  describe('removeFromWishlist', () => {
    it('should remove course from wishlist', async () => {
      mockedApi.delete.mockResolvedValue({
        data: { success: true, data: undefined },
      });

      await wishlistService.removeFromWishlist('course-1');

      expect(mockedApi.delete).toHaveBeenCalledWith('/wishlist/course-1');
    });
  });

  describe('isInWishlist', () => {
    it('should check if course is in wishlist', async () => {
      mockedApi.get.mockResolvedValue({
        data: { success: true, data: true },
      });

      const result = await wishlistService.isInWishlist('course-1');

      expect(mockedApi.get).toHaveBeenCalledWith('/wishlist/check/course-1');
      expect(result.data).toBe(true);
    });
  });
});
