export {};

declare global {
  interface NotificationOptions {
    showTrigger?: any;
  }

  interface Window {
    TimestampTrigger?: new (timestamp: number) => any;
  }

  interface GetNotificationOptions {
    includeTriggered?: boolean;
  }
}



