import type { UserInfoDto } from '@/types/api/auth';

const ACCESS_TOKEN_KEY = 'athary_access_token';
const REFRESH_TOKEN_KEY = 'athary_refresh_token';
const USER_INFO_KEY = 'athary_user_info';

export const tokenStorage = {
  getAccessToken: (): string | null => sessionStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: (): string | null => sessionStorage.getItem(REFRESH_TOKEN_KEY),

  getUserInfo: (): UserInfoDto | null => {
    const raw = sessionStorage.getItem(USER_INFO_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserInfoDto;
    } catch {
      return null;
    }
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  setUserInfo: (user: UserInfoDto): void => {
    sessionStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
  },

  clearTokens: (): void => {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(USER_INFO_KEY);
  },
};
