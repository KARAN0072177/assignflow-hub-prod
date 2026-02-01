import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star,
  Send,
  Sparkles,
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  MessageSquare,
  Zap,
  TrendingUp
} from "lucide-react";
import { submitFeedback } from "../services/feedback.api";

const FeedbackPage = () => {
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("You must be logged in to submit feedback.");
      return;
    }

    if (message.trim().length < 10) {
      setError("Please provide feedback with at least 10 characters.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await submitFeedback(
        { rating, message: message.trim() },
        token
      );

      setSuccess(true);
      setMessage("");
      setRating(5);
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />
      
      {/* Floating Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/10 via-transparent to-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-purple-500/5 via-transparent to-blue-500/5 rounded-full blur-3xl" />
      
      {/* Floating Icons */}
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className={`absolute ${i % 2 === 0 ? 'right-10' : 'left-10'} ${
            i === 1 ? 'top-20' : i === 2 ? 'top-1/3' : i === 3 ? 'bottom-1/3' : 'bottom-20'
          } z-0`}
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        >
          <div className="relative">
            <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50 flex items-center justify-center text-blue-500">
              {i === 1 && <Star className="w-6 h-6" />}
              {i === 2 && <MessageSquare className="w-6 h-6" />}
              {i === 3 && <TrendingUp className="w-6 h-6" />}
              {i === 4 && <Zap className="w-6 h-6" />}
            </div>
          </div>
        </motion.div>
      ))}

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-purple-500/10 backdrop-blur-sm border border-white/30 rounded-full shadow-lg mb-8"
          >
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-semibold text-slate-800">
              Your Voice Matters
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
          >
            <span className="block text-slate-900">Share Your</span>
            <span className="block mt-2">
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 animate-gradient">
                  Experience
                </span>
                <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-600/30 via-blue-500/30 to-emerald-500/30 blur-xl">
                  Experience
                </span>
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto"
          >
            Help us improve AssignFlow Hub with your honest feedback.
            Your insights shape the future of our platform.
          </motion.p>
        </motion.div>

        {/* Main Feedback Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -5 }}
          className="group relative"
        >
          {/* Card Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Main Card */}
          <div className="relative p-8 md:p-10 bg-white/90 backdrop-blur-sm border border-white/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
            {/* Rating Section */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <label className="block text-lg font-semibold text-slate-900">
                  How would you rate your experience?
                </label>
                <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-emerald-50 border border-slate-200 rounded-xl">
                  <span className="text-2xl font-bold text-slate-900">
                    {rating}.0
                  </span>
                  <span className="text-sm text-slate-600 ml-2">/ 5.0</span>
                </div>
              </div>
              
              {/* Interactive Stars */}
              <div className="flex items-center justify-center gap-3 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(null)}
                    className="relative"
                  >
                    <Star
                      className={`w-14 h-14 transition-all duration-300 ${
                        star <= (hoveredStar || rating)
                          ? "text-amber-500 fill-amber-500 drop-shadow-lg"
                          : "text-slate-300 hover:text-amber-400"
                      }`}
                    />
                    {star === rating && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <ThumbsUp className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Rating Labels */}
              <div className="flex justify-between text-sm text-slate-600 px-4">
                <span className={`transition-colors duration-200 ${rating <= 2 ? 'font-semibold text-rose-600' : ''}`}>
                  Poor
                </span>
                <span className={`transition-colors duration-200 ${rating === 3 ? 'font-semibold text-amber-600' : ''}`}>
                  Good
                </span>
                <span className={`transition-colors duration-200 ${rating >= 4 ? 'font-semibold text-emerald-600' : ''}`}>
                  Excellent
                </span>
              </div>
            </div>

            {/* Message Section */}
            <div className="mb-10">
              <label className="block text-lg font-semibold text-slate-900 mb-4">
                Share your thoughts
                <span className="text-sm font-normal text-slate-500 ml-2">
                  (Minimum 10 characters)
                </span>
              </label>
              
              <motion.div
                whileFocus={{ scale: 1.01 }}
                className="relative"
              >
                <textarea
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    setError(null);
                  }}
                  rows={6}
                  className="w-full p-6 bg-white/80 backdrop-blur-sm border-2 border-slate-200/50 rounded-2xl text-slate-700 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                  placeholder="What was your experience like? What features do you love? What could be improved? Your feedback is invaluable..."
                  maxLength={1000}
                />
                
                {/* Character Counter */}
                <div className="absolute bottom-4 right-4 text-sm text-slate-500">
                  {message.length}/1000
                </div>
                
                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((message.length / 1000) * 100, 100)}%` }}
                    className={`h-full transition-all duration-300 ${
                      message.length >= 10
                        ? "bg-gradient-to-r from-blue-500 to-emerald-500"
                        : "bg-gradient-to-r from-amber-500 to-amber-400"
                    }`}
                  />
                </div>
              </motion.div>
              
              {/* Character Requirement Hint */}
              {message.length > 0 && message.length < 10 && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-sm text-amber-600 flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{10 - message.length} more characters needed</span>
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: message.length >= 10 ? 1.02 : 1 }}
              whileTap={{ scale: message.length >= 10 ? 0.98 : 1 }}
              onClick={handleSubmit}
              disabled={loading || message.length < 10}
              className="group relative w-full py-5 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden"
            >
              {/* Button Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-emerald-600 opacity-0 group-hover:opacity-100 group-disabled:opacity-0 transition-opacity duration-300" />
              <div className="absolute inset-0 border-2 border-white/20 rounded-2xl translate-x-[-100%] group-hover:translate-x-[100%] group-disabled:translate-x-[-100%] transition-transform duration-1000" />
              
              {/* Button Content */}
              <div className="relative flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-lg">Sharing Your Feedback...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-disabled:translate-x-0" />
                    <span className="text-lg">
                      {message.length >= 10 ? "Submit Feedback" : "Add More Details"}
                    </span>
                  </>
                )}
              </div>
            </motion.button>

            {/* Privacy Note */}
            <p className="text-sm text-slate-500 text-center mt-4">
              Your feedback will be displayed publicly with your role only.
              Personal information is never shared.
            </p>

            {/* Status Messages */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-8 p-6 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-200 rounded-2xl"
                >
                  <div className="flex items-center gap-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-emerald-900 mb-1 text-lg">
                        Thank You for Your Feedback! 🎉
                      </h3>
                      <p className="text-emerald-700">
                        Your contribution helps us make AssignFlow Hub better for everyone.
                        The community appreciates your input!
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-8 p-6 bg-gradient-to-r from-rose-500/10 to-rose-600/10 border border-rose-200 rounded-2xl"
                >
                  <div className="flex items-center gap-4">
                    <AlertCircle className="w-8 h-8 text-rose-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-rose-900 mb-1 text-lg">
                        Unable to Submit Feedback
                      </h3>
                      <p className="text-rose-700">{error}</p>
                      {error.includes("logged in") && (
                        <a
                          href="/login"
                          className="inline-block mt-3 px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-300"
                        >
                          Sign In to Continue
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-8">
            Why Your Feedback Matters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Drive Improvements",
                description: "Your suggestions directly influence our development roadmap",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: <MessageSquare className="w-8 h-8" />,
                title: "Share Experiences",
                description: "Help other educators and students make informed decisions",
                color: "from-emerald-500 to-emerald-600"
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "Shape Innovation",
                description: "Contribute to the future of educational technology",
                color: "from-purple-500 to-purple-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="p-6 bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-4 mx-auto`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-slate-600 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
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

export default FeedbackPage;