import { describe, it, expect, vi, beforeEach } from 'vitest';
import { certificateService } from './certificate.service';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api);

describe('certificateService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMyCertificates', () => {
    it('should fetch certificates', async () => {
      mockedApi.get.mockResolvedValue({
        data: { success: true, data: [{ id: '1', code: 'CERT-001', courseName: 'Course', issuedAt: '2026-01-01' }] },
      });

      const result = await certificateService.getMyCertificates();

      expect(mockedApi.get).toHaveBeenCalledWith('/certificates/my-certificates');
      expect(result.data).toHaveLength(1);
    });
  });

  describe('verify', () => {
    it('should verify certificate', async () => {
      mockedApi.get.mockResolvedValue({
        data: { success: true, data: { isValid: true, studentName: 'Test', courseName: 'Course', message: 'Valid' } },
      });

      const result = await certificateService.verify('CERT-001');

      expect(mockedApi.get).toHaveBeenCalledWith('/certificates/verify/CERT-001');
      expect(result.data.isValid).toBe(true);
    });
  });
});
