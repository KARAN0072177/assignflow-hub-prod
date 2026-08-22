import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { getTeacherUnreadDiscussionsCount } from "../services/comment.api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  unreadDiscussionsCount: number;
  setUnreadDiscussionsCount: React.Dispatch<React.SetStateAction<number>>;
  refreshUnreadCount: () => Promise<void>;
  lastCommentEvent?: {
    comment: any;
    assignmentId: string;
    classroomId: string;
    assignmentTitle?: string;
    isFromTeacher?: boolean;
  };
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [unreadDiscussionsCount, setUnreadDiscussionsCount] = useState<number>(0);
  const [lastCommentEvent, setLastCommentEvent] = useState<any>(undefined);

  const fetchInitialUnread = async () => {
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("authToken");

    if (token && role === "TEACHER") {
      try {
        const res = await getTeacherUnreadDiscussionsCount();
        setUnreadDiscussionsCount(res.totalUnread || 0);
      } catch {
        // Fallback
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setConnected(false);
      }
      return;
    }

    fetchInitialUnread();

    const socket = io(API_BASE_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    // 🔔 Real-time assignment comment event
    socket.on("comment:new", (payload) => {
      setLastCommentEvent(payload);

      // If teacher received a comment from a student, increment unread counter live!
      if (role === "TEACHER" && !payload.isFromTeacher) {
        setUnreadDiscussionsCount((prev) => prev + 1);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        connected,
        unreadDiscussionsCount,
        setUnreadDiscussionsCount,
        refreshUnreadCount: fetchInitialUnread,
        lastCommentEvent,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useAppSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error("useAppSocket must be used within a SocketProvider");
  }
  return ctx;
};
