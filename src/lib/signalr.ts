import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
  HttpTransportType,
} from '@microsoft/signalr';
import { env } from './env';

export function createNotificationHub(
  token?: string,
): HubConnection {
  const url = token
    ? `${env.VITE_SIGNALR_URL}/hubs/notifications?access_token=${token}`
    : `${env.VITE_SIGNALR_URL}/hubs/notifications`;

  return new HubConnectionBuilder()
    .withUrl(url, {
      transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling,
    })
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: (retryContext) => {
        const delays = [0, 2000, 5000, 10000, 30000];
        return delays[retryContext.previousRetryCount] ?? 30000;
      },
    })
    .configureLogging(LogLevel.Information)
    .build();
}

export function createMessagingHub(
  token?: string,
): HubConnection {
  const url = token
    ? `${env.VITE_SIGNALR_URL}/hubs/messaging?access_token=${token}`
    : `${env.VITE_SIGNALR_URL}/hubs/messaging`;

  return new HubConnectionBuilder()
    .withUrl(url, {
      transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling,
    })
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: (retryContext) => {
        const delays = [0, 2000, 5000, 10000, 30000];
        return delays[retryContext.previousRetryCount] ?? 30000;
      },
    })
    .configureLogging(LogLevel.Information)
    .build();
}
