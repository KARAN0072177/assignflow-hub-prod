import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const FeedbackCTA = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-purple-500/10 backdrop-blur-sm border border-white/30 rounded-full shadow-lg mb-6">
        <Sparkles className="w-5 h-5 text-amber-500" />
        <span className="text-sm font-semibold text-slate-800">
          Join our community of voices
        </span>
      </div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-4"
      >
        Share Your Experience
      </motion.h3>

      <p className="text-slate-600 text-center mb-8 max-w-md">
        Your feedback helps shape the future of AssignFlow Hub for everyone.
      </p>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          to="/feedback"
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 overflow-hidden"
        >
          {/* Button Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 border-2 border-white/20 rounded-2xl translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          
          {/* Button Content */}
          <div className="relative flex items-center gap-3">
            <MessageSquare className="w-5 h-5" />
            <span className="text-lg">Share Your Feedback</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default FeedbackCTA;