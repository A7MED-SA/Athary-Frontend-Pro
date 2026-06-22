import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { messageService } from '@/features/messaging/services/message.service';
import { queryKeys } from '@/lib/query-keys';

export function useMessages() {
  const queryClient = useQueryClient();

  const conversationsQuery = useQuery({
    queryKey: queryKeys.messages.conversations(),
    queryFn: () => messageService.getConversations(),
  });

  const recentQuery = useQuery({
    queryKey: queryKeys.messages.recent(),
    queryFn: () => messageService.getRecentMessages(),
  });

  const sendMutation = useMutation({
    mutationFn: (data: { receiverId: string; content: string }) =>
      messageService.send(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.conversations() });
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.recent() });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (userId: string) => messageService.markAsRead(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.conversations() });
    },
  });

  return {
    conversations: conversationsQuery.data?.data,
    recentMessages: recentQuery.data?.data,
    isLoading: conversationsQuery.isLoading,
    send: sendMutation.mutate,
    isSendPending: sendMutation.isPending,
    markAsRead: markAsReadMutation.mutate,
  };
}

export function useConversation(userId: string) {
  const query = useQuery({
    queryKey: queryKeys.messages.messages(userId),
    queryFn: () => messageService.getMessages(userId),
    enabled: !!userId,
  });

  return {
    messages: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}
