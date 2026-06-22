export interface CertificateResponse {
  id: string;
  code: string;
  studentName: string;
  courseName: string;
  courseId: string;
  issuedAt: string;
  expiresAt?: string;
}

export interface CertificateVerificationResponse {
  isValid: boolean;
  studentName?: string;
  courseName?: string;
  issuedAt?: string;
  message: string;
}
