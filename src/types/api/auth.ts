export type Gender = 'Male' | 'Female' | 'Other' | 'PreferNotToSay';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender?: Gender;
  dateOfBirth?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  streetLine1?: string;
  postalCode?: string;
}

export interface UserInfoDto {
  id: string;
  email: string;
  fullName: string;
  profilePictureUrl?: string;
  isActive: boolean;
  emailConfirmed: boolean;
  roles: string[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  sessionId: string;
  expiresAt: string;
  user: UserInfoDto;
}

export interface OAuthLoginRequest {
  idToken: string;
  provider: 'google' | 'microsoft';
}

export interface SessionDto {
  id: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

export interface ResendConfirmationRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface SendTwoFactorCodeRequest {
  email: string;
}

export interface LoginTwoFactorRequest {
  email: string;
  code: string;
  rememberMe?: boolean;
}

export interface Enable2faResponse {
  sharedKey: string;
  authenticatorUri: string;
}

export interface Disable2faRequest {
  code: string;
}
