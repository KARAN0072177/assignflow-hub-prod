import { Resend } from "resend";
import { config } from "../config";

const resend = new Resend(config.resendApiKey);

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
    await resend.emails.send({
      from: "AssignFlow Hub <onboarding@resend.dev>",
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("❌ EMAIL FAILED (Resend):", err);
    // DO NOT throw — email must never break requests
  }
};