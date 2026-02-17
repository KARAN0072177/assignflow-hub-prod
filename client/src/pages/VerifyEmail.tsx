import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying...");
  const hasRun = useRef(false); // 🔒 Prevent double execution in StrictMode

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = params.get("token");

    if (!token) {
      setStatus("Invalid verification link");
      return;
    }

    axios
      .get(`${API_BASE}/api/auth/verify-email?token=${token}`)
      .then((res) => {
        // ✅ Update status message
        setStatus(res.data.message || "Email verified successfully!");

        // 🔔 Notify other tabs that email is verified
        localStorage.setItem("emailVerified", Date.now().toString());

        // ⏳ Small delay so user sees success message
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch((err) => {
        setStatus(
          err.response?.data?.message || "Verification failed"
        );
      });
  }, [params, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="bg-slate-800 p-8 rounded shadow text-center max-w-md">
        <h2 className="text-xl font-semibold mb-3">
          Email Verification
        </h2>
        <p>{status}</p>
      </div>
    </div>
  );
};

export default VerifyEmail;