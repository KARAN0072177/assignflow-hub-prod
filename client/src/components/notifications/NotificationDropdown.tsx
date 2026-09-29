import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Clock,
  Lock,
  AtSign,
  CheckCheck,
  BellOff,
  ExternalLink,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type AppNotification,
} from "../../services/notification.api";
import { useAppSocket } from "../../context/SocketContext";

export const NotificationDropdown: React.FC = () => {
  const navigate = useNavigate();
  const { unreadNotificationsCount, setUnreadNotificationsCount, socket } =
    useAppSocket();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications from server
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await getMyNotifications(30);
      setNotifications(res.notifications || []);
      setUnreadNotificationsCount(res.unreadCount || 0);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    loadNotifications();
  }, []);

  // Real-time socket events
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (newNotif: AppNotification) => {
      setNotifications((prev) => {
        // Prevent duplicate entries if received multiple times
        if (prev.some((n) => n._id === newNotif._id)) return prev;
        return [newNotif, ...prev];
      });
    };

    const handleCountUpdate = (payload: { unreadCount: number }) => {
      if (typeof payload?.unreadCount === "number") {
        setUnreadNotificationsCount(payload.unreadCount);
      }
    };

    socket.on("notification:new", handleNewNotification);
    socket.on("notification:count", handleCountUpdate);

    return () => {
      socket.off("notification:new", handleNewNotification);
      socket.off("notification:count", handleCountUpdate);
    };
  }, [socket, setUnreadNotificationsCount]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      // Re-fetch on open to ensure freshness
      loadNotifications();
    }
  };

  const handleNotificationClick = async (notif: AppNotification) => {
    // 1. Mark as read if not already read
    if (!notif.isRead) {
      try {
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notif._id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
          )
        );
        setUnreadNotificationsCount((prev) => Math.max(0, prev - 1));
        await markNotificationRead(notif._id);
      } catch (err) {
        console.error("Failed to mark notification read:", err);
      }
    }

    setIsOpen(false);

    // 2. Navigate to destination
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
      );
      setUnreadNotificationsCount(0);
      await markAllNotificationsRead();
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };

  // Format relative timestamp
  const formatTimeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return "Just now";
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const filteredNotifications = notifications.filter((n) =>
    activeTab === "unread" ? !n.isRead : true
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 🔔 Notification Bell Button */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label="View notifications"
        className={`relative p-2 rounded-xl transition-all duration-200 cursor-pointer ${
          isOpen
            ? "bg-blue-50 text-blue-600 ring-2 ring-blue-500/20"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        }`}
      >
        <Bell className="w-5 h-5" />

        {/* Live Unread Badge */}
        {unreadNotificationsCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white shadow-sm ring-2 ring-white animate-in zoom-in-50 duration-200">
            {unreadNotificationsCount > 99 ? "99+" : unreadNotificationsCount}
          </span>
        )}
      </button>

      {/* 📋 Dropdown Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-[90vw] sm:w-[420px] max-w-[440px] origin-top-right rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-2xl shadow-slate-900/15 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-800 text-base">
                  Notifications
                </h3>
                {unreadNotificationsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    {unreadNotificationsCount} new
                  </span>
                )}
              </div>

              {unreadNotificationsCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-2 bg-white">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === "all"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("unread")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === "unread"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Unread ({unreadNotificationsCount})
              </button>
            </div>

            {/* Notification Items List */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
              {loading && notifications.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Loading notifications...
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="py-12 px-6 text-center text-slate-500">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <BellOff className="w-6 h-6" />
                  </div>
                  <p className="font-medium text-slate-700 text-sm">
                    {activeTab === "unread"
                      ? "No unread notifications"
                      : "You're all caught up!"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {activeTab === "unread"
                      ? "Check back later or view all notifications."
                      : "Deadline reminders, lock warnings, and @mentions will appear here."}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notif) => {
                  const isDeadlineStudent = notif.type === "DEADLINE_STUDENT";
                  const isDeadlineTeacher = notif.type === "DEADLINE_TEACHER";
                  const isMention = notif.type === "MENTION";

                  return (
                    <div
                      key={notif._id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`group relative p-3.5 sm:p-4 hover:bg-slate-50 transition-colors duration-150 cursor-pointer flex items-start gap-3 ${
                        !notif.isRead ? "bg-blue-50/30" : "bg-white"
                      }`}
                    >
                      {/* Icon Avatar by Type */}
                      <div className="flex-shrink-0 mt-0.5">
                        {isDeadlineStudent && (
                          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-xs ring-1 ring-amber-500/10">
                            <Clock className="w-4 h-4" />
                          </div>
                        )}
                        {isDeadlineTeacher && (
                          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-xs ring-1 ring-purple-500/10">
                            <Lock className="w-4 h-4" />
                          </div>
                        )}
                        {isMention && (
                          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center shadow-xs ring-1 ring-teal-500/10">
                            <AtSign className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      {/* Content Body */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {formatTimeAgo(notif.createdAt)}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>

                        {/* Special Action: WhatsApp Share for Teachers */}
                        {isDeadlineTeacher && notif.metadata?.shareText && (
                          <div className="mt-2.5 flex items-center gap-2">
                            <a
                              href={`https://api.whatsapp.com/send?text=${notif.metadata.shareText}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-white" />
                              Notify on WhatsApp
                              <ExternalLink className="w-3 h-3 opacity-80" />
                            </a>
                            <span className="text-[10px] text-slate-400">
                              1-tap prefilled reminder
                            </span>
                          </div>
                        )}

                        {/* Special Action for Students */}
                        {isDeadlineStudent && (
                          <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-amber-700">
                            <span>Submit coursework now</span>
                            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        )}

                        {/* Special Action for Mentions */}
                        {isMention && (
                          <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-teal-700">
                            <span>View discussion thread</span>
                            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        )}
                      </div>

                      {/* Unread Indicator Dot */}
                      {!notif.isRead && (
                        <div
                          className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 self-center"
                          title="Unread"
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-2.5 border-t border-slate-100 bg-slate-50/70 text-center">
              <span className="text-[11px] text-slate-400">
                Live notification sync active
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
