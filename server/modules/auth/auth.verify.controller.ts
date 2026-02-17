import { Request, Response } from "express";
import { verifyEmailToken } from "./auth.verify.service";

export const verifyEmail = async (req: Request, res: Response) => {
  const token = req.query.token as string;

  if (!token) {
    return res.status(400).json({
      message: "Verification token missing",
    });
  }

  try {
    const result = await verifyEmailToken(token);

    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({
      message: err.message || "Verification failed",
    });
  }
};