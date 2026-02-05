import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail,
  Bell,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Send,
  X
} from "lucide-react";
import { subscribeNewsletter } from "../services/newsletter.api";

const NewsletterSubscribe = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleSubscribe = async (e?: FormEvent) => {
    if (e) {
      e.preventDefault(); // Prevent form submission
    }
    
    if (!email) return;

    try {
      setLoading(true);
      setMessage(null);

      const res = await subscribeNewsletter({
        email,
        source: "website",
      });

      if (res.alreadySubscribed) {
        const msg = "You're already subscribed.";
        setMessage(msg);
        setPopupMessage(msg);
        setShowPopup(true);
      } else if (res.resubscribed) {
        const msg = "Welcome back! You're subscribed again.";
        setMessage(msg);
        setPopupMessage(msg);
        setShowPopup(true);
      } else if (res.subscribed) {
        const msg = "Subscription successful. Check your email!";
        setMessage(msg);
        setPopupMessage(msg);
        setShowPopup(true);
      }
    } catch (err) {
      const msg = "Something went wrong. Try again.";
      setMessage(msg);
      setPopupMessage(msg);
      setShowPopup(true);
    } finally {
      setLoading(false);
      setEmail("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSubscribe();
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      {/* Confirmation Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={closePopup}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100/80 hover:bg-slate-200/80 transition-colors duration-200"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-slate-700" />
              </button>

              {/* Popup Content */}
              <div className="p-6">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500/10 to-emerald-500/10">
                  {popupMessage.includes("already subscribed") ? (
                    <Bell className="w-8 h-8 text-blue-500" />
                  ) : popupMessage.includes("Welcome back") || popupMessage.includes("successful") ? (
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-rose-500" />
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-center text-slate-900 mb-2">
                  {popupMessage.includes("already subscribed") 
                    ? "Already Subscribed" 
                    : popupMessage.includes("Welcome back") 
                    ? "Welcome Back!" 
                    : popupMessage.includes("successful") 
                    ? "Success!" 
                    : "Oops!"}
                </h3>
                
                <p className="text-sm text-center text-slate-600 mb-6">
                  {popupMessage}
                </p>
                
                <button
                  onClick={closePopup}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Original Newsletter Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -3 }}
        className="group relative max-w-md w-full mx-auto"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Main Card */}
        <div className="mb-12 relative p-6 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 p-2.5">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Subscribe to our Newsletter
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-full">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span className="text-xs font-medium text-slate-700">
                    Latest Updates
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 mb-6">
            Get product updates, new features & important announcements.
          </p>

          {/* Input & Button - Wrap in form */}
          <form onSubmit={handleSubscribe} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setMessage(null);
                }}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-slate-200/50 rounded-xl text-sm text-slate-700 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                disabled={loading}
                required
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="group relative w-full py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden text-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-emerald-600 opacity-0 group-hover:opacity-100 group-disabled:opacity-0 transition-opacity duration-300" />
              
              <div className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Subscribe</span>
                  </>
                )}
              </div>
            </motion.button>
          </form>

          {/* Status Messages */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 5, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -5, height: 0 }}
                className="mt-4 overflow-hidden"
              >
                <div className={`p-3 rounded-lg border text-sm ${
                  message.includes("already subscribed") 
                    ? "bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-200 text-blue-700"
                    : message.includes("Welcome back") || message.includes("successful")
                    ? "bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border-emerald-200 text-emerald-700"
                    : "bg-gradient-to-r from-rose-500/10 to-rose-600/10 border-rose-200 text-rose-700"
                }`}>
                  <div className="flex items-center gap-2">
                    {message.includes("already subscribed") ? (
                      <Bell className="w-4 h-4" />
                    ) : message.includes("Welcome back") || message.includes("successful") ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span className="font-medium">{message}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* What to Expect */}
          <div className="mt-8 pt-6 border-t border-slate-200/50">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">What you'll receive:</h4>
            <div className="grid grid-cols-1 gap-2">
              {[
                { text: "Product updates & new features" },
                { text: "Educational tips & resources" },
                { text: "Platform announcements" },
                { text: "Community highlights" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default NewsletterSubscribe;