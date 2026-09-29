import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LogOut,
  Home,
  LayoutDashboard,
  Contact,
  Info
} from "lucide-react";
import { logoutUser } from "../services/auth.api";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const role = localStorage.getItem("userRole");
      setIsLoggedIn(!!token);
      setUserRole(role);
    };

    // Initial check
    checkAuth();

    // Listen for auth changes
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  useEffect(() => {
    // Close mobile menu on route change
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const navItems = [
    {
      path: "/home",
      label: "Home",
      icon: <Home className="w-4 h-4" />,
      show: true
    },
    {
      path: "/about",
      label: "About Us",
      icon: <Info className="w-4 h-4" />,
      show: true
    },
    {
      path: "/contact",
      label: "Contact",
      icon: <Contact className="w-4 h-4" />,
      show: true
    },
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
      show: isLoggedIn
    }
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3 sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
          >
            <div className="p-1.5 rounded-lg transition-colors">
              <img
                src="/logo.png"
                alt="AssignFlow Hub Logo"
                className="h-9 w-auto object-contain"
              />
            </div>

            {/* Role Badge */}
            {userRole && (
              <span
                className={`ml-1 px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase rounded-md border ${
                  userRole === "TEACHER"
                    ? "bg-slate-100 text-slate-700 border-slate-200"
                    : "bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {userRole === "TEACHER" ? "Instructor" : "Student"}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-1">
              {navItems.map((item) =>
                item.show && (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>

            {/* Auth Section */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              {!isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-md transition-colors"
                  >
                    Open Workspace
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
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
            className="md:hidden mt-4 border-t border-slate-200 pt-4"
          >
            <div className="space-y-2">
              {navItems.map((item) =>
                item.show && (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === item.path
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-100'
                      }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                )
              )}

              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                {!isLoggedIn ? (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-slate-900 text-white font-medium rounded-lg text-xs"
                    >
                      Open Workspace
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-rose-700 bg-rose-50 font-medium rounded-lg text-xs"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;