import { describe, it, expect, vi, beforeEach } from 'vitest';
import { messageService } from './message.service';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api);

describe('messageService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getConversations', () => {
    it('should fetch conversations', async () => {
      mockedApi.get.mockResolvedValue({
        data: {
          success: true,
          data: [{ userId: 'u1', userName: 'User 1', lastMessage: 'Hello', lastMessageAt: '2026-01-01', unreadCount: 0 }],
        },
      });

      const result = await messageService.getConversations();

      expect(mockedApi.get).toHaveBeenCalledWith('/messages/conversations');
      expect(result.data).toHaveLength(1);
    });
  });

  describe('send', () => {
    it('should send a message', async () => {
      mockedApi.post.mockResolvedValue({
        data: {
          success: true,
          data: { id: 'm1', senderId: 's1', receiverId: 'r1', content: 'Hello', isRead: false, sentAt: '2026-01-01' },
        },
      });

      const result = await messageService.send({ receiverId: 'r1', content: 'Hello' });

      expect(mockedApi.post).toHaveBeenCalledWith('/messages/send', { receiverId: 'r1', content: 'Hello' });
      expect(result.data.content).toBe('Hello');
    });
  });
});
