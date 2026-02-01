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

  // 2️⃣ Email to admin (Professional notification)
  await sendMail({
    to: process.env.ADMIN_CONTACT_EMAIL!,
    subject: `📬 New Contact Message from ${name}`,
    html: generateAdminEmail({ name, email, phone, message: cleanMessage }),
  });

  // 3️⃣ Confirmation to user (Professional receipt)
  await sendMail({
    to: email,
    subject: `✅ Message Received - AssignFlow Hub`,
    html: generateUserConfirmationEmail({ name, message: cleanMessage }),
  });

  return record;
};

// ===================== EMAIL TEMPLATES =====================

const generateAdminEmail = ({ 
  name, 
  email, 
  phone, 
  message 
}: { 
  name: string; 
  email: string; 
  phone?: string; 
  message: string; 
}) => {
  const formattedMessage = message.replace(/\n/g, '<br>');
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>New Contact Message - AssignFlow Hub</title>
  <style>
    @media (prefers-color-scheme: dark) {
      .email-container {
        background-color: #1a1a1a !important;
        color: #e0e0e0 !important;
      }
      .email-card {
        background-color: #2d2d2d !important;
        border-color: #404040 !important;
      }
      .email-header {
        background: linear-gradient(135deg, #1e40af 0%, #047857 100%) !important;
      }
      .email-footer {
        border-top-color: #404040 !important;
      }
      a {
        color: #60a5fa !important;
      }
      .message-box {
        background-color: #262626 !important;
        border-color: #404040 !important;
      }
      .label {
        color: #a0a0a0 !important;
      }
      .value {
        color: #ffffff !important;
      }
    }
    
    @media (prefers-color-scheme: light) {
      .email-container {
        background-color: #f8fafc !important;
        color: #334155 !important;
      }
      .email-card {
        background-color: #ffffff !important;
        border-color: #e2e8f0 !important;
      }
      .email-header {
        background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%) !important;
      }
      .email-footer {
        border-top-color: #e2e8f0 !important;
      }
      a {
        color: #2563eb !important;
      }
      .message-box {
        background-color: #f8fafc !important;
        border-color: #e2e8f0 !important;
      }
      .label {
        color: #64748b !important;
      }
      .value {
        color: #0f172a !important;
      }
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .email-card {
      border-radius: 12px;
      border: 1px solid;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    .email-header {
      padding: 24px;
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .logo {
      font-size: 24px;
      font-weight: 700;
      color: white;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    
    .notification-badge {
      display: inline-block;
      background-color: #f59e0b;
      color: white;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 20px;
      margin-top: 12px;
    }
    
    .email-body {
      padding: 32px 24px;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      margin-bottom: 32px;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .value {
      font-size: 16px;
      font-weight: 500;
    }
    
    .message-box {
      border: 1px solid;
      border-radius: 8px;
      padding: 20px;
      margin-top: 8px;
    }
    
    .message-text {
      font-size: 15px;
      line-height: 1.7;
      white-space: pre-wrap;
    }
    
    .priority-tag {
      display: inline-block;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 6px;
      margin-top: 24px;
    }
    
    .action-button {
      display: inline-block;
      background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%);
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      margin-top: 24px;
      text-align: center;
    }
    
    .email-footer {
      padding: 24px;
      border-top: 1px solid;
      text-align: center;
      font-size: 12px;
    }
    
    .footer-text {
      opacity: 0.8;
      margin-bottom: 8px;
    }
    
    .footer-links {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 16px;
    }
    
    .footer-link {
      text-decoration: none;
      font-size: 12px;
    }
    
    @media (max-width: 480px) {
      .email-container {
        padding: 10px;
      }
      
      .email-body {
        padding: 24px 16px;
      }
      
      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-card">
      <!-- Header -->
      <div class="email-header">
        <a href="${process.env.FRONTEND_URL || 'https://assignflowhub.com'}" class="logo">
          📚 AssignFlow Hub
        </a>
        <div class="notification-badge">
          New Contact Message
        </div>
      </div>
      
      <!-- Body -->
      <div class="email-body">
        <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700;">New Contact Request</h2>
        <p style="margin: 0 0 24px 0; opacity: 0.8;">A user has submitted a contact form on the platform.</p>
        
        <!-- Contact Info -->
        <div class="info-grid">
          <div class="info-item">
            <span class="label">From</span>
            <span class="value">${name}</span>
          </div>
          
          <div class="info-item">
            <span class="label">Email</span>
            <a href="mailto:${email}" style="text-decoration: none;" class="value">${email}</a>
          </div>
          
          ${phone ? `
          <div class="info-item">
            <span class="label">Phone</span>
            <a href="tel:${phone}" style="text-decoration: none;" class="value">${phone}</a>
          </div>
          ` : ''}
          
          <div class="info-item">
            <span class="label">Submitted</span>
            <span class="value">${new Date().toLocaleString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
        </div>
        
        <!-- Message -->
        <div>
          <span class="label">Message</span>
          <div class="message-box">
            <p class="message-text">${formattedMessage}</p>
          </div>
        </div>
        
        <!-- Quick Action -->
        <div style="text-align: center;">
          <div class="priority-tag">
            ⏰ Respond within 24 hours
          </div>
          <br>
          <a href="mailto:${email}" class="action-button">
            Reply to ${name.split(' ')[0]}
          </a>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="email-footer">
        <p class="footer-text">
          This message was automatically generated by AssignFlow Hub Contact System.
        </p>
        <div class="footer-links">
          <a href="${process.env.FRONTEND_URL || 'https://assignflowhub.com'}/admin/contacts" class="footer-link">
            View in Dashboard
          </a>
          <a href="${process.env.FRONTEND_URL || 'https://assignflowhub.com'}/admin/settings" class="footer-link">
            Notification Settings
          </a>
        </div>
        <p class="footer-text" style="margin-top: 16px;">
          © ${new Date().getFullYear()} AssignFlow Hub. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

const generateUserConfirmationEmail = ({ 
  name, 
  message 
}: { 
  name: string; 
  message: string; 
}) => {
  const firstName = name.split(' ')[0];
  const formattedMessage = message.replace(/\n/g, '<br>');
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Message Received - AssignFlow Hub</title>
  <style>
    @media (prefers-color-scheme: dark) {
      .email-container {
        background-color: #1a1a1a !important;
        color: #e0e0e0 !important;
      }
      .email-card {
        background-color: #2d2d2d !important;
        border-color: #404040 !important;
      }
      .email-header {
        background: linear-gradient(135deg, #1e40af 0%, #047857 100%) !important;
      }
      .email-footer {
        border-top-color: #404040 !important;
      }
      .confirmation-badge {
        background-color: #059669 !important;
      }
      .message-box {
        background-color: #262626 !important;
        border-color: #404040 !important;
      }
      .feature-card {
        background-color: #2d2d2d !important;
        border-color: #404040 !important;
      }
    }
    
    @media (prefers-color-scheme: light) {
      .email-container {
        background-color: #f8fafc !important;
        color: #334155 !important;
      }
      .email-card {
        background-color: #ffffff !important;
        border-color: #e2e8f0 !important;
      }
      .email-header {
        background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%) !important;
      }
      .email-footer {
        border-top-color: #e2e8f0 !important;
      }
      .confirmation-badge {
        background-color: #10b981 !important;
      }
      .message-box {
        background-color: #f8fafc !important;
        border-color: #e2e8f0 !important;
      }
      .feature-card {
        background-color: #ffffff !important;
        border-color: #e2e8f0 !important;
      }
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .email-card {
      border-radius: 12px;
      border: 1px solid;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    .email-header {
      padding: 32px 24px;
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .logo {
      font-size: 24px;
      font-weight: 700;
      color: white;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    
    .confirmation-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: white;
      font-size: 14px;
      font-weight: 600;
      padding: 8px 16px;
      border-radius: 20px;
      margin-top: 16px;
    }
    
    .email-body {
      padding: 40px 24px;
    }
    
    .greeting {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 16px 0;
    }
    
    .intro-text {
      font-size: 16px;
      line-height: 1.7;
      margin: 0 0 32px 0;
      opacity: 0.9;
    }
    
    .message-section {
      margin: 32px 0;
    }
    
    .section-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      opacity: 0.7;
      margin-bottom: 8px;
    }
    
    .message-box {
      border: 1px solid;
      border-radius: 8px;
      padding: 20px;
    }
    
    .message-text {
      font-size: 15px;
      line-height: 1.7;
      white-space: pre-wrap;
      margin: 0;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin: 32px 0;
    }
    
    .feature-card {
      border: 1px solid;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
    }
    
    .feature-icon {
      font-size: 24px;
      margin-bottom: 12px;
    }
    
    .feature-title {
      font-size: 14px;
      font-weight: 600;
      margin: 0 0 8px 0;
    }
    
    .feature-desc {
      font-size: 12px;
      opacity: 0.8;
      margin: 0;
    }
    
    .next-steps {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
      border-radius: 8px;
      padding: 24px;
      margin: 32px 0;
    }
    
    .steps-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 16px 0;
    }
    
    .steps-list {
      margin: 0;
      padding-left: 20px;
    }
    
    .steps-list li {
      margin-bottom: 8px;
    }
    
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%);
      color: white;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 24px 0;
    }
    
    .email-footer {
      padding: 24px;
      border-top: 1px solid;
      text-align: center;
      font-size: 12px;
    }
    
    .footer-text {
      opacity: 0.8;
      margin-bottom: 8px;
    }
    
    .footer-links {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin: 16px 0;
    }
    
    .footer-link {
      text-decoration: none;
      font-size: 12px;
    }
    
    .social-links {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 16px;
    }
    
    @media (max-width: 480px) {
      .email-container {
        padding: 10px;
      }
      
      .email-body {
        padding: 24px 16px;
      }
      
      .features-grid {
        grid-template-columns: 1fr;
      }
      
      .greeting {
        font-size: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-card">
      <!-- Header -->
      <div class="email-header">
        <a href="${process.env.FRONTEND_URL || 'https://assignflowhub.com'}" class="logo">
          📚 AssignFlow Hub
        </a>
        <div class="confirmation-badge">
          ✅ Message Received
        </div>
      </div>
      
      <!-- Body -->
      <div class="email-body">
        <h1 class="greeting">Hi ${firstName},</h1>
        
        <p class="intro-text">
          Thank you for reaching out to AssignFlow Hub! We've received your message and 
          appreciate you taking the time to contact us. Our team will review your inquiry 
          and respond if needed within 24 hours.
        </p>
        
        <!-- Message Reference -->
        <div class="message-section">
          <div class="section-label">Your Message</div>
          <div class="message-box">
            <p class="message-text">${formattedMessage}</p>
          </div>
        </div>
        
        <!-- What's Next -->
        <div class="next-steps">
          <h3 class="steps-title">What happens next?</h3>
          <ul class="steps-list">
            <li>Our team reviews your message</li>
            <li>We prioritize based on inquiry type</li>
            <li>You'll receive a response if needed</li>
            <li>We may follow up for more details</li>
          </ul>
        </div>
        
        <!-- Quick Links -->
        <div style="text-align: center; margin: 40px 0;">
          <a href="${process.env.FRONTEND_URL || 'https://assignflowhub.com'}" class="cta-button">
            Return to AssignFlow Hub
          </a>
        </div>
        
        <!-- Helpful Resources -->
        <div>
          <div class="section-label">Helpful Resources</div>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">📚</div>
              <h4 class="feature-title">Knowledge Base</h4>
              <p class="feature-desc">Browse our comprehensive guides and tutorials</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">❓</div>
              <h4 class="feature-title">FAQ</h4>
              <p class="feature-desc">Find quick answers to common questions</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="email-footer">
        <p class="footer-text">
          This is an automated confirmation of your contact form submission.
        </p>
        
        <div class="footer-links">
          <a href="${process.env.FRONTEND_URL || 'https://assignflowhub.com'}/contact" class="footer-link">
            Contact Us
          </a>
          <a href="${process.env.FRONTEND_URL || 'https://assignflowhub.com'}/privacy" class="footer-link">
            Privacy Policy
          </a>
          <a href="${process.env.FRONTEND_URL || 'https://assignflowhub.com'}/support" class="footer-link">
            Support Center
          </a>
        </div>
        
        <div class="social-links">
          <a href="https://twitter.com/assignflowhub" style="text-decoration: none;">🐦 Twitter</a>
          <a href="https://linkedin.com/company/assignflowhub" style="text-decoration: none;">💼 LinkedIn</a>
          <a href="https://github.com/assignflowhub" style="text-decoration: none;">🐙 GitHub</a>
        </div>
        
        <p class="footer-text" style="margin-top: 16px;">
          © ${new Date().getFullYear()} AssignFlow Hub. All rights reserved.<br>
          ${process.env.FRONTEND_URL || 'https://assignflowhub.com'}
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};