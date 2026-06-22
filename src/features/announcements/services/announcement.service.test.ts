import { describe, it, expect, vi, beforeEach } from 'vitest';
import { announcementService } from './announcement.service';
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

describe('announcementService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMyAnnouncements', () => {
    it('should fetch announcements', async () => {
      mockedApi.get.mockResolvedValue({
        data: { success: true, data: { announcements: [], totalCount: 0 } },
      });

      const result = await announcementService.getMyAnnouncements();

      expect(mockedApi.get).toHaveBeenCalledWith('/announcements/my-announcements');
      expect(result.data.totalCount).toBe(0);
    });
  });

  describe('create', () => {
    it('should create announcement', async () => {
      mockedApi.post.mockResolvedValue({
        data: { success: true, data: { id: '1', title: 'New', content: 'Content', type: 'info', targetRoles: [], isPinned: false, createdAt: '2026-01-01' } },
      });

      const result = await announcementService.create({
        title: 'New',
        content: 'Content',
        type: 'info',
        targetRoles: [],
      });

      expect(mockedApi.post).toHaveBeenCalledWith('/announcements', expect.objectContaining({ title: 'New' }));
      expect(result.data.id).toBe('1');
    });
  });
});
