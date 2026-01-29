import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LogOut,
  Home,
  User,
  BookOpen,
  LayoutDashboard,
  Contact,
  Info} from "lucide-react";

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
    try {
      const token = localStorage.getItem("authToken");

      if (token) {
        await fetch("http://localhost:5000/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      // ignore errors — logout must always succeed
    } finally {
      // Clear session
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");

      // Notify other components
      window.dispatchEvent(new Event("storage"));

      // Redirect to login
      navigate("/login");
    }
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
            className="flex items-center gap-2 group"
          >
            <motion.div
              whileHover={{ rotate: 5 }}
              className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-200"
            >
              <BookOpen className="w-5 h-5 text-blue-600" />
            </motion.div>
            <span className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors duration-200">
              AssignFlow Hub
            </span>
            {userRole && (
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${userRole === 'TEACHER' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}`}>
                {userRole === 'TEACHER' ? 'Teacher' : 'Student'}
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
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                )
              )}
            </div>

            {/* Auth Section */}
            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
              {!isLoggedIn ? (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 group"
                >
                  <User className="w-4 h-4" />
                  Login
                </Link>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center gap-2 group"
                >
                  <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  Logout
                </motion.button>
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === item.path
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
              <div className="pt-4 border-t border-slate-200">
                {!isLoggedIn ? (
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    <User className="w-4 h-4" />
                    Login to Dashboard
                  </Link>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
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