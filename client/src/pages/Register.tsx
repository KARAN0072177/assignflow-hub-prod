import { useState, useEffect } from "react";
import { registerUser, checkUsernameAvailability } from "../services/auth.api";
import { type UserRole } from "../types/auth.types";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  BookOpen,
  GraduationCap,
  User,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Users,
  Sparkles,
  Shield,
  Zap,
  Star,
  Award,
  AtSign,
  XCircle,
} from "lucide-react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
  const [usernameMsg, setUsernameMsg] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState(""); // Store email for success message
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Debounced username availability check
  useEffect(() => {
    if (!username.trim()) {
      setUsernameStatus("idle");
      setUsernameMsg("");
      return;
    }

    const clean = username.trim().toLowerCase();
    if (clean.length < 3 || clean.length > 30) {
      setUsernameStatus("invalid");
      setUsernameMsg("Username must be 3-30 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(clean)) {
      setUsernameStatus("invalid");
      setUsernameMsg("Only letters, numbers, _, -, and . allowed");
      return;
    }

    setUsernameStatus("checking");
    const timer = setTimeout(async () => {
      try {
        const res = await checkUsernameAvailability(clean);
        if (res.available) {
          setUsernameStatus("available");
          setUsernameMsg("Username available!");
        } else {
          setUsernameStatus("taken");
          setUsernameMsg(res.message || "Username already taken");
        }
      } catch (err: any) {
        setUsernameStatus("taken");
        setUsernameMsg(err?.response?.data?.message || "Username already taken");
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [username]);

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

    if (!email.trim() || !password.trim() || !username.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    if (usernameStatus === "taken" || usernameStatus === "invalid") {
      setError("Please choose a valid and available username");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (!agreedToTerms) {
      setError("Please agree to the Terms and Privacy Policy");
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        email,
        password,
        role,
        username: username.trim().toLowerCase(),
      });
      setRegisteredEmail(email); // Store email for success message
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
      setLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { score: 0, label: "None", color: "bg-slate-300" };
    if (password.length < 6) return { score: 1, label: "Weak", color: "bg-red-500" };
    if (password.length < 8) return { score: 2, label: "Fair", color: "bg-amber-500" };
    if (password.length < 10) return { score: 3, label: "Good", color: "bg-blue-500" };
    return { score: 4, label: "Strong", color: "bg-emerald-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  // Check if email is verified (only for when user comes back from email verification)
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "emailVerified") {
        setEmailVerified(true);
        // Clear the flag after showing verified message
        setTimeout(() => {
          localStorage.removeItem("emailVerified");
        }, 100);
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // Floating elements for background
  const floatingElements = [
    { icon: BookOpen, className: "top-20 left-10 delay-0", color: "text-blue-400" },
    { icon: GraduationCap, className: "top-40 right-10 delay-100", color: "text-emerald-400" },
    { icon: Users, className: "bottom-40 left-20 delay-200", color: "text-purple-400" },
    { icon: Award, className: "bottom-20 right-20 delay-300", color: "text-amber-400" },
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 overflow-hidden relative flex items-center justify-center p-4">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-emerald-300/30 rounded-full"
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

        {/* Animated Gradients */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-emerald-500/10 via-transparent to-green-500/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center border border-white/50">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full mb-6 shadow-lg shadow-emerald-500/30"
            >
              {emailVerified ? (
                <CheckCircle2 className="w-10 h-10 text-white" />
              ) : (
                <Mail className="w-10 h-10 text-white" />
              )}
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-slate-800 mb-3"
            >
              {emailVerified ? "✨ Email Verified!" : "Verify your email"}
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-slate-600 mb-8"
            >
              {emailVerified ? (
                "Your email has been verified. You can now log in with your credentials."
              ) : (
                <>
                  We've sent a verification link to <span className="font-semibold text-emerald-600">{registeredEmail}</span>.
                  Please check your inbox and verify your email before logging in.
                </>
              )}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                to="/login"
                className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
              >
                <span>Go to Login</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* Email tips for non-verified users */}
            {!emailVerified && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-200"
              >
                <p className="text-xs text-blue-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>Didn't receive the email? Check your spam folder or wait a few minutes.</span>
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

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
              Join 10,000+ educators & students
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
              <UserPlus className="w-8 h-8 text-white" />
            </motion.div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
              <p className="text-slate-600 mt-1">Join the AssignFlow community</p>
            </div>
          </div>
        </motion.div>

        {/* Registration Card with 3D Effect */}
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
            {/* Progress Indicator */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-slate-600">Step 1 of 1</span>
              </div>
              <div className="flex gap-1">
                <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800">
                  Email Address
                  <span className="text-red-600 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-12 pr-12 py-4 bg-white/70 border-2 rounded-xl focus:ring-4 transition-all duration-300 text-slate-900 placeholder-slate-500
                      ${focusedField === 'email' 
                        ? 'border-blue-500 ring-blue-500/20 bg-white' 
                        : 'border-slate-200 hover:border-blue-300'
                      }
                      ${email && validateEmail(email) ? 'border-emerald-500 bg-emerald-50/30' : ''}
                    `}
                    placeholder="student@college.edu"
                    disabled={loading}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Mail className={`w-5 h-5 transition-colors duration-300 
                      ${focusedField === 'email' ? 'text-blue-600' : 'text-slate-500'}`} 
                    />
                  </div>
                  <AnimatePresence>
                    {email && validateEmail(email) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <p className="text-xs text-slate-600 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-blue-500 rounded-full" />
                  Use your institutional email for better verification
                </p>
              </div>

              {/* Username Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-800">
                    Username
                    <span className="text-red-600 ml-1">*</span>
                  </label>
                  {usernameMsg && (
                    <span
                      className={`text-xs font-semibold ${
                        usernameStatus === "available"
                          ? "text-emerald-600"
                          : usernameStatus === "checking"
                          ? "text-blue-600"
                          : "text-red-600"
                      }`}
                    >
                      {usernameMsg}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    required
                    minLength={3}
                    maxLength={30}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ""))}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-12 pr-12 py-4 bg-white/70 border-2 rounded-xl focus:ring-4 transition-all duration-300 text-slate-900 placeholder-slate-500 font-medium
                      ${focusedField === 'username' 
                        ? 'border-blue-500 ring-blue-500/20 bg-white' 
                        : 'border-slate-200 hover:border-blue-300'
                      }
                      ${usernameStatus === 'available' ? 'border-emerald-500 bg-emerald-50/30' : ''}
                      ${usernameStatus === 'taken' || usernameStatus === 'invalid' ? 'border-red-400 bg-red-50/30' : ''}
                    `}
                    placeholder="e.g. alex_rivera"
                    disabled={loading}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <AtSign className={`w-5 h-5 transition-colors duration-300 
                      ${focusedField === 'username' ? 'text-blue-600' : 'text-slate-500'}`} 
                    />
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                    {usernameStatus === "checking" && (
                      <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                    )}
                    {usernameStatus === "available" && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    )}
                    {(usernameStatus === "taken" || usernameStatus === "invalid") && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Your public handle (3-30 characters: letters, numbers, _, -, .)
                </p>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800">
                  Password
                  <span className="text-red-600 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    required
                    minLength={8}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-12 pr-12 py-4 bg-white/70 border-2 rounded-xl focus:ring-4 transition-all duration-300 text-slate-900 placeholder-slate-500
                      ${focusedField === 'password' 
                        ? 'border-blue-500 ring-blue-500/20 bg-white' 
                        : 'border-slate-200 hover:border-blue-300'
                      }
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

                {/* Password Strength with Animation */}
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

              {/* Role Selection with Enhanced Cards */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800">
                  Account Type
                  <span className="text-red-600 ml-1">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    type="button"
                    onClick={() => setRole("STUDENT")}
                    disabled={loading}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative overflow-hidden group p-5 rounded-xl border-2 transition-all duration-300 ${
                      role === "STUDENT"
                        ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100/50 shadow-lg shadow-emerald-500/20'
                        : 'border-slate-200 hover:border-emerald-300 bg-white/50 hover:bg-emerald-50/30'
                    } disabled:opacity-60`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <User className={`w-8 h-8 mb-3 mx-auto transition-colors duration-300 ${
                      role === "STUDENT" ? 'text-emerald-600' : 'text-slate-600 group-hover:text-emerald-600'
                    }`} />
                    <span className={`block font-semibold mb-1 ${
                      role === "STUDENT" ? 'text-emerald-800' : 'text-slate-700'
                    }`}>
                      Student
                    </span>
                    <span className="text-xs text-slate-600">Join & learn</span>
                    {role === "STUDENT" && (
                      <motion.div
                        layoutId="activeRole"
                        className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full"
                      />
                    )}
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => setRole("TEACHER")}
                    disabled={loading}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative overflow-hidden group p-5 rounded-xl border-2 transition-all duration-300 ${
                      role === "TEACHER"
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-lg shadow-blue-500/20'
                        : 'border-slate-200 hover:border-blue-300 bg-white/50 hover:bg-blue-50/30'
                    } disabled:opacity-60`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <GraduationCap className={`w-8 h-8 mb-3 mx-auto transition-colors duration-300 ${
                      role === "TEACHER" ? 'text-blue-600' : 'text-slate-600 group-hover:text-blue-600'
                    }`} />
                    <span className={`block font-semibold mb-1 ${
                      role === "TEACHER" ? 'text-blue-800' : 'text-slate-700'
                    }`}>
                      Teacher
                    </span>
                    <span className="text-xs text-slate-600">Create & teach</span>
                    {role === "TEACHER" && (
                      <motion.div
                        layoutId="activeRole"
                        className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"
                      />
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="space-y-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-slate-400 mt-1 flex-shrink-0 cursor-pointer"
                    disabled={loading}
                  />
                  <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
                    I agree to the{" "}
                    <Link to="/terms" className="text-blue-600 hover:text-blue-800 font-medium underline-offset-2 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-blue-600 hover:text-blue-800 font-medium underline-offset-2 hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
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
                disabled={loading || !email.trim() || !password.trim() || !agreedToTerms}
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
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>Create {role === 'TEACHER' ? 'Teacher' : 'Student'} Account</span>
                      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </div>
              </motion.button>
            </form>

            {/* Role Benefits with Animation */}
            <motion.div 
              key={role}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`mt-6 p-5 rounded-xl ${
                role === 'TEACHER' 
                  ? 'bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200' 
                  : 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 rounded-lg ${
                  role === 'TEACHER' ? 'bg-blue-200' : 'bg-emerald-200'
                }`}>
                  <Shield className={`w-4 h-4 ${
                    role === 'TEACHER' ? 'text-blue-700' : 'text-emerald-700'
                  }`} />
                </div>
                <h4 className="font-semibold text-slate-800">
                  {role === 'TEACHER' ? '✨ Teacher Benefits' : '✨ Student Benefits'}
                </h4>
              </div>
              <ul className="grid grid-cols-1 gap-2">
                {(role === 'TEACHER' ? [
                  'Create and manage classrooms',
                  'Assign and grade submissions',
                  'Track student progress',
                  'Analytics dashboard'
                ] : [
                  'Join classrooms with codes',
                  'Submit assignments online',
                  'View grades and feedback',
                  'Collaborate with peers'
                ]).map((benefit, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex items-center gap-2 text-sm ${
                      role === 'TEACHER' ? 'text-blue-800' : 'text-emerald-800'
                    }`}
                  >
                    <Zap className="w-4 h-4 flex-shrink-0" />
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Login Link */}
            <div className="text-center pt-6 mt-6 border-t border-slate-200">
              <p className="text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 inline-flex items-center gap-1 group"
                >
                  Sign in here
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Shield className="w-4 h-4 text-slate-500" />
                <p className="text-xs text-slate-600">
                  Protected by enterprise-grade encryption
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
            <div className="text-lg font-bold text-slate-900">4.9/5</div>
            <div className="text-xs text-slate-600">Rating</div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center text-sm text-slate-600"
        >
          Join thousands of educators and students already using AssignFlow Hub
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

export default Register;