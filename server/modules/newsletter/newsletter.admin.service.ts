import { NewsletterSubscriber } from "../../models/newsletterSubscriber.model";
import { sendMail } from "../../utils/mailer";

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

export const sendNewsletterCampaign = async (
  subject: string,
  html: string
) => {
  const subscribers = await NewsletterSubscriber.find({
    status: "subscribed",
  });

  let sentCount = 0;

  for (const user of subscribers) {
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