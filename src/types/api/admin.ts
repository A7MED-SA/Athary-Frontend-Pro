export interface AdminUserListItemDto {
  id: string;
  email: string;
  fullName: string;
  profilePictureUrl?: string | null;
  isActive: boolean;
  emailConfirmed: boolean;
  createdAt: string;
  lastLogin?: string | null;
  roles: string[];
}

export interface AdminContactMessageDto {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminCreateContactMessageDto {
  fullName: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
}

export interface AdminTestimonialDto {
  id: string;
  content: string;
  rating: number;
  userName: string;
  userAvatar?: string | null;
  displayOrder: number;
  createdAt: string;
}

export interface AdminCreateTestimonialDto {
  content: string;
  rating: number;
}

export interface AdminUpdateTestimonialDto {
  content?: string | null;
  rating?: number | null;
  isApproved?: boolean | null;
  displayOrder?: number | null;
}

export interface AdminReorderItemDto {
  id: string;
  order: number;
}
