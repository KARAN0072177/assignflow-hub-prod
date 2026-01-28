import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { User, UserRole } from "../models/user.model";
import { connectDB } from "../db";

const createAdmin = async () => {
  await connectDB();

  const email = "admin@assignflow.com";
  const password = "Admin@123"; // move to env later

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    email,
    password: hashed,
    role: UserRole.ADMIN,
  });

  console.log("Admin user created");
  process.exit(0);
};

createAdmin();