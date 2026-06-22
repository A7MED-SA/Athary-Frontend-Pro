export interface Course {
  id: string;
  title: string;
  category: string;
  categorySlug: string;
  instructorName: string;
  instructorAvatar: string;
  rating: number;
  studentsCount: number;
  price: number; // 0 for Free
  originalPrice?: number;
  duration: string; // e.g. "٢٤ ساعة"
  lessonsCount: number; // e.g. ١٥
  thumbnail: string;
  progress?: number; // 0 to 100 for enrolled courses
  nextLesson?: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string; // Dynamic icon rendering matching Lucide
  courseCount: number;
}

export interface LiveSession {
  id: string;
  title: string;
  instructor: string;
  date: string; // e.g. "١٥ يونيو"
  time: string; // e.g. "٠٨:٠٠ م"
  duration: string; // e.g. "ساعة ونصف"
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export type ViewType = 'landing' | 'catalog' | 'dashboard' | 'auth' | 'course-details' | 'cart-checkout' | 'instructor-dashboard' | 'admin-dashboard' | 'about-contact' | 'profile-settings' | 'public-profile';

export type AuthSubView = 'login' | 'register' | 'forgot' | 'verify' | 'reset' | 'success';
