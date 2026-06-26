import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/features/auth/services/auth.service';
import { queryKeys } from '@/lib/query-keys';
import { tokenStorage } from '@/lib/token-storage';
import type { LoginRequest, RegisterRequest, ChangePasswordRequest } from '@/types/api/auth';

export function useAuth() {
  const queryClient = useQueryClient();

  const sessionsQuery = useQuery({
    queryKey: queryKeys.auth.sessions(),
    queryFn: () => authService.getActiveSessions(),
    enabled: !!tokenStorage.getAccessToken(),
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
      window.location.href = '/auth';
    },
  });

  const loginWithGoogleMutation = useMutation({
    mutationFn: (idToken: string) => authService.loginWithGoogle(idToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });

  const loginWithMicrosoftMutation = useMutation({
    mutationFn: (idToken: string) => authService.loginWithMicrosoft(idToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });

  const revokeSessionMutation = useMutation({
    mutationFn: (id: string) => authService.revokeSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.sessions() });
    },
  });

  const revokeAllSessionsMutation = useMutation({
    mutationFn: () => authService.revokeAllSessions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.sessions() });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordRequest) => authService.changePassword(data),
  });

  return {
    sessions: sessionsQuery.data?.data,
    isSessionsLoading: sessionsQuery.isLoading,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoginPending: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutate,
    isRegisterPending: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: logoutMutation.mutate,
    isLogoutPending: logoutMutation.isPending,
    loginWithGoogle: loginWithGoogleMutation.mutate,
    loginWithGoogleAsync: loginWithGoogleMutation.mutateAsync,
    loginWithMicrosoft: loginWithMicrosoftMutation.mutate,
    loginWithMicrosoftAsync: loginWithMicrosoftMutation.mutateAsync,
    isOAuthPending: loginWithGoogleMutation.isPending || loginWithMicrosoftMutation.isPending,
    revokeSession: revokeSessionMutation.mutate,
    revokeAllSessions: revokeAllSessionsMutation.mutate,
    changePassword: changePasswordMutation.mutate,
  };
}
