import api from '@/lib/api';
import type { ApiResponse, PagedList } from '@/types/api/envelope';
import type {
  AnnouncementResponse,
  AnnouncementListResponse,
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
} from '@/types/api/announcement';

export const announcementService = {
  getMyAnnouncements: () =>
    api
      .get<ApiResponse<AnnouncementListResponse>>('/announcements/my-announcements')
      .then((r) => r.data),

  getAnnouncements: (params?: Record<string, unknown>) =>
    api
      .get<ApiResponse<PagedList<AnnouncementResponse>>>('/announcements', { params })
      .then((r) => r.data),

  getByUser: (userId: string) =>
    api
      .get<ApiResponse<AnnouncementResponse[]>>(`/announcements/user/${userId}`)
      .then((r) => r.data),

  getCourseAnnouncements: (courseId: string) =>
    api
      .get<ApiResponse<AnnouncementResponse[]>>(`/announcements/course/${courseId}`)
      .then((r) => r.data),

  getById: (id: string) =>
    api
      .get<ApiResponse<AnnouncementResponse>>(`/announcements/${id}`)
      .then((r) => r.data),

  create: (data: CreateAnnouncementRequest) =>
    api
      .post<ApiResponse<AnnouncementResponse>>('/announcements', data)
      .then((r) => r.data),

  update: (id: string, data: UpdateAnnouncementRequest) =>
    api
      .put<ApiResponse<AnnouncementResponse>>(`/announcements/${id}`, data)
      .then((r) => r.data),

  delete: (id: string) =>
    api.delete<ApiResponse>(`/announcements/${id}`).then((r) => r.data),
};
