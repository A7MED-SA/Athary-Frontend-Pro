import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useReview, useCourseReviews } from './useReview';
import { reviewService } from '@/features/reviews/services/review.service';

vi.mock('@/features/reviews/services/review.service', () => ({
  reviewService: {
    getUserReviews: vi.fn(),
    getReviewableEnrollments: vi.fn(),
    createReview: vi.fn(),
    updateReview: vi.fn(),
    deleteReview: vi.fn(),
    getCourseReviews: vi.fn(),
  },
}));

const mockedReviewService = vi.mocked(reviewService);

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useReview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial loading state', () => {
    mockedReviewService.getUserReviews.mockReturnValue(new Promise(() => {}));
    mockedReviewService.getReviewableEnrollments.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useReview(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.userReviews).toBeUndefined();
  });

  it('should fetch user reviews and reviewable enrollments', async () => {
    const mockReviews = [{ id: '1', rating: 5, comment: 'Great!' }];
    const mockReviewable = [{ enrollmentId: 'e1', courseName: 'React' }];
    mockedReviewService.getUserReviews.mockResolvedValue({ success: true, data: mockReviews } as any);
    mockedReviewService.getReviewableEnrollments.mockResolvedValue({ success: true, data: mockReviewable } as any);

    const { result } = renderHook(() => useReview(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.userReviews).toEqual(mockReviews);
    expect(result.current.reviewableEnrollments).toEqual(mockReviewable);
  });

  it('should call createReview mutation', async () => {
    mockedReviewService.getUserReviews.mockResolvedValue({ success: true, data: [] } as any);
    mockedReviewService.getReviewableEnrollments.mockResolvedValue({ success: true, data: [] } as any);
    mockedReviewService.createReview.mockResolvedValue({ success: true, data: {} } as any);

    const { result } = renderHook(() => useReview(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.create({ courseId: 'c1', data: { rating: 5, comment: 'Excellent' } });

    await waitFor(() => expect(mockedReviewService.createReview).toHaveBeenCalledWith('c1', { rating: 5, comment: 'Excellent' }));
  });

  it('should call updateReview mutation', async () => {
    mockedReviewService.getUserReviews.mockResolvedValue({ success: true, data: [] } as any);
    mockedReviewService.getReviewableEnrollments.mockResolvedValue({ success: true, data: [] } as any);
    mockedReviewService.updateReview.mockResolvedValue({ success: true, data: {} } as any);

    const { result } = renderHook(() => useReview(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.update({ reviewId: 'r1', data: { rating: 4 } });

    await waitFor(() => expect(mockedReviewService.updateReview).toHaveBeenCalledWith('r1', { rating: 4 }));
  });

  it('should call deleteReview mutation', async () => {
    mockedReviewService.getUserReviews.mockResolvedValue({ success: true, data: [] } as any);
    mockedReviewService.getReviewableEnrollments.mockResolvedValue({ success: true, data: [] } as any);
    mockedReviewService.deleteReview.mockResolvedValue({ success: true, data: undefined } as any);

    const { result } = renderHook(() => useReview(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.deleteReview('r1');

    await waitFor(() => expect(mockedReviewService.deleteReview).toHaveBeenCalledWith('r1'));
  });
});

describe('useCourseReviews', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch course reviews when courseId is provided', async () => {
    const mockReviews = [{ id: '1', rating: 5, comment: 'Great course!' }];
    mockedReviewService.getCourseReviews.mockResolvedValue({ success: true, data: { data: mockReviews } } as any);

    const { result } = renderHook(() => useCourseReviews('course-1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.reviews).toEqual({ data: mockReviews });
  });

  it('should not fetch when courseId is empty', () => {
    const { result } = renderHook(() => useCourseReviews(''), { wrapper: createWrapper() });

    expect(mockedReviewService.getCourseReviews).not.toHaveBeenCalled();
  });
});
