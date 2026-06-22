export interface LiveSessionResponseDto {
  id: string;
  title: string;
  description?: string;
  instructorId: string;
  instructorName: string;
  courseId?: string;
  courseName?: string;
  scheduledAt: string;
  durationMinutes: number;
  status: string;
  meetingUrl?: string;
  meetingId?: string;
  maxAttendees?: number;
  currentAttendees: number;
  createdAt: string;
}

export interface CreateLiveSessionRequest {
  title: string;
  description?: string;
  courseId?: string;
  scheduledAt: string;
  durationMinutes: number;
  meetingUrl?: string;
  maxAttendees?: number;
}

export interface UpdateLiveSessionRequest {
  title?: string;
  description?: string;
  scheduledAt?: string;
  durationMinutes?: number;
  meetingUrl?: string;
  maxAttendees?: number;
}

export interface JoinLiveSessionResponse {
  meetingUrl: string;
  meetingId: string;
  token: string;
}
