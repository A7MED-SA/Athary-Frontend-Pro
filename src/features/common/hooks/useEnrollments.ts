import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enrollmentService } from '@/features/enrollment/services/enrollment.service';
import { queryKeys } from '@/lib/query-keys';

export function useEnrollments() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.enrollments.myCourses(),
    queryFn: () => enrollmentService.getEnrollments(),
  });

  const checkProgressMutation = useMutation({
    mutationFn: (id: string) => enrollmentService.checkProgress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments.all });
    },
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) => enrollmentService.checkAndCompleteIfEligible(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments.all });
    },
  });

  const requestCompletionMutation = useMutation({
    mutationFn: (id: string) => enrollmentService.requestCompletion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments.all });
    },
  });

  return {
    enrollments: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
    checkProgress: checkProgressMutation.mutate,
    complete: completeMutation.mutate,
    requestCompletion: requestCompletionMutation.mutate,
  };
}

export function useEnrollmentDetail(id: string) {
  const query = useQuery({
    queryKey: queryKeys.enrollments.detail(id),
    queryFn: () => enrollmentService.getEnrollmentDetail(id),
    enabled: !!id,
  });

  const progressQuery = useQuery({
    queryKey: queryKeys.enrollments.progress(id),
    queryFn: () => enrollmentService.getEnrollmentProgress(id),
    enabled: !!id,
  });

  return {
    enrollment: query.data?.data,
    progress: progressQuery.data?.data,
    isLoading: query.isLoading,
    isProgressLoading: progressQuery.isLoading,
    error: query.error,
  };
}
