// server/server.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";

import { config } from "./config";
import { connectDB, disconnectDB } from "./db";

const app = express();

/**
 * Global middlewares
 */
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send(`
    <h2>🚀 AssignFlow Hub API is running!</h2>
    <p>Status: Server working perfectly.</p>
    <p>Try <code>/health</code> for JSON health check.</p>
  `);
});

/**
 * Health check
 * Used for deployment & monitoring
 */
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "assignflow-hub-api",
    env: config.env,
  });
});

/**
 * Mount modules (empty for now)
 * Example:
 * app.use("/api/auth", authRoutes);
 */

/**
 * Server bootstrap
 */
const startServer = async () => {
  await connectDB();

  app.listen(config.port, () => {
    console.log(
      `🚀 AssignFlow Hub API running on port ${config.port} (${config.env})`
    );
  });
};

startServer();

/**
 * Graceful shutdown
 */
const shutdown = async () => {
  console.log("🛑 Shutting down server...");
  await disconnectDB();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);