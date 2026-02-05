// server/modules/newsletter/newsletter.admin.mail.ts

export const generateNewsletterCampaignTemplate = ({
  title,
  content,
  unsubscribeUrl,
}: {
  title: string;
  content: string;     // already sanitized text
  unsubscribeUrl: string;
}) => {
  const formattedContent = content.replace(/\n/g, "<br>");

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>

<style>
  /* Base styles with CSS variables for theme support */
  :root {
    --background: #ffffff;
    --surface: #f8fafc;
    --text-primary: #1f2937;
    --text-secondary: #6b7280;
    --text-muted: #9ca3af;
    --border: #e5e7eb;
    --primary: #2563eb;
    --primary-hover: #1d4ed8;
    --radius: 8px;
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    --spacing-2xl: 40px;
    --font-size-sm: 14px;
    --font-size-base: 16px;
    --font-size-lg: 24px;
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
    }
  }

  /* Reset and base styles */
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

  /* Container with responsive max-width */
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

  /* Responsive padding adjustments */
  @media (max-width: 640px) {
    body {
      padding: var(--spacing-sm);
    }
    
    .container {
      padding: var(--spacing-lg);
      border-radius: var(--radius);
    }
  }

  @media (max-width: 480px) {
    .container {
      padding: var(--spacing-md);
      border-radius: calc(var(--radius) * 0.75);
    }
  }

  /* Header with responsive typography */
  .header {
    text-align: center;
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-lg);
    border-bottom: 2px solid var(--primary);
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
    margin: 0;
    line-height: 1.4;
  }

  @media (max-width: 640px) {
    .header {
      margin-bottom: var(--spacing-lg);
      padding-bottom: var(--spacing-md);
    }
    
    .header-title {
      font-size: var(--font-size-base);
    }
    
    .header-icon {
      font-size: var(--font-size-lg);
    }
  }

  /* Content area */
  .content {
    font-size: var(--font-size-base);
    color: var(--text-primary);
    margin-bottom: var(--spacing-2xl);
  }

  .content p {
    margin-bottom: var(--spacing-md);
  }

  .content p:last-child {
    margin-bottom: 0;
  }

  /* Links styling */
  a {
    color: var(--primary);
    text-decoration: none;
    transition: color 0.2s ease;
    position: relative;
  }

  a:hover {
    color: var(--primary-hover);
    text-decoration: underline;
  }

  a:focus {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }

  /* Footer */
  .footer {
    margin-top: var(--spacing-2xl);
    padding-top: var(--spacing-lg);
    border-top: 1px solid var(--border);
    text-align: center;
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .footer-text {
    margin-bottom: var(--spacing-sm);
    color: var(--text-muted);
  }

  .footer-links {
    margin-top: var(--spacing-md);
  }

  .unsubscribe-link {
    display: inline-block;
    padding: var(--spacing-xs) var(--spacing-sm);
    background: transparent;
    border: 1px solid var(--border);
    border-radius: calc(var(--radius) * 0.5);
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    transition: all 0.2s ease;
    text-decoration: none;
  }

  .unsubscribe-link:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: #ef4444;
    color: #ef4444;
    text-decoration: none;
  }

  /* Utility classes for spacing */
  .my-2 {
    margin-top: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
  }

  .my-4 {
    margin-top: var(--spacing-md);
    margin-bottom: var(--spacing-md);
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

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    :root {
      --primary: #0044cc;
      --text-primary: #000000;
      --text-secondary: #333333;
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
    a {
      transition: none;
    }
  }
</style>
</head>

<body>
  <div class="container">
    <!-- Header Section -->
    <div class="header">
      <span class="header-icon" role="img" aria-label="Announcement">📢</span>
      <h1 class="header-title">${title}</h1>
    </div>

    <!-- Content Section -->
    <div class="content">
      ${formattedContent}
    </div>

    <!-- Footer Section -->
    <div class="footer">
      <div class="footer-text">
        You are receiving this email because you subscribed to the AssignFlow Hub Newsletter.
      </div>
      <div class="my-2">
        If you no longer wish to receive these emails, you can unsubscribe below.
      </div>
      <div class="footer-links">
        <a href="${unsubscribeUrl}" 
           class="unsubscribe-link"
           title="Unsubscribe from AssignFlow Hub Newsletter">
          Unsubscribe
        </a>
      </div>
      <div class="my-4">
        <small>
          &copy; ${new Date().getFullYear()} AssignFlow Hub. All rights reserved.
        </small>
      </div>
    </div>
  </div>
</body>
</html>
`;
};