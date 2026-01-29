import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Breadcrumbs from "../components/Breadcrumbs";
import { Menu, X, Bell, User } from "lucide-react";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const role = localStorage.getItem("userRole");

      if (!token || !role) {
        navigate("/login");
        return;
      }

      setUserRole(role);
      setIsLoading(false);
    };

    // Small delay for smoother transition
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [navigate]);

  // Reset scroll on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-slate-700 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Mobile Header Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen flex flex-col">
        {/* Top Navigation Bar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 shadow-sm"
        >
          <div className="flex items-center justify-between">
            {/* Left: Mobile Menu Button & Breadcrumb */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors duration-200"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden md:block">
                <Breadcrumbs />
              </div>
              <div className="md:hidden">
                <h1 className="text-lg font-semibold text-slate-800">
                  {location.pathname.includes('grades') ? 'My Grades' :
                   location.pathname.includes('join') ? 'Join Classroom' :
                   location.pathname.includes('create') ? 'Create Classroom' :
                   location.pathname.includes('my') ? 'My Classrooms' : 'Dashboard'}
                </h1>
              </div>
            </div>

            {/* Right: User Info & Notifications */}
            <div className="flex items-center gap-3">
              {/* Role Badge */}
              <div className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                userRole === 'TEACHER' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                <User className="w-4 h-4" />
                {userRole === 'TEACHER' ? 'Teacher' : 'Student'}
              </div>
              
              {/* Notification Bell */}
              <button className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors duration-200 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* User Profile */}
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors duration-200 cursor-pointer">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  userRole === 'TEACHER' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-emerald-100 text-emerald-600'
                }`}>
                  <User className="w-4 h-4" />
                </div>
                <span className="hidden sm:inline text-sm font-medium text-slate-700">
                  {userRole === 'TEACHER' ? 'Teacher' : 'Student'} Account
                </span>
              </div>
            </div>
          </div>
          
          {/* Mobile Breadcrumbs */}
          <div className="md:hidden mt-2">
            <Breadcrumbs />
          </div>
        </motion.header>

        {/* Content Area */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1 p-4 sm:p-6 lg:p-8"
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white px-6 py-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-sm text-slate-600">
            <p>© {new Date().getFullYear()} AssignFlow Hub. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-2 sm:mt-0">
              <a href="/terms" className="hover:text-blue-600 transition-colors">Terms</a>
              <a href="/privacy" className="hover:text-blue-600 transition-colors">Privacy</a>
              <a href="/help" className="hover:text-blue-600 transition-colors">Help</a>
            </div>
          </div>
        </footer>
      </main>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="fixed inset-y-0 left-0 z-40 w-64 h-screen bg-white shadow-xl md:hidden"
          >
            <div className="h-full overflow-y-auto">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-800">Menu</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <Sidebar />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;