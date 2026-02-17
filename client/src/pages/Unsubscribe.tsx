import { useSearchParams, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MailX,
  MailCheck,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Send,
  XCircle,
  MessageSquare,
  Shield,
  BookOpen
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const email = params.get("email");

  const [step, setStep] = useState<"confirm" | "reason" | "success" | "error">("confirm");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleUnsubscribe = async () => {
    if (!email) return;

    try {
      setLoading(true);

      await axios.post(`${API_BASE_URL}/api/newsletter/unsubscribe`, {
        email,
        reason: reason.trim() || undefined,
      });

      setStep("success");
    } catch (err) {
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = "/";
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden relative flex items-center justify-center p-4">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full border border-white/50 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Invalid Link</h2>
          <p className="text-slate-600 mb-6">This unsubscribe link is invalid or has expired.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden relative flex items-center justify-center p-4">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
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

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 text-blue-400/20 hidden lg:block"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Mail className="w-16 h-16" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-10 text-emerald-400/20 hidden lg:block"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -5, 5, 0],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <BookOpen className="w-16 h-16" />
        </motion.div>
      </div>

      {/* Animated Gradient Backgrounds */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/10 via-transparent to-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-purple-500/5 via-transparent to-blue-500/5 rounded-full blur-3xl" />
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
            <Mail className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">
              Newsletter Preferences
            </span>
          </motion.div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/50"
        >
          <AnimatePresence mode="wait">
            {/* CONFIRM STEP */}
            {step === "confirm" && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl mb-4">
                    <MailX className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Unsubscribe from Newsletter
                  </h2>
                  <p className="text-slate-600">
                    Are you sure you want to unsubscribe
                  </p>
                  <div className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl border border-blue-200/50">
                    <p className="text-sm font-medium text-blue-700 break-all">
                      {email}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep("reason")}
                    className="w-full py-4 px-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    <MailX className="w-5 h-5" />
                    <span>Yes, Unsubscribe</span>
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancel}
                    className="w-full py-4 px-4 bg-white/80 backdrop-blur-sm border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:border-blue-300 hover:text-blue-700 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Cancel</span>
                  </motion.button>
                </div>

                {/* Security Note */}
                <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-700">
                      You can always resubscribe later from your account settings or any newsletter email.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* REASON STEP */}
            {step === "reason" && (
              <motion.div
                key="reason"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl mb-4">
                    <MessageSquare className="w-8 h-8 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Optional Feedback
                  </h2>
                  <p className="text-slate-600">
                    Help us improve by sharing why you're leaving
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Email Display */}
                  <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl border border-blue-200/50">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <p className="text-sm text-blue-700 break-all">{email}</p>
                    </div>
                  </div>

                  {/* Feedback Textarea */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-800">
                      Your Reason (Optional)
                    </label>
                    <div className="relative">
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        onFocus={() => setFocusedField('reason')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Tell us why you're unsubscribing..."
                        rows={4}
                        className={`w-full px-4 py-3 bg-white/70 border-2 rounded-xl focus:ring-4 transition-all duration-300 text-slate-900 placeholder-slate-500 resize-none
                          ${focusedField === 'reason' 
                            ? 'border-blue-500 ring-blue-500/20 bg-white' 
                            : 'border-slate-200 hover:border-blue-300'
                          }
                        `}
                        disabled={loading}
                      />
                    </div>
                    <p className="text-xs text-slate-600">
                      Your feedback helps us improve our newsletter content.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleUnsubscribe}
                      disabled={loading}
                      className="w-full py-4 px-4 bg-gradient-to-r from-red-600 to-orange-600 disabled:from-red-400 disabled:to-orange-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Confirm Unsubscribe</span>
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep("confirm")}
                      disabled={loading}
                      className="w-full py-4 px-4 bg-white/80 backdrop-blur-sm border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:border-blue-300 hover:text-blue-700 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>Back</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SUCCESS STEP */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl mb-6 shadow-lg shadow-emerald-500/30"
                >
                  <MailCheck className="w-10 h-10 text-white" />
                </motion.div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  You're Unsubscribed
                </h2>
                
                <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 mb-6">
                  <p className="text-sm text-emerald-700 break-all">{email}</p>
                </div>
                
                <p className="text-slate-600 mb-8">
                  You will no longer receive newsletter emails from AssignFlow Hub.
                </p>

                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 group"
                >
                  <span>Return to Home</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <p className="text-xs text-slate-500 mt-6">
                  Changed your mind? You can resubscribe anytime from your account settings.
                </p>
              </motion.div>
            )}

            {/* ERROR STEP */}
            {step === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl mb-6">
                  <XCircle className="w-10 h-10 text-red-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Something Went Wrong
                </h2>
                
                <p className="text-slate-600 mb-8">
                  We couldn't process your unsubscribe request. Please try again.
                </p>

                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep("confirm")}
                    className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Try Again</span>
                  </motion.button>

                  <Link
                    to="/"
                    className="block w-full py-4 px-4 bg-white/80 backdrop-blur-sm border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:border-blue-300 hover:text-blue-700 hover:shadow-lg transition-all duration-300"
                  >
                    Return Home
                  </Link>
                </div>

                <p className="text-xs text-slate-500 mt-6">
                  If the problem persists, please contact support.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center text-xs text-slate-600"
        >
          © {new Date().getFullYear()} AssignFlow Hub. All rights reserved.
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

export default Unsubscribe;