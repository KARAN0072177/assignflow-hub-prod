import { Request, Response } from "express";
import { z } from "zod";
import {
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
} from "./newsletter.service";

const subscribeSchema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
});

const unsubscribeSchema = z.object({
  email: z.string().email(),
  reason: z.string().max(300).optional(),
});

// POST /api/newsletter/subscribe
export const subscribe = async (req: Request, res: Response) => {
  const parsed = subscribeSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const result = await subscribeToNewsletter(
      parsed.data.email,
      parsed.data.source
    );

    if (result.alreadySubscribed) {
      return res.status(200).json({ message: "Already subscribed" });
    }

    if (result.resubscribed) {
      return res.status(200).json({ message: "Subscription reactivated" });
    }

    return res.status(201).json({ message: "Subscribed successfully" });
  } catch (err) {
    console.error("❌ Newsletter subscribe failed:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/newsletter/unsubscribe
export const unsubscribe = async (req: Request, res: Response) => {
  const parsed = unsubscribeSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const result = await unsubscribeFromNewsletter(
      parsed.data.email,
      parsed.data.reason
    );

    if (result.notFound) {
      return res.status(404).json({ message: "Email not found" });
    }

    if (result.alreadyUnsubscribed) {
      return res.status(200).json({ message: "Already unsubscribed" });
    }

    return res.status(200).json({ message: "Unsubscribed successfully" });
  } catch (err) {
    console.error("❌ Newsletter unsubscribe failed:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};