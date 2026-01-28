import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token);
    };

    // Initial check
    checkAuth();

    // Listen for auth changes (login / logout)
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

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
    // Clear session (NOT deleting user)
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");

    // Notify other components
    window.dispatchEvent(new Event("storage"));

    // Redirect to login
    navigate("/login");
  }
};

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
      <div className="flex gap-6">
        <Link to="/home" className="font-semibold">
          AssignFlow Hub
        </Link>

        <Link to="/home" className="text-gray-600 hover:text-black">
          About Us
        </Link>

        <Link to="/contact" className="text-gray-600 hover:text-black">
          Contact Us
        </Link>

        {isLoggedIn && (
          <Link to="/dashboard" className="text-gray-600 hover:text-black">
            Dashboard
          </Link>
        )}
      </div>

      <div>
        {!isLoggedIn ? (
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="text-red-600 hover:underline"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;