// server/modules/newsletter/admin.newsletter.controller.ts

import { Request, Response } from "express";
import { z } from "zod";
import {
  getNewsletterSubscribers,
  sendNewsletterCampaign,
} from "./newsletter.admin.service";

const sendSchema = z.object({
  subject: z.string().min(3),
  content: z.string().min(10),
});

// GET /api/admin/newsletter/subscribers?status=subscribed
export const getSubscribers = async (req: Request, res: Response) => {
  const status = req.query.status as string | undefined;

  const subscribers = await getNewsletterSubscribers(status);

  res.json(subscribers);
};

// POST /api/admin/newsletter/send
export const sendCampaign = async (req: Request, res: Response) => {
  const parsed = sendSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const result = await sendNewsletterCampaign(
    parsed.data.subject,
    parsed.data.content
  );

  res.json({
    message: "Newsletter sent successfully",
    sentCount: result.sentCount,
  });
};