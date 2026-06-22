export interface OrderItemDto {
  courseId: string;
  courseTitle: string;
  courseImageUrl?: string;
  price: number;
}

export interface OrderResponseDto {
  id: string;
  orderNumber: string;
  subtotal: number;
  discountAmount: number;
  finalAmount: number;
  status: string;
  couponCode?: string;
  itemCount: number;
  createdAt: string;
}

export interface OrderDetailDto extends OrderResponseDto {
  items: OrderItemDto[];
  paymentStatus?: string;
  paymentMethod?: string;
}

export interface CheckoutRequest {
  paymentMethodId: string;
  couponCode?: string;
}
