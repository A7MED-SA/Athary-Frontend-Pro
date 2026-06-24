import axios, { type InternalAxiosRequestConfig, type AxiosError } from 'axios';
import { env } from './env';
import { tokenStorage } from './token-storage';

const api = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(undefined);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        tokenStorage.clearTokens();
        processQueue(error);
        if (window.location.pathname !== '/auth') {
          window.location.href = '/auth';
        }
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${env.VITE_API_BASE_URL}/auth/refresh`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } },
        );
        const newAccessToken = data?.data?.accessToken;
        const newRefreshToken = data?.data?.refreshToken;
        if (newAccessToken && newRefreshToken) {
          tokenStorage.setTokens(newAccessToken, newRefreshToken);
        }
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        tokenStorage.clearTokens();
        processQueue(refreshError);
        if (window.location.pathname !== '/auth') {
          window.location.href = '/auth';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const status = error.response?.status;
    const message =
      (error.response?.data as { message?: string })?.message || error.message;

    if (status) {
      console.error(`API Error [${status}]: ${message}`);
    }

    return Promise.reject(error);
  },
);

export default api;
