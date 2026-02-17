import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Key,
  Mail,
  ArrowRight,
  Loader2,
  AlertCircle,
  Shield,
  Sparkles,
  BookOpen,
  GraduationCap,
  Users,
  Star,
  Timer,
  RefreshCw
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const RESEND_COOLDOWN = 60; // seconds

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<number | null>(null);

  const [timer, setTimer] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);

  // Mouse movement for 3D effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 300 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;
    
    requestAnimationFrame(() => {
      mouseX.set(x);
      mouseY.set(y);
    });
  };

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
  // Handle OTP Input Change
  // =============================
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // If pasting multiple digits
      const pastedOtp = value.slice(0, 6).split("");
      const newOtp = [...otp];
      pastedOtp.forEach((digit, i) => {
        if (i < 6 && /^\d*$/.test(digit)) {
          newOtp[i] = digit;
        }
      });
      setOtp(newOtp);
      
      // Focus last filled or next empty field
      const lastFilledIndex = Math.min(pastedOtp.length - 1, 5);
      const nextInput = document.getElementById(`otp-${lastFilledIndex + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    } else if (/^\d*$/.test(value)) {
      // Single digit
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) {
          (nextInput as HTMLInputElement).focus();
        }
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Focus previous input on backspace
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
      }
    }
  };

  // =============================
  // Verify OTP
  // =============================
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post(`${API_BASE_URL}/api/auth/verify-reset-otp`, {
        email,
        otp: otpString,
      });

      navigate("/reset-password", { state: { email } });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid OTP. Please try again.");
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
      
      // Clear OTP fields
      setOtp(["", "", "", "", "", ""]);
      
      // Focus first input
      const firstInput = document.getElementById("otp-0");
      if (firstInput) {
        (firstInput as HTMLInputElement).focus();
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  // Check if OTP is complete
  const isOtpComplete = otp.every(digit => digit !== "");

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center border border-white/50">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Invalid Access</h2>
          <p className="text-slate-600 mb-4">No email address provided.</p>
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-2"
          >
            Go back to Forgot Password
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Floating elements for background
  const floatingElements = [
    { icon: BookOpen, className: "top-20 left-10 delay-0", color: "text-blue-400" },
    { icon: GraduationCap, className: "top-40 right-10 delay-100", color: "text-emerald-400" },
    { icon: Users, className: "bottom-40 left-20 delay-200", color: "text-purple-400" },
    { icon: Star, className: "bottom-20 right-20 delay-300", color: "text-amber-400" },
  ];

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden relative flex items-center justify-center p-4"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-300/30 rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
            }}
            animate={{
              y: [null, `-${Math.random() * 50 + 20}px`],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Floating Feature Icons */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute ${element.className} z-0 hidden lg:block`}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.3,
          }}
        >
          <div className="relative">
            <div className={`w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 flex items-center justify-center ${element.color}`}>
              <element.icon className="w-8 h-8" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl blur-xl -z-10" />
          </div>
        </motion.div>
      ))}

      {/* Animated Gradient Backgrounds */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/10 via-transparent to-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500/5 via-transparent to-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-emerald-500/10 via-transparent to-blue-500/10 rounded-full blur-3xl" />
      </div>

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
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/50 rounded-full shadow-lg mb-6"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-slate-700">
              OTP Verification
            </span>
          </motion.div>

          <div className="flex items-center justify-center gap-4">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="p-3 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl shadow-lg shadow-blue-500/30"
            >
              <Key className="w-8 h-8 text-white" />
            </motion.div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-slate-900">Verify OTP</h1>
              <p className="text-slate-600 mt-1">Enter the 6-digit code</p>
            </div>
          </div>
        </motion.div>

        {/* Verify OTP Card with 3D Effect */}
        <motion.div
          style={{ rotateX, rotateY }}
          className="perspective-1000"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/50"
          >
            {/* Card Header */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30"
              >
                <Mail className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-xl font-semibold text-slate-900">Enter OTP</h2>
              <p className="text-sm text-slate-600 mt-2">
                We've sent a 6-digit code to <span className="font-semibold text-blue-600">{email}</span>
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              {/* OTP Input Fields */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-800 text-center">
                  Verification Code
                </label>
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="relative"
                    >
                      <input
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onFocus={() => setFocusedField(index)}
                        onBlur={() => setFocusedField(null)}
                        className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold bg-white/70 border-2 rounded-xl focus:ring-4 transition-all duration-300 text-slate-900
                          ${focusedField === index 
                            ? 'border-blue-500 ring-blue-500/20 bg-white' 
                            : digit 
                              ? 'border-emerald-500 bg-emerald-50/30' 
                              : 'border-slate-200 hover:border-blue-300'
                          }
                        `}
                        disabled={loading || resendLoading}
                      />
                      {focusedField === index && (
                        <motion.div
                          layoutId="cursor"
                          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
                <p className="text-xs text-slate-600 text-center">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              {/* Error Message */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-red-50 to-red-100/50 border border-red-300 rounded-xl"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-800">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Verify Button */}
              <motion.button
                type="submit"
                disabled={loading || !isOtpComplete}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-emerald-500 disabled:from-blue-400 disabled:to-emerald-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 border-2 border-white/20 rounded-xl translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                <div className="relative flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify OTP</span>
                      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </div>
              </motion.button>
            </form>

            {/* Resend Section */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-center gap-2">
                <Timer className="w-4 h-4 text-slate-500" />
                {canResend ? (
                  <motion.button
                    onClick={handleResendOtp}
                    disabled={resendLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-2 group"
                  >
                    {resendLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Resending...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                        <span>Resend OTP</span>
                      </>
                    )}
                  </motion.button>
                ) : (
                  <p className="text-slate-600">
                    Resend OTP in <span className="font-semibold text-blue-600">{timer}s</span>
                  </p>
                )}
              </div>
            </div>

            {/* Security Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <p className="text-xs text-blue-700">
                  The OTP will expire in 10 minutes. For security, don't share this code with anyone.
                </p>
              </div>
            </motion.div>

            {/* Back to Forgot Password Link */}
            <div className="text-center pt-4 mt-2">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 group"
              >
                <ArrowRight className="w-4 h-4 rotate-180 transition-transform duration-200 group-hover:-translate-x-1" />
                <span>Back to Forgot Password</span>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Help Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center text-sm text-slate-600"
        >
          Didn't receive the code?{" "}
          <button
            onClick={handleResendOtp}
            disabled={!canResend || resendLoading}
            className="text-blue-600 hover:text-blue-800 font-medium disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            Try again
          </button>
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
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default VerifyOtp;