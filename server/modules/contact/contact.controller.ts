import { Request, Response } from "express";
import { z } from "zod";
import { handleContactSubmission } from "./contact.service";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address"),
  phone: z
    .string()
    .trim()
    .max(25, "Phone number cannot exceed 25 characters")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message cannot exceed 2000 characters"),
});

export const submitContactForm = async (
  req: Request,
  res: Response
) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    const firstErrorMessage =
      parsed.error.issues[0]?.message || "Invalid contact form input";
    return res.status(400).json({
      message: firstErrorMessage,
      errors: parsed.error.issues,
    });
  }

  try {
    await handleContactSubmission({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || undefined,
      message: parsed.data.message,
    });

    return res.status(200).json({
      message: "Message sent successfully! We will get back to you shortly.",
    });
  } catch (error: any) {
    console.error("Contact submission error:", error);
    return res.status(500).json({
      message:
        error?.message || "Failed to process your request. Please try again later.",
    });
  }
};