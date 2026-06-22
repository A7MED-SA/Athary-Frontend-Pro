import api from '@/lib/api';
import type { ApiResponse, PagedList } from '@/types/api/envelope';
import type {
  ReviewResponse,
  ReviewDetailResponse,
  CreateReviewRequest,
  UpdateReviewRequest,
  ReviewableEnrollment,
} from '@/types/api/review';

export const reviewService = {
  getCourseReviews: (courseId: string, params?: Record<string, unknown>) =>
    api
      .get<ApiResponse<PagedList<ReviewResponse>>>(`/reviews/course/${courseId}`, { params })
      .then((r) => r.data),

  getUserReviews: () =>
    api
      .get<ApiResponse<ReviewDetailResponse[]>>('/reviews/user')
      .then((r) => r.data),

  createReview: (courseId: string, data: CreateReviewRequest) =>
    api
      .post<ApiResponse<ReviewResponse>>(`/reviews/course/${courseId}`, data)
      .then((r) => r.data),

  updateReview: (reviewId: string, data: UpdateReviewRequest) =>
    api
      .put<ApiResponse<ReviewResponse>>(`/reviews/${reviewId}`, data)
      .then((r) => r.data),

  deleteReview: (reviewId: string) =>
    api.delete<ApiResponse>(`/reviews/${reviewId}`).then((r) => r.data),

  getReviewableEnrollments: () =>
    api
      .get<ApiResponse<ReviewableEnrollment[]>>('/reviews/reviewable-enrollments')
      .then((r) => r.data),
};
