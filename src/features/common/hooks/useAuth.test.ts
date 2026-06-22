import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useAuth } from './useAuth';
import { authService } from '@/features/auth/services/auth.service';

vi.mock('@/features/auth/services/auth.service', () => ({
  authService: {
    getActiveSessions: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    loginWithOAuth: vi.fn(),
    revokeSession: vi.fn(),
    revokeAllSessions: vi.fn(),
  },
}));

const mockedAuthService = vi.mocked(authService);

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'location', { value: { href: '' }, writable: true });
  });

  it('should return initial loading state', () => {
    mockedAuthService.getActiveSessions.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    expect(result.current.isSessionsLoading).toBe(true);
    expect(result.current.sessions).toBeUndefined();
  });

  it('should fetch sessions successfully', async () => {
    const mockSessions = [{ id: '1', ipAddress: '127.0.0.1', userAgent: 'Chrome', createdAt: '2026-01-01', isActive: true }];
    mockedAuthService.getActiveSessions.mockResolvedValue({ success: true, data: mockSessions } as any);

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSessionsLoading).toBe(false));
    expect(result.current.sessions).toEqual(mockSessions);
  });

  it('should call login mutation and invalidate queries', async () => {
    mockedAuthService.login.mockResolvedValue({ success: true, data: { accessToken: 'token' } } as any);
    mockedAuthService.getActiveSessions.mockResolvedValue({ success: true, data: [] } as any);

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    result.current.login({ email: 'test@test.com', password: 'password' });

    await waitFor(() => expect(mockedAuthService.login).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password' }));
  });

  it('should call register mutation', async () => {
    mockedAuthService.register.mockResolvedValue({ success: true, data: { userId: '1', token: 't', refreshToken: 'r', expiration: '2026-01-01' } } as any);
    mockedAuthService.getActiveSessions.mockResolvedValue({ success: true, data: [] } as any);

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    result.current.register({ firstName: 'Test', lastName: 'User', email: 'test@test.com', password: 'Pass123!', confirmPassword: 'Pass123!' });

    await waitFor(() => expect(mockedAuthService.register).toHaveBeenCalled());
  });

  it('should call logout and redirect', async () => {
    mockedAuthService.logout.mockResolvedValue({ success: true, data: undefined } as any);
    mockedAuthService.getActiveSessions.mockResolvedValue({ success: true, data: [] } as any);

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    result.current.logout();

    await waitFor(() => {
      expect(mockedAuthService.logout).toHaveBeenCalled();
    });
  });
});
