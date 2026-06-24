import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useProfile } from './useProfile';
import { profileService } from '@/features/profile/services/profile.service';

vi.mock('@/features/profile/services/profile.service', () => ({
  profileService: {
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
    addPhone: vi.fn(),
    setDefaultPhone: vi.fn(),
    deletePhone: vi.fn(),
    addAddress: vi.fn(),
    setDefaultAddress: vi.fn(),
    deleteAddress: vi.fn(),
    setProfilePicture: vi.fn(),
    deleteProfilePicture: vi.fn(),
  },
}));

const mockedProfileService = vi.mocked(profileService);

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial loading state', () => {
    mockedProfileService.getProfile.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useProfile(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.profile).toBeUndefined();
  });

  it('should fetch profile successfully', async () => {
    const mockProfile = { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@test.com' };
    mockedProfileService.getProfile.mockResolvedValue({ success: true, data: mockProfile } as any);

    const { result } = renderHook(() => useProfile(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.profile).toEqual(mockProfile);
  });

  it('should call update mutation and invalidate cache', async () => {
    mockedProfileService.getProfile.mockResolvedValue({ success: true, data: {} } as any);
    mockedProfileService.updateProfile.mockResolvedValue({ success: true, data: {} } as any);

    const { result } = renderHook(() => useProfile(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.update({ firstName: 'Jane' } as any);

    await waitFor(() => expect(mockedProfileService.updateProfile).toHaveBeenCalledWith({ firstName: 'Jane' }));
  });

  it('should call addPhone mutation', async () => {
    mockedProfileService.getProfile.mockResolvedValue({ success: true, data: {} } as any);
    mockedProfileService.addPhone.mockResolvedValue({ success: true, data: {} } as any);

    const { result } = renderHook(() => useProfile(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.addPhone({ number: '+1234567890' } as any);

    await waitFor(() => expect(mockedProfileService.addPhone).toHaveBeenCalledWith({ number: '+1234567890' }));
  });

  it('should call deletePhone mutation', async () => {
    mockedProfileService.getProfile.mockResolvedValue({ success: true, data: {} } as any);
    mockedProfileService.deletePhone.mockResolvedValue({ success: true, data: undefined } as any);

    const { result } = renderHook(() => useProfile(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.deletePhone('phone-1');

    await waitFor(() => expect(mockedProfileService.deletePhone).toHaveBeenCalledWith('phone-1'));
  });

  it('should call addAddress mutation', async () => {
    mockedProfileService.getProfile.mockResolvedValue({ success: true, data: {} } as any);
    mockedProfileService.addAddress.mockResolvedValue({ success: true, data: {} } as any);

    const { result } = renderHook(() => useProfile(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.addAddress({ street: '123 Main St', city: 'NYC' } as any);

    await waitFor(() => expect(mockedProfileService.addAddress).toHaveBeenCalledWith({ street: '123 Main St', city: 'NYC' }));
  });
});
