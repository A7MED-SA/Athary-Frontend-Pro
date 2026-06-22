import api from '@/lib/api';
import type { ApiResponse } from '@/types/api/envelope';
import type {
  MessageResponse,
  ConversationResponse,
  SendMessageRequest,
} from '@/types/api/message';

export const messageService = {
  getConversations: () =>
    api
      .get<ApiResponse<ConversationResponse[]>>('/messages/conversations')
      .then((r) => r.data),

  getConversationWithUser: (userId: string) =>
    api
      .get<ApiResponse<ConversationResponse>>(`/messages/conversations/${userId}`)
      .then((r) => r.data),

  getMessages: (userId: string) =>
    api
      .get<ApiResponse<MessageResponse[]>>(`/messages/${userId}`)
      .then((r) => r.data),

  getRecentMessages: () =>
    api
      .get<ApiResponse<MessageResponse[]>>('/messages/recent-messages')
      .then((r) => r.data),

  send: (data: SendMessageRequest) =>
    api
      .post<ApiResponse<MessageResponse>>('/messages/send', data)
      .then((r) => r.data),

  markAsRead: (userId: string) =>
    api.put<ApiResponse>(`/messages/read/${userId}`).then((r) => r.data),

  deleteMessage: (id: string) =>
    api.delete<ApiResponse>(`/messages/${id}`).then((r) => r.data),
};
