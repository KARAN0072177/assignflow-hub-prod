import { NavLink, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded text-sm font-medium ${
      isActive
        ? "bg-gray-800 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-6">
        <span className="font-semibold text-lg">
          AssignFlow Hub – Admin
        </span>

        <NavLink to="/admin/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/audit-logs" className={linkClass}>
          Audit Logs
        </NavLink>

        <a
          href="http://localhost:5000/admin/queues"
          target="_blank"
          rel="noreferrer"
          className="px-3 py-2 rounded text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          Job Monitor
        </a>
      </div>

      <button
        onClick={handleLogout}
        className="text-red-400 hover:text-red-300 text-sm"
      >
        Logout
      </button>
    </nav>
  );
};

export default AdminNavbar;