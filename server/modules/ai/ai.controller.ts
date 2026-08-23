import { Response } from "express";
import { z } from "zod";
import { AuthenticatedRequest } from "../../middleware/requireAuth";
import { enhanceAssignmentDescription } from "./ai.service";

const enhanceSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(["GRADED", "MATERIAL"]).optional(),
});

export const enhanceDescriptionHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user || req.user.role !== "TEACHER") {
    return res.status(403).json({
      message: "AI enhancement features are exclusively available to instructors.",
    });
  }

  const parsed = enhanceSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: parsed.error.issues[0]?.message || "Invalid input parameters",
    });
  }

  const { title, description, type } = parsed.data;

  try {
    const enhanced = await enhanceAssignmentDescription({
      title,
      description,
      type: type || "GRADED",
    });

    return res.status(200).json({
      enhancedDescription: enhanced,
    });
  } catch (error: any) {
    console.error("AI enhancement handler error:", error);
    return res.status(500).json({
      message: error.message || "Failed to enhance description with AI",
    });
  }
};
