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
import {
  getStudentUnreadAssignmentsCount,
  markClassroomAssignmentsRead as apiMarkClassroomAssignmentsRead,
} from "../services/classroom.api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  // 👨‍🏫 Teacher Discussions unread counter
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
  // 🎓 Student Assignment unread counters
  unreadAssignmentsCount: number;
  classroomUnreadCounts: Record<string, number>;
  markClassroomAssignmentsAsRead: (classroomId: string) => Promise<void>;
  refreshStudentUnreadAssignments: () => Promise<void>;
  lastAssignmentEvent?: {
    assignmentId: string;
    classroomId: string;
    title: string;
    type: string;
    createdAt?: string;
  };
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [unreadDiscussionsCount, setUnreadDiscussionsCount] = useState<number>(0);
  const [lastCommentEvent, setLastCommentEvent] = useState<any>(undefined);

  // Student assignment unread states
  const [unreadAssignmentsCount, setUnreadAssignmentsCount] = useState<number>(0);
  const [classroomUnreadCounts, setClassroomUnreadCounts] = useState<
    Record<string, number>
  >({});
  const [lastAssignmentEvent, setLastAssignmentEvent] = useState<any>(undefined);

  const fetchInitialUnread = async () => {
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("authToken");

    if (!token) return;

    if (role === "TEACHER") {
      try {
        const res = await getTeacherUnreadDiscussionsCount();
        setUnreadDiscussionsCount(res.totalUnread || 0);
      } catch {
        // Fallback
      }
    } else if (role === "STUDENT") {
      try {
        const res = await getStudentUnreadAssignmentsCount();
        setUnreadAssignmentsCount(res.totalUnread || 0);
        setClassroomUnreadCounts(res.classroomUnread || {});
      } catch {
        // Fallback
      }
    }
  };

  const markClassroomAssignmentsAsRead = async (classroomId: string) => {
    // 1. Optimistically update local state immediately
    const prevClassroomCount = classroomUnreadCounts[classroomId] || 0;
    if (prevClassroomCount > 0) {
      setClassroomUnreadCounts((prev) => ({
        ...prev,
        [classroomId]: 0,
      }));
      setUnreadAssignmentsCount((prev) => Math.max(0, prev - prevClassroomCount));
    }

    // 2. Persist read state on backend
    try {
      await apiMarkClassroomAssignmentsRead(classroomId);
    } catch (err) {
      console.error("Failed to mark classroom assignments as read:", err);
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
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("connect_error", () => {
      // Graceful connection error handling
      setConnected(false);
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

    // 📚 Real-time assignment published event for students
    socket.on("assignment:new", (payload) => {
      setLastAssignmentEvent(payload);

      if (role === "STUDENT") {
        setUnreadAssignmentsCount((prev) => prev + 1);
        setClassroomUnreadCounts((prev) => ({
          ...prev,
          [payload.classroomId]: (prev[payload.classroomId] || 0) + 1,
        }));
      }
    });

    // Real-time assignment read event
    socket.on("assignment:read", (payload) => {
      if (payload?.classroomId) {
        const count = classroomUnreadCounts[payload.classroomId] || 0;
        setClassroomUnreadCounts((prev) => ({
          ...prev,
          [payload.classroomId]: 0,
        }));
        setUnreadAssignmentsCount((prev) => Math.max(0, prev - count));
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
        unreadAssignmentsCount,
        classroomUnreadCounts,
        markClassroomAssignmentsAsRead,
        refreshStudentUnreadAssignments: fetchInitialUnread,
        lastAssignmentEvent,
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
