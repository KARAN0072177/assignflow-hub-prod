import axios from "axios";
import type {
  SubmitFeedbackPayload,
  FeedbackResponse,
} from "../types/feedback.types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * Submit feedback (authenticated)
 * POST /api/feedback/submit
 */
export const submitFeedback = async (
  payload: SubmitFeedbackPayload,
  token: string
) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/feedback/submit`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

/**
 * Fetch latest 5-star feedback (public testimonials)
 * GET /api/feedback/latest
 */
export const getLatestFeedbacks = async (): Promise<
  FeedbackResponse[]
> => {
  const response = await axios.get(
    `${API_BASE_URL}/api/feedback/latest`
  );

  return response.data;
};