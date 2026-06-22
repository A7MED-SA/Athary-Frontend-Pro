import api from '@/lib/api';
import type { ApiResponse } from '@/types/api/envelope';
import type {
  QuizResponseDto,
  SubmitQuizAttemptRequest,
  QuizAttemptResultResponse,
  MyQuizAttemptResponse,
} from '@/types/api/quiz';

export const quizService = {
  getQuizzes: (lessonId: string) =>
    api
      .get<ApiResponse<QuizResponseDto[]>>(`/quizzes/lesson/${lessonId}`)
      .then((r) => r.data),

  getQuizDetail: (id: string) =>
    api.get<ApiResponse<QuizResponseDto>>(`/quizzes/${id}`).then((r) => r.data),

  submitAttempt: (id: string, data: SubmitQuizAttemptRequest) =>
    api
      .post<ApiResponse<QuizAttemptResultResponse>>(`/quizzes/${id}/submit`, data)
      .then((r) => r.data),

  getMyAttempts: (lessonId: string) =>
    api
      .get<ApiResponse<MyQuizAttemptResponse[]>>(`/quizzes/attempts/my-attempts/${lessonId}`)
      .then((r) => r.data),

  getQuizzesForStudent: (lessonId: string) =>
    api
      .get<ApiResponse>(`/quizzes/lesson/${lessonId}/student`)
      .then((r) => r.data),
};
