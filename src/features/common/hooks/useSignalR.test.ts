import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSignalR } from './useSignalR';
import { createNotificationHub, createMessagingHub } from '@/lib/signalr';
import type { HubConnection } from '@microsoft/signalr';

vi.mock('@/lib/signalr', () => ({
  createNotificationHub: vi.fn(),
  createMessagingHub: vi.fn(),
}));

function createMockConnection(): HubConnection {
  return {
    on: vi.fn(),
    off: vi.fn(),
    start: vi.fn().mockResolvedValue(undefined),
    stop: vi.fn().mockResolvedValue(undefined),
    onreconnecting: vi.fn(),
    onreconnected: vi.fn(),
    onclose: vi.fn(),
    state: 1,
    connectionId: 'test-id',
    invoke: vi.fn(),
    send: vi.fn(),
    stream: vi.fn(),
  } as unknown as HubConnection;
}

describe('useSignalR', () => {
  let mockNotifConn: HubConnection;
  let mockMsgConn: HubConnection;

  beforeEach(() => {
    vi.clearAllMocks();
    mockNotifConn = createMockConnection();
    mockMsgConn = createMockConnection();
    vi.mocked(createNotificationHub).mockReturnValue(mockNotifConn);
    vi.mocked(createMessagingHub).mockReturnValue(mockMsgConn);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return initial disconnected state', () => {
    const { result } = renderHook(() => useSignalR({}));

    expect(result.current.isConnected).toBe(false);
    expect(result.current.notificationConnection).toBeNull();
    expect(result.current.messagingConnection).toBeNull();
  });

  it('should not connect without token', () => {
    renderHook(() => useSignalR({}));

    expect(createNotificationHub).not.toHaveBeenCalled();
    expect(createMessagingHub).not.toHaveBeenCalled();
  });

  it('should connect when token is provided', async () => {
    const { result } = renderHook(() => useSignalR({ token: 'test-token' }));

    await act(async () => {
      await result.current.start();
    });

    expect(createNotificationHub).toHaveBeenCalledWith('test-token');
    expect(createMessagingHub).toHaveBeenCalledWith('test-token');
    expect(mockNotifConn.start).toHaveBeenCalled();
    expect(mockMsgConn.start).toHaveBeenCalled();
  });

  it('should register event listeners', async () => {
    const onNotification = vi.fn();
    const { result } = renderHook(() =>
      useSignalR({ token: 'test-token', onNotification })
    );

    await act(async () => {
      await result.current.start();
    });

    expect(mockNotifConn.on).toHaveBeenCalledWith('ReceiveNotification', onNotification);
  });

  it('should stop connections on cleanup', async () => {
    const { result, unmount } = renderHook(() => useSignalR({ token: 'test-token' }));

    await act(async () => {
      await result.current.start();
    });

    unmount();

    expect(mockNotifConn.stop).toHaveBeenCalled();
    expect(mockMsgConn.stop).toHaveBeenCalled();
  });
});
