import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth.api";
import { type UserRole } from "../types/auth.types";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Users
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
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
      await registerUser({ email, password, role });

      setSuccess(true);
      
      // Redirect to login after showing success message
      setTimeout(() => {
        navigate("/login");
      }, 1500);
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

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center border border-emerald-200"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Account Created Successfully!</h2>
          <p className="text-slate-600 mb-6">
            Your {role === 'TEACHER' ? 'teacher' : 'student'} account has been created. 
            You'll be redirected to login shortly.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-emerald-700 bg-emerald-50 p-3 rounded-lg">
            <ShieldCheck className="w-4 h-4" />
            <span>You can now sign in with your credentials</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-slate-800">Join AssignFlow Hub</h1>
              <p className="text-slate-600 mt-1">Create your educational account</p>
            </div>
          </div>
        </motion.div>

        {/* Registration Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200"
        >
          {/* Card Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4">
              <Users className="w-7 h-7 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Create Your Account</h2>
            <p className="text-slate-600 mt-2">Join our educational platform</p>
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
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 text-slate-900 placeholder-slate-600"
                  placeholder="student@college.edu"
                  disabled={loading}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Mail className="w-5 h-5 text-slate-500" />
                </div>
                {email && validateEmail(email) && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-600">
                Use your institutional email for better verification
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
                  className="w-full pl-11 pr-12 py-3.5 bg-white border border-slate-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 text-slate-900 placeholder-slate-600"
                  placeholder="Minimum 8 characters"
                  disabled={loading}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock className="w-5 h-5 text-slate-500" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700 transition-colors"
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
              {password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Password strength:</span>
                    <span className={`font-medium ${
                      passwordStrength.score <= 1 ? 'text-red-600' :
                      passwordStrength.score === 2 ? 'text-amber-600' :
                      passwordStrength.score === 3 ? 'text-blue-600' :
                      'text-emerald-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full ${
                          level <= passwordStrength.score
                            ? passwordStrength.color
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800">
                Account Type
                <span className="text-red-600 ml-1">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("STUDENT")}
                  disabled={loading}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-200 ${
                    role === "STUDENT"
                      ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200'
                      : 'bg-white border-slate-400 hover:bg-slate-50'
                  } disabled:opacity-60`}
                >
                  <User className={`w-6 h-6 mb-2 ${role === "STUDENT" ? 'text-emerald-700' : 'text-slate-600'}`} />
                  <span className={`font-medium ${role === "STUDENT" ? 'text-emerald-800' : 'text-slate-700'}`}>
                    Student
                  </span>
                  <span className="text-xs text-slate-500 mt-1">Join classrooms</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("TEACHER")}
                  disabled={loading}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-200 ${
                    role === "TEACHER"
                      ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200'
                      : 'bg-white border-slate-400 hover:bg-slate-50'
                  } disabled:opacity-60`}
                >
                  <GraduationCap className={`w-6 h-6 mb-2 ${role === "TEACHER" ? 'text-blue-700' : 'text-slate-600'}`} />
                  <span className={`font-medium ${role === "TEACHER" ? 'text-blue-800' : 'text-slate-700'}`}>
                    Teacher
                  </span>
                  <span className="text-xs text-slate-500 mt-1">Create classrooms</span>
                </button>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-slate-400 mt-1 flex-shrink-0"
                  disabled={loading}
                />
                <span className="text-sm text-slate-700">
                  I agree to the{" "}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-800 font-medium">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-800 font-medium">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-3 p-4 bg-red-50 border border-red-300 rounded-lg"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !email.trim() || !password.trim() || !agreedToTerms}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create {role === 'TEACHER' ? 'Teacher' : 'Student'} Account</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Role Benefits */}
          <div className={`mt-6 p-4 rounded-lg ${
            role === 'TEACHER' ? 'bg-blue-50 border border-blue-200' : 'bg-emerald-50 border border-emerald-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className={`w-5 h-5 ${role === 'TEACHER' ? 'text-blue-700' : 'text-emerald-700'}`} />
              <h4 className="font-medium text-slate-800">
                {role === 'TEACHER' ? 'Teacher Benefits' : 'Student Benefits'}
              </h4>
            </div>
            <ul className={`text-sm space-y-1 ${role === 'TEACHER' ? 'text-blue-800' : 'text-emerald-800'}`}>
              {role === 'TEACHER' ? (
                <>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4" />
                    Create and manage classrooms
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4" />
                    Assign and grade submissions
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4" />
                    Track student progress
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4" />
                    Join classrooms with codes
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4" />
                    Submit assignments online
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4" />
                    View grades and feedback
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Login Link */}
          <div className="text-center pt-6 border-t border-slate-200">
            <p className="text-slate-600 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 inline-flex items-center gap-1 group"
              >
                Sign in here
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </p>
            <p className="text-xs text-slate-500 mt-3">
              Secure registration protected by industry-standard encryption
            </p>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-slate-600">
            Join thousands of educators and students already using AssignFlow Hub
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;