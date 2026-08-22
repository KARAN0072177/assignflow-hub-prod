// server/server.ts
import "./config/dns";
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

import sitemapRoutes from "./modules/seo/sitemap.routes"; // new import for sitemap route

import robotsRoutes from "./modules/seo/robots.routes"; // new import for robots.txt route 

import verifyRoutes from "./modules/auth/auth.verify.routes"; // new import for email verification routes

// websockets imports

import http from "http";
import { initSocket } from "./socket";
import blogRoutes from "./modules/blog/blog.routes";



const app = express();

/**
 * Global middlewares
 */

import { noSqlSanitizer, xssSanitizer } from "./middleware/security";
import {
  authLimiter,
  publicFormsLimiter,
  courseworkLimiter,
} from "./middleware/rateLimiters";

// CORS MUST BE FIRST
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "https://assignflowhub.karanart.com",
      "http://localhost:5173",
      "http://localhost:4173",
    ];

    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.endsWith(".onrender.com")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Handle preflight explicitly
app.options("*", cors(corsOptions));

// 🛡️ Enterprise Security Headers (CSP, COOP, CORP, HSTS, X-Frame-Options)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: [
          "'self'",
          "https://assignflowhub.karanart.com",
          "https://*.onrender.com",
          "https://*.amazonaws.com",
          "wss://*.onrender.com",
          "http://localhost:5173",
          "http://localhost:4173",
          "http://localhost:5000",
          "ws://localhost:5000",
        ],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: process.env.NODE_ENV === "production" ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xContentTypeOptions: true,
    xFrameOptions: { action: "deny" },
  })
);

// Limit JSON body size
app.use(express.json({ limit: "10mb" }));

// 🛡️ NoSQL Injection & Stored XSS Sanitization Middlewares
app.use(noSqlSanitizer);
app.use(xssSanitizer);

app.get("/", (_req, res) => {
  res.send(`
    <h2>🚀 AssignFlow Hub API is running!</h2>
    <p>Status: Server working securely.</p>
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
 * Mount modules with Granular Rate Limiters
 */

// 🔐 Authentication routes (protected by strict authLimiter)
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/auth", authLimiter, verifyRoutes);

// 📁 Coursework & Classroom management (protected by courseworkLimiter)
app.use("/api/classrooms", courseworkLimiter, classroomRoutes);
app.use("/api/assignments", courseworkLimiter, assignmentRoutes);
app.use("/api/submissions", courseworkLimiter, submissionRoutes);

// 📊 Grade & Evaluation suite (never throttles heavy batch grading for teachers)
app.use("/api/grades", gradeRoutes);

// 🛡️ Admin routes
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminAnalyticsRoutes);
app.use("/api/admin", adminSystemRoutes);
app.use("/api/admin", adminContactRoutes);
app.use("/api/admin/newsletter", adminNewsletterRoutes);

// 📨 Public communication forms (protected by publicFormsLimiter)
app.use("/api/feedback", publicFormsLimiter, feedbackRoutes);
app.use("/api/contact", publicFormsLimiter, contactRoutes);
app.use("/api/newsletter", publicFormsLimiter, newsletterRoutes);

// 📖 Blog & SEO routes
app.use("/api/blogs", blogRoutes);
app.use("/", sitemapRoutes);
app.use("/", robotsRoutes);

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

    const PORT = Number(process.env.PORT) || config.port || 5000;

    server.listen(PORT, "0.0.0.0", () => {
      console.log(
        `🚀 AssignFlow Hub API + WebSocket running on port ${PORT} (${config.env})`
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

startServer();