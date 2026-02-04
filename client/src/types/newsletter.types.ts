export interface SubscribeNewsletterPayload {
  email: string;
  source?: string;
}

export interface SubscribeResponse {
  subscribed?: boolean;
  resubscribed?: boolean;
  alreadySubscribed?: boolean;
}