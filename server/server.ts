// server/server.ts
import "./types/express";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import { config } from "./config";
import { connectDB, disconnectDB } from "./db";

import authRoutes from "./modules/auth/auth.routes";

import { requireAuth } from "./middleware/requireAuth";

import classroomRoutes from "./modules/classrooms/classroom.routes";

import assignmentRoutes from "./modules/assignments/assignment.routes";

import submissionRoutes from "./modules/submissions/submission.routes";
import gradeRoutes from "./modules/grades/grade.routes";

import { registerRepeatableJobs } from "./queues/scheduler";  // import the scheduler

import adminRoutes from "./modules/admin/admin.routes"; // import admin routes

import { adminGuard } from "./middleware/adminGuard";
import { bullmqAuth } from "./middleware/bullmqAuth";

import adminAnalyticsRoutes from "./modules/admin/admin.analytics.routes";

import adminSystemRoutes from "./modules/admin/admin.system.routes";

import { Router } from "express";

import feedbackRoutes from "./modules/feedback/feedback.routes";

import contactRoutes from "./modules/contact/contact.routes";

import adminContactRoutes from "./modules/admin/admin.contact.routes";

import newsletterRoutes from "./modules/newsletter/newsletter.routes";

import adminNewsletterRoutes from "./modules/newsletter/admin.newsletter.routes";


// websockets imports

import http from "http";
import { initSocket } from "./socket";



const app = express();

/**
 * Global middlewares
 */

// CORS MUST BE FIRST
app.use(
  cors({
    origin: [
      "https://assignflowhub.karanart.com",
      "http://localhost:5173",
      "http://localhost:4173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight explicitly
app.options("*", cors());

app.use(helmet());



// Limit JSON body size (important for security)
app.use(express.json({ limit: "10mb" }));

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

// after middlewares
app.use("/api/auth", authRoutes);          // login and register (auth management) routes
app.use("/api/classrooms", classroomRoutes);    // classroom management routes
app.use("/api/assignments", assignmentRoutes);  // assignment management routes
app.use("/api/submissions", submissionRoutes);     // submission management routes
app.use("/api/grades", gradeRoutes);             // grade management routes


// Admin routes

app.use("/api/admin", adminRoutes);              // admin management routes 
app.use("/api/admin", adminAnalyticsRoutes);     // admin analytics routes
app.use("/api/admin", adminSystemRoutes);       // admin system metadata routes
app.use("/api/admin", adminContactRoutes);
app.use("/api/admin/newsletter", adminNewsletterRoutes);



app.use("/api/feedback", feedbackRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);


app.get("/api/test-auth", requireAuth, (req, res) => {
  res.json({ message: "Authenticated access granted", user: req.user });
});


// ===============================
// Global Error Handler (LAST)
// ===============================
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("🔥 Unhandled Error:", err);

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});


const server = http.createServer(app);

// 🔌 Initialize WebSocket layer (admin-only)
initSocket(server);


/**
 * Server bootstrap
 */
const startServer = async () => {
  try {
    await connectDB();

    if (process.env.NODE_ENV === "production") {
      // 🔥 Lazy-load BullMQ dashboard ONLY in prod
      const { setupBullMQDashboard } = await import("./admin/bullmq");
      const bullBoardAdapter = setupBullMQDashboard();

      app.use(
        "/admin/queues",
        bullmqAuth,
        bullBoardAdapter.getRouter()
      );

      await registerRepeatableJobs();
      await import("./worker/worker");
    }

    server.listen(config.port, () => {
      console.log(
        `🚀 AssignFlow Hub API + WebSocket running on port ${config.port} (${config.env})`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

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