import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, UserRole } from "../../models/user.model";
import { config } from "../../config";
import { logAuditEvent } from "../../utils/auditLogger";

const SALT_ROUNDS = 10;

export const registerUser = async (
  email: string,
  password: string,
  role: UserRole
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    email,
    password: hashedPassword,
    role,
  });

  return {
    id: user._id,
    email: user.email,
    role: user.role,
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    config.jwtSecret,
    { expiresIn: "1d" }
  );

  await logAuditEvent({
  actorRole: "USER",
  actorId: user._id,
  action: "USER_LOGIN",
  entityType: "AUTH",
  entityId: user._id,
  metadata: {
    email: user.email,
  },
});


  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  };
};