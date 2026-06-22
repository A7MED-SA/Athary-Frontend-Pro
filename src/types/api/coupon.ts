export interface CouponResponseDto {
  id: string;
  code: string;
  description?: string;
  discountType: string;
  discountValue: number;
  maxUses?: number;
  currentUses: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

export interface ValidateCouponResponse {
  isValid: boolean;
  code: string;
  discountType: string;
  discountValue: number;
  discountAmount: number;
  message: string;
}
