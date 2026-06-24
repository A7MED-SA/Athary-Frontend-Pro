import { describe, it, expect, vi, beforeEach } from 'vitest';
import { profileService } from './profile.service';
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

describe('profileService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should fetch profile', async () => {
      mockedApi.get.mockResolvedValue({
        data: {
          success: true,
          data: { id: '1', fullName: 'Test User', email: 'test@test.com', phones: [], addresses: [] },
        },
      });

      const result = await profileService.getProfile();

      expect(mockedApi.get).toHaveBeenCalledWith('/profile/me');
      expect(result.data.fullName).toBe('Test User');
    });
  });

  describe('updateProfile', () => {
    it('should update profile', async () => {
      mockedApi.put.mockResolvedValue({
        data: { success: true, data: { id: '1', fullName: 'Updated Name', email: 'test@test.com', phones: [], addresses: [] } },
      });

      const result = await profileService.updateProfile({ firstName: 'Updated' });

      expect(mockedApi.put).toHaveBeenCalledWith('/profile', { firstName: 'Updated' });
      expect(result.data.fullName).toBe('Updated Name');
    });
  });

  describe('addPhone', () => {
    it('should add phone', async () => {
      mockedApi.post.mockResolvedValue({
        data: { success: true, data: { id: 'p1', phoneNumber: '+1234567890', type: 'Primary', isVerified: false, isDefault: true } },
      });

      const result = await profileService.addPhone({ phoneNumber: '+1234567890', type: 'Primary' });

      expect(mockedApi.post).toHaveBeenCalledWith('/profile/phones', { PhoneNumber: '+1234567890', Type: 'Primary' });
      expect(result.data.phoneNumber).toBe('+1234567890');
    });
  });
});
