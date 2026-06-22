export interface LandingDto {
  stats: LandingStatsDto;
  testimonials: TestimonialDto[];
  featuredCourses: LandingCourseDto[];
}

export interface LandingStatsDto {
  totalStudents: number;
  totalCourses: number;
  totalInstructors: number;
  totalHours: number;
}

export interface TestimonialDto {
  id: string;
  name: string;
  role: string;
  content: string;
  avatarUrl?: string;
  rating: number;
}

export interface LandingCourseDto {
  id: string;
  title: string;
  slug: string;
  courseImageUrl?: string;
  price: number;
  isFree: boolean;
  instructorName: string;
  averageRating: number;
  enrollmentCount: number;
}
