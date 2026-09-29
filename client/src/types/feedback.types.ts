/**
 * Payload used when submitting feedback
 */
export interface SubmitFeedbackPayload {
  rating: number;   // 1–5
  message: string;
}

/**
 * Feedback object returned from the backend
 * (used for testimonials)
 */
export interface FeedbackResponse {
  id?: number | string;
  _id?: string;
  username?: string;
  name?: string;
  avatarUrl?: string | null;
  courseName?: any;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  rating: number;
  message: string;
  createdAt: string;
}