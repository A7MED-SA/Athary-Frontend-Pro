export interface MessageResponse {
  id: string;
  senderId: string;
  senderName: string;
  senderProfileImageUrl?: string;
  receiverId: string;
  receiverName: string;
  content: string;
  isRead: boolean;
  sentAt: string;
  readAt?: string;
}

export interface ConversationResponse {
  userId: string;
  userName: string;
  userProfileImageUrl?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface ConversationListResponse {
  conversations: ConversationResponse[];
}

export interface SendMessageRequest {
  receiverId: string;
  content: string;
}
