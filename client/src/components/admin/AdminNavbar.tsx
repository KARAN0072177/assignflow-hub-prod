import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminSocket } from "../../admin/AdminSocketProvider";

import {
  LayoutDashboard,
  FileText,
  Activity,
  LogOut,
  Menu,
  X,
  Shield,
  Bell,
  Server,
  AlertCircle,
} from "lucide-react";

/* =====================
   Types
===================== */

type AdminNotification = {
  id: string;
  title: string;
  description: string;
  type: "info" | "success" | "warning";
  timestamp: number;
};

const AdminNavbar = () => {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [, setShowUserMenu] = useState(false);

  const [notifications, setNotifications] = useState<
    AdminNotification[]
  >([]);

  const { lastEvent } = useAdminSocket();

  /* =====================
     Handle WebSocket Events
  ===================== */

  useEffect(() => {
    if (!lastEvent) return;

    if (lastEvent.type === "contact:new") {
      setNotifications((prev) => {
        const newNotification: AdminNotification = {
          id: crypto.randomUUID(),
          title: "New Contact Message",
          description: "A user submitted a contact request",
          type: "info",
          timestamp: Date.now(),
        };

        return [newNotification, ...prev].slice(0, 3);
      });
    }
  }, [lastEvent]);

  /* =====================
     Logout
  ===================== */

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  /* =====================
     Navigation
  ===================== */

  const navItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      path: "/admin/audit-logs",
      label: "Audit Logs",
      icon: FileText,
      exact: false,
    },
    {
      path: "/admin/system",
      label: "System",
      icon: Server,
      exact: false,
    },
    {
      path: "/admin/inbox",
      label: "Inbox",
      icon: Bell,
      exact: false,
    },
  ];

  const externalLinks = [
    {
      href: "http://localhost:5000/admin/queues",
      label: "Job Monitor",
      icon: Activity,
      badge: "Live",
    },
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-gradient-to-r from-blue-600/20 to-emerald-600/20 text-white border-l-4 border-blue-500"
        : "text-slate-300 hover:bg-white/5 hover:text-white"
    }`;

  /* =====================
     Render
  ===================== */

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/95 via-slate-900/95 to-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 px-4 sm:px-6 lg:px-8 py-3 shadow-2xl shadow-black/30"
    >
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  AssignFlow Hub
                </h1>
                <p className="text-xs text-slate-500">
                  Admin Panel
                </p>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={navLinkClass}
                  end={item.exact}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}

              {externalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.label}</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                    {link.badge}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="relative p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50"
              >
                <Bell className="w-5 h-5 text-slate-300" />

                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-xs rounded-full flex items-center justify-center border-2 border-slate-900">
                    {notifications.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50"
                  >
                    <div className="p-4 border-b border-slate-800">
                      <h3 className="text-white font-semibold">
                        Notifications
                      </h3>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-sm text-slate-400 text-center">
                          No new notifications
                        </p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className="p-4 border-b border-slate-800 hover:bg-slate-800/40"
                          >
                            <div className="flex gap-3">
                              <AlertCircle className="w-4 h-4 text-blue-400 mt-1" />
                              <div>
                                <p className="text-sm text-white font-medium">
                                  {n.title}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {n.description}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                  {new Date(
                                    n.timestamp
                                  ).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-red-500/20 text-red-400"
            >
              <LogOut className="w-5 h-5" />
            </button>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default AdminNavbar;