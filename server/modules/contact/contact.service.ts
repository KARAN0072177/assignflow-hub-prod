import sanitizeHtml from "sanitize-html";
import { Contact } from "../../models/contact.model";
import { sendMail } from "../../utils/mailer";
import { getIO } from "../../socket";

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

  // 1. Store in Database
  const record = await Contact.create({
    name,
    email,
    phone,
    message: cleanMessage,
  });

  // 2. Notify admins in real time via Socket.IO
  try {
    const io = getIO();
    if (io) {
      io.emit("contact:new", {
        id: record._id,
        createdAt: record.createdAt,
      });
    }
  } catch (err) {
    console.warn("Socket emit failed for contact submission:", err);
  }

  const frontendUrl = process.env.FRONTEND_URL || "https://assignflowhub.com";
  const adminEmail = process.env.ADMIN_CONTACT_EMAIL || "support@assignflowhub.com";

  // 3. Email to admin (Professional notification)
  try {
    await sendMail({
      to: adminEmail,
      subject: `New Contact Inquiry from ${name} — AssignFlow Hub`,
      html: generateAdminEmail({
        name,
        email,
        phone,
        message: cleanMessage,
        frontendUrl,
      }),
    });
  } catch (mailErr) {
    console.error("Failed to send admin contact email:", mailErr);
  }

  // 4. Confirmation to user (Professional receipt)
  try {
    await sendMail({
      to: email,
      subject: `We've received your message — AssignFlow Hub`,
      html: generateUserConfirmationEmail({
        name,
        message: cleanMessage,
        frontendUrl,
      }),
    });
  } catch (mailErr) {
    console.error("Failed to send user confirmation email:", mailErr);
  }

  return record;
};

/* =========================================================================
   EMAIL TEMPLATES (Modern, Enterprise SaaS Design)
   ========================================================================= */

const generateAdminEmail = ({
  name,
  email,
  phone,
  message,
  frontendUrl,
}: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  frontendUrl: string;
}) => {
  const formattedMessage = message.replace(/\n/g, "<br/>");
  const timestamp = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Inquiry - AssignFlow Hub</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #0f172a; padding: 28px 32px; text-align: left;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 18px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">AssignFlow Hub</span>
                    <span style="display: block; font-size: 12px; color: #94a3b8; margin-top: 4px;">Admin Support Dispatch</span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; background-color: #1e293b; border: 1px solid #334155; color: #38bdf8; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px;">
                      New Inquiry
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #0f172a;">New Message Received</h2>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #64748b; line-height: 1.6;">
                A visitor submitted the contact form on AssignFlow Hub. Details are provided below:
              </p>

              <!-- Sender Metadata Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0; font-size: 13px;">
                    <strong style="color: #475569; display: inline-block; width: 100px;">Sender Name:</strong>
                    <span style="color: #0f172a; font-weight: 600;">${name}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0; font-size: 13px;">
                    <strong style="color: #475569; display: inline-block; width: 100px;">Email:</strong>
                    <a href="mailto:${email}" style="color: #2563eb; font-weight: 600; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0; font-size: 13px;">
                    <strong style="color: #475569; display: inline-block; width: 100px;">Phone:</strong>
                    <span style="color: #0f172a;">${phone || "Not provided"}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; font-size: 13px;">
                    <strong style="color: #475569; display: inline-block; width: 100px;">Received At:</strong>
                    <span style="color: #64748b;">${timestamp}</span>
                  </td>
                </tr>
              </table>

              <!-- Message Content Area -->
              <div style="margin-bottom: 28px;">
                <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Message Content</label>
                <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; border: 1px solid #e2e8f0; border-left-width: 4px; border-radius: 8px; padding: 18px 20px; color: #1e293b; font-size: 14px; line-height: 1.7;">
                  ${formattedMessage}
                </div>
              </div>

              <!-- Quick Action Reply Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-top: 8px;">
                    <a href="mailto:${email}?subject=Re:%20AssignFlow%20Hub%20Inquiry" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 28px; border-radius: 10px; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);">
                      Reply to ${name}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748b;">
                You received this email because you are configured as the administrator for AssignFlow Hub.
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                &copy; ${new Date().getFullYear()} AssignFlow Hub. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

const generateUserConfirmationEmail = ({
  name,
  message,
  frontendUrl,
}: {
  name: string;
  message: string;
  frontendUrl: string;
}) => {
  const firstName = name.trim().split(" ")[0] || name;
  const formattedMessage = message.replace(/\n/g, "<br/>");
  const timestamp = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Message Received - AssignFlow Hub</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #0f172a; padding: 28px 32px; text-align: left;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 18px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">AssignFlow Hub</span>
                    <span style="display: block; font-size: 12px; color: #94a3b8; margin-top: 4px;">Support &amp; Community</span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; background-color: #1e293b; border: 1px solid #334155; color: #34d399; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px;">
                      Received
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #0f172a;">Thanks for reaching out, ${firstName}!</h2>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #475569; line-height: 1.6;">
                We have received your message and our team is currently reviewing it. We typically reply within <strong>24 business hours</strong>.
              </p>

              <!-- Submitted Message Summary Box -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                  Summary of your inquiry (${timestamp}):
                </div>
                <div style="color: #334155; font-size: 13.5px; line-height: 1.65; font-style: italic;">
                  "${formattedMessage}"
                </div>
              </div>

              <!-- Helpful Note -->
              <p style="margin: 0 0 24px 0; font-size: 13px; color: #64748b; line-height: 1.6;">
                If you have any additional details or files to provide, you can simply reply directly to this email.
              </p>

              <!-- Action Link -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${frontendUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; padding: 11px 24px; border-radius: 10px;">
                      Visit AssignFlow Hub
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748b;">
                AssignFlow Hub • Modern Assignment &amp; Classroom Management
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                &copy; ${new Date().getFullYear()} AssignFlow Hub. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};