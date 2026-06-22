export type CourseId = string & { __brand: 'CourseId' };
export type UserId = string & { __brand: 'UserId' };
export type EnrollmentId = string & { __brand: 'EnrollmentId' };
export type OrderId = string & { __brand: 'OrderId' };
export type PaymentId = string & { __brand: 'PaymentId' };
export type QuizId = string & { __brand: 'QuizId' };
export type CertificateId = string & { __brand: 'CertificateId' };
export type NotificationId = string & { __brand: 'NotificationId' };
export type MessageId = string & { __brand: 'MessageId' };
export type ReviewId = string & { __brand: 'ReviewId' };
export type LiveSessionId = string & { __brand: 'LiveSessionId' };
export type AnnouncementId = string & { __brand: 'AnnouncementId' };
export type CategoryId = string & { __brand: 'CategoryId' };
export type CartId = string & { __brand: 'CartId' };
export type ProfileId = string & { __brand: 'ProfileId' };
export type MediaId = string & { __brand: 'MediaId' };
export type SessionId = string & { __brand: 'SessionId' };
export type InstructorRequestId = string & { __brand: 'InstructorRequestId' };
export type RefundId = string & { __brand: 'RefundId' };
export type CouponId = string & { __brand: 'CouponId' };
export type WishlistId = string & { __brand: 'WishlistId' };
export type SectionId = string & { __brand: 'SectionId' };
export type LessonId = string & { __brand: 'LessonId' };
export type PhoneId = string & { __brand: 'PhoneId' };
export type AddressId = string & { __brand: 'AddressId' };

export function createBrandedId<T>(id: string): T {
  return id as T;
}
