import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { verify } from "jsonwebtoken";
import { config } from "../config";

let io: SocketIOServer;

export const initSocket = (httpServer: HttpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: (origin, callback) => {
        // Allow all configured origins, localhost, and production domains
        callback(null, true);
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
      socket.data.user = payload;
      next();
    } catch (err: any) {
      return next(new Error("Invalid token"));
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

    // Join / leave classroom specific rooms
    socket.on("join:classroom", (classroomId: string) => {
      if (classroomId) {
        socket.join(`classroom:${classroomId}`);
      }
    });

    socket.on("leave:classroom", (classroomId: string) => {
      if (classroomId) {
        socket.leave(`classroom:${classroomId}`);
      }
    });

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