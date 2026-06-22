export interface StudentOverviewDto {
  enrolledCoursesCount: number;
  completedCoursesCount: number;
  inProgressCoursesCount: number;
  certificatesCount: number;
  totalWatchTimeMinutes: number;
  recentEnrollments: RecentEnrollmentDto[];
}

export interface RecentEnrollmentDto {
  courseId: string;
  courseTitle: string;
  courseImageUrl?: string;
  progressPercentage: number;
  lastAccessedAt: string;
}

export interface InstructorOverviewDto {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
  recentReviews: RecentReviewDto[];
}

export interface RecentReviewDto {
  courseId: string;
  courseName: string;
  studentName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface AdminOverviewDto {
  totalUsers: number;
  totalInstructors: number;
  totalStudents: number;
  totalCourses: number;
  pendingApprovals: number;
  totalRevenue: number;
  monthlyRevenue: number;
  newUsersThisMonth: number;
}

export interface InstructorRevenueDto {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayouts: number;
  completedPayouts: number;
  revenueByMonth: MonthlyRevenueDto[];
}

export interface MonthlyRevenueDto {
  month: string;
  amount: number;
}

export interface InstructorStudentDto {
  studentId: string;
  studentName: string;
  email: string;
  enrolledCoursesCount: number;
  totalWatchTimeMinutes: number;
  lastActiveAt: string;
}

export interface StudentCertificatesDto {
  certificates: StudentCertificateDto[];
  totalCount: number;
}

export interface StudentCertificateDto {
  id: string;
  code: string;
  courseName: string;
  issuedAt: string;
}

export interface StudentWishlistDto {
  items: StudentWishlistItemDto[];
  totalCount: number;
}

export interface StudentWishlistItemDto {
  courseId: string;
  courseTitle: string;
  courseImageUrl?: string;
  price: number;
  addedAt: string;
}

export interface StudentPaymentsDto {
  payments: StudentPaymentDto[];
  totalCount: number;
}

export interface StudentPaymentDto {
  id: string;
  orderNumber: string;
  amount: number;
  method: string;
  status: string;
  paidAt: string;
}
