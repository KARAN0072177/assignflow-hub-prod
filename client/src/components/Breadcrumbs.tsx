import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";

const ROUTE_LABELS: Record<string, string> = {
  classrooms: "Classrooms",
  my: "My Classrooms",
  join: "Join Classroom",
  create: "Create Classroom",
  grades: "My Grades",
};

const CLICKABLE_SEGMENTS = new Set([
  "dashboard",
  "my",
  "join",
  "create",
  "grades",
]);

const Breadcrumbs = () => {
  const location = useLocation();

  const pathnames = location.pathname
    .split("/")
    .filter((x) => x && x !== "dashboard");

  // Function to get appropriate icon for route
  const getRouteIcon = (segment: string) => {
    switch (segment) {
      case "my":
      case "classrooms":
        return "📚";
      case "join":
        return "➕";
      case "create":
        return "🏗️";
      case "grades":
        return "📊";
      default:
        return null;
    }
  };

  if (pathnames.length === 0) {
    return (
      <nav className="flex items-center gap-2 text-sm mb-6 px-2">
        <div className="flex items-center gap-2 text-slate-900 font-medium">
          <div className="p-1.5 bg-slate-100 rounded-lg">
            <Home className="w-4 h-4" />
          </div>
          <span>Dashboard</span>
        </div>
      </nav>
    );
  }

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2 text-sm mb-6 px-2 overflow-x-auto scrollbar-hide"
      aria-label="Breadcrumb"
    >
      {/* Dashboard Link */}
      <Link 
        to="/dashboard" 
        className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors duration-200 group"
      >
        <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-blue-50 transition-colors duration-200">
          <Home className="w-4 h-4 group-hover:text-blue-600 transition-colors duration-200" />
        </div>
        <span className="font-medium">Dashboard</span>
      </Link>

      {/* Breadcrumb segments */}
      {pathnames.map((value, index) => {
        const to = `/dashboard/${pathnames
          .slice(0, index + 1)
          .join("/")}`;

        const isLast = index === pathnames.length - 1;
        const label = ROUTE_LABELS[value] || decodeURIComponent(value);
        const isClickable = CLICKABLE_SEGMENTS.has(value) && !isLast;
        const routeIcon = getRouteIcon(value);

        return (
          <div key={to} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
            
            {isClickable ? (
              <Link 
                to={to}
                className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors duration-200 group"
              >
                {routeIcon && (
                  <span className="text-sm opacity-80">{routeIcon}</span>
                )}
                <span className="font-medium truncate max-w-[200px]">{label}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2 text-slate-900">
                {routeIcon && (
                  <span className="text-sm opacity-80">{routeIcon}</span>
                )}
                <span className="font-semibold truncate max-w-[200px]">{label}</span>
              </div>
            )}
          </div>
        );
      })}
    </motion.nav>
  );
};

export default Breadcrumbs;