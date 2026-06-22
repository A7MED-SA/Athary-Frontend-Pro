import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { liveSessionService } from '@/features/liveSessions/services/liveSession.service';
import { queryKeys } from '@/lib/query-keys';
import type { CreateLiveSessionRequest, UpdateLiveSessionRequest } from '@/types/api/liveSession';

export function useLiveSession() {
  const queryClient = useQueryClient();

  const scheduledQuery = useQuery({
    queryKey: queryKeys.liveSessions.scheduled(),
    queryFn: () => liveSessionService.getScheduledSessions(),
  });

  const enrolledUpcomingQuery = useQuery({
    queryKey: queryKeys.liveSessions.enrolledUpcoming(),
    queryFn: () => liveSessionService.getEnrolledUpcoming(),
  });

  const upcomingStudentQuery = useQuery({
    queryKey: queryKeys.liveSessions.upcomingStudent(),
    queryFn: () => liveSessionService.getUpcomingStudent(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateLiveSessionRequest) => liveSessionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.liveSessions.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLiveSessionRequest }) =>
      liveSessionService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.liveSessions.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => liveSessionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.liveSessions.all });
    },
  });

  const joinMutation = useMutation({
    mutationFn: (id: string) => liveSessionService.join(id),
  });

  return {
    scheduled: scheduledQuery.data?.data,
    enrolledUpcoming: enrolledUpcomingQuery.data?.data,
    upcomingStudent: upcomingStudentQuery.data?.data,
    isLoading: scheduledQuery.isLoading,
    create: createMutation.mutate,
    isCreatePending: createMutation.isPending,
    update: updateMutation.mutate,
    deleteSession: deleteMutation.mutate,
    join: joinMutation.mutate,
    joinAsync: joinMutation.mutateAsync,
  };
}
