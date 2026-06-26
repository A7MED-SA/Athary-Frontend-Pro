import api from '@/lib/api';
import type { ApiResponse } from '@/types/api/envelope';
import type {
  NotificationDto,
  NotificationListDto,
  NotificationPreferencesDto,
  UpdateNotificationPreferencesRequest,
} from '@/types/api/notification';

export const notificationService = {
  getMyNotifications: () =>
    api
      .get<ApiResponse<NotificationListDto>>('/notifications')
      .then((r) => r.data),

  getNotifications: (params?: Record<string, unknown>) =>
    api
      .get<ApiResponse<NotificationListDto>>('/notifications', { params })
      .then((r) => r.data),

  getUnreadCount: () =>
    api
      .get<ApiResponse<number>>('/notifications/unread-count')
      .then((r) => r.data),

  markAsRead: (id: string) =>
    api.patch<ApiResponse>(`/notifications/${id}/read`).then((r) => r.data),

  markAllAsRead: () =>
    api.post<ApiResponse>('/notifications/mark-all-read').then((r) => r.data),

  deleteNotification: (id: string) =>
    api.delete<ApiResponse>(`/notifications/${id}`).then((r) => r.data),

  getPreferences: () =>
    api
      .get<ApiResponse<NotificationPreferencesDto>>('/notifications/preferences')
      .then((r) => r.data),

  updatePreferences: (data: UpdateNotificationPreferencesRequest) =>
    api
      .put<ApiResponse<NotificationPreferencesDto>>('/notifications/preferences', data)
      .then((r) => r.data),

  checkCompletion: (enrollmentId: string) =>
    api
      .get<ApiResponse>(`/notifications/check-completion/${enrollmentId}`)
      .then((r) => r.data),
};
