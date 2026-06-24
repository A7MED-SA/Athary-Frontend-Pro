import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useNotifications } from './useNotifications';
import { notificationService } from '@/features/notifications/services/notification.service';

vi.mock('@/features/notifications/services/notification.service', () => ({
  notificationService: {
    getMyNotifications: vi.fn(),
    getUnreadCount: vi.fn(),
    getPreferences: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
    deleteNotification: vi.fn(),
    updatePreferences: vi.fn(),
  },
}));

const mockedNotificationService = vi.mocked(notificationService);

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial loading state', () => {
    mockedNotificationService.getMyNotifications.mockReturnValue(new Promise(() => {}));
    mockedNotificationService.getUnreadCount.mockReturnValue(new Promise(() => {}));
    mockedNotificationService.getPreferences.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useNotifications(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.notifications).toEqual([]);
    expect(result.current.unreadCount).toBe(0);
  });

  it('should fetch notifications and unread count', async () => {
    const mockNotifications = [{ id: '1', title: 'Test', isRead: false }];
    mockedNotificationService.getMyNotifications.mockResolvedValue({ success: true, data: { items: mockNotifications } } as any);
    mockedNotificationService.getUnreadCount.mockResolvedValue({ success: true, data: 5 } as any);
    mockedNotificationService.getPreferences.mockResolvedValue({ success: true, data: { emailEnabled: true } } as any);

    const { result } = renderHook(() => useNotifications(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.notifications).toEqual(mockNotifications);
    expect(result.current.unreadCount).toBe(5);
  });

  it('should call markAsRead mutation', async () => {
    mockedNotificationService.getMyNotifications.mockResolvedValue({ success: true, data: [] } as any);
    mockedNotificationService.getUnreadCount.mockResolvedValue({ success: true, data: 0 } as any);
    mockedNotificationService.getPreferences.mockResolvedValue({ success: true, data: {} } as any);
    mockedNotificationService.markAsRead.mockResolvedValue({ success: true, data: undefined } as any);

    const { result } = renderHook(() => useNotifications(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.markAsRead('notif-1');

    await waitFor(() => expect(mockedNotificationService.markAsRead).toHaveBeenCalledWith('notif-1'));
  });

  it('should call markAllAsRead mutation', async () => {
    mockedNotificationService.getMyNotifications.mockResolvedValue({ success: true, data: [] } as any);
    mockedNotificationService.getUnreadCount.mockResolvedValue({ success: true, data: 0 } as any);
    mockedNotificationService.getPreferences.mockResolvedValue({ success: true, data: {} } as any);
    mockedNotificationService.markAllAsRead.mockResolvedValue({ success: true, data: undefined } as any);

    const { result } = renderHook(() => useNotifications(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.markAllAsRead();

    await waitFor(() => expect(mockedNotificationService.markAllAsRead).toHaveBeenCalled());
  });

  it('should call deleteNotification mutation', async () => {
    mockedNotificationService.getMyNotifications.mockResolvedValue({ success: true, data: [] } as any);
    mockedNotificationService.getUnreadCount.mockResolvedValue({ success: true, data: 0 } as any);
    mockedNotificationService.getPreferences.mockResolvedValue({ success: true, data: {} } as any);
    mockedNotificationService.deleteNotification.mockResolvedValue({ success: true, data: undefined } as any);

    const { result } = renderHook(() => useNotifications(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.deleteNotification('notif-1');

    await waitFor(() => expect(mockedNotificationService.deleteNotification).toHaveBeenCalledWith('notif-1'));
  });

  it('should call updatePreferences mutation', async () => {
    mockedNotificationService.getMyNotifications.mockResolvedValue({ success: true, data: [] } as any);
    mockedNotificationService.getUnreadCount.mockResolvedValue({ success: true, data: 0 } as any);
    mockedNotificationService.getPreferences.mockResolvedValue({ success: true, data: {} } as any);
    mockedNotificationService.updatePreferences.mockResolvedValue({ success: true, data: {} } as any);

    const { result } = renderHook(() => useNotifications(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.updatePreferences({ emailEnabled: false } as any);

    await waitFor(() => expect(mockedNotificationService.updatePreferences).toHaveBeenCalledWith({ emailEnabled: false }));
  });
});
