import nodemailer from "nodemailer";
import { config } from "../config";

export const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.gmailUser,
    pass: config.gmailAppPassword,
  },
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
  await mailer.sendMail({
    from: `"AssignFlow Hub" <${config.gmailUser}>`,
    to,
    subject,
    html,
  });
};