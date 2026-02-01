import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminNavbar from "../components/admin/AdminNavbar";
import { motion } from "framer-motion";
import { ShieldAlert, Server } from "lucide-react";
import { AdminSocketProvider } from "../admin/AdminSocketProvider";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const role = localStorage.getItem("userRole");

      if (!token || role !== "ADMIN") {
        navigate("/login");
        return;
      }

      setIsAdmin(true);
      // Small delay for smoother transition
      setTimeout(() => setIsLoading(false), 300);
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    // Reset scroll on route change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-800 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-slate-400 font-medium text-lg">Loading Admin Panel</p>
          <p className="mt-2 text-sm text-slate-500">Verifying administrator privileges...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-black/30">
            <div className="flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-6">
              <ShieldAlert className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-3">Access Denied</h2>
            <p className="text-slate-400 text-center mb-6">
              You don't have administrator privileges to access this panel.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              Go to User Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (

    <AdminSocketProvider>
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
      <AdminNavbar />

      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="p-4 sm:p-6 lg:p-8"
      >
        <div className="max-w-8xl mx-auto">
          {/* System Status Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <Server className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">System Status</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <p className="font-medium text-white">All Systems Operational</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs px-3 py-1 bg-slate-800/50 text-slate-400 rounded-full border border-slate-700">
                    Live
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-3xl shadow-2xl shadow-black/20 overflow-hidden">
            <div className="p-6 sm:p-8">
              <Outlet />
            </div>
          </div>

          {/* Admin Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 pt-6 border-t border-slate-800/50"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500">
              <div className="flex items-center gap-6 mb-4 sm:mb-0">
                <span>AssignFlow Hub Admin Panel</span>
                <span className="hidden sm:inline">•</span>
                <span className="text-xs px-2 py-1 bg-slate-800/50 rounded-full border border-slate-700">
                  v2.5.1
                </span>
              </div>
              <div className="flex items-center gap-6">
                <span>© {new Date().getFullYear()} All rights reserved</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span>Secure Connection</span>
                </div>
              </div>
            </div>
          </motion.footer>
        </div>
      </motion.main>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600/20 via-emerald-600/20 to-purple-600/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-900/5 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
    </AdminSocketProvider>
  );
};

export default AdminLayout;