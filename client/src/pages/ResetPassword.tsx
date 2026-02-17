import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async () => {
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post(`${API_BASE_URL}/api/auth/reset-password`, {
        email,
        password,
      });

      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return <p className="text-center mt-10">Invalid access</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>

        <input
          type="password"
          className="w-full p-2 border rounded mb-3"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 border rounded mb-3"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Saving..." : "Reset Password"}
        </button>

        {error && <p className="text-red-600 mt-3">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;