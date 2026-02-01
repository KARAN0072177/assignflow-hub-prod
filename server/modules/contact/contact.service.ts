import sanitizeHtml from "sanitize-html";
import { Contact } from "../../models/contact.model";
import { sendMail } from "../../utils/mailer";

export const handleContactSubmission = async ({
  name,
  email,
  phone,
  message,
}: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) => {
  const cleanMessage = sanitizeHtml(message, {
    allowedTags: [],
    allowedAttributes: {},
  });

  // 1️⃣ Store in DB
  const record = await Contact.create({
    name,
    email,
    phone,
    message: cleanMessage,
  });

  // 2️⃣ Email to admin
  await sendMail({
    to: process.env.ADMIN_CONTACT_EMAIL!,
    subject: "New Contact Us Message",
    html: `
      <h3>New Contact Message</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
      <p><strong>Message:</strong></p>
      <p>${cleanMessage}</p>
    `,
  });

  // 3️⃣ Confirmation to user
  await sendMail({
    to: email,
    subject: "We received your message",
    html: `
      <p>Hi ${name},</p>
      <p>Thank you for contacting AssignFlow Hub.</p>
      <p>We have received your message and will get back to you if needed.</p>
      <hr/>
      <p><strong>Your message:</strong></p>
      <p>${cleanMessage}</p>
    `,
  });

  return record;
};