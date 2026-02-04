// server/modules/newsletter/newsletter.admin.service.ts

import sanitizeHtml from "sanitize-html";
import { NewsletterSubscriber } from "../../models/newsletterSubscriber.model";
import { sendMail } from "../../utils/mailer";
import { generateNewsletterCampaignTemplate } from "./newsletter.admin.mail";

/**
 * Fetch subscribers (optionally filtered)
 */
export const getNewsletterSubscribers = async (status?: string) => {
  const filter: any = {};

  if (status) {
    filter.status = status; // subscribed | unsubscribed
  }

  const subscribers = await NewsletterSubscriber.find(filter)
    .sort({ createdAt: -1 })
    .lean();

  return subscribers;
};

/**
 * Send campaign to all subscribed users
 */
export const sendNewsletterCampaign = async (
  subject: string,
  content: string
) => {
  // 1️⃣ Sanitize admin input
  const cleanContent = sanitizeHtml(content, {
    allowedTags: [],
    allowedAttributes: {},
  });

  // 2️⃣ Get subscribed users
  const subscribers = await NewsletterSubscriber.find({
    status: "subscribed",
  }).select("email");

  let sentCount = 0;

  // 3️⃣ Send mail one-by-one
  for (const user of subscribers) {
    const html = generateNewsletterCampaignTemplate({
      title: subject,
      content: cleanContent,
      unsubscribeUrl: `${process.env.FRONTEND_URL}/unsubscribe?email=${user.email}`,
    });

    await sendMail({
      to: user.email,
      subject,
      html,
    });

    sentCount++;
  }

  return {
    sentCount,
  };
};