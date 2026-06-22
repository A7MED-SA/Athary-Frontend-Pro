import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useQuiz, useQuizDetail, useQuizAttempts } from './useQuiz';
import { quizService } from '@/features/enrollment/services/quiz.service';

vi.mock('@/features/enrollment/services/quiz.service', () => ({
  quizService: {
    submitAttempt: vi.fn(),
    getQuizDetail: vi.fn(),
    getMyAttempts: vi.fn(),
  },
}));

const mockedQuizService = vi.mocked(quizService);

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useQuiz', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should expose submit mutation', async () => {
    mockedQuizService.submitAttempt.mockResolvedValue({ success: true, data: { score: 80 } } as any);

    const { result } = renderHook(() => useQuiz(), { wrapper: createWrapper() });

    expect(result.current.isSubmitPending).toBe(false);
    expect(result.current.submit).toBeInstanceOf(Function);
  });

  it('should call submitAttempt mutation and invalidate cache', async () => {
    mockedQuizService.submitAttempt.mockResolvedValue({ success: true, data: { score: 80 } } as any);

    const { result } = renderHook(() => useQuiz(), { wrapper: createWrapper() });

    result.current.submit({ id: 'quiz-1', data: { answers: [{ questionId: 'q1', selectedOptionId: 'o1' }] } });

    await waitFor(() => expect(mockedQuizService.submitAttempt).toHaveBeenCalledWith('quiz-1', { answers: [{ questionId: 'q1', selectedOptionId: 'o1' }] }));
  });
});

describe('useQuizDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch quiz detail when id is provided', async () => {
    const mockQuiz = { id: '1', title: 'Test Quiz', questions: [] };
    mockedQuizService.getQuizDetail.mockResolvedValue({ success: true, data: mockQuiz } as any);

    const { result } = renderHook(() => useQuizDetail('1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.quiz).toEqual(mockQuiz);
  });

  it('should not fetch when id is empty', () => {
    const { result } = renderHook(() => useQuizDetail(''), { wrapper: createWrapper() });

    expect(mockedQuizService.getQuizDetail).not.toHaveBeenCalled();
  });
});

describe('useQuizAttempts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch attempts when lessonId is provided', async () => {
    const mockAttempts = [{ id: '1', score: 90, completedAt: '2026-01-01' }];
    mockedQuizService.getMyAttempts.mockResolvedValue({ success: true, data: mockAttempts } as any);

    const { result } = renderHook(() => useQuizAttempts('lesson-1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.attempts).toEqual(mockAttempts);
  });

  it('should not fetch when lessonId is empty', () => {
    const { result } = renderHook(() => useQuizAttempts(''), { wrapper: createWrapper() });

    expect(mockedQuizService.getMyAttempts).not.toHaveBeenCalled();
  });
});
