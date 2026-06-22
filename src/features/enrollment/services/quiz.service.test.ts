import { describe, it, expect, vi, beforeEach } from 'vitest';
import { quizService } from './quiz.service';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api);

describe('quizService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getQuizzes', () => {
    it('should fetch quizzes for lesson', async () => {
      mockedApi.get.mockResolvedValue({
        data: { success: true, data: [{ id: '1', title: 'Quiz 1', lessonId: 'l1' }] },
      });

      const result = await quizService.getQuizzes('l1');

      expect(mockedApi.get).toHaveBeenCalledWith('/quizzes/lesson/l1');
      expect(result.data).toHaveLength(1);
    });
  });

  describe('submitAttempt', () => {
    it('should submit quiz attempt', async () => {
      mockedApi.post.mockResolvedValue({
        data: { success: true, data: { attemptId: 'a1', score: 80, passed: true, correctAnswers: 4, totalQuestions: 5 } },
      });

      const result = await quizService.submitAttempt('q1', { answers: [] });

      expect(mockedApi.post).toHaveBeenCalledWith('/quizzes/q1/submit', { answers: [] });
      expect(result.data.passed).toBe(true);
    });
  });
});
