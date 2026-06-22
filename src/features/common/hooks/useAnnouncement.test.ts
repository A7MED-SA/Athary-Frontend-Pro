import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useAnnouncement } from './useAnnouncement';
import { announcementService } from '@/features/announcements/services/announcement.service';

vi.mock('@/features/announcements/services/announcement.service', () => ({
  announcementService: {
    getMyAnnouncements: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedAnnouncementService = vi.mocked(announcementService);

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useAnnouncement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial loading state', () => {
    mockedAnnouncementService.getMyAnnouncements.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useAnnouncement(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.myAnnouncements).toBeUndefined();
  });

  it('should fetch my announcements successfully', async () => {
    const mockAnnouncements = { items: [{ id: '1', title: 'New Update', content: 'Check this out' }], totalCount: 1 };
    mockedAnnouncementService.getMyAnnouncements.mockResolvedValue({ success: true, data: mockAnnouncements } as any);

    const { result } = renderHook(() => useAnnouncement(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.myAnnouncements).toEqual(mockAnnouncements);
  });

  it('should call create mutation and invalidate cache', async () => {
    mockedAnnouncementService.getMyAnnouncements.mockResolvedValue({ success: true, data: { items: [] } } as any);
    mockedAnnouncementService.create.mockResolvedValue({ success: true, data: {} } as any);

    const { result } = renderHook(() => useAnnouncement(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.create({ title: 'New', content: 'Content', courseId: 'c1' } as any);

    await waitFor(() => expect(mockedAnnouncementService.create).toHaveBeenCalled());
  });

  it('should call update mutation', async () => {
    mockedAnnouncementService.getMyAnnouncements.mockResolvedValue({ success: true, data: { items: [] } } as any);
    mockedAnnouncementService.update.mockResolvedValue({ success: true, data: {} } as any);

    const { result } = renderHook(() => useAnnouncement(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.update({ id: '1', data: { title: 'Updated' } as any });

    await waitFor(() => expect(mockedAnnouncementService.update).toHaveBeenCalledWith('1', { title: 'Updated' }));
  });

  it('should call deleteAnnouncement mutation', async () => {
    mockedAnnouncementService.getMyAnnouncements.mockResolvedValue({ success: true, data: { items: [] } } as any);
    mockedAnnouncementService.delete.mockResolvedValue({ success: true, data: undefined } as any);

    const { result } = renderHook(() => useAnnouncement(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.deleteAnnouncement('1');

    await waitFor(() => expect(mockedAnnouncementService.delete).toHaveBeenCalledWith('1'));
  });
});
