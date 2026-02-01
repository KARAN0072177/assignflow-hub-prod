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
    .select("name email phone message createdAt");

  return res.status(200).json(
    contacts.map((c) => ({
      id: c._id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      message: c.message,
      createdAt: c.createdAt,
    }))
  );
};