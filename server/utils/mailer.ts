import nodemailer from "nodemailer";
import { config } from "../config";

export const mailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // IMPORTANT
  auth: {
    user: config.gmailUser,
    pass: config.gmailAppPassword, // App Password ONLY
  },
});

mailer.verify((err) => {
  if (err) console.error("❌ SMTP ERROR:", err);
  else console.log("✅ SMTP server ready");
});

export const sendMail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    await mailer.sendMail({
      from: `"AssignFlow Hub" <${config.gmailUser}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("❌ EMAIL FAILED:", err);
    throw err; // or swallow depending on logic
  }
};