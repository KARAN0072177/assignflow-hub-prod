export interface SubscribeNewsletterPayload {
  email: string;
  source?: string;
}

export interface SubscribeResponse {
  subscribed?: boolean;
  resubscribed?: boolean;
  alreadySubscribed?: boolean;
  message?: string;
}

export interface UnsubscribeResponse {
  unsubscribed?: boolean;
  alreadyUnsubscribed?: boolean;
  notFound?: boolean;
  message?: string;
}