import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { verify } from "jsonwebtoken";
import { Types } from "mongoose";
import { config } from "../config";
import { Classroom } from "../models/classroom.model";
import { Membership } from "../models/membership.model";
import { Assignment } from "../models/assignment.model";

let io: SocketIOServer;

export const initSocket = (httpServer: HttpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: (origin, callback) => {
        const allowedOrigins = [
          "https://assignflowhub.karanart.com",
          "http://localhost:5173",
          "http://localhost:4173",
        ];
        if (process.env.FRONTEND_URL) {
          allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ""));
        }
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Origin not allowed by WebSocket CORS"));
        }
      },
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["polling", "websocket"],
    allowUpgrades: true,
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.use((socket, next) => {
    let token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization;

    if (!token || typeof token !== "string") {
      return next(new Error("Authentication required"));
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    }

    try {
      const payload = verify(token, config.jwtSecret) as any;
      if (!payload || !payload.userId || !payload.role) {
        return next(new Error("Invalid token payload"));
      }
      if (!Types.ObjectId.isValid(payload.userId)) {
        return next(new Error("Invalid user ID in token"));
      }
      socket.data.user = payload;
      next();
    } catch (err: any) {
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user;
    if (!user || !user.userId) {
      socket.disconnect(true);
      return;
    }

    const userId = new Types.ObjectId(user.userId);

    // Join user specific room and role room
    socket.join(`user:${user.userId}`);
    socket.join(`role:${user.role}`);

    if (user.role === "TEACHER") {
      socket.join(`teacher:${user.userId}`);
    }

    // Join classroom room with strict authorization
    socket.on("join:classroom", async (classroomId: unknown) => {
      if (
        !classroomId ||
        typeof classroomId !== "string" ||
        !Types.ObjectId.isValid(classroomId)
      ) {
        return;
      }

      try {
        const classObjId = new Types.ObjectId(classroomId);

        // Admins can join any classroom for oversight
        if (user.role === "ADMIN") {
          socket.join(`classroom:${classroomId}`);
          return;
        }

        // Teachers can only join classrooms they own
        if (user.role === "TEACHER") {
          const ownsClassroom = await Classroom.exists({
            _id: classObjId,
            teacherId: userId,
          });
          if (ownsClassroom) {
            socket.join(`classroom:${classroomId}`);
            return;
          }
        }

        // Students can only join classrooms they are enrolled in
        if (user.role === "STUDENT") {
          const isEnrolled = await Membership.exists({
            classroomId: classObjId,
            studentId: userId,
          });
          if (isEnrolled) {
            socket.join(`classroom:${classroomId}`);
            return;
          }
        }

        console.warn(
          `[Socket Security] Unauthorized join:classroom attempt by user ${user.userId} for room ${classroomId}`
        );
        socket.emit("error:unauthorized", {
          message: "You are not authorized to join this classroom stream.",
        });
      } catch (err) {
        console.error("[Socket Security] Error verifying classroom access:", err);
      }
    });

    socket.on("leave:classroom", (classroomId: unknown) => {
      if (classroomId && typeof classroomId === "string") {
        socket.leave(`classroom:${classroomId}`);
      }
    });

    // Join assignment room with strict authorization
    socket.on("join:assignment", async (assignmentId: unknown) => {
      if (
        !assignmentId ||
        typeof assignmentId !== "string" ||
        !Types.ObjectId.isValid(assignmentId)
      ) {
        return;
      }

      try {
        const assignObjId = new Types.ObjectId(assignmentId);
        const assignment = await Assignment.findById(assignObjId).select(
          "classroomId"
        );
        if (!assignment) {
          return;
        }

        // Admins can join any assignment discussion stream
        if (user.role === "ADMIN") {
          socket.join(`assignment:${assignmentId}`);
          return;
        }

        // Teachers can only join if they own the classroom
        if (user.role === "TEACHER") {
          const ownsClassroom = await Classroom.exists({
            _id: assignment.classroomId,
            teacherId: userId,
          });
          if (ownsClassroom) {
            socket.join(`assignment:${assignmentId}`);
            return;
          }
        }

        // Students can only join if they are enrolled in the classroom
        if (user.role === "STUDENT") {
          const isEnrolled = await Membership.exists({
            classroomId: assignment.classroomId,
            studentId: userId,
          });
          if (isEnrolled) {
            socket.join(`assignment:${assignmentId}`);
            return;
          }
        }

        console.warn(
          `[Socket Security] Unauthorized join:assignment attempt by user ${user.userId} for room ${assignmentId}`
        );
        socket.emit("error:unauthorized", {
          message: "You are not authorized to join this assignment discussion.",
        });
      } catch (err) {
        console.error("[Socket Security] Error verifying assignment access:", err);
      }
    });

    socket.on("leave:assignment", (assignmentId: unknown) => {
      if (assignmentId && typeof assignmentId === "string") {
        socket.leave(`assignment:${assignmentId}`);
      }
    });

    socket.on("disconnect", () => {
      // Cleanup handled automatically by socket.io
    });
  });

  return io;
};

export const getIO = (): SocketIOServer | null => {
  return io || null;
};