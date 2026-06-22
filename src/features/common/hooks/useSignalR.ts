import { useEffect, useRef, useState, useCallback } from 'react';
import type { HubConnection } from '@microsoft/signalr';
import { createNotificationHub, createMessagingHub } from '@/lib/signalr';

interface UseSignalROptions {
  token?: string;
  onNotification?: (notification: unknown) => void;
  onMessage?: (message: unknown) => void;
}

interface UseSignalRReturn {
  notificationConnection: HubConnection | null;
  messagingConnection: HubConnection | null;
  isConnected: boolean;
  start: () => Promise<void>;
  stop: () => Promise<void>;
}

export function useSignalR({
  token,
  onNotification,
  onMessage,
}: UseSignalROptions): UseSignalRReturn {
  const notificationConnRef = useRef<HubConnection | null>(null);
  const messagingConnRef = useRef<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const onNotificationRef = useRef(onNotification);
  const onMessageRef = useRef(onMessage);

  onNotificationRef.current = onNotification;
  onMessageRef.current = onMessage;

  const start = useCallback(async () => {
    if (!token) return;

    try {
      const notifConn = createNotificationHub(token);
      const msgConn = createMessagingHub(token);

      notifConn.onreconnecting(() => setIsConnected(false));
      notifConn.onreconnected(() => setIsConnected(true));
      notifConn.onclose(() => setIsConnected(false));

      if (onNotificationRef.current) {
        notifConn.on('ReceiveNotification', onNotificationRef.current);
      }

      if (onMessageRef.current) {
        msgConn.on('ReceiveMessage', onMessageRef.current);
      }

      await Promise.all([notifConn.start(), msgConn.start()]);

      notificationConnRef.current = notifConn;
      messagingConnRef.current = msgConn;
      setIsConnected(true);
    } catch (error) {
      console.error('SignalR connection error:', error);
      setIsConnected(false);
    }
  }, [token]);

  const stop = useCallback(async () => {
    try {
      await Promise.all([
        notificationConnRef.current?.stop(),
        messagingConnRef.current?.stop(),
      ]);
    } catch (error) {
      console.error('SignalR stop error:', error);
    } finally {
      notificationConnRef.current = null;
      messagingConnRef.current = null;
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      start();
    }

    return () => {
      stop();
    };
  }, [token, start, stop]);

  return {
    notificationConnection: notificationConnRef.current,
    messagingConnection: messagingConnRef.current,
    isConnected,
    start,
    stop,
  };
}
