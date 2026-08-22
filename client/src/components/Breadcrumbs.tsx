import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  UserPlus,
  Award,
  Users,
  Layers,
  FolderOpen
} from "lucide-react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface BreadcrumbItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  isLast: boolean;
}

const Breadcrumbs = () => {
  const location = useLocation();
  const [classroomNames, setClassroomNames] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    try {
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith("classroom_name_")) {
          const id = key.replace("classroom_name_", "");
          const val = sessionStorage.getItem(key);
          if (val) initial[id] = val;
        }
      }
    } catch {
      // Storage unavailable fallback
    }
    return initial;
  });

  // Listen for classroom name updates dispatched by ClassroomDetail
  useEffect(() => {
    const handleClassroomUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string; name: string }>;
      if (customEvent.detail?.id && customEvent.detail?.name) {
        setClassroomNames((prev) => ({
          ...prev,
          [customEvent.detail.id]: customEvent.detail.name,
        }));
      }
    };

    window.addEventListener("classroom_name_updated", handleClassroomUpdate);
    return () => {
      window.removeEventListener("classroom_name_updated", handleClassroomUpdate);
    };
  }, []);

  // Check if current route has a 24-character hex Mongo ID that needs fetching
  useEffect(() => {
    const pathParts = location.pathname.split("/").filter(Boolean);
    const idParam = pathParts.find((part) => /^[a-fA-F0-9]{24}$/.test(part));

    if (idParam && !classroomNames[idParam]) {
      // Check session storage first
      try {
        const cached = sessionStorage.getItem(`classroom_name_${idParam}`);
        if (cached) {
          setClassroomNames((prev) => ({ ...prev, [idParam]: cached }));
          return;
        }
      } catch {}

      // Fetch from API
      const token = localStorage.getItem("authToken");
      if (token) {
        axios
          .get(`${API_BASE_URL}/api/classrooms/${idParam}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            if (res.data?.name) {
              setClassroomNames((prev) => ({
                ...prev,
                [idParam]: res.data.name,
              }));
              try {
                sessionStorage.setItem(`classroom_name_${idParam}`, res.data.name);
              } catch {}
            }
          })
          .catch(() => {
            // Silently fall back to generic label
          });
      }
    }
  }, [location.pathname, classroomNames]);

  // Construct structured breadcrumb items based on current path
  const buildBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname;
    const rawSegments = path.split("/").filter((x) => x && x !== "dashboard");

    if (rawSegments.length === 0) {
      return [];
    }

    const items: BreadcrumbItem[] = [];

    // Check specific sub-route patterns
    if (rawSegments[0] === "classrooms") {
      const sub = rawSegments[1];

      if (!sub || sub === "my") {
        items.push({
          label: "My Classrooms",
          to: "/dashboard/classrooms/my",
          icon: <BookOpen className="w-3.5 h-3.5 text-blue-600" />,
          isLast: true,
        });
      } else if (sub === "create") {
        items.push({
          label: "Classrooms",
          to: "/dashboard/classrooms/my",
          icon: <BookOpen className="w-3.5 h-3.5 text-slate-500" />,
          isLast: false,
        });
        items.push({
          label: "Create Classroom",
          to: "/dashboard/classrooms/create",
          icon: <PlusCircle className="w-3.5 h-3.5 text-blue-600" />,
          isLast: true,
        });
      } else if (sub === "join") {
        items.push({
          label: "Classrooms",
          to: "/dashboard/classrooms/my",
          icon: <BookOpen className="w-3.5 h-3.5 text-slate-500" />,
          isLast: false,
        });
        items.push({
          label: "Join Classroom",
          to: "/dashboard/classrooms/join",
          icon: <UserPlus className="w-3.5 h-3.5 text-emerald-600" />,
          isLast: true,
        });
      } else {
        // Assume sub is a classroom ID or specific slug
        const isMongoId = /^[a-fA-F0-9]{24}$/.test(sub);
        const resolvedName = isMongoId
          ? classroomNames[sub] || "Classroom"
          : decodeURIComponent(sub);

        items.push({
          label: "Classrooms",
          to: "/dashboard/classrooms/my",
          icon: <BookOpen className="w-3.5 h-3.5 text-slate-500" />,
          isLast: false,
        });
        items.push({
          label: resolvedName,
          to: `/dashboard/classrooms/${sub}`,
          icon: <FolderOpen className="w-3.5 h-3.5 text-blue-600" />,
          isLast: true,
        });
      }
    } else if (rawSegments[0] === "students") {
      items.push({
        label: "Class Students",
        to: "/dashboard/students",
        icon: <Users className="w-3.5 h-3.5 text-indigo-600" />,
        isLast: true,
      });
    } else if (rawSegments[0] === "grades") {
      items.push({
        label: "My Grades",
        to: "/dashboard/grades",
        icon: <Award className="w-3.5 h-3.5 text-amber-600" />,
        isLast: true,
      });
    } else {
      // Fallback for any other custom dashboard sub-route
      rawSegments.forEach((segment, idx) => {
        const isLast = idx === rawSegments.length - 1;
        const currentTo = `/dashboard/${rawSegments.slice(0, idx + 1).join("/")}`;
        const isMongoId = /^[a-fA-F0-9]{24}$/.test(segment);
        const label = isMongoId
          ? classroomNames[segment] || "Details"
          : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

        items.push({
          label,
          to: currentTo,
          icon: <Layers className="w-3.5 h-3.5 text-slate-500" />,
          isLast,
        });
      });
    }

    return items;
  };

  const breadcrumbItems = buildBreadcrumbs();
  const isDashboardRoot = location.pathname === "/dashboard";

  return (
    <motion.nav
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2 text-xs sm:text-sm overflow-x-auto scrollbar-hide py-1"
      aria-label="Breadcrumb"
    >
      {/* Root: Dashboard */}
      {isDashboardRoot ? (
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100/80 rounded-lg text-slate-800 font-semibold border border-slate-200/60">
          <LayoutDashboard className="w-4 h-4 text-blue-600" />
          <span>Dashboard</span>
        </div>
      ) : (
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors font-medium group"
          title="Return to Dashboard"
        >
          <LayoutDashboard className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
          <span>Dashboard</span>
        </Link>
      )}

      {/* Dynamic Breadcrumbs */}
      {breadcrumbItems.map((item, index) => (
        <div key={item.to + index} className="flex items-center gap-2 shrink-0">
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

          {item.isLast ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100/60 border border-slate-200/60 rounded-lg text-slate-900 font-semibold max-w-[240px] sm:max-w-[320px]">
              <span className="shrink-0">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </div>
          ) : (
            <Link
              to={item.to}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100/80 rounded-lg transition-colors font-medium group max-w-[220px]"
              title={`Go to ${item.label}`}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </Link>
          )}
        </div>
      ))}
    </motion.nav>
  );
};

export default Breadcrumbs;