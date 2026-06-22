import { describe, it, expect, vi, beforeEach } from 'vitest';
import { liveSessionService } from './liveSession.service';
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

describe('liveSessionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getScheduledSessions', () => {
    it('should fetch scheduled sessions', async () => {
      mockedApi.get.mockResolvedValue({
        data: { success: true, data: [{ id: '1', title: 'Session 1', status: 'Scheduled' }] },
      });

      const result = await liveSessionService.getScheduledSessions();

      expect(mockedApi.get).toHaveBeenCalledWith('/livesessions/scheduled');
      expect(result.data).toHaveLength(1);
    });
  });

  describe('create', () => {
    it('should create a live session', async () => {
      mockedApi.post.mockResolvedValue({
        data: { success: true, data: { id: '1', title: 'New Session', status: 'Scheduled' } },
      });

      const result = await liveSessionService.create({
        title: 'New Session',
        scheduledAt: '2026-07-01T10:00:00Z',
        durationMinutes: 60,
      });

      expect(mockedApi.post).toHaveBeenCalledWith('/livesessions', expect.objectContaining({ title: 'New Session' }));
      expect(result.data.id).toBe('1');
    });
  });
});
