import { apiClient } from "./apiClient";
import type {
  SubscribeNewsletterPayload,
  SubscribeResponse,
} from "../types/newsletter.types";

export const subscribeNewsletter = async (
  payload: SubscribeNewsletterPayload
): Promise<SubscribeResponse> => {
  const res = await apiClient.post<SubscribeResponse>(
    "/api/newsletter/subscribe",
    payload
  );
  return res.data;
};

export const unsubscribeNewsletter = async (
  email: string,
  reason?: string
) => {
  const res = await apiClient.post("/api/newsletter/unsubscribe", {
    email,
    reason,
  });
  return res.data;
};