import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Contact: Model<IContact> =
  mongoose.models.Contact ||
  mongoose.model<IContact>("Contact", ContactSchema);