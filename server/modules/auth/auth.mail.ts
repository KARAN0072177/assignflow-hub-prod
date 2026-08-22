// server/modules/auth/auth.mail.ts

/**
 * Clean & Professional Password Reset OTP Email Template
 */
export const generateResetOtpEmailTemplate = ({
  email,
  otp,
  isResend = false,
}: {
  email: string;
  otp: string;
  isResend?: boolean;
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${isResend ? "New Password Reset Code" : "Password Reset Code"} - AssignFlow Hub</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">

  <!-- Outer Wrapper -->
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

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 36px 28px 36px;">
              
              <!-- Badge -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 16px;">
                <tr>
                  <td style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 20px; padding: 4px 14px;">
                    <span style="color: #2563eb; font-size: 12px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase;">
                      ${isResend ? "Updated Verification Code" : "Password Reset Request"}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Heading -->
              <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #0f172a; line-height: 1.3;">
                ${isResend ? "Your New Verification Code" : "Reset Your Password"}
              </h1>

              <!-- Intro Text -->
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #475569;">
                We received a request to reset the password associated with <strong style="color: #0f172a;">${email}</strong>. Use the verification code below to complete your request:
              </p>

              <!-- OTP Code Display Card -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin: 0 0 28px 0;">
                <tr>
                  <td align="center" style="padding: 24px 20px;">
                    <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">
                      Verification Code
                    </div>
                    
                    <div style="display: inline-block; background-color: #ffffff; border: 2px solid #2563eb; border-radius: 8px; padding: 12px 28px; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.08);">
                      <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #0f172a; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">
                        ${otp}
                      </span>
                    </div>

                    <div style="font-size: 13px; color: #64748b; margin-top: 12px; font-weight: 500;">
                      ⏱ This code is valid for <strong>10 minutes</strong>.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Steps List -->
              <div style="margin-bottom: 24px;">
                <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">
                  Next Steps
                </p>

                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td width="24" style="vertical-align: top; padding-bottom: 10px;">
                      <span style="display: inline-block; width: 20px; height: 20px; line-height: 20px; text-align: center; border-radius: 50%; background-color: #eff6ff; color: #2563eb; font-size: 12px; font-weight: 700;">1</span>
                    </td>
                    <td style="vertical-align: top; padding-left: 10px; padding-bottom: 10px; font-size: 14px; color: #475569;">
                      Enter the 6-digit code on the OTP verification page
                    </td>
                  </tr>
                  <tr>
                    <td width="24" style="vertical-align: top; padding-bottom: 10px;">
                      <span style="display: inline-block; width: 20px; height: 20px; line-height: 20px; text-align: center; border-radius: 50%; background-color: #eff6ff; color: #2563eb; font-size: 12px; font-weight: 700;">2</span>
                    </td>
                    <td style="vertical-align: top; padding-left: 10px; padding-bottom: 10px; font-size: 14px; color: #475569;">
                      Choose a new secure password
                    </td>
                  </tr>
                  <tr>
                    <td width="24" style="vertical-align: top;">
                      <span style="display: inline-block; width: 20px; height: 20px; line-height: 20px; text-align: center; border-radius: 50%; background-color: #eff6ff; color: #2563eb; font-size: 12px; font-weight: 700;">3</span>
                    </td>
                    <td style="vertical-align: top; padding-left: 10px; font-size: 14px; color: #475569;">
                      Log in to your account with your new credentials
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Security Notice Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-left: 4px solid #3b82f6; border-radius: 6px; padding: 14px 16px; margin-top: 24px;">
                <tr>
                  <td>
                    <div style="font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 4px;">
                      Security Reminder
                    </div>
                    <div style="font-size: 13px; color: #64748b; line-height: 1.5;">
                      Never share this code with anyone. AssignFlow Hub staff will never ask for your verification code. If you didn't request a password reset, you can safely ignore this email.
                    </div>
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
                  <td style="font-size: 12px; line-height: 1.5; color: #64748b; text-align: center;">
                    This is an automated security notification from AssignFlow Hub.
                    <br />
                    Questions? Contact us at <a href="mailto:support@assignflow.com" style="color: #2563eb; text-decoration: underline;">support@assignflow.com</a>.
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

/**
 * Clean & Professional Account Verification Email Template
 */
export const generateVerificationEmailTemplate = ({
  email,
  verifyUrl,
}: {
  email: string;
  verifyUrl: string;
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Verify Your Email - AssignFlow Hub</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">

  <!-- Outer Wrapper -->
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

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 36px 28px 36px;">
              
              <!-- Badge -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 16px;">
                <tr>
                  <td style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 20px; padding: 4px 14px;">
                    <span style="color: #2563eb; font-size: 12px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase;">
                      Account Verification
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Heading -->
              <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #0f172a; line-height: 1.3;">
                Confirm Your Email Address
              </h1>

              <!-- Intro Text -->
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #475569;">
                Welcome to AssignFlow Hub! Please verify that <strong style="color: #0f172a;">${email}</strong> belongs to you by clicking the button below:
              </p>

              <!-- CTA Button -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
                <tr>
                  <td align="center" style="border-radius: 8px; background-color: #2563eb;">
                    <a href="${verifyUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px; border: 1px solid #2563eb;">
                      Verify My Email
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry Note -->
              <p style="margin: 0 0 24px 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                This link will expire in <strong>24 hours</strong>. If you did not create an AssignFlow Hub account, you can safely ignore this email.
              </p>

              <!-- Fallback Link Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px;">
                <tr>
                  <td>
                    <div style="font-size: 12px; font-weight: 600; color: #64748b; margin-bottom: 4px;">
                      Button not working? Copy and paste this URL into your browser:
                    </div>
                    <div style="font-size: 12px; color: #2563eb; word-break: break-all;">
                      ${verifyUrl}
                    </div>
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
                  <td style="font-size: 12px; line-height: 1.5; color: #64748b; text-align: center;">
                    This email was sent to ${email} regarding your AssignFlow Hub account.
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
