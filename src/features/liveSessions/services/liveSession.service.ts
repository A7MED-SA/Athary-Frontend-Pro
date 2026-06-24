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
      .get<ApiResponse<LiveSessionResponseDto[]>>('/live-sessions/scheduled')
      .then((r) => r.data),

  getEnrolledUpcoming: () =>
    api
      .get<ApiResponse<LiveSessionResponseDto[]>>('/live-sessions/enrolled-upcoming')
      .then((r) => r.data),

  getSessionsForCourse: (courseId: string) =>
    api
      .get<ApiResponse<LiveSessionResponseDto[]>>(`/courses/${courseId}/live-sessions`)
      .then((r) => r.data),

  getById: (id: string) =>
    api
      .get<ApiResponse<LiveSessionResponseDto>>(`/live-sessions/${id}`)
      .then((r) => r.data),

  create: (data: CreateLiveSessionRequest) =>
    api
      .post<ApiResponse<LiveSessionResponseDto>>(`/courses/${data.courseId}/live-sessions`, data)
      .then((r) => r.data),

  update: (id: string, data: UpdateLiveSessionRequest) =>
    api
      .put<ApiResponse<LiveSessionResponseDto>>(`/live-sessions/${id}`, data)
      .then((r) => r.data),

  delete: (id: string) =>
    api.delete<ApiResponse>(`/live-sessions/${id}`).then((r) => r.data),

  cancel: (id: string) =>
    api
      .post<ApiResponse<LiveSessionResponseDto>>(`/live-sessions/${id}/cancel`)
      .then((r) => r.data),

  start: (id: string) =>
    api
      .post<ApiResponse<LiveSessionResponseDto>>(`/live-sessions/${id}/start`)
      .then((r) => r.data),

  end: (id: string) =>
    api
      .post<ApiResponse<LiveSessionResponseDto>>(`/live-sessions/${id}/end`)
      .then((r) => r.data),

  join: (id: string) =>
    api
      .post<ApiResponse<JoinLiveSessionResponse>>(`/live-sessions/${id}/attendance/join`)
      .then((r) => r.data),

  getUpcomingStudent: () =>
    api
      .get<ApiResponse<LiveSessionResponseDto[]>>('/live-sessions/student/upcoming')
      .then((r) => r.data),
};
