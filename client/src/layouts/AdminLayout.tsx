import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AdminNavbar from "../components/admin/AdminNavbar";

const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "ADMIN") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;