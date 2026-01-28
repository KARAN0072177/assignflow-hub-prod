import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./requireAuth";

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access only" });
  }

  next();
};