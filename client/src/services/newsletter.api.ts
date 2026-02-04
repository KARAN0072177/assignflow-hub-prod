import axios from "axios";
import type {
    SubscribeNewsletterPayload,
    SubscribeResponse,
} from "../types/newsletter.types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const subscribeNewsletter = async (
  payload: SubscribeNewsletterPayload
): Promise<SubscribeResponse> => {
  const res = await axios.post(
    `${API_BASE_URL}/api/newsletter/subscribe`,
    payload
  );

  return res.data;
};

export const unsubscribeNewsletter = async (email: string, reason?: string) => {
  const res = await axios.post(
    `${API_BASE_URL}/api/newsletter/unsubscribe`,
    { email, reason }
  );

  return res.data;
};