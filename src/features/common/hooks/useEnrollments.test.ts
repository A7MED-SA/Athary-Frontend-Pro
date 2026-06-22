import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useEnrollments, useEnrollmentDetail } from './useEnrollments';
import { enrollmentService } from '@/features/enrollment/services/enrollment.service';

vi.mock('@/features/enrollment/services/enrollment.service', () => ({
  enrollmentService: {
    getEnrollments: vi.fn(),
    checkProgress: vi.fn(),
    checkAndCompleteIfEligible: vi.fn(),
    requestCompletion: vi.fn(),
    getEnrollmentDetail: vi.fn(),
    getEnrollmentProgress: vi.fn(),
  },
}));

const mockedEnrollmentService = vi.mocked(enrollmentService);

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useEnrollments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial loading state', () => {
    mockedEnrollmentService.getEnrollments.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useEnrollments(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.enrollments).toBeUndefined();
  });

  it('should fetch enrollments successfully', async () => {
    const mockEnrollments = [{ id: '1', courseId: 'c1', progress: 50 }];
    mockedEnrollmentService.getEnrollments.mockResolvedValue({ success: true, data: mockEnrollments } as any);

    const { result } = renderHook(() => useEnrollments(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.enrollments).toEqual(mockEnrollments);
  });

  it('should call checkProgress mutation', async () => {
    mockedEnrollmentService.getEnrollments.mockResolvedValue({ success: true, data: [] } as any);
    mockedEnrollmentService.checkProgress.mockResolvedValue({ success: true, data: undefined } as any);

    const { result } = renderHook(() => useEnrollments(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.checkProgress('enrollment-1');

    await waitFor(() => expect(mockedEnrollmentService.checkProgress).toHaveBeenCalledWith('enrollment-1'));
  });

  it('should call complete mutation', async () => {
    mockedEnrollmentService.getEnrollments.mockResolvedValue({ success: true, data: [] } as any);
    mockedEnrollmentService.checkAndCompleteIfEligible.mockResolvedValue({ success: true, data: undefined } as any);

    const { result } = renderHook(() => useEnrollments(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.complete('enrollment-1');

    await waitFor(() => expect(mockedEnrollmentService.checkAndCompleteIfEligible).toHaveBeenCalledWith('enrollment-1'));
  });

  it('should call requestCompletion mutation', async () => {
    mockedEnrollmentService.getEnrollments.mockResolvedValue({ success: true, data: [] } as any);
    mockedEnrollmentService.requestCompletion.mockResolvedValue({ success: true, data: undefined } as any);

    const { result } = renderHook(() => useEnrollments(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.requestCompletion('enrollment-1');

    await waitFor(() => expect(mockedEnrollmentService.requestCompletion).toHaveBeenCalledWith('enrollment-1'));
  });
});

describe('useEnrollmentDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch enrollment detail when id is provided', async () => {
    const mockDetail = { id: '1', courseId: 'c1', progress: 75 };
    mockedEnrollmentService.getEnrollmentDetail.mockResolvedValue({ success: true, data: mockDetail } as any);
    mockedEnrollmentService.getEnrollmentProgress.mockResolvedValue({ success: true, data: { percentage: 75 } } as any);

    const { result } = renderHook(() => useEnrollmentDetail('1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.enrollment).toEqual(mockDetail);
  });

  it('should not fetch when id is empty', () => {
    const { result } = renderHook(() => useEnrollmentDetail(''), { wrapper: createWrapper() });

    expect(mockedEnrollmentService.getEnrollmentDetail).not.toHaveBeenCalled();
  });
});
