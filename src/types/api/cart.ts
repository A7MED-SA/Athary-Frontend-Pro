export interface CartItemDto {
  courseId: string;
  courseTitle: string;
  courseImageUrl?: string;
  price: number;
  instructorName: string;
}

export interface CartResponseDto {
  id: string;
  items: CartItemDto[];
  subtotal: number;
  couponCode?: string;
  discountAmount: number;
  finalAmount: number;
}

export interface AddCartItemRequest {
  courseId: string;
}

export interface ApplyCouponRequest {
  code: string;
}

export interface ApplyCouponResponse {
  couponCode: string;
  discountAmount: number;
  finalAmount: number;
}
