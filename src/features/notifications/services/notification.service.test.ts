import { describe, it, expect, vi, beforeEach } from 'vitest';
import { notificationService } from './notification.service';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api);

describe('notificationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMyNotifications', () => {
    it('should fetch notifications', async () => {
      mockedApi.get.mockResolvedValue({
        data: { success: true, data: [{ id: '1', title: 'Test', message: 'Hello', type: 'info', isRead: false, createdAt: '2026-01-01' }] },
      });

      const result = await notificationService.getMyNotifications();

      expect(mockedApi.get).toHaveBeenCalledWith('/notifications/my-notifications');
      expect(result.data).toHaveLength(1);
    });
  });

  describe('getUnreadCount', () => {
    it('should fetch unread count', async () => {
      mockedApi.get.mockResolvedValue({
        data: { success: true, data: 5 },
      });

      const result = await notificationService.getUnreadCount();

      expect(mockedApi.get).toHaveBeenCalledWith('/notifications/unread-count');
      expect(result.data).toBe(5);
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      mockedApi.put.mockResolvedValue({
        data: { success: true, data: undefined },
      });

      await notificationService.markAsRead('1');

      expect(mockedApi.put).toHaveBeenCalledWith('/notifications/1/read');
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      mockedApi.put.mockResolvedValue({
        data: { success: true, data: undefined },
      });

      await notificationService.markAllAsRead();

      expect(mockedApi.put).toHaveBeenCalledWith('/notifications/mark-all-read');
    });
  });
});
