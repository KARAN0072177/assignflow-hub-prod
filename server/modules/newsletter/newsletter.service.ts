import { NewsletterSubscriber } from "../../models/newsletterSubscriber.model";
import { sendMail } from "../../utils/mailer";
import { newsletterSubscribedTemplate } from "./newsletter.mail";

export const subscribeToNewsletter = async (
  email: string,
  source: string = "footer"
) => {
  const existing = await NewsletterSubscriber.findOne({ email });

  // Already subscribed → no email
  if (existing && existing.status === "subscribed") {
    return { alreadySubscribed: true };
  }

  // Resubscribe
  if (existing && existing.status === "unsubscribed") {
    existing.status = "subscribed";
    existing.subscribedAt = new Date();
    existing.unsubscribedAt = undefined;
    existing.unsubscribeReason = undefined;

    await existing.save();

    // 📧 confirmation mail (NON-BLOCKING)
    sendMail({
      to: email,
      subject: "You're subscribed to AssignFlow Hub Newsletter",
      html: newsletterSubscribedTemplate(email),
    }).catch((err) => {
      console.error("❌ Newsletter resubscribe email failed:", err);
    });

    return { resubscribed: true };
  }

  // New subscriber
  await NewsletterSubscriber.create({
    email,
    source,
  });

  // 📧 confirmation mail (NON-BLOCKING)
  sendMail({
    to: email,
    subject: "You're subscribed to AssignFlow Hub Newsletter",
    html: newsletterSubscribedTemplate(email),
  }).catch((err) => {
    console.error("❌ Newsletter subscribe email failed:", err);
  });

  return { subscribed: true };
};

export const unsubscribeFromNewsletter = async (
  email: string,
  reason?: string
) => {
  const subscriber = await NewsletterSubscriber.findOne({ email });

  if (!subscriber) {
    return { notFound: true };
  }

  if (subscriber.status === "unsubscribed") {
    return { alreadyUnsubscribed: true };
  }

  subscriber.status = "unsubscribed";
  subscriber.unsubscribedAt = new Date();
  subscriber.unsubscribeReason = reason;

  await subscriber.save();

  return { unsubscribed: true };
};