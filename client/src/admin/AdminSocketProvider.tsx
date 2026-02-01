import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/* =====================
   Types
===================== */

type AdminSocketContextType = {
  connected: boolean;
  lastEvent?: {
    type: string;
    payload: any;
  };
};

const AdminSocketContext = createContext<
  AdminSocketContextType | undefined
>(undefined);

/* =====================
   Provider
===================== */

export const AdminSocketProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<
    { type: string; payload: any } | undefined
  >(undefined);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    // 🚫 Only admins should connect
    if (!token || role !== "ADMIN") {
      return;
    }

    // 🔌 Create socket connection ONCE
    const socket = io(API_BASE_URL, {
      auth: {
        token,
      },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      console.log("🟢 Admin WebSocket connected");
    });

    socket.on("disconnect", () => {
      setConnected(false);
      console.log("🔴 Admin WebSocket disconnected");
    });

    /* =====================
       Event Listeners
       (extend later)
    ===================== */

    socket.on("contact:new", (payload) => {
      setLastEvent({
        type: "contact:new",
        payload,
      });
    });

    /* =====================
       Cleanup
    ===================== */
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  return (
    <AdminSocketContext.Provider
      value={{
        connected,
        lastEvent,
      }}
    >
      {children}
    </AdminSocketContext.Provider>
  );
};

/* =====================
   Hook
===================== */

export const useAdminSocket = () => {
  const ctx = useContext(AdminSocketContext);
  if (!ctx) {
    throw new Error(
      "useAdminSocket must be used inside AdminSocketProvider"
    );
  }
  return ctx;
};