import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { verify } from "jsonwebtoken";
import { config } from "../config";

let io: SocketIOServer;

export const initSocket = (httpServer: HttpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*", // tighten later
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

      if (payload.role !== "ADMIN") {
        return next(new Error("Admin access only"));
      }

      socket.data.user = payload;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("🟢 Admin connected via WebSocket");

    socket.on("disconnect", () => {
      console.log("🔴 Admin disconnected");
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};