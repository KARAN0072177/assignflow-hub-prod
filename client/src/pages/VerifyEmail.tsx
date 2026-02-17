import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MailCheck,
  MailX,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  Shield,
  Sparkles
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying your email...");
  const [verificationState, setVerificationState] = useState<"verifying" | "success" | "error">("verifying");
  const [countdown, setCountdown] = useState(3);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = params.get("token");

    if (!token) {
      setStatus("Invalid verification link");
      setVerificationState("error");
      return;
    }

    axios
      .get(`${API_BASE}/api/auth/verify-email?token=${token}`)
      .then((res) => {
        setStatus(res.data.message || "Email verified successfully!");
        setVerificationState("success");
        
        // Notify other tabs that email is verified
        localStorage.setItem("emailVerified", Date.now().toString());
      })
      .catch((err) => {
        setStatus(err.response?.data?.message || "Verification failed");
        setVerificationState("error");
      });
  }, [params, navigate]);

  // Auto-redirect countdown for success state
  useEffect(() => {
    if (verificationState !== "success") return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [verificationState, navigate]);

  const handleManualRedirect = () => {
    navigate("/login");
  };

  const handleRetry = () => {
    window.location.reload();
  };

  // Floating particles for background
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden relative flex items-center justify-center p-4">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute bg-blue-300/30 rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Animated Gradient Backgrounds */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/10 via-transparent to-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-purple-500/5 via-transparent to-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/5 via-transparent to-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header with Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/50 rounded-full shadow-lg mb-4"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-slate-700">
              Email Verification
            </span>
          </motion.div>
        </motion.div>

        {/* Verification Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50"
        >
          {/* Animated Icon */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 20,
                delay: 0.2 
              }}
              className={`relative w-24 h-24 rounded-2xl flex items-center justify-center
                ${verificationState === "verifying" ? "bg-gradient-to-br from-blue-500 to-blue-600" :
                  verificationState === "success" ? "bg-gradient-to-br from-emerald-500 to-green-500" :
                  "bg-gradient-to-br from-red-500 to-rose-500"
                } shadow-lg shadow-blue-500/30`}
            >
              {/* Pulsing rings */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-white/30"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              <AnimatePresence mode="wait">
                {verificationState === "verifying" && (
                  <motion.div
                    key="verifying"
                    initial={{ opacity: 0, rotate: -180 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                  </motion.div>
                )}

                {verificationState === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </motion.div>
                )}

                {verificationState === "error" && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <XCircle className="w-12 h-12 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Title */}
          <motion.h2
            key={verificationState}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-2xl font-bold text-center mb-3
              ${verificationState === "verifying" ? "text-slate-800" :
                verificationState === "success" ? "text-emerald-700" :
                "text-red-700"
              }`}
          >
            {verificationState === "verifying" && "Verifying Your Email"}
            {verificationState === "success" && "Email Verified!"}
            {verificationState === "error" && "Verification Failed"}
          </motion.h2>

          {/* Status Message */}
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-8"
          >
            <p className="text-slate-600">{status}</p>
          </motion.div>

          {/* Action Area */}
          <AnimatePresence mode="wait">
            {verificationState === "verifying" && (
              <motion.div
                key="verifying-actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Progress bar */}
                <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </div>
                <p className="text-sm text-slate-600 text-center">
                  Please wait while we verify your email address
                </p>
              </motion.div>
            )}

            {verificationState === "success" && (
              <motion.div
                key="success-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {/* Success benefits */}
                <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-200">
                  <h3 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                    <MailCheck className="w-5 h-5" />
                    What's next?
                  </h3>
                  <ul className="space-y-2 text-sm text-emerald-700">
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      You can now log in to your account
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      Access your dashboard and start learning
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      Connect with educators and students
                    </li>
                  </ul>
                </div>

                {/* Redirect button */}
                <motion.button
                  onClick={handleManualRedirect}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 px-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 flex items-center justify-center gap-3 group"
                >
                  <span>Go to Login</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>

                {/* Auto-redirect countdown */}
                <p className="text-sm text-slate-600 text-center">
                  Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
                </p>
              </motion.div>
            )}

            {verificationState === "error" && (
              <motion.div
                key="error-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {/* Error details */}
                <div className="bg-red-50/50 rounded-xl p-4 border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <MailX className="w-5 h-5" />
                    Possible reasons:
                  </h3>
                  <ul className="space-y-2 text-sm text-red-700">
                    <li className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Link may have expired</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Invalid verification token</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Email might already be verified</span>
                    </li>
                  </ul>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    onClick={handleRetry}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-4 px-4 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:border-blue-300 hover:text-blue-700 transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    <RefreshCw className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
                    <span>Try Again</span>
                  </motion.button>
                  
                  <Link
                    to="/login"
                    className="flex-1 py-4 px-4 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    <span>Go to Login</span>
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>

                {/* Resend verification link */}
                <div className="text-center">
                  <Link
                    to="/resend-verification"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                  >
                    Resend verification email
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 pt-6 border-t border-slate-200"
          >
            <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
              <Shield className="w-4 h-4" />
              <span>Secure verification process</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center text-sm text-slate-600"
        >
          Having trouble?{" "}
          <Link to="/support" className="text-blue-600 hover:text-blue-800 font-medium">
            Contact support
          </Link>
        </motion.p>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .bg-grid-slate-100 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(241 245 249 / 0.3)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
          mask-image: linear-gradient(to bottom, transparent, white 20%, white 80%, transparent);
        }
      `}</style>
    </div>
  );
};

export default VerifyEmail;