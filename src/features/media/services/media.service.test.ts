import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mediaService } from './media.service';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api);

describe('mediaService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUploadUrl', () => {
    it('should get upload url', async () => {
      mockedApi.post.mockResolvedValue({
        data: {
          success: true,
          data: { id: '1', fileName: 'test.jpg', fileUrl: 'https://presigned.url', objectKey: 'key', contentType: 'image/jpeg', fileSize: 1024, createdAt: '2026-01-01' },
        },
      });

      const result = await mediaService.getUploadUrl({ fileName: 'test.jpg', contentType: 'image/jpeg', fileSize: 1024 });

      expect(mockedApi.post).toHaveBeenCalledWith('/media/upload-url', { fileName: 'test.jpg', contentType: 'image/jpeg', fileSize: 1024 });
      expect(result.data.fileUrl).toBe('https://presigned.url');
    });
  });

  describe('deleteMedia', () => {
    it('should delete media', async () => {
      mockedApi.delete.mockResolvedValue({
        data: { success: true, data: undefined },
      });

      await mediaService.deleteMedia('1');

      expect(mockedApi.delete).toHaveBeenCalledWith('/media/1');
    });
  });
});
