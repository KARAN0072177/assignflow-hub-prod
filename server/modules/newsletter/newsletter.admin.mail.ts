// server/modules/newsletter/newsletter.admin.mail.ts

export const generateNewsletterCampaignTemplate = ({
  title,
  content,
  unsubscribeUrl,
}: {
  title: string;
  content: string; // already sanitized text
  unsubscribeUrl: string;
}) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const formattedContent = content.replace(/\n/g, "<br>");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  
  <!-- Outer Wrapper Table -->
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f6f9; padding: 40px 16px;">
    <tr>
      <td align="center">
        
        <!-- Main Card Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
          
          <!-- Top Accent Bar -->
          <tr>
            <td height="4" style="background: #2563eb; background-image: linear-gradient(90deg, #2563eb 0%, #3b82f6 50%, #10b981 100%);"></td>
          </tr>

          <!-- Header / Brand Section -->
          <tr>
            <td style="padding: 32px 36px 20px 36px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="vertical-align: middle;">
                          <div style="background-color: #2563eb; width: 36px; height: 36px; border-radius: 8px; text-align: center; line-height: 36px; font-weight: 700; color: #ffffff; font-size: 18px;">
                            A
                          </div>
                        </td>
                        <td style="vertical-align: middle; padding-left: 12px;">
                          <span style="font-size: 18px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;">
                            AssignFlow <span style="color: #2563eb;">Hub</span>
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 36px;">
              <div style="height: 1px; background-color: #edf2f7; width: 100%;"></div>
            </td>
          </tr>

          <!-- Main Content Section -->
          <tr>
            <td style="padding: 32px 36px 28px 36px;">
              
              <!-- Badge -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 16px;">
                <tr>
                  <td style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 20px; padding: 4px 14px;">
                    <span style="color: #2563eb; font-size: 12px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase;">
                      Newsletter Update
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Heading -->
              <h1 style="margin: 0 0 18px 0; font-size: 22px; font-weight: 700; color: #0f172a; line-height: 1.3;">
                ${title}
              </h1>

              <!-- Broadcast Content -->
              <div style="font-size: 15px; line-height: 1.7; color: #334155;">
                ${formattedContent}
              </div>

              <!-- Action Link -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin-top: 32px;">
                <tr>
                  <td align="center" style="border-radius: 8px; background-color: #2563eb;">
                    <a href="${frontendUrl}" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px; border: 1px solid #2563eb;">
                      Open AssignFlow Hub
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td style="padding: 24px 36px 32px 36px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-size: 13px; line-height: 1.5; color: #64748b; text-align: center;">
                    You received this broadcast email because you are subscribed to AssignFlow Hub updates.
                    <br />
                    No longer wish to receive these emails? 
                    <a href="${unsubscribeUrl}" target="_blank" style="color: #2563eb; text-decoration: underline; font-weight: 500;">
                      Unsubscribe here
                    </a>.
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #94a3b8; text-align: center; padding-top: 14px;">
                    &copy; ${new Date().getFullYear()} AssignFlow Hub. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- End Main Card -->

      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
};