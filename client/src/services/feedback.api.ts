import { apiClient } from "./apiClient";
import type {
  SubmitFeedbackPayload,
  FeedbackResponse,
} from "../types/feedback.types";

export interface FeedbackStats {
  averageRating: string;
  totalReviews: number;
  totalClassrooms: number;
  totalAssignments: number;
  totalSubmissions: number;
}

export interface FeedbackStatsResponse {
  success: boolean;
  data: FeedbackStats;
}

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

/**
 * Fetch platform rating & review aggregate metrics
 * GET /api/feedback/stats
 */
export const getFeedbackStats = async (): Promise<FeedbackStats> => {
  try {
    const response = await apiClient.get<FeedbackStatsResponse>("/api/feedback/stats");
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return { averageRating: "4.9", totalReviews: 9, totalClassrooms: 14, totalAssignments: 25, totalSubmissions: 25 };
  } catch (error) {
    console.warn("Failed to fetch feedback stats, using fallback:", error);
    return { averageRating: "4.9", totalReviews: 9, totalClassrooms: 14, totalAssignments: 25, totalSubmissions: 25 };
  }
};