export interface PaymentMethodResponse {
  id: string;
  name: string;
  type: string;
  isEnabled: boolean;
}

export interface PaymentResponseDto {
  id: string;
  orderId: string;
  amount: number;
  method: string;
  status: string;
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
}

export interface CreatePaymentIntentRequest {
  orderId: string;
  paymentMethodId: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}
