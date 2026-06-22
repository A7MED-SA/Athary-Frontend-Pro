export interface ReviewResponse {
  id: string;
  courseId: string;
  courseName: string;
  studentId: string;
  studentName: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewDetailResponse extends ReviewResponse {
  instructorReply?: string;
  instructorReplyAt?: string;
}

export interface CreateReviewRequest {
  rating: number;
  comment?: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
}

export interface ReviewableEnrollment {
  enrollmentId: string;
  courseId: string;
  courseName: string;
  courseImageUrl?: string;
  completedAt: string;
}
