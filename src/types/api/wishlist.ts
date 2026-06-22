export interface WishlistItemDto {
  courseId: string;
  courseTitle: string;
  courseImageUrl?: string;
  price: number;
  instructorName: string;
  averageRating: number;
  enrollmentCount: number;
  addedAt: string;
}

export interface WishlistResponseDto {
  items: WishlistItemDto[];
  totalCount: number;
}
