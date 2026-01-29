import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Users,
  Award,
  GraduationCap,
  User,
  LogOut,
  Home
} from "lucide-react";

const Sidebar = () => {
  const role = localStorage.getItem("userRole");
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const homeItem = {
    path: "/home",
    label: "Home",
    icon: <Home className="w-5 h-5" />,
  };

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(false);
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on route change for mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
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
    `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${isActive
      ? role === 'TEACHER'
        ? 'bg-blue-600 text-white shadow-md'
        : 'bg-emerald-600 text-white shadow-md'
      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
    } ${collapsed && !isMobile ? 'justify-center px-2' : ''}`;

  // Mobile overlay and sidebar
  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className={`fixed top-4 left-4 z-40 p-2.5 rounded-lg ${role === 'TEACHER'
            ? 'bg-blue-600 text-white'
            : 'bg-emerald-600 text-white'
            } shadow-lg md:hidden`}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />

              {/* Mobile Sidebar */}
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                className="fixed top-0 left-0 z-50 w-64 h-screen bg-white shadow-xl md:hidden flex flex-col"
              >
                {/* Sidebar Header */}
                <div className={`p-4 border-b ${role === 'TEACHER'
                  ? 'bg-blue-600 text-white'
                  : 'bg-emerald-600 text-white'
                  }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-7 h-7" />
                      <div>
                        <h2 className="font-bold text-lg">AssignFlow Hub</h2>
                        <p className="text-sm opacity-90">{role === 'TEACHER' ? 'Teacher Dashboard' : 'Student Dashboard'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {/* Home */}
                  <NavLink
                    to={homeItem.path}
                    className={navLinkClass}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                      {homeItem.icon}
                    </div>
                    <span className="font-medium">{homeItem.label}</span>
                  </NavLink>

                  <div className="my-3 border-t border-slate-200" />

                  {/* Dashboard links */}
                  {items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === "/dashboard"}
                      className={navLinkClass}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div
                        className={`p-2 rounded-lg ${location.pathname === item.path
                          ? "bg-white/20"
                          : role === "TEACHER"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-emerald-100 text-emerald-600"
                          }`}
                      >
                        {item.icon}
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  ))}
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-slate-200">
                  <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-lg">
                    <div className={`p-2 rounded-lg ${role === 'TEACHER'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-emerald-100 text-emerald-600'
                      }`}>
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{role === 'TEACHER' ? 'Teacher Account' : 'Student Account'}</p>
                      <p className="text-sm text-slate-600">Active</p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        width: collapsed ? 80 : 280
      }}
      transition={{ duration: 0.3, type: "spring" }}
      className={`hidden md:flex flex-col h-screen bg-white border-r border-slate-200 sticky top-0 overflow-hidden transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'
        }`}
    >
      {/* Sidebar Header */}
      <div className={`p-4 border-b ${role === 'TEACHER'
        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
        : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white'
        }`}>
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <GraduationCap className="w-7 h-7" />
              <div>
                <h2 className="font-bold text-lg">AssignFlow Hub</h2>
                <p className="text-sm opacity-90">{role === 'TEACHER' ? 'Teacher Dashboard' : 'Student Dashboard'}</p>
              </div>
            </div>
          )}
          {collapsed && (
            <GraduationCap className="w-7 h-7 mx-auto" />
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {/* Home */}
        <NavLink
          to={homeItem.path}
          className={navLinkClass}
          title={collapsed ? homeItem.label : undefined}
        >
          <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
            {homeItem.icon}
          </div>
          {!collapsed && <span className="font-medium">Home</span>}
        </NavLink>

        <div className="my-3 border-t border-slate-200" />

        {/* Dashboard links */}
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard"}
            className={navLinkClass}
            title={collapsed ? item.label : undefined}
          >
            <div
              className={`p-2 rounded-lg flex-shrink-0 ${location.pathname === item.path
                  ? "bg-white/20"
                  : role === "TEACHER"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-emerald-100 text-emerald-600"
                }`}
            >
              {item.icon}
            </div>

            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-lg">
            <div className={`p-2 rounded-lg ${role === 'TEACHER'
              ? 'bg-blue-100 text-blue-600'
              : 'bg-emerald-100 text-emerald-600'
              }`}>
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-slate-800">{role === 'TEACHER' ? 'Teacher Account' : 'Student Account'}</p>
              <p className="text-sm text-slate-600">Active session</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg transition-colors duration-200 group"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            <span>Logout</span>
          </button>
        </div>
      )}

      {collapsed && (
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center p-3 w-full bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors duration-200"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      )}
    </motion.aside>
  );
};

export default Sidebar;