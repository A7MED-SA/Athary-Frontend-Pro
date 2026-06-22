export interface AnnouncementResponse {
  id: string;
  title: string;
  content: string;
  type: string;
  instructorId?: string;
  instructorName?: string;
  courseId?: string;
  courseName?: string;
  targetRoles: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AnnouncementListResponse {
  announcements: AnnouncementResponse[];
  totalCount: number;
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  type: string;
  courseId?: string;
  targetRoles: string[];
  isPinned?: boolean;
}

export interface UpdateAnnouncementRequest {
  title?: string;
  content?: string;
  type?: string;
  courseId?: string;
  targetRoles?: string[];
  isPinned?: boolean;
}
