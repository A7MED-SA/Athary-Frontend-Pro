import api from '@/lib/api';
import type { ApiResponse } from '@/types/api/envelope';
import type {
  LiveSessionResponseDto,
  CreateLiveSessionRequest,
  UpdateLiveSessionRequest,
  JoinLiveSessionResponse,
} from '@/types/api/liveSession';

export const liveSessionService = {
  getScheduledSessions: () =>
    api
      .get<ApiResponse<LiveSessionResponseDto[]>>('/livesessions/scheduled')
      .then((r) => r.data),

  getEnrolledUpcoming: () =>
    api
      .get<ApiResponse<LiveSessionResponseDto[]>>('/livesessions/enrolled-upcoming')
      .then((r) => r.data),

  getSessionsForCourse: (courseId: string) =>
    api
      .get<ApiResponse<LiveSessionResponseDto[]>>(`/livesessions/course/${courseId}`)
      .then((r) => r.data),

  getById: (id: string) =>
    api
      .get<ApiResponse<LiveSessionResponseDto>>(`/livesessions/${id}`)
      .then((r) => r.data),

  create: (data: CreateLiveSessionRequest) =>
    api
      .post<ApiResponse<LiveSessionResponseDto>>('/livesessions', data)
      .then((r) => r.data),

  update: (id: string, data: UpdateLiveSessionRequest) =>
    api
      .put<ApiResponse<LiveSessionResponseDto>>(`/livesessions/${id}`, data)
      .then((r) => r.data),

  delete: (id: string) =>
    api.delete<ApiResponse>(`/livesessions/${id}`).then((r) => r.data),

  cancel: (id: string) =>
    api
      .post<ApiResponse<LiveSessionResponseDto>>(`/livesessions/${id}/cancel`)
      .then((r) => r.data),

  start: (id: string) =>
    api
      .post<ApiResponse<LiveSessionResponseDto>>(`/livesessions/${id}/start`)
      .then((r) => r.data),

  end: (id: string) =>
    api
      .post<ApiResponse<LiveSessionResponseDto>>(`/livesessions/${id}/end`)
      .then((r) => r.data),

  join: (id: string) =>
    api
      .post<ApiResponse<JoinLiveSessionResponse>>(`/livesessions/${id}/join`)
      .then((r) => r.data),

  getUpcomingStudent: () =>
    api
      .get<ApiResponse<LiveSessionResponseDto[]>>('/livesessions/student/upcoming')
      .then((r) => r.data),
};
