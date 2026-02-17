import { useState, useEffect } from "react";
import { loginUser } from "../services/auth.api";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  BookOpen,
  AlertCircle,
  ArrowRight,
  Shield,
  Sparkles,
  Star,
  Users,
  GraduationCap,
  Zap
} from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const navigate = useNavigate();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser({ email, password });

      // Store authentication data
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userRole", data.user.role);

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      window.dispatchEvent(new Event("storage"));

      // role-based redirect
      if (data.user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

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

      <div className="relative z-10 w-full max-w-lg">
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
              Welcome back to AssignFlow Hub
            </span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
              ))}
            </div>
          </motion.div>

          <div className="flex items-center justify-center gap-4">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="p-3 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl shadow-lg shadow-blue-500/30"
            >
              <BookOpen className="w-8 h-8 text-white" />
            </motion.div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-slate-900">AssignFlow Hub</h1>
              <p className="text-slate-600 mt-1">College Assignment Portal</p>
            </div>
          </div>
        </motion.div>

        {/* Login Card with 3D Effect */}
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
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30"
              >
                <Shield className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
              <p className="text-slate-600 mt-2">Sign in to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-12 pr-4 py-4 bg-white/70 border-2 rounded-xl focus:ring-4 transition-all duration-300 text-slate-900 placeholder-slate-500
                      ${focusedField === 'email' 
                        ? 'border-blue-500 ring-blue-500/20 bg-white' 
                        : 'border-slate-200 hover:border-blue-300'
                      }
                    `}
                    placeholder="student@college.edu"
                    disabled={loading}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Mail className={`w-5 h-5 transition-colors duration-300 
                      ${focusedField === 'email' ? 'text-blue-600' : 'text-slate-500'}`} 
                    />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-800">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-12 pr-12 py-4 bg-white/70 border-2 rounded-xl focus:ring-4 transition-all duration-300 text-slate-900 placeholder-slate-500
                      ${focusedField === 'password' 
                        ? 'border-blue-500 ring-blue-500/20 bg-white' 
                        : 'border-slate-200 hover:border-blue-300'
                      }
                    `}
                    placeholder="Enter your password"
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
              </div>

              {/* Forgot Password & Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-400 cursor-pointer"
                    disabled={loading}
                  />
                  <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
                    Remember me
                  </span>
                </label>

                <Link 
                  to="/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 inline-flex items-center gap-1 group"
                >
                  Forgot password?
                  <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
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

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading || !email.trim() || !password.trim()}
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
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </div>
              </motion.button>
            </form>

            {/* Quick Tips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-semibold text-blue-800">Quick Tips</h4>
              </div>
              <ul className="space-y-1 text-xs text-blue-700">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-600 rounded-full" />
                  Use your institutional email for access
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-600 rounded-full" />
                  Check "Remember me" for quick access
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-600 rounded-full" />
                  Contact support if you can't login
                </li>
              </ul>
            </motion.div>

            {/* Register Link */}
            <div className="text-center pt-6 mt-6 border-t border-slate-200">
              <p className="text-slate-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 inline-flex items-center gap-1 group"
                >
                  Register now
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Shield className="w-4 h-4 text-slate-500" />
                <p className="text-xs text-slate-600">
                  By signing in, you agree to our Terms and Privacy Policy
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-3 gap-4 text-center"
        >
          <div className="bg-white/50 backdrop-blur-sm rounded-xl py-3 px-2 border border-white/50">
            <div className="text-lg font-bold text-slate-900">10K+</div>
            <div className="text-xs text-slate-600">Active Users</div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl py-3 px-2 border border-white/50">
            <div className="text-lg font-bold text-slate-900">500+</div>
            <div className="text-xs text-slate-600">Classrooms</div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl py-3 px-2 border border-white/50">
            <div className="text-lg font-bold text-slate-900">24/7</div>
            <div className="text-xs text-slate-600">Support</div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center text-sm text-slate-600"
        >
          Secure login powered by AssignFlow Hub Education Platform
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

export default Login;