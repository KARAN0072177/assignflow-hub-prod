import { Request, Response, NextFunction } from "express";
import { logSystemError } from "../utils/errorLogger";
import { ErrorSeverity } from "../models/errorLog.model";

export const errorMiddleware = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await logSystemError({
    source: "API",
    message: err.message || "Unhandled API error",
    severity: ErrorSeverity.ERROR,
    route: req.originalUrl,
    method: req.method,
    statusCode: res.statusCode || 500,
    stack: err.stack,
  });

  res.status(500).json({ message: "Internal server error" });
};