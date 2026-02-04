export const newsletterSubscribedTemplate = (email: string) => {
  const unsubscribeUrl = `http://localhost:5173/unsubscribe?email=${encodeURIComponent(
    email
  )}`;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>You're subscribed 🎉</h2>

      <p>
        This email confirms that <b>${email}</b> is now subscribed to the
        <strong>AssignFlow Hub Newsletter</strong>.
      </p>

      <p>You’ll receive:</p>
      <ul>
        <li>Platform updates</li>
        <li>New feature announcements</li>
        <li>Important system & security notices</li>
      </ul>

      <p style="margin-top: 24px;">
        You can unsubscribe anytime:
      </p>

      <p>
        <a href="${unsubscribeUrl}">
          Unsubscribe from newsletter
        </a>
      </p>

      <p style="margin-top: 32px; font-size: 12px; color: #666;">
        AssignFlow Hub Team
      </p>
    </div>
  `;
};