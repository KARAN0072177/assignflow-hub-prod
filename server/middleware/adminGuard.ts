import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./requireAuth";

export const adminGuard = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (
    req.user?.role !== "ADMIN" &&
    req.user?.role !== "TEACHER"
  ) {
    return res.status(403).json({ message: "Access denied" });
  }

  next();
};