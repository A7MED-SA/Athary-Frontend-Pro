import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { quizService } from '@/features/enrollment/services/quiz.service';
import { queryKeys } from '@/lib/query-keys';

export function useQuiz() {
  const queryClient = useQueryClient();

  const submitMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { answers: { questionId: string; selectedOptionId: string }[] } }) =>
      quizService.submitAttempt(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quizzes.all });
    },
  });

  return {
    submit: submitMutation.mutate,
    submitAsync: submitMutation.mutateAsync,
    isSubmitPending: submitMutation.isPending,
    submitError: submitMutation.error,
  };
}

export function useQuizDetail(id: string) {
  const query = useQuery({
    queryKey: queryKeys.quizzes.detail(id),
    queryFn: () => quizService.getQuizDetail(id),
    enabled: !!id,
  });

  return {
    quiz: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useQuizAttempts(lessonId: string) {
  const query = useQuery({
    queryKey: queryKeys.quizzes.attempts(lessonId),
    queryFn: () => quizService.getMyAttempts(lessonId),
    enabled: !!lessonId,
  });

  return {
    attempts: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}
