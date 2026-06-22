export interface NotificationDto {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface NotificationListDto {
  notifications: NotificationDto[];
  unreadCount: number;
}

export interface NotificationPreferencesDto {
  emailNotifications: boolean;
  pushNotifications: boolean;
  courseUpdates: boolean;
  announcements: boolean;
  messages: boolean;
  reviews: boolean;
}

export interface UpdateNotificationPreferencesRequest {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  courseUpdates?: boolean;
  announcements?: boolean;
  messages?: boolean;
  reviews?: boolean;
}
