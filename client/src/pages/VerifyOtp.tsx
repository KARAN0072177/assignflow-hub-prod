import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const RESEND_COOLDOWN = 60; // seconds

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const [timer, setTimer] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);

  // =============================
  // Countdown Timer
  // =============================
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // =============================
  // Verify OTP
  // =============================
  const handleVerify = async () => {
    try {
      setLoading(true);
      setError("");

      await axios.post(`${API_BASE_URL}/api/auth/verify-reset-otp`, {
        email,
        otp,
      });

      navigate("/reset-password", { state: { email } });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // Resend OTP
  // =============================
  const handleResendOtp = async () => {
    try {
      setResendLoading(true);
      setError("");

      await axios.post(`${API_BASE_URL}/api/auth/resend-reset-otp`, {
        email,
      });

      // Reset timer
      setTimer(RESEND_COOLDOWN);
      setCanResend(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return <p className="text-center mt-10">Invalid access</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Verify OTP</h2>

        <input
          className="w-full p-2 border rounded mb-3"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded mb-3"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* ===================== */}
        {/* Resend Section */}
        {/* ===================== */}

        <div className="text-center text-sm">
          {canResend ? (
            <button
              onClick={handleResendOtp}
              disabled={resendLoading}
              className="text-blue-600 hover:underline"
            >
              {resendLoading ? "Resending..." : "Resend OTP"}
            </button>
          ) : (
            <p className="text-slate-500">
              Resend OTP in <span className="font-semibold">{timer}s</span>
            </p>
          )}
        </div>

        {error && <p className="text-red-600 mt-3">{error}</p>}
      </div>
    </div>
  );
};

export default VerifyOtp;