import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";

import CreateClassroom from "./pages/CreateClassroom";
import JoinClassroom from "./pages/JoinClassroom";
import MyClassrooms from "./pages/MyClassrooms";
import ClassroomDetail from "./pages/ClassroomDetail";
import MyGrades from "./pages/MyGrades";

import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout";

import Navbar from "./components/Navbar";
import AdminAuditLogs from "./pages/AdminAuditLogs";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

function AppRoutes() {
  const location = useLocation();

  // hide navbar on these routes
  const hideNavbarRoutes = ["/login", "/register", "/admin"];

  const shouldHideNavbar = hideNavbarRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />

          <Route path="classrooms/my" element={<MyClassrooms />} />
          <Route path="classrooms/:id" element={<ClassroomDetail />} />

          <Route path="classrooms/create" element={<CreateClassroom />} />
          <Route path="classrooms/join" element={<JoinClassroom />} />
          <Route path="grades" element={<MyGrades />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}