import { Response } from "express";
import { Types } from "mongoose";
import { AuthenticatedRequest } from "../../middleware/requireAuth";
import { NotificationService } from "./notification.service";

/**
 * Get current user's notifications & unread count
 */
export const getMyNotificationsHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 25;
    const data = await NotificationService.getUserNotifications(
      new Types.ObjectId(req.user.userId),
      limit
    );

    return res.status(200).json(data);
  } catch (error: any) {
    console.error("[NotificationController] Get notifications error:", error);
    return res.status(500).json({ message: error.message || "Failed to fetch notifications" });
  }
};

/**
 * Mark a single notification as read
 */
export const markNotificationReadHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const { id } = req.params;
  if (!id || !Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Valid notification ID required" });
  }

  try {
    const result = await NotificationService.markAsRead(
      new Types.ObjectId(id),
      new Types.ObjectId(req.user.userId)
    );

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("[NotificationController] Mark read error:", error);
    return res.status(500).json({ message: error.message || "Failed to mark notification as read" });
  }
};

/**
 * Mark all notifications as read for current user
 */
export const markAllNotificationsReadHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const result = await NotificationService.markAllAsRead(
      new Types.ObjectId(req.user.userId)
    );

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("[NotificationController] Mark all read error:", error);
    return res.status(500).json({ message: error.message || "Failed to mark all as read" });
  }
};
