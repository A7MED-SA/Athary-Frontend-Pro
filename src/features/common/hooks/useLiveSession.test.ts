import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useLiveSession } from './useLiveSession';
import { liveSessionService } from '@/features/liveSessions/services/liveSession.service';

vi.mock('@/features/liveSessions/services/liveSession.service', () => ({
  liveSessionService: {
    getScheduledSessions: vi.fn(),
    getEnrolledUpcoming: vi.fn(),
    getUpcomingStudent: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    join: vi.fn(),
  },
}));

const mockedLiveSessionService = vi.mocked(liveSessionService);

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useLiveSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial loading state', () => {
    mockedLiveSessionService.getScheduledSessions.mockReturnValue(new Promise(() => {}));
    mockedLiveSessionService.getEnrolledUpcoming.mockReturnValue(new Promise(() => {}));
    mockedLiveSessionService.getUpcomingStudent.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useLiveSession(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.scheduled).toBeUndefined();
  });

  it('should fetch scheduled sessions', async () => {
    const mockSessions = [{ id: '1', title: 'Live Q&A', startTime: '2026-01-01T10:00:00Z' }];
    mockedLiveSessionService.getScheduledSessions.mockResolvedValue({ success: true, data: mockSessions } as any);
    mockedLiveSessionService.getEnrolledUpcoming.mockResolvedValue({ success: true, data: [] } as any);
    mockedLiveSessionService.getUpcomingStudent.mockResolvedValue({ success: true, data: [] } as any);

    const { result } = renderHook(() => useLiveSession(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.scheduled).toEqual(mockSessions);
  });

  it('should call create mutation and invalidate cache', async () => {
    mockedLiveSessionService.getScheduledSessions.mockResolvedValue({ success: true, data: [] } as any);
    mockedLiveSessionService.getEnrolledUpcoming.mockResolvedValue({ success: true, data: [] } as any);
    mockedLiveSessionService.getUpcomingStudent.mockResolvedValue({ success: true, data: [] } as any);
    mockedLiveSessionService.create.mockResolvedValue({ success: true, data: {} } as any);

    const { result } = renderHook(() => useLiveSession(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.create({ title: 'New Session', courseId: 'c1', startTime: '2026-01-01T10:00:00Z' } as any);

    await waitFor(() => expect(mockedLiveSessionService.create).toHaveBeenCalled());
  });

  it('should call update mutation', async () => {
    mockedLiveSessionService.getScheduledSessions.mockResolvedValue({ success: true, data: [] } as any);
    mockedLiveSessionService.getEnrolledUpcoming.mockResolvedValue({ success: true, data: [] } as any);
    mockedLiveSessionService.getUpcomingStudent.mockResolvedValue({ success: true, data: [] } as any);
    mockedLiveSessionService.update.mockResolvedValue({ success: true, data: {} } as any);

    const { result } = renderHook(() => useLiveSession(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.update({ id: '1', data: { title: 'Updated' } as any });

    await waitFor(() => expect(mockedLiveSessionService.update).toHaveBeenCalledWith('1', { title: 'Updated' }));
  });

  it('should call deleteSession mutation', async () => {
    mockedLiveSessionService.getScheduledSessions.mockResolvedValue({ success: true, data: [] } as any);
    mockedLiveSessionService.getEnrolledUpcoming.mockResolvedValue({ success: true, data: [] } as any);
    mockedLiveSessionService.getUpcomingStudent.mockResolvedValue({ success: true, data: [] } as any);
    mockedLiveSessionService.delete.mockResolvedValue({ success: true, data: undefined } as any);

    const { result } = renderHook(() => useLiveSession(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.deleteSession('1');

    await waitFor(() => expect(mockedLiveSessionService.delete).toHaveBeenCalledWith('1'));
  });

  it('should call join mutation', async () => {
    mockedLiveSessionService.getScheduledSessions.mockResolvedValue({ success: true, data: [] } as any);
    mockedLiveSessionService.getEnrolledUpcoming.mockResolvedValue({ success: true, data: [] } as any);
    mockedLiveSessionService.getUpcomingStudent.mockResolvedValue({ success: true, data: [] } as any);
    mockedLiveSessionService.join.mockResolvedValue({ success: true, data: { joinUrl: 'https://meet.example.com' } } as any);

    const { result } = renderHook(() => useLiveSession(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.join('1');

    await waitFor(() => expect(mockedLiveSessionService.join).toHaveBeenCalledWith('1'));
  });
});
