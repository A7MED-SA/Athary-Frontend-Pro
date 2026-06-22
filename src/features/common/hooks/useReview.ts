import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/features/reviews/services/review.service';
import { queryKeys } from '@/lib/query-keys';

export function useReview() {
  const queryClient = useQueryClient();

  const userReviewsQuery = useQuery({
    queryKey: queryKeys.reviews.userReviews(),
    queryFn: () => reviewService.getUserReviews(),
  });

  const reviewableQuery = useQuery({
    queryKey: queryKeys.reviews.reviewableEnrollments(),
    queryFn: () => reviewService.getReviewableEnrollments(),
  });

  const createMutation = useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: { rating: number; comment?: string } }) =>
      reviewService.createReview(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: string; data: { rating?: number; comment?: string } }) =>
      reviewService.updateReview(reviewId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (reviewId: string) => reviewService.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
    },
  });

  return {
    userReviews: userReviewsQuery.data?.data,
    reviewableEnrollments: reviewableQuery.data?.data,
    isLoading: userReviewsQuery.isLoading,
    create: createMutation.mutate,
    isCreatePending: createMutation.isPending,
    update: updateMutation.mutate,
    deleteReview: deleteMutation.mutate,
  };
}

export function useCourseReviews(courseId: string) {
  const query = useQuery({
    queryKey: queryKeys.reviews.courseReviews(courseId),
    queryFn: () => reviewService.getCourseReviews(courseId),
    enabled: !!courseId,
  });

  return {
    reviews: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}
