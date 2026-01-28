import basicAuth from "express-basic-auth";
import { config } from "../config";

export const bullmqAuth = basicAuth({
  users: {
    [config.bullmqAdminUser]: config.bullmqAdminPass,
  },
  challenge: true,
});