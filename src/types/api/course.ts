export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CourseStatus = 'Draft' | 'Pending' | 'Published' | 'Rejected' | 'Archived';
export type CourseLanguage = 'Ar' | 'En';
export type PublicCourseSortBy =
  | 'PublishedAt'
  | 'Price'
  | 'AverageRating'
  | 'EnrollmentCount'
  | 'Title';

export interface PublicCourseDto {
  id: string;
  title: string;
  slug: string;
  description?: string;
  courseImageUrl?: string;
  price: number;
  isFree: boolean;
  level: CourseLevel;
  language: CourseLanguage;
  categoryName: string;
  categoryId: string;
  instructorName: string;
  averageRating: number;
  enrollmentCount: number;
  totalDurationMinutes: number;
  sectionCount: number;
  lessonCount: number;
  publishedAt?: string;
}

export interface PublicCourseDetailDto extends PublicCourseDto {
  requirements?: string[];
  learningOutcomes?: string[];
  targetAudience?: string;
  instructorBio?: string;
  instructorProfileImageUrl?: string;
}

export interface PublicCourseFilterDto {
  searchQuery?: string;
  categoryId?: string;
  level?: CourseLevel;
  language?: CourseLanguage;
  minPrice?: number;
  maxPrice?: number;
  isFreeOnly?: boolean;
  minRating?: number;
  sortBy?: PublicCourseSortBy;
  sortDescending?: boolean;
  page?: number;
  pageSize?: number;
}

export interface CourseSectionResponseDto {
  id: string;
  title: string;
  sortOrder: number;
  lessons: CourseLessonResponseDto[];
}

export interface CourseLessonResponseDto {
  id: string;
  title: string;
  contentType: string;
  durationMinutes: number;
  sortOrder: number;
  isFreePreview: boolean;
}

export interface CourseFaqDto {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
}

export interface CourseResponseDto {
  id: string;
  title: string;
  slug: string;
  description?: string;
  courseImageUrl?: string;
  price: number;
  isFree: boolean;
  level: CourseLevel;
  language: CourseLanguage;
  categoryId: string;
  categoryName: string;
  status: string;
  publishedAt?: string;
  createdAt: string;
}

export interface ManagementCourseDto {
  id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  price: number;
  status: CourseStatus;
  categoryName: string;
  totalDurationMinutes: number;
  enrollmentCount: number;
  averageRating: number;
  revenue: number;
  sectionCount: number;
  lessonCount: number;
  createdAt: string;
  publishedAt?: string;
  updatedAt?: string;
}

export interface CourseDetailResponseDto extends CourseResponseDto {
  requirements?: string[];
  learningOutcomes?: string[];
  targetAudience?: string;
  totalDurationMinutes: number;
  sectionCount: number;
  lessonCount: number;
}

export interface CreateCourseRequestDto {
  title: string;
  description?: string;
  price: number;
  isFree: boolean;
  level: CourseLevel;
  language: CourseLanguage;
  categoryId: string;
  requirements?: string[];
  learningOutcomes?: string[];
  targetAudience?: string;
}

export interface UpdateCourseRequestDto {
  title?: string;
  description?: string;
  price?: number;
  isFree?: boolean;
  level?: CourseLevel;
  language?: CourseLanguage;
  categoryId?: string;
  requirements?: string[];
  learningOutcomes?: string[];
  targetAudience?: string;
}

export interface GetCoursesFilterDto {
  searchQuery?: string;
  categoryId?: string;
  level?: CourseLevel;
  language?: CourseLanguage;
  status?: string;
  page?: number;
  pageSize?: number;
}
