import { describe, it, expect, vi, beforeEach } from 'vitest';
import { categoryService } from './category.service';
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

describe('categoryService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCategories', () => {
    it('should fetch categories', async () => {
      mockedApi.get.mockResolvedValue({
        data: { success: true, data: [{ id: '1', name: 'Programming', slug: 'programming', courseCount: 10 }] },
      });

      const result = await categoryService.getCategories();

      expect(mockedApi.get).toHaveBeenCalledWith('/categories');
      expect(result.data).toHaveLength(1);
    });
  });

  describe('createCategory', () => {
    it('should create category', async () => {
      mockedApi.post.mockResolvedValue({
        data: { success: true, data: { id: '1', name: 'New', slug: 'new', courseCount: 0 } },
      });

      const result = await categoryService.createCategory({ name: 'New', slug: 'new', iconName: 'code' });

      expect(mockedApi.post).toHaveBeenCalledWith('/categories', { name: 'New', slug: 'new', iconName: 'code' });
      expect(result.data.name).toBe('New');
    });
  });
});
