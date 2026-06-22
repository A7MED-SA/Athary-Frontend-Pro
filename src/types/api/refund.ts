export type RefundStatus = 'Pending' | 'Approved' | 'Rejected' | 'Completed';

export interface RefundResponseDto {
  id: string;
  orderId: string;
  orderNumber: string;
  courseId: string;
  courseName: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  processedAt?: string;
  processedBy?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface RequestRefundRequest {
  orderId: string;
  courseId: string;
  reason: string;
}
