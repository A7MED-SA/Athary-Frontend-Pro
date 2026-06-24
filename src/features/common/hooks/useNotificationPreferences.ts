import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/features/notifications/services/notification.service';
import { queryKeys } from '@/lib/query-keys';
import type { UpdateNotificationPreferencesRequest } from '@/types/api/notification';

export function useNotificationPreferences() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.notifications.preferences(),
    queryFn: () => notificationService.getPreferences(),
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateNotificationPreferencesRequest) =>
      notificationService.updatePreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.preferences() });
    },
  });

  return {
    preferences: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
    updatePreferences: updateMutation.mutate,
    isUpdatePending: updateMutation.isPending,
  };
}
