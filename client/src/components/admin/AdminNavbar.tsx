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
  ChevronRight,
  Sparkles,
  ExternalLink,
  Mail,
  BellRing,
  MessageCircle,
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
  const [unreadCount, setUnreadCount] = useState(0);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [notificationPulse, setNotificationPulse] = useState(false);

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
      // Pulse animation for new notification
      setNotificationPulse(true);
      setTimeout(() => setNotificationPulse(false), 1000);

      // Increment unread counter (NO LIMIT)
      setUnreadCount((prev) => prev + 1);

      // Update dropdown list (LIMITED to 3)
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
      color: "blue",
    },
    {
      path: "/admin/audit-logs",
      label: "Audit Logs",
      icon: FileText,
      exact: false,
      color: "emerald",
    },
    {
      path: "/admin/system",
      label: "System",
      icon: Server,
      exact: false,
      color: "purple",
    },
    {
      path: "/admin/inbox",
      label: "Inbox",
      icon: Mail,
      exact: false,
      color: "amber",
    },
        {
      path: "/admin/newsletter",
      label: "Newsletters",
      icon: MessageCircle,
      exact: false,
      color: "amber",
    },
  ];

  const externalLinks = [
    {
      href: "http://localhost:5000/admin/queues",
      label: "Job Monitor",
      icon: Activity,
      badge: "Live",
      color: "red",
    },
  ];


  /* =====================
     Notification Icon Animation
  ===================== */

  const NotificationIcon = () => (
    <div className="relative">
      <motion.div
        animate={notificationPulse ? {
          scale: [1, 1.3, 1],
          rotate: [0, 10, -10, 0],
        } : {}}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <Bell className="w-5 h-5 text-slate-300" />
        {unreadCount > 0 && (
          <>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 text-xs rounded-full flex items-center justify-center border-2 border-slate-900 font-bold"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </motion.span>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 0, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500/30"
            />
          </>
        )}
      </motion.div>
    </div>
  );

  /* =====================
     Nav Item Hover Effect
  ===================== */

  const NavHoverEffect = ({ id, isActive, color = "blue" }: { 
    id: string; 
    isActive: boolean; 
    color?: string 
  }) => {
    const isHovered = hoveredNav === id || isActive;
    const colorMap: Record<string, string> = {
      blue: "rgba(59, 130, 246, 0.1)",
      emerald: "rgba(16, 185, 129, 0.1)",
      purple: "rgba(168, 85, 247, 0.1)",
      amber: "rgba(245, 158, 11, 0.1)",
      red: "rgba(239, 68, 68, 0.1)"
    };

    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
        {/* Active/Hover Background */}
        {isHovered && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              className={`absolute inset-0 bg-gradient-to-r from-${color}-500/10 to-${color}-600/10`}
            />
            {/* Animated Border */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 border border-slate-700/30 rounded-xl"
            />
            {/* Particle Effects */}
            <div className="absolute inset-0">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{ backgroundColor: colorMap[color] }}
                  initial={{
                    x: Math.random() * 100 + '%',
                    y: Math.random() * 100 + '%',
                    scale: 0,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    x: [
                      `${Math.random() * 100}%`,
                      `${Math.random() * 100}%`,
                      `${Math.random() * 100}%`
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.6,
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  /* =====================
     Render
  ===================== */

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 0.4,
          type: "spring",
          stiffness: 100,
          damping: 20
        }}
        className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/95 via-slate-900/95 to-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 px-4 sm:px-6 lg:px-8 py-3 shadow-2xl shadow-black/30"
        style={{
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.97) 0%, rgba(30, 41, 59, 0.97) 100%)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-8xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Brand */}
            <div className="flex items-center gap-8">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 group cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: 15 }}
                  className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center overflow-hidden"
                  style={{
                    boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)"
                  }}
                >
                  {/* Animated background */}
                  <motion.div
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-transparent to-emerald-500/30"
                  />
                  <Shield className="w-6 h-6 text-white relative z-10" />
                </motion.div>
                <div>
                  <motion.h1 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg font-bold bg-gradient-to-r from-blue-300 to-emerald-300 bg-clip-text text-transparent"
                  >
                    AssignFlow Hub
                  </motion.h1>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <span>Admin Panel</span>
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-emerald-500"
                    >
                      •
                    </motion.span>
                    <span>Secure Access</span>
                  </p>
                </div>
              </motion.div>

              {/* Desktop Nav */}
              <div className="hidden lg:flex items-center gap-2">
                {navItems.map((item) => (
                  <motion.div
                    key={item.path}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden cursor-pointer ${isActive
                          ? `text-white`
                          : "text-slate-400 hover:text-white"
                        }`
                      }
                      end={item.exact}
                      onMouseEnter={() => setHoveredNav(item.path)}
                      onMouseLeave={() => setHoveredNav(null)}
                    >
                      <NavHoverEffect id={item.path} isActive={false} color={item.color} />
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={`p-2 rounded-lg ${hoveredNav === item.path || false ? 
                          `bg-gradient-to-br from-${item.color}-500/20 to-${item.color}-600/20` : 
                          "bg-slate-800/50"
                        }`}
                      >
                        <item.icon className={`w-4 h-4 ${hoveredNav === item.path || false ? 
                          `text-${item.color}-400` : 
                          "text-slate-400"
                        }`} />
                      </motion.div>
                      <span className="font-medium">{item.label}</span>
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: hoveredNav === item.path ? 1 : 0, x: hoveredNav === item.path ? 0 : -5 }}
                        className={`text-${item.color}-400`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    </NavLink>
                  </motion.div>
                ))}

                {externalLinks.map((link) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white transition-all duration-300 group relative overflow-hidden cursor-pointer"
                    onMouseEnter={() => setHoveredNav(link.href)}
                    onMouseLeave={() => setHoveredNav(null)}
                  >
                    <NavHoverEffect id={link.href} isActive={false} color={link.color} />
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      className={`p-2 rounded-lg ${hoveredNav === link.href ? 
                        `bg-gradient-to-br from-${link.color}-500/20 to-${link.color}-600/20` : 
                        "bg-slate-800/50"
                      }`}
                    >
                      <link.icon className={`w-4 h-4 ${hoveredNav === link.href ? 
                        `text-${link.color}-400` : 
                        "text-slate-400"
                      }`} />
                    </motion.div>
                    <span className="font-medium">{link.label}</span>
                    <span className="px-2 py-0.5 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 text-xs rounded-full font-medium">
                      {link.badge}
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-400" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowUserMenu(false);

                    // Mark all as seen
                    if (!showNotifications) {
                      setUnreadCount(0);
                    }
                  }}
                  className="relative p-2.5 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 group overflow-hidden"
                  style={{
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)"
                  }}
                >
                  {/* Animated background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-emerald-600/0"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "linear"
                    }}
                  />
                  <NotificationIcon />
                </motion.button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="absolute right-0 mt-2 w-96 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/50 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
                      style={{
                        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)"
                      }}
                    >
                      {/* Header */}
                      <div className="p-4 border-b border-slate-800/50 bg-gradient-to-r from-slate-900/50 to-slate-800/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BellRing className="w-5 h-5 text-blue-400" />
                            <h3 className="text-white font-semibold">
                              Notifications
                            </h3>
                            {unreadCount > 0 && (
                              <span className="px-2 py-0.5 bg-gradient-to-r from-red-500 to-red-600 text-xs rounded-full">
                                {unreadCount} new
                              </span>
                            )}
                          </div>
                          <Sparkles className="w-4 h-4 text-blue-400/50" />
                        </div>
                      </div>

                      {/* Notifications List */}
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-8 text-center"
                          >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center">
                              <Bell className="w-8 h-8 text-slate-600" />
                            </div>
                            <p className="text-sm text-slate-400 mb-2">
                              No notifications yet
                            </p>
                            <p className="text-xs text-slate-500">
                              You're all caught up!
                            </p>
                          </motion.div>
                        ) : (
                          notifications.map((n, index) => (
                            <motion.div
                              key={n.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ x: 5 }}
                              className="p-4 border-b border-slate-800/50 hover:bg-gradient-to-r hover:from-slate-800/30 hover:to-slate-900/30 cursor-pointer group"
                            >
                              <div className="flex gap-3">
                                <motion.div
                                  whileHover={{ rotate: 15 }}
                                  className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10"
                                >
                                  <AlertCircle className="w-4 h-4 text-blue-400" />
                                </motion.div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm text-white font-medium group-hover:text-blue-300 transition-colors">
                                      {n.title}
                                    </p>
                                    <span className="text-xs text-slate-500">
                                      {new Date(n.timestamp).toLocaleTimeString([], { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                      })}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-400">
                                    {n.description}
                                  </p>
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ delay: 0.2 }}
                                    className="h-px bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 mt-3"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>

                      {/* Footer */}
                      {notifications.length > 0 && (
                        <div className="p-3 border-t border-slate-800/50 bg-gradient-to-r from-slate-900/50 to-slate-800/30">
                          <button
                            onClick={() => setNotifications([])}
                            className="w-full text-xs text-slate-400 hover:text-white py-2 rounded-lg hover:bg-slate-800/30 transition-colors"
                          >
                            Clear all notifications
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Logout Button */}
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(239, 68, 68, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="relative p-2.5 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 hover:border-red-400/50 text-red-400 hover:text-red-300 transition-all duration-300 overflow-hidden group"
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/10 to-red-600/0"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear"
                  }}
                />
                <LogOut className="w-5 h-5 relative z-10" />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs bg-slate-900 border border-slate-700 px-2 py-1 rounded-lg z-20"
                >
                  Logout
                </motion.div>
              </motion.button>

              {/* Mobile Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300"
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                    >
                      <X className="w-5 h-5 text-white" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                    >
                      <Menu className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="lg:hidden fixed inset-x-0 top-16 z-40 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-xl border-b border-slate-800/50"
            style={{
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                        ? `bg-gradient-to-r from-${item.color}-600/20 to-${item.color}-500/20 text-white`
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`
                    }
                    end={item.exact}
                  >
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      className={`p-2 rounded-lg ${true ? 
                        `bg-gradient-to-br from-${item.color}-500/20 to-${item.color}-600/20` : 
                        "bg-slate-800/50"
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${true ? 
                        `text-${item.color}-400` : 
                        "text-slate-400"
                      }`} />
                    </motion.div>
                    <span className="font-medium">{item.label}</span>
                    <ChevronRight className="w-4 h-4 ml-auto text-slate-600" />
                  </NavLink>
                </motion.div>
              ))}

              {externalLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navItems.length + index) * 0.1 }}
                >
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300 group"
                  >
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      className="p-2 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/20"
                    >
                      <link.icon className="w-5 h-5 text-red-400" />
                    </motion.div>
                    <span className="font-medium">{link.label}</span>
                    <span className="px-2 py-0.5 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 text-xs rounded-full ml-auto">
                      {link.badge}
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-600" />
                  </a>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: (navItems.length + externalLinks.length) * 0.1 }}
                className="pt-4 mt-4 border-t border-slate-800/50"
              >
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 hover:text-red-300 transition-all duration-300 group"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminNavbar;