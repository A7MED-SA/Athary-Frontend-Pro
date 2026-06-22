import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useMessages, useConversation } from './useMessages';
import { messageService } from '@/features/messaging/services/message.service';

vi.mock('@/features/messaging/services/message.service', () => ({
  messageService: {
    getConversations: vi.fn(),
    getRecentMessages: vi.fn(),
    send: vi.fn(),
    markAsRead: vi.fn(),
    getMessages: vi.fn(),
  },
}));

const mockedMessageService = vi.mocked(messageService);

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useMessages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial loading state', () => {
    mockedMessageService.getConversations.mockReturnValue(new Promise(() => {}));
    mockedMessageService.getRecentMessages.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useMessages(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.conversations).toBeUndefined();
  });

  it('should fetch conversations and recent messages', async () => {
    const mockConversations = [{ userId: 'u1', userName: 'John', lastMessage: 'Hi' }];
    const mockRecent = [{ id: '1', content: 'Hello', senderId: 'u1' }];
    mockedMessageService.getConversations.mockResolvedValue({ success: true, data: mockConversations } as any);
    mockedMessageService.getRecentMessages.mockResolvedValue({ success: true, data: mockRecent } as any);

    const { result } = renderHook(() => useMessages(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.conversations).toEqual(mockConversations);
    expect(result.current.recentMessages).toEqual(mockRecent);
  });

  it('should call send mutation and invalidate cache', async () => {
    mockedMessageService.getConversations.mockResolvedValue({ success: true, data: [] } as any);
    mockedMessageService.getRecentMessages.mockResolvedValue({ success: true, data: [] } as any);
    mockedMessageService.send.mockResolvedValue({ success: true, data: {} } as any);

    const { result } = renderHook(() => useMessages(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.send({ receiverId: 'u1', content: 'Hello' });

    await waitFor(() => expect(mockedMessageService.send).toHaveBeenCalledWith({ receiverId: 'u1', content: 'Hello' }));
  });

  it('should call markAsRead mutation', async () => {
    mockedMessageService.getConversations.mockResolvedValue({ success: true, data: [] } as any);
    mockedMessageService.getRecentMessages.mockResolvedValue({ success: true, data: [] } as any);
    mockedMessageService.markAsRead.mockResolvedValue({ success: true, data: undefined } as any);

    const { result } = renderHook(() => useMessages(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.markAsRead('user-1');

    await waitFor(() => expect(mockedMessageService.markAsRead).toHaveBeenCalledWith('user-1'));
  });
});

describe('useConversation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch messages when userId is provided', async () => {
    const mockMessages = [{ id: '1', content: 'Hello', senderId: 'u1' }];
    mockedMessageService.getMessages.mockResolvedValue({ success: true, data: mockMessages } as any);

    const { result } = renderHook(() => useConversation('user-1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.messages).toEqual(mockMessages);
  });

  it('should not fetch when userId is empty', () => {
    const { result } = renderHook(() => useConversation(''), { wrapper: createWrapper() });

    expect(mockedMessageService.getMessages).not.toHaveBeenCalled();
  });
});
