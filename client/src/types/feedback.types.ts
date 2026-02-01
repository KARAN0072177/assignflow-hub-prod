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
  id: number;
  courseName: any;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  rating: number;
  message: string;
  createdAt: string;
}