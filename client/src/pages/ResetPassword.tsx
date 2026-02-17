import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Shield,
  Sparkles,
  BookOpen,
  GraduationCap,
  Users,
  Star,
  Key
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { score: 0, label: "None", color: "bg-slate-300" };
    if (password.length < 6) return { score: 1, label: "Weak", color: "bg-red-500" };
    if (password.length < 8) return { score: 2, label: "Fair", color: "bg-amber-500" };
    if (password.length < 10) return { score: 3, label: "Good", color: "bg-blue-500" };
    return { score: 4, label: "Strong", color: "bg-emerald-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

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

      // Show success and redirect to login
      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Check if passwords match
  const doPasswordsMatch = password && confirm && password === confirm;
  const isPasswordValid = password.length >= 8;

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
              Reset Your Password
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
              <h1 className="text-3xl font-bold text-slate-900">Reset Password</h1>
              <p className="text-slate-600 mt-1">Create a new password</p>
            </div>
          </div>
        </motion.div>

        {/* Reset Password Card with 3D Effect */}
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
                <Lock className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-xl font-semibold text-slate-900">Create New Password</h2>
              <p className="text-sm text-slate-600 mt-2">
                For <span className="font-semibold text-blue-600">{email}</span>
              </p>
            </div>

            <form onSubmit={handleReset} className="space-y-5">
              {/* New Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-12 pr-12 py-4 bg-white/70 border-2 rounded-xl focus:ring-4 transition-all duration-300 text-slate-900 placeholder-slate-500
                      ${focusedField === 'password' 
                        ? 'border-blue-500 ring-blue-500/20 bg-white' 
                        : 'border-slate-200 hover:border-blue-300'
                      }
                      ${password && isPasswordValid ? 'border-emerald-500 bg-emerald-50/30' : ''}
                      ${password && !isPasswordValid && password.length > 0 ? 'border-red-500 bg-red-50/30' : ''}
                    `}
                    placeholder="Minimum 8 characters"
                    disabled={loading}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className={`w-5 h-5 transition-colors duration-300 
                      ${focusedField === 'password' ? 'text-blue-600' : 'text-slate-500'}`} 
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Strength */}
                <AnimatePresence>
                  {password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Password strength:</span>
                        <motion.span 
                          initial={{ x: -10 }}
                          animate={{ x: 0 }}
                          className={`font-medium ${
                            passwordStrength.score <= 1 ? 'text-red-600' :
                            passwordStrength.score === 2 ? 'text-amber-600' :
                            passwordStrength.score === 3 ? 'text-blue-600' :
                            'text-emerald-600'
                          }`}
                        >
                          {passwordStrength.label}
                        </motion.span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((level) => (
                          <motion.div
                            key={level}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: level * 0.1 }}
                            className={`h-1.5 flex-1 rounded-full ${
                              level <= passwordStrength.score
                                ? passwordStrength.color
                                : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => {
                      setConfirm(e.target.value);
                      setError("");
                    }}
                    onFocus={() => setFocusedField('confirm')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-12 pr-12 py-4 bg-white/70 border-2 rounded-xl focus:ring-4 transition-all duration-300 text-slate-900 placeholder-slate-500
                      ${focusedField === 'confirm' 
                        ? 'border-blue-500 ring-blue-500/20 bg-white' 
                        : 'border-slate-200 hover:border-blue-300'
                      }
                      ${confirm && doPasswordsMatch ? 'border-emerald-500 bg-emerald-50/30' : ''}
                      ${confirm && !doPasswordsMatch && confirm.length > 0 ? 'border-red-500 bg-red-50/30' : ''}
                    `}
                    placeholder="Re-enter your password"
                    disabled={loading}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className={`w-5 h-5 transition-colors duration-300 
                      ${focusedField === 'confirm' ? 'text-blue-600' : 'text-slate-500'}`} 
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700 transition-colors"
                    disabled={loading}
                  >
                    {showConfirm ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  
                  {/* Match indicator */}
                  <AnimatePresence>
                    {confirm && doPasswordsMatch && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute right-12 top-1/2 -translate-y-1/2"
                      >
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Match message */}
                <AnimatePresence>
                  {confirm && !doPasswordsMatch && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-red-600 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      Passwords do not match
                    </motion.p>
                  )}
                </AnimatePresence>
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

              {/* Password Requirements */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200">
                <h4 className="text-xs font-semibold text-blue-800 mb-2">Password Requirements:</h4>
                <ul className="space-y-1 text-xs text-blue-700">
                  <li className="flex items-center gap-2">
                    {password.length >= 8 ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-blue-400" />
                    )}
                    At least 8 characters
                  </li>
                  <li className="flex items-center gap-2">
                    {password.length >= 8 && /[A-Z]/.test(password) ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-blue-400" />
                    )}
                    At least one uppercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    {password.length >= 8 && /[0-9]/.test(password) ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-blue-400" />
                    )}
                    At least one number
                  </li>
                </ul>
              </div>

              {/* Reset Button */}
              <motion.button
                type="submit"
                disabled={loading || !isPasswordValid || !doPasswordsMatch}
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
                      <span>Saving New Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </div>
              </motion.button>
            </form>

            {/* Security Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <p className="text-xs text-blue-700">
                  Your password will be encrypted and securely stored. Never share your password with anyone.
                </p>
              </div>
            </motion.div>

            {/* Back to Login Link */}
            <div className="text-center pt-4 mt-2">
              <Link
                to="/login"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 group"
              >
                <ArrowRight className="w-4 h-4 rotate-180 transition-transform duration-200 group-hover:-translate-x-1" />
                <span>Back to Login</span>
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
          Need help?{" "}
          <Link to="/support" className="text-blue-600 hover:text-blue-800 font-medium">
            Contact Support
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
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;