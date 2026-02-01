import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/requireAuth";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { Feedback } from "../../models/feedback.model";

const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  message: z.string().min(5).max(300),
});

// POST /api/feedback/submit
export const submitFeedback = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const parsed = feedbackSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const cleanMessage = sanitizeHtml(parsed.data.message, {
    allowedTags: [],
    allowedAttributes: {},
  });

  await Feedback.create({
    userId: req.user!.userId,
    role: req.user!.role,
    rating: parsed.data.rating,
    message: cleanMessage,
  });

  return res.status(201).json({
    message: "Feedback submitted successfully",
  });
};

// GET /api/feedback/latest
export const getLatestFeedbacks = async (
  _req: AuthenticatedRequest,
  res: Response
) => {
  const feedbacks = await Feedback.find({ rating: 5 })
    .sort({ createdAt: -1 })
    .limit(3)
    .select("role rating message createdAt");

  return res.status(200).json(feedbacks);
};