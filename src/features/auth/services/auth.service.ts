import api from '@/lib/api';
import type { ApiResponse } from '@/types/api/envelope';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  OAuthLoginRequest,
  SessionDto,
  ResendConfirmationRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  SendTwoFactorCodeRequest,
  LoginTwoFactorRequest,
  Enable2faResponse,
  Disable2faRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
} from '@/types/api/auth';

export const authService = {
  login: (data: LoginRequest) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', data).then((r) => r.data),

  register: (data: RegisterRequest) =>
    api
      .post<ApiResponse<{ userId: string; token: string; refreshToken: string; expiration: string }>>(
        '/auth/register',
        data,
      )
      .then((r) => r.data),

  logout: () =>
    api.post<ApiResponse>('/auth/logout').then((r) => r.data),

  refreshToken: () =>
    api.post<ApiResponse<{ accessToken: string; refreshToken: string; expiresAt: string }>>('/auth/refresh').then((r) => r.data),

  loginWithOAuth: (data: OAuthLoginRequest) =>
    api.post<ApiResponse<AuthResponse>>('/auth/loginWithOAuth', data).then((r) => r.data),

  confirmEmail: (userId: string, token: string) =>
    api
      .get<ApiResponse>('/auth/confirm-email', { params: { userId, token } })
      .then((r) => r.data),

  resendConfirmation: (data: ResendConfirmationRequest) =>
    api.post<ApiResponse>('/auth/resend-confirmation-email', data).then((r) => r.data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    api.post<ApiResponse>('/auth/forgot-password', data).then((r) => r.data),

  resetPassword: (data: ResetPasswordRequest) =>
    api.post<ApiResponse>('/auth/reset-password', data).then((r) => r.data),

  changePassword: (data: ChangePasswordRequest) =>
    api.post<ApiResponse>('/auth/change-password', data).then((r) => r.data),

  send2FA: (data: SendTwoFactorCodeRequest) =>
    api.post<ApiResponse>('/auth/send-2fa', data).then((r) => r.data),

  loginWith2FA: (data: LoginTwoFactorRequest) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login-2fa', data).then((r) => r.data),

  enable2FA: () =>
    api.post<ApiResponse<Enable2faResponse>>('/auth/enable-2fa').then((r) => r.data),

  disable2FA: (data: Disable2faRequest) =>
    api.post<ApiResponse>('/auth/disable-2fa', data).then((r) => r.data),

  getActiveSessions: () =>
    api.get<ApiResponse<SessionDto[]>>('/auth/sessions').then((r) => r.data),

  revokeSession: (id: string) =>
    api.delete<ApiResponse>(`/auth/sessions/${id}`).then((r) => r.data),

  revokeAllSessions: () =>
    api.delete<ApiResponse>('/auth/revoke-all-sessions').then((r) => r.data),

  verifyEmail: (data: VerifyEmailRequest) =>
    api.post<ApiResponse>('/auth/verify-email', data).then((r) => r.data),

  resendVerification: (data: ResendVerificationRequest) =>
    api.post<ApiResponse>('/auth/resend-verification', data).then((r) => r.data),
};
