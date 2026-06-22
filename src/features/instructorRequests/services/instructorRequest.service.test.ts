import { describe, it, expect, vi, beforeEach } from 'vitest';
import { instructorRequestService } from './instructorRequest.service';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api);

describe('instructorRequestService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('submit', () => {
    it('should submit instructor request', async () => {
      mockedApi.post.mockResolvedValue({
        data: { success: true, data: { id: '1', status: 'Pending', submittedAt: '2026-01-01' } },
      });

      const result = await instructorRequestService.submit({ qualifications: 'PhD', experience: '5 years' });

      expect(mockedApi.post).toHaveBeenCalledWith('/instructor-requests', { qualifications: 'PhD', experience: '5 years' });
      expect(result.data.status).toBe('Pending');
    });
  });

  describe('getStatus', () => {
    it('should get request status', async () => {
      mockedApi.get.mockResolvedValue({
        data: { success: true, data: { id: '1', status: 'Approved', submittedAt: '2026-01-01' } },
      });

      const result = await instructorRequestService.getStatus();

      expect(mockedApi.get).toHaveBeenCalledWith('/instructor-requests/status');
      expect(result.data.status).toBe('Approved');
    });
  });
});
