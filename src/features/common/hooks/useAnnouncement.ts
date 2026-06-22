import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { announcementService } from '@/features/announcements/services/announcement.service';
import { queryKeys } from '@/lib/query-keys';
import type { CreateAnnouncementRequest, UpdateAnnouncementRequest } from '@/types/api/announcement';

export function useAnnouncement() {
  const queryClient = useQueryClient();

  const myAnnouncementsQuery = useQuery({
    queryKey: queryKeys.announcements.myAnnouncements(),
    queryFn: () => announcementService.getMyAnnouncements(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateAnnouncementRequest) => announcementService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAnnouncementRequest }) =>
      announcementService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => announcementService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all });
    },
  });

  return {
    myAnnouncements: myAnnouncementsQuery.data?.data,
    isLoading: myAnnouncementsQuery.isLoading,
    create: createMutation.mutate,
    isCreatePending: createMutation.isPending,
    update: updateMutation.mutate,
    deleteAnnouncement: deleteMutation.mutate,
  };
}
