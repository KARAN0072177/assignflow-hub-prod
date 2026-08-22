import { apiClient } from "./apiClient";
import type {
  SubmitFeedbackPayload,
  FeedbackResponse,
} from "../types/feedback.types";

/**
 * Submit feedback (authenticated)
 * POST /api/feedback/submit
 */
export const submitFeedback = async (
  payload: SubmitFeedbackPayload,
  _token?: string
) => {
  const response = await apiClient.post("/api/feedback/submit", payload);
  return response.data;
};

/**
 * Fetch latest 5-star feedback (public testimonials)
 * GET /api/feedback/latest
 */
export const getLatestFeedbacks = async (): Promise<FeedbackResponse[]> => {
  const response = await apiClient.get<FeedbackResponse[]>("/api/feedback/latest");
  return response.data;
};