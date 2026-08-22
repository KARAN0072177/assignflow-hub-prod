import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { verify } from "jsonwebtoken";
import { config } from "../config";

let io: SocketIOServer;

export const initSocket = (httpServer: HttpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    try {
      const payload = verify(token, config.jwtSecret) as any;
      socket.data.user = payload;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user;

    if (user?.userId) {
      // Join user specific room
      socket.join(`user:${user.userId}`);
      socket.join(`role:${user.role}`);

      if (user.role === "TEACHER") {
        socket.join(`teacher:${user.userId}`);
      }
    }

    // Join / leave assignment specific rooms
    socket.on("join:assignment", (assignmentId: string) => {
      if (assignmentId) {
        socket.join(`assignment:${assignmentId}`);
      }
    });

    socket.on("leave:assignment", (assignmentId: string) => {
      if (assignmentId) {
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