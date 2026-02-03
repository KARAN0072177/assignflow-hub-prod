import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/requireAuth";
import { Contact } from "../../models/contact.model";

export const getAdminContacts = async (
  _req: AuthenticatedRequest,
  res: Response
) => {
  const contacts = await Contact.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .select("name email phone message isRead createdAt");

  return res.status(200).json(
    contacts.map((c) => ({
      id: c._id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      message: c.message,
      isRead: c.isRead !== undefined ? c.isRead : false,
      createdAt: c.createdAt,
    }))
  );
};

// Add these new functions:

export const markMessageAsRead = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const message = await Contact.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true } // Return the updated document
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    return res.status(200).json({
      id: message._id,
      name: message.name,
      email: message.email,
      phone: message.phone,
      message: message.message,
      isRead: message.isRead,
      createdAt: message.createdAt,
    });
  } catch (error) {
    console.error("Error marking message as read:", error);

    const message =
      error instanceof Error ? error.message : "Unknown error occurred";

    return res.status(500).json({
      message: "Server error",
      error: message,
    });
  }
};

export const markMessagesAsReadBulk = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { messageIds } = req.body;

    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({ message: 'messageIds must be a non-empty array' });
    }

    const result = await Contact.updateMany(
      { _id: { $in: messageIds } },
      { $set: { isRead: true } }
    );

    return res.status(200).json({
      success: true,
      count: result.modifiedCount,
      message: `Marked ${result.modifiedCount} messages as read`
    });
  } catch (error) {
    console.error("Error marking messages as read in bulk:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return res.status(500).json({
      message: "Server error",
      error: errorMessage,
    });
  }
};