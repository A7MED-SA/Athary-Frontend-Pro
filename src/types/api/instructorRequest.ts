export type InstructorRequestStatus = 'Pending' | 'Approved' | 'Rejected';

export interface InstructorRequestDto {
  id: string;
  userId: string;
  userName: string;
  email: string;
  status: InstructorRequestStatus;
  qualifications?: string;
  experience?: string;
  motivation?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface SubmitInstructorRequestDto {
  qualifications?: string;
  experience?: string;
  motivation?: string;
}

export interface InstructorRequestResponseDto {
  id: string;
  status: InstructorRequestStatus;
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}
