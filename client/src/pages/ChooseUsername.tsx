import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AtSign,
  Sparkles,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Zap,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { getMe, setUsername, checkUsernameAvailability } from "../services/auth.api";

const ChooseUsername = () => {
  const navigate = useNavigate();
  const [username, setUsernameInput] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const checkUserStatus = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      // Pre-fill from local cache for instant UI rendering
      const storedEmail = localStorage.getItem("userEmail") || "";
      const storedRole = localStorage.getItem("userRole") || "STUDENT";
      if (storedEmail) {
        setUserEmail(storedEmail);
        const prefix = storedEmail.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
        const randomNum = Math.floor(100 + Math.random() * 900);
        const sugList = [
          prefix,
          `${prefix}_${storedRole === "TEACHER" ? "edu" : "student"}`,
          `${prefix}${randomNum}`,
        ].filter((s) => s.length >= 3 && s.length <= 30);
        setSuggestions(sugList);
      }

      try {
        const user = await getMe();
        if (!isMounted) return;

        if (user.username) {
          // User already has a username -> Redirect to dashboard!
          navigate("/dashboard");
          return;
        }

        setUserEmail(user.email || storedEmail);

        // Generate smart suggestions based on email
        if (user.email) {
          const prefix = user.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
          const randomNum = Math.floor(100 + Math.random() * 900);
          const sugList = [
            prefix,
            `${prefix}_${user.role === "TEACHER" ? "edu" : "student"}`,
            `${prefix}${randomNum}`,
          ].filter((s) => s.length >= 3 && s.length <= 30);
          setSuggestions(sugList);
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error("Failed to verify user profile:", err);
        // If unauthenticated or token expired, send to login
        if (err?.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        if (isMounted) {
          setInitialLoading(false);
        }
      }
    };

    checkUserStatus();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // Debounced availability check
  useEffect(() => {
    if (!username.trim()) {
      setStatus("idle");
      setMessage("");
      return;
    }

    const clean = username.trim().toLowerCase();
    if (clean.length < 3 || clean.length > 30) {
      setStatus("invalid");
      setMessage("Username must be between 3 and 30 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(clean)) {
      setStatus("invalid");
      setMessage("Only letters, numbers, underscores, hyphens, and dots allowed");
      return;
    }

    setStatus("checking");
    const timer = setTimeout(async () => {
      try {
        const res = await checkUsernameAvailability(clean);
        if (res.available) {
          setStatus("available");
          setMessage("Username is available!");
        } else {
          setStatus("taken");
          setMessage(res.message || "Username is already taken");
        }
      } catch (err: any) {
        setStatus("taken");
        setMessage(err?.response?.data?.message || "Username already taken");
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const clean = username.trim().toLowerCase();
    if (!clean || clean.length < 3) {
      setError("Please enter a valid username (min 3 characters)");
      return;
    }

    if (status === "taken" || status === "invalid") {
      setError("Please choose an available and valid username");
      return;
    }

    try {
      setLoading(true);
      await setUsername(clean);
      // Successfully saved! Redirect to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to set username. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-300 font-medium">Checking your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
              <AtSign className="w-8 h-8 text-white" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Profile Setup</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Choose Your Username
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                Welcome to AssignFlow Hub! Please choose a unique public handle to display across classrooms, assignments, and discussions.
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-red-500/10 border border-red-500/30 text-red-300 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 text-red-400 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Your Handle
                </label>
                {message && (
                  <span
                    className={`text-xs font-semibold ${
                      status === "available"
                        ? "text-emerald-400"
                        : status === "checking"
                        ? "text-blue-400"
                        : "text-red-400"
                    }`}
                  >
                    {message}
                  </span>
                )}
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">
                  @
                </div>

                <input
                  type="text"
                  value={username}
                  required
                  autoFocus
                  minLength={3}
                  maxLength={30}
                  onChange={(e) =>
                    setUsernameInput(
                      e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, "")
                    )
                  }
                  className={`w-full pl-10 pr-12 py-3.5 bg-slate-800/80 border rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all font-medium text-sm sm:text-base ${
                    status === "available"
                      ? "border-emerald-500/80 focus:ring-emerald-500/20"
                      : status === "taken" || status === "invalid"
                      ? "border-red-500/80 focus:ring-red-500/20"
                      : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                  placeholder="alex_rivera"
                  disabled={loading}
                />

                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                  {status === "checking" && (
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                  )}
                  {status === "available" && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                  {(status === "taken" || status === "invalid") && (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                3 to 30 characters (letters, numbers, _, -, .)
              </p>
            </div>

            {/* Smart Suggestions Chips */}
            {suggestions.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Suggestions for you</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setUsernameInput(sug)}
                      className="px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-blue-500/50 rounded-xl text-xs text-blue-300 font-medium transition-all cursor-pointer active:scale-95"
                    >
                      @{sug}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || status === "taken" || status === "invalid" || !username.trim()}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Handle...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Confirm &amp; Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Security Note */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center gap-2 text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Logged in as <strong className="text-slate-300 font-mono">{userEmail}</strong></span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChooseUsername;
