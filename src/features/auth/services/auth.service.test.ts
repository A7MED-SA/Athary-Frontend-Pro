import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from './auth.service';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api);

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should send login request with correct data', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { accessToken: 'token', refreshToken: 'refresh', sessionId: '1', expiresAt: '2026-01-01', user: { id: '1', email: 'test@test.com', fullName: 'Test', isActive: true, emailConfirmed: true, roles: [] } },
        },
      };
      mockedApi.post.mockResolvedValue(mockResponse);

      const result = await authService.login({ email: 'test@test.com', password: 'password' });

      expect(mockedApi.post).toHaveBeenCalledWith('/auth/login', { email: 'test@test.com', password: 'password' });
      expect(result.data.accessToken).toBe('token');
    });
  });

  describe('register', () => {
    it('should send register request with correct data', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { userId: '1', token: 'token', refreshToken: 'refresh', expiration: '2026-01-01' },
        },
      };
      mockedApi.post.mockResolvedValue(mockResponse);

      const result = await authService.register({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });

      expect(mockedApi.post).toHaveBeenCalledWith('/auth/register', expect.objectContaining({ email: 'test@test.com' }));
      expect(result.data.userId).toBe('1');
    });
  });

  describe('logout', () => {
    it('should send logout request', async () => {
      mockedApi.post.mockResolvedValue({ data: { success: true, data: undefined } });

      await authService.logout();

      expect(mockedApi.post).toHaveBeenCalledWith('/auth/logout');
    });
  });

  describe('refreshToken', () => {
    it('should send refresh request', async () => {
      mockedApi.post.mockResolvedValue({
        data: { success: true, data: { accessToken: 'new', refreshToken: 'new', expiresAt: '2026-01-01' } },
      });

      await authService.refreshToken();

      expect(mockedApi.post).toHaveBeenCalledWith('/auth/refresh');
    });
  });

  describe('getActiveSessions', () => {
    it('should return sessions list', async () => {
      mockedApi.get.mockResolvedValue({
        data: { success: true, data: [{ id: '1', ipAddress: '127.0.0.1', userAgent: 'Chrome', createdAt: '2026-01-01', isActive: true }] },
      });

      const result = await authService.getActiveSessions();

      expect(mockedApi.get).toHaveBeenCalledWith('/auth/sessions');
      expect(result.data).toHaveLength(1);
    });
  });
});
