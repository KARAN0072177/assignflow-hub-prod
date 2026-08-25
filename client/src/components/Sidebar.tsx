import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Users,
  Award,
  GraduationCap,
  User,
  LogOut,
  Home,
  MessageSquare
} from "lucide-react";
import { useAppSocket } from "../context/SocketContext";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const [role, setRole] = useState(localStorage.getItem("userRole"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { unreadDiscussionsCount, unreadAssignmentsCount } = useAppSocket();

  const homeItem = {
    path: "/home",
    label: "Home",
    icon: <Home className="w-5 h-5" />,
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("userRole"));
      setUsername(localStorage.getItem("username"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    if (onClose) {
      onClose();
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("username");
    window.dispatchEvent(new Event("storage"));
    window.location.href = "/login";
  };

  const navItems = {
    TEACHER: [
      {
        path: "/dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
      {
        path: "/dashboard/classrooms/create",
        label: "Create Classroom",
        icon: <PlusCircle className="w-5 h-5" />,
      },
      {
        path: "/dashboard/classrooms/my",
        label: "My Classrooms",
        icon: <BookOpen className="w-5 h-5" />,
      },
      {
        path: "/dashboard/students",
        label: "Students",
        icon: <Users className="w-5 h-5" />,
      },
      {
        path: "/dashboard/discussions",
        label: "Discussions",
        icon: <MessageSquare className="w-5 h-5" />,
      },
    ],
    STUDENT: [
      {
        path: "/dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
      {
        path: "/dashboard/classrooms/join",
        label: "Join Classroom",
        icon: <Users className="w-5 h-5" />,
      },
      {
        path: "/dashboard/classrooms/my",
        label: "My Classrooms",
        icon: <BookOpen className="w-5 h-5" />,
      },
      {
        path: "/dashboard/grades",
        label: "My Grades",
        icon: <Award className="w-5 h-5" />,
      },
    ],
  };

  const items = role ? navItems[role as keyof typeof navItems] : [];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? role === "TEACHER"
          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
          : "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
    } ${collapsed ? "md:justify-center md:px-2" : ""}`;

  return (
    <>
      {/* 📱 Mobile Drawer & Backdrop (controlled by isOpen / onClose) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-xs"
              onClick={onClose}
            />

            {/* Mobile Sliding Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed top-0 left-0 z-50 w-72 max-w-[80vw] h-screen bg-white shadow-2xl md:hidden flex flex-col"
            >
              {/* Header */}
              <div
                className={`p-4 border-b ${
                  role === "TEACHER"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                    : "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-7 h-7" />
                    <div>
                      <h2 className="font-bold text-base">AssignFlow Hub</h2>
                      <p className="text-xs opacity-90">
                        {role === "TEACHER"
                          ? "Teacher Dashboard"
                          : "Student Dashboard"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Mobile Navigation List */}
              <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                {/* Home */}
                <NavLink
                  to={homeItem.path}
                  className={navLinkClass}
                  onClick={onClose}
                >
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                    {homeItem.icon}
                  </div>
                  <span className="font-medium">{homeItem.label}</span>
                </NavLink>

                <div className="my-2.5 border-t border-slate-100" />

                {/* Dashboard Navigation Items */}
                {items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/dashboard"}
                    className={navLinkClass}
                    onClick={onClose}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        location.pathname === item.path
                          ? "bg-white/20"
                          : role === "TEACHER"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-emerald-100 text-emerald-600"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <span className="font-medium flex-1">{item.label}</span>

                    {/* Discussions Unread Badge (Teachers) */}
                    {item.path === "/dashboard/discussions" &&
                      unreadDiscussionsCount > 0 && (
                        <span
                          className={`ml-auto px-2 py-0.5 text-[11px] font-extrabold rounded-full shadow-xs ${
                            location.pathname === item.path
                              ? "bg-white text-blue-700"
                              : "bg-blue-600 text-white animate-pulse"
                          }`}
                        >
                          {unreadDiscussionsCount}
                        </span>
                      )}

                    {/* New Assignments Badge (Students) */}
                    {item.path === "/dashboard/classrooms/my" &&
                      role === "STUDENT" &&
                      unreadAssignmentsCount > 0 && (
                        <span
                          className={`ml-auto px-2 py-0.5 text-[11px] font-extrabold rounded-full shadow-xs ${
                            location.pathname === item.path
                              ? "bg-white text-emerald-800"
                              : "bg-emerald-600 text-white animate-pulse"
                          }`}
                        >
                          {unreadAssignmentsCount}
                        </span>
                      )}
                  </NavLink>
                ))}
              </nav>

              {/* User Info & Logout on Mobile */}
              <div className="p-4 border-t border-slate-200">
                <div className="flex items-center gap-3 mb-3 p-2.5 bg-slate-50 rounded-xl">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      role === "TEACHER"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {username ? username[0].toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-xs text-slate-800 truncate">
                      {username ? `@${username}` : (role === "TEACHER" ? "Teacher Account" : "Student Account")}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {role === "TEACHER" ? "Teacher" : "Student"} • Online
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 💻 Desktop Sidebar (Sticky, Collapsible) */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{
          x: 0,
          opacity: 1,
          width: collapsed ? 80 : 280,
        }}
        transition={{ duration: 0.3, type: "spring" }}
        className={`hidden md:flex flex-col h-screen bg-white border-r border-slate-200 sticky top-0 overflow-hidden transition-all duration-300 ${
          collapsed ? "w-20" : "w-72"
        }`}
      >
        {/* Sidebar Header */}
        <div
          className={`p-4 border-b ${
            role === "TEACHER"
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
              : "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white"
          }`}
        >
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <GraduationCap className="w-7 h-7 shrink-0" />
                <div>
                  <h2 className="font-bold text-base">AssignFlow Hub</h2>
                  <p className="text-xs opacity-90">
                    {role === "TEACHER"
                      ? "Teacher Dashboard"
                      : "Student Dashboard"}
                  </p>
                </div>
              </div>
            )}
            {collapsed && <GraduationCap className="w-7 h-7 mx-auto" />}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {/* Home */}
          <NavLink
            to={homeItem.path}
            className={navLinkClass}
            title={collapsed ? homeItem.label : undefined}
          >
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700 shrink-0">
              {homeItem.icon}
            </div>
            {!collapsed && <span className="font-medium">Home</span>}
          </NavLink>

          <div className="my-2.5 border-t border-slate-200" />

          {/* Dashboard links */}
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={navLinkClass}
              title={collapsed ? item.label : undefined}
            >
              <div className="relative shrink-0">
                <div
                  className={`p-2 rounded-lg flex-shrink-0 ${
                    location.pathname === item.path
                      ? "bg-white/20"
                      : role === "TEACHER"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-emerald-100 text-emerald-600"
                  }`}
                >
                  {item.icon}
                </div>
                {collapsed &&
                  item.path === "/dashboard/discussions" &&
                  unreadDiscussionsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white animate-pulse" />
                  )}
                {collapsed &&
                  item.path === "/dashboard/classrooms/my" &&
                  role === "STUDENT" &&
                  unreadAssignmentsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-600 rounded-full border-2 border-white animate-pulse" />
                  )}
              </div>

              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium whitespace-nowrap flex-1"
                >
                  {item.label}
                </motion.span>
              )}

              {/* Discussions Unread Badge (Teachers) */}
              {!collapsed &&
                item.path === "/dashboard/discussions" &&
                unreadDiscussionsCount > 0 && (
                  <span
                    className={`ml-auto px-2 py-0.5 text-[11px] font-extrabold rounded-full shadow-xs ${
                      location.pathname === item.path
                        ? "bg-white text-blue-700"
                        : "bg-blue-600 text-white animate-pulse"
                    }`}
                  >
                    {unreadDiscussionsCount}
                  </span>
                )}

              {/* New Assignments Badge (Students) */}
              {!collapsed &&
                item.path === "/dashboard/classrooms/my" &&
                role === "STUDENT" &&
                unreadAssignmentsCount > 0 && (
                  <span
                    className={`ml-auto px-2 py-0.5 text-[11px] font-extrabold rounded-full shadow-xs ${
                      location.pathname === item.path
                        ? "bg-white text-emerald-800"
                        : "bg-emerald-600 text-white animate-pulse"
                    }`}
                  >
                    {unreadAssignmentsCount}
                  </span>
                )}
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout on Desktop */}
        {!collapsed && (
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3 mb-3 p-2.5 bg-slate-50 rounded-xl">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                  role === "TEACHER"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {username ? username[0].toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-xs text-slate-800 truncate">
                  {username ? `@${username}` : (role === "TEACHER" ? "Teacher Account" : "Student Account")}
                </p>
                <p className="text-[11px] text-slate-500">
                  {role === "TEACHER" ? "Teacher" : "Student"} • Online
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer group"
            >
              <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              <span>Logout</span>
            </button>
          </div>
        )}

        {collapsed && (
          <div className="p-4 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center p-2.5 w-full bg-red-50 hover:bg-red-100 text-red-700 rounded-xl transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.aside>
    </>
  );
};

export default Sidebar;