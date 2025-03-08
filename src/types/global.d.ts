interface SubscriptionInfo {
  isSubscribed: boolean;
  subscription: any;
  trialEnd: string | null;
  daysRemaining: number;
  isTrialing: boolean;
}

declare global {
  interface Window {
    subscriptionInfo: SubscriptionInfo;
  }
}

export {}; 