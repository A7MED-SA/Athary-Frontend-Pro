import type { PublicCourseFilterDto } from '@/types/api/course';

export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    sessions: () => [...queryKeys.auth.all, 'sessions'] as const,
  },

  courses: {
    all: ['courses'] as const,
    list: (filters?: PublicCourseFilterDto) =>
      ['courses', 'list', filters] as const,
    detail: (id: string) => ['courses', 'detail', id] as const,
    related: (id: string) => ['courses', 'related', id] as const,
    sections: (id: string) => ['courses', 'sections', id] as const,
    faq: (id: string) => ['courses', 'faq', id] as const,
    instructorCourses: (instructorId: string) =>
      ['courses', 'instructor', instructorId] as const,
  },

  categories: {
    all: ['categories'] as const,
  },

  enrollments: {
    all: ['enrollments'] as const,
    myCourses: () => ['enrollments', 'myCourses'] as const,
    detail: (id: string) => ['enrollments', 'detail', id] as const,
    progress: (id: string) => ['enrollments', 'progress', id] as const,
    courseEnrollments: (courseId: string) =>
      ['enrollments', 'course', courseId] as const,
    studentEnrollments: (studentId: string) =>
      ['enrollments', 'student', studentId] as const,
  },

  cart: {
    all: ['cart'] as const,
  },

  orders: {
    all: ['orders'] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
  },

  payments: {
    all: ['payments'] as const,
    methods: () => ['payments', 'methods'] as const,
    orderPayments: (orderId: string) =>
      ['payments', 'order', orderId] as const,
    detail: (id: string) => ['payments', 'detail', id] as const,
  },

  quizzes: {
    all: ['quizzes'] as const,
    lesson: (lessonId: string) => ['quizzes', 'lesson', lessonId] as const,
    detail: (id: string) => ['quizzes', 'detail', id] as const,
    attempts: (lessonId: string) =>
      ['quizzes', 'attempts', lessonId] as const,
  },

  certificates: {
    all: ['certificates'] as const,
    myCertificates: () => ['certificates', 'my'] as const,
    detail: (id: string) => ['certificates', 'detail', id] as const,
    verify: (code: string) => ['certificates', 'verify', code] as const,
  },

  notifications: {
    all: ['notifications'] as const,
    myNotifications: () => ['notifications', 'my'] as const,
    list: (params?: Record<string, unknown>) =>
      ['notifications', 'list', params] as const,
    unreadCount: () => ['notifications', 'unreadCount'] as const,
    preferences: () => ['notifications', 'preferences'] as const,
  },

  messages: {
    all: ['messages'] as const,
    conversations: () => ['messages', 'conversations'] as const,
    conversationWith: (userId: string) =>
      ['messages', 'conversation', userId] as const,
    messages: (userId: string) => ['messages', 'messages', userId] as const,
    recent: () => ['messages', 'recent'] as const,
  },

  profiles: {
    all: ['profiles'] as const,
    current: () => ['profiles', 'current'] as const,
    publicProfile: (slug: string) => ['profiles', 'public', slug] as const,
    publicById: (id: string) => ['profiles', 'publicById', id] as const,
  },

  dashboards: {
    all: ['dashboards'] as const,
    studentOverview: () => ['dashboards', 'student', 'overview'] as const,
    instructorOverview: () =>
      ['dashboards', 'instructor', 'overview'] as const,
    adminOverview: () => ['dashboards', 'admin', 'overview'] as const,
    instructorRevenue: () => ['dashboards', 'instructor', 'revenue'] as const,
    instructorStudents: () =>
      ['dashboards', 'instructor', 'students'] as const,
    studentCertificates: () =>
      ['dashboards', 'student', 'certificates'] as const,
    studentWishlist: () => ['dashboards', 'student', 'wishlist'] as const,
    studentPayments: () => ['dashboards', 'student', 'payments'] as const,
  },

  reviews: {
    all: ['reviews'] as const,
    courseReviews: (courseId: string) =>
      ['reviews', 'course', courseId] as const,
    userReviews: () => ['reviews', 'user'] as const,
    reviewableEnrollments: () =>
      ['reviews', 'reviewableEnrollments'] as const,
  },

  liveSessions: {
    all: ['liveSessions'] as const,
    scheduled: () => ['liveSessions', 'scheduled'] as const,
    enrolledUpcoming: () => ['liveSessions', 'enrolledUpcoming'] as const,
    courseSessions: (courseId: string) =>
      ['liveSessions', 'course', courseId] as const,
    detail: (id: string) => ['liveSessions', 'detail', id] as const,
    upcomingStudent: () => ['liveSessions', 'upcomingStudent'] as const,
  },

  wishlist: {
    all: ['wishlist'] as const,
    myWishlist: () => ['wishlist', 'my'] as const,
    check: (courseId: string) => ['wishlist', 'check', courseId] as const,
  },

  announcements: {
    all: ['announcements'] as const,
    myAnnouncements: () => ['announcements', 'my'] as const,
    list: (params?: Record<string, unknown>) =>
      ['announcements', 'list', params] as const,
    byUser: (userId: string) => ['announcements', 'user', userId] as const,
    courseAnnouncements: (courseId: string) =>
      ['announcements', 'course', courseId] as const,
    detail: (id: string) => ['announcements', 'detail', id] as const,
  },

  landing: {
    all: ['landing'] as const,
    data: () => ['landing', 'data'] as const,
    testimonials: () => ['landing', 'testimonials'] as const,
  },

  instructorRequests: {
    all: ['instructorRequests'] as const,
    status: () => ['instructorRequests', 'status'] as const,
  },
};
