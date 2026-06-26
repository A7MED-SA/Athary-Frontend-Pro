import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/features/notifications/services/notification.service';
import { queryKeys } from '@/lib/query-keys';
import type { UpdateNotificationPreferencesRequest } from '@/types/api/notification';

export function useNotifications() {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: queryKeys.notifications.myNotifications(),
    queryFn: () => notificationService.getMyNotifications(),
  });

  const unreadCountQuery = useQuery({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: () => notificationService.getUnreadCount(),
  });

  const preferencesQuery = useQuery({
    queryKey: queryKeys.notifications.preferences(),
    queryFn: () => notificationService.getPreferences(),
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: (data: UpdateNotificationPreferencesRequest) =>
      notificationService.updatePreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.preferences() });
    },
  });

  return {
    notifications: notificationsQuery.data?.data?.notifications ?? [],
    unreadCount: unreadCountQuery.data?.data ?? 0,
    preferences: preferencesQuery.data?.data,
    isLoading: notificationsQuery.isLoading,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteMutation.mutate,
    updatePreferences: updatePreferencesMutation.mutate,
  };
}
