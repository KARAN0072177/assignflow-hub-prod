import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRole?: "TEACHER" | "STUDENT" | "ADMIN";
}

/**
 * Route guard component that protects authenticated pages.
 * If unauthorized, immediately redirects to /login with return state
 * instead of rendering children and exposing plain API errors.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const location = useLocation();
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");

  // 1. Not authenticated -> Redirect to /login with state preservation
  if (!token) {
    return (
      <Navigate
        to="/login"
        state={{ from: location, message: "Please log in to continue" }}
        replace
      />
    );
  }

  // 2. Role restriction check
  if (requiredRole && role !== requiredRole) {
    if (role === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Authenticated and permitted -> render children or outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
