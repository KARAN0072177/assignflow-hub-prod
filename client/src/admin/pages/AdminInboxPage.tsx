import ContactInbox from "../components/ContactInbox";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Users, Zap, Sparkles } from "lucide-react";

const AdminInboxPage = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="p-3 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-xl"
            >
              <Mail className="w-6 h-6 text-blue-400" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-emerald-200 bg-clip-text text-transparent">
                Contact Inbox
              </h1>
              <p className="text-slate-400 mt-2">
                Manage user messages and contact requests in real-time
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl"
          >
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-slate-300">Live Updates</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-emerald-500"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div
          whileHover={{ y: -4 }}
          className="relative group overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-blue-900/20 to-blue-900/10 border border-blue-800/30"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-emerald-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-blue-500/20 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white">User Messages</h3>
            </div>
            <p className="text-sm text-slate-400">
              Messages submitted via the Contact Us form. Respond promptly to maintain good user experience.
            </p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="relative group overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-emerald-900/20 to-emerald-900/10 border border-emerald-800/30"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/0 via-emerald-600/5 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-emerald-500/20 rounded-lg">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white">Real-time Updates</h3>
            </div>
            <p className="text-sm text-slate-400">
              New messages appear instantly via WebSocket. Get notified immediately when users contact you.
            </p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="relative group overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-purple-900/20 to-purple-900/10 border border-purple-800/30"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-purple-500/20 rounded-lg">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white">User Engagement</h3>
            </div>
            <p className="text-sm text-slate-400">
              Track and manage user inquiries. Keep communication organized for better customer support.
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6"
        style={{
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
        }}
      >
        <ContactInbox />
      </motion.div>

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 text-sm text-slate-500">
          <Sparkles className="w-4 h-4 text-blue-400/50" />
          <span>Messages are automatically synced in real-time</span>
          <Sparkles className="w-4 h-4 text-emerald-400/50" />
        </div>
      </motion.div>
    </div>
  );
};

export default AdminInboxPage;