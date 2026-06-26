export interface NotificationDto {
  id: string;
  title: string;
  message?: string;
  type: string;
  linkUrl?: string;
  icon?: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string | null;
}

export interface NotificationListDto {
  notifications: NotificationDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface NotificationPreferencesDto {
  emailNotifications: boolean;
  pushNotifications: boolean;
  courseUpdates: boolean;
  marketingEmails: boolean;
  newMessageAlerts: boolean;
  liveSessionReminders: boolean;
  quizReminders: boolean;
  certificateAchievements: boolean;
  announcementAlerts: boolean;
}

export interface UpdateNotificationPreferencesRequest {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  courseUpdates?: boolean;
  marketingEmails?: boolean;
  newMessageAlerts?: boolean;
  liveSessionReminders?: boolean;
  quizReminders?: boolean;
  certificateAchievements?: boolean;
  announcementAlerts?: boolean;
}
