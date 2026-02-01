import { Request, Response } from "express";
import { z } from "zod";
import { handleContactSubmission } from "./contact.service";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
});

export const submitContactForm = async (
  req: Request,
  res: Response
) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input" });
  }

  await handleContactSubmission(parsed.data);

  return res.status(200).json({
    message: "Message sent successfully",
  });
};