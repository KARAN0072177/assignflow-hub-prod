import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Activity,
  LogOut,
  Menu,
  X,
  Shield,
  Bell,
  Search,
  ChevronDown,
  Settings,
  Database,
  Server,
  AlertCircle
} from "lucide-react";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  const navItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      exact: true
    },
    {
      path: "/admin/audit-logs",
      label: "Audit Logs",
      icon: FileText,
      exact: false
    },
    {
      path: "/admin/system",
      label: "System",
      icon: Server,
      exact: false
    }
  ];

  const externalLinks = [
    {
      href: "http://localhost:5000/admin/queues",
      label: "Job Monitor",
      icon: Activity,
      badge: "Live"
    }
  ];

  const notifications = [
    { id: 1, text: "System backup completed", time: "2 min ago", type: "success" },
    { id: 2, text: "3 new user registrations", time: "15 min ago", type: "info" },
    { id: 3, text: "High memory usage detected", time: "1 hour ago", type: "warning" }
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-gradient-to-r from-blue-600/20 to-emerald-600/20 text-white border-l-4 border-blue-500"
        : "text-slate-300 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/95 via-slate-900/95 to-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 px-4 sm:px-6 lg:px-8 py-3 shadow-2xl shadow-black/30"
    >
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Left: Brand & Desktop Navigation */}
          <div className="flex items-center gap-8">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  AssignFlow Hub
                </h1>
                <p className="text-xs text-slate-500">Administration Panel</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={navLinkClass}
                  end={item.exact}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
              
              {/* External Links */}
              {externalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-200 group"
                >
                  <div className="relative">
                    <link.icon className="w-5 h-5" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <span className="font-medium">{link.label}</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30">
                    {link.badge}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Right: Admin Controls */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search admin panel..."
                className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 w-64 transition-all duration-200"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="relative p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 transition-all duration-200 group"
              >
                <Bell className="w-5 h-5 text-slate-400 group-hover:text-white" />
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-xs rounded-full flex items-center justify-center border-2 border-slate-900">
                  3
                </span>
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-slate-800">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white">Notifications</h3>
                        <span className="text-xs text-slate-500">3 unread</span>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors duration-150 cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${
                              notification.type === 'success' ? 'bg-emerald-500/20' :
                              notification.type === 'warning' ? 'bg-amber-500/20' :
                              'bg-blue-500/20'
                            }`}>
                              <AlertCircle className={`w-4 h-4 ${
                                notification.type === 'success' ? 'text-emerald-400' :
                                notification.type === 'warning' ? 'text-amber-400' :
                                'text-blue-400'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-white font-medium">{notification.text}</p>
                              <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-slate-800">
                      <button className="w-full text-center text-sm text-slate-400 hover:text-white transition-colors">
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 transition-all duration-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white">Admin User</p>
                  <p className="text-xs text-slate-500">Super Admin</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform duration-200" />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-slate-800">
                      <p className="text-sm font-medium text-white">admin@assignflow.com</p>
                      <p className="text-xs text-slate-500 mt-1">Super Administrator</p>
                    </div>
                    <div className="p-2">
                      <button className="flex items-center gap-3 w-full p-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-150">
                        <Settings className="w-5 h-5" />
                        <span className="text-sm">Settings</span>
                      </button>
                      <button className="flex items-center gap-3 w-full p-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-150">
                        <Database className="w-5 h-5" />
                        <span className="text-sm">Database</span>
                      </button>
                    </div>
                    <div className="p-3 border-t border-slate-800">
                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-3 w-full p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 group"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 transition-all duration-200"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-4 pt-4 border-t border-slate-800/50"
            >
              <div className="space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={navLinkClass}
                    onClick={() => setMobileMenuOpen(false)}
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
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.label}</span>
                    <span className="ml-auto px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                      {link.badge}
                    </span>
                  </a>
                ))}
              </div>

              {/* Mobile Search */}
              <div className="mt-4">
                <div className="flex items-center relative">
                  <Search className="absolute left-3 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search admin panel..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default AdminNavbar;