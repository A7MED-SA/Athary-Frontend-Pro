export type EnrollmentStatus = 'InProgress' | 'Completed' | 'Expired' | 'Refunded';
export type EnrollmentSource = 'Purchase' | 'Gift' | 'AdminGrant' | 'Coupon';
export type ContentType = 'Video' | 'Quiz' | 'Document' | 'LiveSession';

export interface EnrollmentResponseDto {
  id: string;
  courseId: string;
  courseTitle: string;
  courseImageUrl?: string;
  studentId: string;
  studentName: string;
  status: EnrollmentStatus;
  source: EnrollmentSource;
  enrolledAt: string;
  completedAt?: string;
  progressPercentage: number;
  lastAccessedAt?: string;
}

export interface EnrollmentProgressResponse {
  enrollmentId: string;
  totalContent: number;
  completedContent: number;
  progressPercentage: number;
  contents: ContentProgressDto[];
}

export interface ContentProgressDto {
  id: string;
  enrollmentId: string;
  contentType: ContentType;
  contentId: string;
  isCompleted: boolean;
  watchTimeSeconds: number;
  attemptsCount: number;
  completionPercentage: number;
  metadata?: string;
  lastAccessedAt?: string;
  completedAt?: string;
}

export interface UpdateProgressRequest {
  contentType: ContentType;
  contentId: string;
  watchTimeSeconds?: number;
  isCompleted?: boolean;
}
