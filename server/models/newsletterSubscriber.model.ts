// server/modules/newsletter/newsletterSubscriber.model.ts

import mongoose, { Schema, Document } from "mongoose";

export interface INewsletterSubscriber extends Document {
  email: string;
  status: "subscribed" | "unsubscribed";
  subscribedAt: Date;
  unsubscribedAt?: Date;
  unsubscribeReason?: string;
  source: "footer" | "signup" | "settings" | "manual" | "website";
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["subscribed", "unsubscribed"],
      default: "subscribed",
    },

    subscribedAt: {
      type: Date,
      default: Date.now,
    },

    unsubscribedAt: {
      type: Date,
    },

    unsubscribeReason: {
      type: String,
      maxlength: 300,
    },

    source: {
      type: String,
      enum: ["footer", "signup", "settings", "manual","website"],
      default: "website",
    },
  },
  {
    timestamps: true,
  }
);

export const NewsletterSubscriber = mongoose.model<INewsletterSubscriber>(
  "NewsletterSubscriber",
  NewsletterSubscriberSchema
);