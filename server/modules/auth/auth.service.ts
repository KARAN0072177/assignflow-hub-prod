import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, UserRole } from "../../models/user.model";
import { config } from "../../config";
import { logAuditEvent } from "../../utils/auditLogger";
import { generateVerificationToken } from "../../utils/generateVerificationToken";
import { sendMail } from "../../utils/mailer";
import crypto from "crypto";
import { generateOtp } from "../../utils/generateOtp";

const SALT_ROUNDS = 10;

/**
 * ============================
 * REGISTER USER
 * ============================
 */
export const registerUser = async (
  email: string,
  password: string,
  role: UserRole
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // 🔐 Generate email verification token
  const { token, hashedToken, expires } = generateVerificationToken();

  // Create user (NOT verified yet)
  const user = await User.create({
    email,
    password: hashedPassword,
    role,
    isVerified: false,
    emailVerificationToken: hashedToken,
    emailVerificationExpires: expires,
  });

  // 📧 Send verification email
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  await sendMail({
    to: email,
    subject: "Verify your AssignFlow Hub account",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light dark">
      <meta name="supported-color-schemes" content="light dark">
      <style>
        /* Dark mode styles - matching Home page theme */
        @media (prefers-color-scheme: dark) {
          body, .email-body { background: linear-gradient(135deg, #0f172a, #1e293b) !important; }
          .email-container { background-color: #1e293b !important; border-color: #334155 !important; }
          h1, h2, h3, p, div { color: #f1f5f9 !important; }
          .email-heading { color: #f1f5f9 !important; }
          .email-text { color: #cbd5e1 !important; }
          .badge { background-color: #334155 !important; border-color: #475569 !important; }
          .badge-text { color: #e2e8f0 !important; }
          .gradient-text {
            background: linear-gradient(135deg, #60a5fa, #34d399) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
          }
          .verify-button {
            background: linear-gradient(135deg, #3b82f6, #10b981) !important;
          }
          .info-box { background-color: #1e293b !important; border-color: #3b82f6 !important; }
          .info-box-title { color: #93c5fd !important; }
          .info-box-text { color: #bfdbfe !important; }
          .info-box-note { color: #86efac !important; }
          .metadata { background-color: #1e293b !important; border-color: #334155 !important; }
          .metadata-value { color: #cbd5e1 !important; background-color: #0f172a !important; }
          .footer-text { color: #94a3b8 !important; }
          hr { border-color: #334155 !important; }
          a { color: #60a5fa !important; }
          .feature-icon { background-color: #334155 !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; background: linear-gradient(135deg, #f8fafc, #f1f5f9);" class="email-body">
      
      <!-- Main Container -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 32px; border: 1px solid #e2e8f0; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);" class="email-container">
        <tr>
          <td style="padding: 40px 35px;">
            
            <!-- Header with Badge - Home page style -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="padding-bottom: 30px;">
                  <!-- Badge -->
                  <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 25px auto; background-color: #f8fafc; border-radius: 9999px; padding: 8px 18px; border: 1px solid #e2e8f0;" class="badge">
                    <tr>
                      <td>
                        <span style="font-size: 14px; color: #64748b; font-weight: 500; display: flex; align-items: center; gap: 6px;" class="badge-text">
                          <span style="font-size: 16px;">✨</span> Welcome to AssignFlow Hub
                        </span>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Gradient Logo - Home page style -->
                  <span style="font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #2563eb, #10b981); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.5px;" class="gradient-text">AssignFlow Hub</span>
                </td>
              </tr>
            </table>
            
            <!-- Main Heading - Home page typography -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center">
                  <h1 style="font-size: 36px; font-weight: 800; color: #0f172a; margin: 0 0 15px 0; letter-spacing: -0.02em; line-height: 1.2;" class="email-heading">
                    Verify Your<br>Email Address
                  </h1>
                  <p style="font-size: 18px; color: #64748b; margin: 0 0 10px 0;" class="email-text">Thanks for registering!</p>
                </td>
              </tr>
            </table>
            
            <!-- Welcome Message with Feature Icons -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
              <tr>
                <td>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td width="50" align="center" valign="top" style="padding: 5px 0;">
                        <span style="display: inline-block; width: 36px; height: 36px; background: linear-gradient(135deg, #dbeafe, #eff6ff); border-radius: 10px; line-height: 36px; text-align: center; font-size: 18px;" class="feature-icon">📚</span>
                      </td>
                      <td style="padding: 5px 0 5px 10px;">
                        <p style="font-size: 15px; color: #475569; margin: 0;" class="email-text">Access your courses and assignments</p>
                      </td>
                    </tr>
                    <tr>
                      <td width="50" align="center" valign="top" style="padding: 5px 0;">
                        <span style="display: inline-block; width: 36px; height: 36px; background: linear-gradient(135deg, #dbeafe, #eff6ff); border-radius: 10px; line-height: 36px; text-align: center; font-size: 18px;" class="feature-icon">👥</span>
                      </td>
                      <td style="padding: 5px 0 5px 10px;">
                        <p style="font-size: 15px; color: #475569; margin: 0;" class="email-text">Connect with educators and peers</p>
                      </td>
                    </tr>
                    <tr>
                      <td width="50" align="center" valign="top" style="padding: 5px 0;">
                        <span style="display: inline-block; width: 36px; height: 36px; background: linear-gradient(135deg, #dbeafe, #eff6ff); border-radius: 10px; line-height: 36px; text-align: center; font-size: 18px;" class="feature-icon">⚡</span>
                      </td>
                      <td style="padding: 5px 0 5px 10px;">
                        <p style="font-size: 15px; color: #475569; margin: 0;" class="email-text">Track your progress in real-time</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            
            <!-- CTA Text -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center">
                  <p style="font-size: 16px; color: #334155; margin: 0 0 25px 0; font-weight: 500;" class="email-text">
                    Click the button below to verify your account and get started:
                  </p>
                </td>
              </tr>
            </table>
            
            <!-- Verification Button - Home page gradient style -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
              <tr>
                <td align="center">
                  <a href="${verifyUrl}" 
                     style="display: inline-block; padding: 18px 40px; background: linear-gradient(135deg, #2563eb, #10b981); color: #ffffff !important; text-decoration: none; font-weight: 600; font-size: 18px; border-radius: 16px; border: none; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);"
                     class="verify-button">
                    <span style="display: flex; align-items: center; gap: 8px;">
                      Verify Email Address
                      <span style="font-size: 20px;">→</span>
                    </span>
                  </a>
                </td>
              </tr>
            </table>
            
            <!-- Security Info Box - Home page card style -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 35px 0; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border: 1px solid #bae6fd; border-radius: 20px; padding: 25px;" class="info-box">
              <tr>
                <td>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td width="40" valign="top" style="font-size: 24px;">🔒</td>
                      <td>
                        <h3 style="font-size: 16px; color: #0369a1; margin: 0 0 12px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;" class="info-box-title">Security Notice</h3>
                        <p style="font-size: 15px; color: #0284c7; margin: 0 0 10px 0;" class="info-box-text">
                          This verification link will expire in <strong style="color: #2563eb;">1 hour</strong> for your security.
                        </p>
                        <p style="font-size: 14px; color: #0369a1; margin: 0; font-style: italic; background-color: rgba(255,255,255,0.5); padding: 10px; border-radius: 10px;" class="info-box-note">
                          ⚡ If you didn't create an account, you can safely ignore this email.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            
            <!-- Alternative Link Section - Monospace style -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
                  <p style="font-size: 14px; color: #64748b; margin: 20px 0 10px 0; text-align: center;" class="email-text">
                    ⚡ Button not working? Copy this link:
                  </p>
                </td>
              </tr>
            </table>
            
            <!-- Verification Link Box - Code style -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 10px 0 30px 0; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;" class="metadata">
              <tr>
                <td style="padding: 18px;">
                  <p style="font-size: 13px; color: #0f172a; margin: 0; word-break: break-all; font-family: 'Courier New', monospace; background-color: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;" class="metadata-value">
                    ${verifyUrl}
                  </p>
                </td>
              </tr>
            </table>
            
            <!-- Stats Section - Home page style -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
              <tr>
                <td>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td width="33%" align="center" style="padding: 10px;">
                        <div style="background-color: #f8fafc; border-radius: 12px; padding: 12px; border: 1px solid #e2e8f0;">
                          <span style="font-size: 20px; font-weight: 700; color: #2563eb; display: block;">10K+</span>
                          <span style="font-size: 12px; color: #64748b;">Active Users</span>
                        </div>
                      </td>
                      <td width="33%" align="center" style="padding: 10px;">
                        <div style="background-color: #f8fafc; border-radius: 12px; padding: 12px; border: 1px solid #e2e8f0;">
                          <span style="font-size: 20px; font-weight: 700; color: #10b981; display: block;">500+</span>
                          <span style="font-size: 12px; color: #64748b;">Classrooms</span>
                        </div>
                      </td>
                      <td width="33%" align="center" style="padding: 10px;">
                        <div style="background-color: #f8fafc; border-radius: 12px; padding: 12px; border: 1px solid #e2e8f0;">
                          <span style="font-size: 20px; font-weight: 700; color: #8b5cf6; display: block;">4.9/5</span>
                          <span style="font-size: 12px; color: #64748b;">Rating</span>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            
            <!-- Divider - Gradient style -->
            <hr style="border: none; height: 2px; background: linear-gradient(90deg, transparent, #2563eb, #10b981, transparent); margin: 35px 0 25px 0;">
            
            <!-- Footer - Home page style -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="color: #94a3b8; font-size: 13px;" class="footer-text">
                  <p style="margin: 5px 0;">This is an automated message from <strong style="background: linear-gradient(135deg, #2563eb, #10b981); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">AssignFlow Hub</strong></p>
                  <p style="margin: 12px 0 5px 0;">
                    <a href="mailto:support@assignflow.com" style="color: #64748b; text-decoration: none; border-bottom: 1px dashed #94a3b8;">📧 support@assignflow.com</a>
                  </p>
                  <p style="margin: 15px 0 0 0; font-size: 12px;">
                    © ${new Date().getFullYear()} AssignFlow Hub. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
            
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
  });

  return {
    message: "Registration successful. Please verify your email.",
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  };
};


// ============================
// REQUEST PASSWORD RESET (OTP FLOW )
// ============================

export const requestPasswordReset = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const otp = generateOtp();
  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  user.resetPasswordOtp = hashedOtp;
  user.resetPasswordOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  await user.save();

  await sendMail({
    to: email,
    subject: "Password Reset OTP - AssignFlow Hub",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light dark">
      <meta name="supported-color-schemes" content="light dark">
      <style>
        /* Dark mode styles - matching Home page theme */
        @media (prefers-color-scheme: dark) {
          body, .email-body { background-color: #0f172a !important; }
          .email-container { background-color: #1e293b !important; border-color: #334155 !important; }
          h1, h2, h3, p, div { color: #f1f5f9 !important; }
          .email-heading { color: #f1f5f9 !important; }
          .email-text { color: #cbd5e1 !important; }
          .otp-box { background: linear-gradient(135deg, #1e293b, #0f172a) !important; border-color: #3b82f6 !important; }
          .otp-label { color: #93c5fd !important; }
          .otp-code { color: #ffffff !important; background-color: #2563eb !important; }
          .info-box { background-color: #1e293b !important; border-color: #3b82f6 !important; }
          .info-box-title { color: #93c5fd !important; }
          .info-box-text { color: #bfdbfe !important; }
          .warning-box { background-color: #2d1f1f !important; border-color: #ef4444 !important; }
          .warning-text { color: #fecaca !important; }
          .footer-text { color: #94a3b8 !important; }
          hr { border-color: #334155 !important; }
          a { color: #60a5fa !important; }
          .gradient-text {
            background: linear-gradient(135deg, #60a5fa, #34d399) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
          }
          .request-details { background-color: #1e293b !important; border-color: #334155 !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; background: linear-gradient(135deg, #f8fafc, #f1f5f9);" class="email-body">
      
      <!-- Main Container -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);" class="email-container">
        <tr>
          <td style="padding: 40px 30px;">
            
            <!-- Header with Badge Style -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="padding-bottom: 30px;">
                  <!-- Badge -->
                  <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 20px auto; background-color: #f8fafc; border-radius: 9999px; padding: 8px 16px; border: 1px solid #e2e8f0;">
                    <tr>
                      <td>
                        <span style="font-size: 14px; color: #64748b;">🔐 Password Reset</span>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Logo with Gradient (Home page style) -->
                  <span style="font-size: 28px; font-weight: 700; background: linear-gradient(135deg, #2563eb, #10b981); -webkit-background-clip: text; -webkit-text-fill-color: transparent;" class="gradient-text">AssignFlow Hub</span>
                </td>
              </tr>
            </table>
            
            <!-- Main Heading - Home page typography -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center">
                  <h1 style="font-size: 32px; font-weight: 700; color: #0f172a; margin: 0 0 10px 0; letter-spacing: -0.02em;" class="email-heading">Password Reset</h1>
                  <p style="font-size: 16px; color: #64748b; margin: 0;" class="email-text">We received a request to reset your password</p>
                </td>
              </tr>
            </table>
            
            <!-- OTP Display - Enhanced with Home page gradients -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 40px 0;">
              <tr>
                <td align="center" style="background: linear-gradient(135deg, #f0f9ff, #ffffff); border: 2px solid #2563eb; border-radius: 20px; padding: 35px 25px; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.1);" class="otp-box">
                  <p style="font-size: 14px; color: #2563eb; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;" class="otp-label">Your One-Time Password</p>
                  
                  <!-- OTP Code - Prominent display -->
                  <div style="font-size: 56px; font-weight: 800; color: #ffffff; letter-spacing: 8px; font-family: 'Courier New', monospace; background: linear-gradient(135deg, #2563eb, #3b82f6); padding: 20px 30px; border-radius: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);" class="otp-code">
                    ${otp}
                  </div>
                  
                  <!-- Timer Badge -->
                  <table cellpadding="0" cellspacing="0" border="0" style="margin: 20px auto 0 auto; background-color: #2563eb; border-radius: 9999px; padding: 6px 16px;">
                    <tr>
                      <td>
                        <span style="font-size: 14px; color: #ffffff; font-weight: 500;">⏱️ Valid for 10 minutes</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            
            <!-- Instructions Card - Home page card style -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0; background: linear-gradient(135deg, #f8fafc, #f1f5f9); border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px;" class="info-box">
              <tr>
                <td>
                  <p style="font-size: 16px; color: #0f172a; margin: 0 0 15px 0; font-weight: 600; display: flex; align-items: center; gap: 8px;" class="info-box-title">
                    <span style="font-size: 20px;">📋</span> Next Steps
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="padding: 5px 0;">
                        <span style="color: #2563eb; font-weight: 600; margin-right: 10px;">1 →</span>
                        <span style="font-size: 15px; color: #475569;" class="info-box-text">Enter the 6-digit code on the reset page</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 5px 0;">
                        <span style="color: #10b981; font-weight: 600; margin-right: 10px;">2 →</span>
                        <span style="font-size: 15px; color: #475569;" class="info-box-text">Create your new secure password</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 5px 0;">
                        <span style="color: #8b5cf6; font-weight: 600; margin-right: 10px;">3 →</span>
                        <span style="font-size: 15px; color: #475569;" class="info-box-text">Login with your new credentials</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            
            <!-- Security Warning - Matching Home page alert style -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 25px 0; background: linear-gradient(135deg, #fef2f2, #fee2e2); border: 1px solid #fecaca; border-radius: 12px; padding: 16px;" class="warning-box">
              <tr>
                <td>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td width="30" valign="top" style="font-size: 20px;">⚠️</td>
                      <td>
                        <p style="font-size: 15px; color: #b91c1c; margin: 0; font-weight: 500;" class="warning-text">
                          <strong>Never share this OTP</strong> — Our team will never ask for this code.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            
            <!-- Request Details - Stats card style from Home page -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 25px 0; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;" class="request-details">
              <tr>
                <td style="padding: 16px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="padding: 4px 0;">
                        <span style="font-size: 13px; font-weight: 600; color: #475569; width: 100px; display: inline-block;">📧 Email:</span>
                        <span style="font-size: 13px; color: #0f172a; font-weight: 500;">${email}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0;">
                        <span style="font-size: 13px; font-weight: 600; color: #475569; width: 100px; display: inline-block;">⏰ Expires:</span>
                        <span style="font-size: 13px; color: #0f172a; font-weight: 500;">10 minutes from request</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0;">
                        <span style="font-size: 13px; font-weight: 600; color: #475569; width: 100px; display: inline-block;">🕒 Time:</span>
                        <span style="font-size: 13px; color: #0f172a; font-weight: 500;">${new Date().toLocaleString()}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            
            <!-- Didn't Request - Info box style -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 25px 0; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border: 1px solid #bae6fd; border-radius: 12px; padding: 16px;" class="info-box">
              <tr>
                <td>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td width="30" valign="top" style="font-size: 18px;">🔒</td>
                      <td>
                        <p style="font-size: 15px; color: #0369a1; margin: 0 0 5px 0; font-weight: 600;" class="info-box-title">Didn't request this?</p>
                        <p style="font-size: 14px; color: #0284c7; margin: 0;" class="info-box-text">
                          If you didn't request a password reset, please ignore this email or 
                          <a href="mailto:support@assignflow.com" style="color: #2563eb; text-decoration: underline; font-weight: 500;">contact support</a>.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            
            <!-- Divider - Matching Home page style -->
            <hr style="border: none; height: 1px; background: linear-gradient(90deg, transparent, #e2e8f0, transparent); margin: 35px 0 25px 0;">
            
            <!-- Footer - Matching Home page footer -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="color: #94a3b8; font-size: 13px;" class="footer-text">
                  <p style="margin: 5px 0;">This is an automated message from <strong style="color: #2563eb;">AssignFlow Hub</strong></p>
                  <p style="margin: 10px 0 5px 0;">
                    <a href="mailto:support@assignflow.com" style="color: #64748b; text-decoration: underline; text-decoration-color: #cbd5e1;">📧 support@assignflow.com</a>
                  </p>
                  <p style="margin: 15px 0 0 0; font-size: 12px;">
                    © ${new Date().getFullYear()} AssignFlow Hub. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
            
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
  });
};

// ============================
// VERIFY RESET OTP
// ============================

export const verifyResetOtp = async (
  email: string,
  otp: string
) => {
  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  const user = await User.findOne({
    email,
    resetPasswordOtp: hashedOtp,
    resetPasswordOtpExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new Error("Invalid or expired OTP");
  }

  user.resetPasswordOtp = undefined;
  user.resetPasswordOtpExpires = undefined;
  await user.save();

  return true;
};


// ============================
// RESET PASSWORD AFTER OTP VERIFICATION
// ============================

export const resetPassword = async (
  email: string,
  newPassword: string
) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const user = await User.findOneAndUpdate(
    { email },
    {
      password: hashedPassword,
      resetPasswordOtp: undefined,
      resetPasswordOtpExpires: undefined,
    }
  );

  if (!user) {
    throw new Error("User not found");
  }
};


// ==============================
// RESEND RESET PASSWORD OTP
// ==============================

export const resendResetPasswordOtp = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user || !user.resetPasswordOtp) {
    throw new Error("Password reset not initiated");
  }

  const now = new Date();

  // ⏳ Cooldown: 60 seconds
  if (
    user.resetOtpLastSentAt &&
    now.getTime() - user.resetOtpLastSentAt.getTime() < 60 * 1000
  ) {
    throw new Error("Please wait before requesting another OTP");
  }

  // 🚫 Limit attempts
  if (user.resetOtpAttempts && user.resetOtpAttempts >= 5) {
    throw new Error("Too many OTP requests. Try again later.");
  }

  // ✅ Generate NEW OTP
  const otp = generateOtp();

  // ✅ Hash OTP (VERY IMPORTANT)
  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  // ✅ Override old OTP (this automatically invalidates previous one)
  user.resetPasswordOtp = hashedOtp;
  user.resetPasswordOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  user.resetOtpLastSentAt = now;
  user.resetOtpAttempts = (user.resetOtpAttempts || 0) + 1;

  await user.save();

  // 📧 Send email
  await sendMail({
    to: user.email,
    subject: "Your New Password Reset OTP - AssignFlow Hub",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light dark">
      <meta name="supported-color-schemes" content="light dark">
      <style>
        /* Minimal dark mode support */
        @media (prefers-color-scheme: dark) {
          body, .email-body { background-color: #1a1a1a !important; }
          .email-container { background-color: #2d2d2d !important; border-color: #404040 !important; }
          h1, h2, h3, p, div { color: #e0e0e0 !important; }
          .otp-box { background-color: #333333 !important; border-color: #2563eb !important; }
          .otp-code { background-color: #404040 !important; color: #ffffff !important; }
          .warning-box { background-color: #3d2b2b !important; border-color: #ef4444 !important; }
          .warning-text { color: #fecaca !important; }
          hr { border-color: #404040 !important; }
          a { color: #66b0ff !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 20px; font-family: Arial, 'Helvetica Neue', sans-serif; line-height: 1.6; background-color: #f5f5f5;" class="email-body">
      
      <!-- Main Container -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; border: 1px solid #e0e0e0;" class="email-container">
        <tr>
          <td style="padding: 30px 25px;">
            
            <!-- Simple Logo/Header -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="padding-bottom: 20px;">
                  <span style="font-size: 24px; font-weight: bold; color: #2563eb;">AssignFlow</span>
                  <span style="font-size: 24px; font-weight: bold; color: #10b981;"> Hub</span>
                </td>
              </tr>
            </table>
            
            <!-- Heading -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center">
                  <h2 style="font-size: 22px; color: #333333; margin: 0 0 15px 0; font-weight: 600;">Password Reset Request</h2>
                </td>
              </tr>
            </table>
            
            <!-- Context -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center">
                  <p style="font-size: 16px; color: #666666; margin: 0 0 20px 0;">
                    We received a request to reset your password. Use the following OTP to complete the process:
                  </p>
                </td>
              </tr>
            </table>
            
            <!-- OTP Box - Prominently Displayed -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 25px 0;">
              <tr>
                <td align="center" style="background-color: #f0f9ff; border: 2px solid #2563eb; border-radius: 10px; padding: 25px 15px;" class="otp-box">
                  <p style="font-size: 14px; color: #2563eb; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Your One-Time Password</p>
                  <div style="font-size: 48px; font-weight: bold; color: #2563eb; letter-spacing: 8px; font-family: 'Courier New', monospace; background-color: #ffffff; padding: 15px 20px; border-radius: 6px; display: inline-block;" class="otp-code">
                    ${otp}
                  </div>
                  <p style="font-size: 14px; color: #666666; margin: 15px 0 0 0;">
                    ⏱️ Valid for 10 minutes only
                  </p>
                </td>
              </tr>
            </table>
            
            <!-- Simple Instructions -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
              <tr>
                <td>
                  <p style="font-size: 14px; color: #666666; margin: 5px 0;">
                    • Enter this 6-digit code on the password reset page
                  </p>
                  <p style="font-size: 14px; color: #666666; margin: 5px 0;">
                    • Create your new password
                  </p>
                  <p style="font-size: 14px; color: #666666; margin: 5px 0;">
                    • Log in with your new credentials
                  </p>
                </td>
              </tr>
            </table>
            
            <!-- Warning Box - Never Share OTP -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 25px 0; background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 6px;" class="warning-box">
              <tr>
                <td style="padding: 12px 15px;">
                  <p style="font-size: 14px; color: #dc2626; margin: 0; font-weight: 500;" class="warning-text">
                    ⚠️ NEVER share this OTP with anyone. Our team will never ask for this code.
                  </p>
                </td>
              </tr>
            </table>
            
            <!-- Request Details -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0; background-color: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 6px;">
              <tr>
                <td style="padding: 12px 15px;">
                  <p style="font-size: 13px; color: #666666; margin: 0;">
                    <strong>Request for:</strong> ${user.email}<br>
                    <strong>Expires:</strong> 10 minutes from request<br>
                    <strong>Time:</strong> ${new Date().toLocaleString()}
                  </p>
                </td>
              </tr>
            </table>
            
            <!-- Didn't Request Section -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 25px 0;">
              <tr>
                <td align="center">
                  <p style="font-size: 14px; color: #666666; margin: 0 0 5px 0;">
                    <strong>Didn't request this password reset?</strong>
                  </p>
                  <p style="font-size: 13px; color: #666666; margin: 0;">
                    If you didn't request a password reset, please ignore this email or 
                    <a href="mailto:support@assignflow.com" style="color: #2563eb; text-decoration: underline;">contact support</a> 
                    if you have concerns.
                  </p>
                </td>
              </tr>
            </table>
            
            <!-- Divider -->
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0 20px 0;">
            
            <!-- Footer -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="color: #999999; font-size: 12px;">
                  <p style="margin: 3px 0;">This is an automated message from AssignFlow Hub</p>
                  <p style="margin: 3px 0;">
                    <a href="mailto:support@assignflow.com" style="color: #2563eb; text-decoration: underline;">Contact Support</a>
                  </p>
                  <p style="margin: 10px 0 0 0;">© ${new Date().getFullYear()} AssignFlow Hub. All rights reserved.</p>
                </td>
              </tr>
            </table>
            
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
  });

  return { success: true };
};

/**
 * ============================
 * LOGIN USER
 * ============================
 */
export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // 🚫 Block login if email not verified
  if (!user.isVerified) {
    throw new Error("Please verify your email before logging in");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    config.jwtSecret,
    { expiresIn: "1d" }
  );

  await logAuditEvent({
    actorRole: "USER",
    actorId: user._id,
    action: "USER_LOGIN",
    entityType: "AUTH",
    entityId: user._id,
    metadata: {
      email: user.email,
    },
  });

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  };
};