export const newsletterSubscribedTemplate = (email: string) => {
  const unsubscribeUrl = `http://localhost:5173/unsubscribe?email=${encodeURIComponent(
    email
  )}`;

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Welcome to AssignFlow Hub Newsletter</title>

<style>
  /* CSS Variables for theme support */
  :root {
    --background: #ffffff;
    --surface: #f8fafc;
    --text-primary: #1f2937;
    --text-secondary: #6b7280;
    --text-muted: #9ca3af;
    --border: #e5e7eb;
    --primary: #2563eb;
    --primary-hover: #1d4ed8;
    --success: #059669;
    --radius: 8px;
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    --spacing-2xl: 40px;
    --font-size-sm: 14px;
    --font-size-base: 16px;
    --font-size-lg: 20px;
    --font-size-xl: 28px;
    --line-height: 1.7;
    --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --background: #111827;
      --surface: #1f2937;
      --text-primary: #f9fafb;
      --text-secondary: #d1d5db;
      --text-muted: #9ca3af;
      --border: #374151;
      --primary: #3b82f6;
      --primary-hover: #60a5fa;
      --success: #10b981;
    }
  }

  /* Base styles */
  body {
    margin: 0;
    padding: var(--spacing-md);
    font-family: var(--font-family);
    background: var(--background);
    color: var(--text-primary);
    line-height: var(--line-height);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Container */
  .container {
    max-width: 600px;
    width: 100%;
    margin: 0 auto;
    background: var(--surface);
    border-radius: var(--radius);
    padding: var(--spacing-xl);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border: 1px solid var(--border);
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    body {
      padding: var(--spacing-sm);
    }
    
    .container {
      padding: var(--spacing-lg);
    }
  }

  /* Header */
  .header {
    text-align: center;
    margin-bottom: var(--spacing-2xl);
    padding-bottom: var(--spacing-lg);
    border-bottom: 2px solid var(--success);
  }

  .header-icon {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-md);
    display: block;
  }

  .header-title {
    font-size: var(--font-size-lg);
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 var(--spacing-sm) 0;
  }

  .header-subtitle {
    font-size: var(--font-size-base);
    color: var(--text-secondary);
    margin: 0;
  }

  /* Content */
  .content {
    margin-bottom: var(--spacing-2xl);
  }

  .email-highlight {
    background: linear-gradient(120deg, rgba(37, 99, 235, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
    border-left: 4px solid var(--primary);
    padding: var(--spacing-md);
    border-radius: var(--radius);
    margin: var(--spacing-lg) 0;
  }

  .email-address {
    font-weight: 600;
    color: var(--primary);
    word-break: break-all;
  }

  /* Benefits List */
  .benefits-list {
    margin: var(--spacing-xl) 0;
  }

  .benefit-item {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
  }

  .benefit-icon {
    color: var(--success);
    font-size: 18px;
    line-height: 1;
    margin-top: 2px;
    flex-shrink: 0;
  }

  .benefit-text {
    color: var(--text-primary);
  }

  /* Unsubscribe Section */
  .unsubscribe-section {
    margin-top: var(--spacing-2xl);
    padding-top: var(--spacing-xl);
    border-top: 1px solid var(--border);
  }

  .unsubscribe-title {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: var(--spacing-sm);
  }

  .unsubscribe-button {
    display: inline-block;
    padding: var(--spacing-sm) var(--spacing-lg);
    background: transparent;
    border: 1px solid var(--border);
    border-radius: calc(var(--radius) * 0.75);
    color: var(--text-secondary);
    text-decoration: none;
    font-size: var(--font-size-sm);
    transition: all 0.2s ease;
  }

  .unsubscribe-button:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: #ef4444;
    color: #ef4444;
  }

  /* Footer */
  .footer {
    margin-top: var(--spacing-2xl);
    padding-top: var(--spacing-lg);
    border-top: 1px solid var(--border);
    text-align: center;
    font-size: var(--font-size-sm);
    color: var(--text-muted);
  }

  .footer-brand {
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: var(--spacing-xs);
  }

  /* Links */
  a {
    color: var(--primary);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: var(--primary-hover);
    text-decoration: underline;
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    :root {
      --primary: #0044cc;
      --success: #006600;
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
        --text-primary: #ffffff;
        --text-secondary: #cccccc;
      }
    }
    
    a {
      text-decoration: underline;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    a, .unsubscribe-button {
      transition: none;
    }
  }

  /* Print styles */
  @media print {
    body {
      background: white !important;
      color: black !important;
      padding: 0 !important;
    }
    
    .container {
      box-shadow: none !important;
      border: 1px solid #ddd !important;
      max-width: 100% !important;
      margin: 0 !important;
    }
    
    a {
      color: #0066cc !important;
    }
  }
</style>
</head>

<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <span class="header-icon" role="img" aria-label="Celebration">🎉</span>
      <h1 class="header-title">You're Subscribed!</h1>
      <p class="header-subtitle">Welcome to AssignFlow Hub Newsletter</p>
    </div>

    <!-- Content -->
    <div class="content">
      <p>This email confirms that you have successfully subscribed to the <strong>AssignFlow Hub Newsletter</strong>.</p>

      <div class="email-highlight">
        <p style="margin: 0 0 var(--spacing-xs) 0; font-size: var(--font-size-sm); color: var(--text-secondary);">
          Subscribed email:
        </p>
        <p class="email-address" style="margin: 0;">
          ${email}
        </p>
      </div>

      <!-- Benefits List -->
      <div class="benefits-list">
        <p style="margin: 0 0 var(--spacing-md) 0; font-weight: 600; color: var(--text-primary);">
          You'll receive:
        </p>
        
        <div class="benefit-item">
          <span class="benefit-icon" role="img" aria-label="Checkmark">✓</span>
          <span class="benefit-text">Platform updates and new features</span>
        </div>
        
        <div class="benefit-item">
          <span class="benefit-icon" role="img" aria-label="Checkmark">✓</span>
          <span class="benefit-text">Important system and security announcements</span>
        </div>
        
        <div class="benefit-item">
          <span class="benefit-icon" role="img" aria-label="Checkmark">✓</span>
          <span class="benefit-text">Productivity tips and best practices</span>
        </div>
      </div>

      <p>We're excited to keep you updated with the latest developments from AssignFlow Hub.</p>
    </div>

    <!-- Unsubscribe Section -->
    <div class="unsubscribe-section">
      <p class="unsubscribe-title">Manage your subscription:</p>
      <p style="margin: 0 0 var(--spacing-md) 0; color: var(--text-secondary);">
        You can unsubscribe anytime if you no longer wish to receive these emails.
      </p>
      <a href="${unsubscribeUrl}" class="unsubscribe-button" title="Unsubscribe from AssignFlow Hub Newsletter">
        Unsubscribe
      </a>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-brand">AssignFlow Hub Team</div>
      <div style="font-size: 12px; margin-top: var(--spacing-xs);">
        Thank you for being part of our community
      </div>
    </div>
  </div>
</body>
</html>
  `;
};