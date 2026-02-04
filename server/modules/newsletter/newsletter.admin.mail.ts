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
<title>${title}</title>

<style>
body {
  font-family: Arial, sans-serif;
  background: #f8fafc;
  padding: 20px;
}

.container {
  max-width: 600px;
  margin: auto;
  background: #ffffff;
  border-radius: 8px;
  padding: 32px;
}

.header {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}

.content {
  margin-top: 24px;
  font-size: 15px;
  line-height: 1.7;
}

.footer {
  margin-top: 40px;
  font-size: 12px;
  color: #666;
  text-align: center;
}
a {
  color: #2563eb;
}
</style>
</head>

<body>
  <div class="container">
    <div class="header">📢 ${title}</div>

    <div class="content">
      ${formattedContent}
    </div>

    <div class="footer">
      You are receiving this because you subscribed to AssignFlow Hub Newsletter.<br/>
      <a href="${unsubscribeUrl}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>
`;
};