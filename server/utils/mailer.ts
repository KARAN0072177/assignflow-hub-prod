import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const response = await resend.emails.send({
      from: "AssignFlow Hub <no-reply@karanart.com>",
      to,
      subject,
      html,
    });

    console.log("📨 RESEND RESPONSE:", response);
  } catch (err) {
    console.error("❌ RESEND ERROR:", err);
    throw err;
  }
};