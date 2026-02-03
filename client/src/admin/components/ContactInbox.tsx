import { useEffect, useState } from "react";
import ContactMessageCard from "./ContactMessageCard";
import { 
  getAdminContacts, 
  markMessageAsRead, 
  markMessagesAsReadBulk 
} from "../../services/adminContact.api";
import { useAdminSocket } from "../AdminSocketProvider";
import type { AdminContactMessage } from "../../services/adminContact.api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  RefreshCw, 
  Loader2, 
  Inbox, 
  Filter, 
  CheckCircle, 
  Eye,
  CheckCheck,
  AlertCircle,
  AlertTriangle} from "lucide-react";

const ContactInbox = () => {
  const [messages, setMessages] = useState<AdminContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [markingAsRead, setMarkingAsRead] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { lastEvent } = useAdminSocket();

  const fetchMessages = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    setRefreshing(true);
    setError(null);
    try {
      const data = await getAdminContacts(token);
      setMessages(data);
      setSelectedMessages([]); // Clear selection on refresh
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setError("Failed to load messages. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // 🔔 React to real-time contact events
  useEffect(() => {
    if (lastEvent?.type === "contact:new") {
      fetchMessages();
    }
  }, [lastEvent]);

  const handleMessageSelect = (messageId: string) => {
    setSelectedMessages(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleSelectAll = () => {
    const unreadMessages = messages.filter(msg => !msg.isRead).map(msg => msg.id);
    if (selectedMessages.length === unreadMessages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(unreadMessages);
    }
  };

  const handleMarkAsRead = async () => {
    if (selectedMessages.length === 0) return;

    const token = localStorage.getItem("authToken");
    if (!token) return;

    setMarkingAsRead(true);
    setError(null);
    try {
      // Try bulk endpoint first, fallback to individual calls
      try {
        const response = await markMessagesAsReadBulk(token, selectedMessages);
        console.log("Bulk mark as read response:", response);
      } catch (bulkError) {
        console.log("Bulk endpoint not available, falling back to individual calls");
        // Fallback to individual calls
        await Promise.all(selectedMessages.map(id => 
          markMessageAsRead(token, id)
        ));
      }

      // Update local state
      setMessages(prev => prev.map(msg => 
        selectedMessages.includes(msg.id) 
          ? { ...msg, isRead: true }
          : msg
      ));

      // Clear selection
      setSelectedMessages([]);
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
      setError("Failed to mark messages as read. Please try again.");
    } finally {
      setMarkingAsRead(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const unreadMessages = messages.filter(msg => !msg.isRead);
    if (unreadMessages.length === 0) return;

    setMarkingAsRead(true);
    setError(null);
    try {
      const unreadIds = unreadMessages.map(msg => msg.id);
      
      // Try bulk endpoint first
      try {
        const response = await markMessagesAsReadBulk(token, unreadIds);
        console.log("Mark all as read response:", response);
      } catch (bulkError) {
        console.log("Bulk endpoint not available, falling back to individual calls");
        // Fallback to individual calls
        await Promise.all(unreadIds.map(id => 
          markMessageAsRead(token, id)
        ));
      }

      // Update local state
      setMessages(prev => prev.map(msg => 
        ({ ...msg, isRead: true })
      ));

      // Clear selection
      setSelectedMessages([]);
    } catch (error) {
      console.error("Failed to mark all messages as read:", error);
      setError("Failed to mark messages as read. Please try again.");
    } finally {
      setMarkingAsRead(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedMessages([]);
  };

  const filteredMessages = filter === "unread" 
    ? messages.filter(msg => !msg.isRead) 
    : messages;

  const unreadCount = messages.filter(msg => !msg.isRead).length;
  const selectedCount = selectedMessages.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative w-16 h-16"
        >
          <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <div className="absolute inset-2 border-4 border-emerald-500 border-r-transparent rounded-full animate-pulse"></div>
        </motion.div>
        <div className="ml-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 font-medium"
          >
            Loading Messages
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-slate-500"
          >
            Fetching contact requests...
          </motion.p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[400px] p-8"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-2xl flex items-center justify-center border border-red-500/30 mb-6">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Error Loading Messages
        </h3>
        <p className="text-slate-400 text-center max-w-md mb-4">
          {error}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchMessages}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl text-slate-300 hover:text-white transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm font-medium">Try Again</span>
        </motion.button>
      </motion.div>
    );
  }

  if (messages.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[400px] p-8"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="relative mb-6"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center border border-slate-700/50">
            <Inbox className="w-12 h-12 text-slate-600" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-full flex items-center justify-center">
            <Mail className="w-5 h-5 text-blue-400" />
          </div>
        </motion.div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Inbox Empty
        </h3>
        <p className="text-slate-400 text-center max-w-md mb-6">
          No contact messages have been submitted yet. 
          Messages will appear here when users reach out via the contact form.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchMessages}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl text-slate-300 hover:text-white transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm font-medium">Refresh</span>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                <Inbox className="w-5 h-5 text-blue-400" />
              </div>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 text-xs rounded-full flex items-center justify-center font-bold"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </motion.span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Contact Messages
              </h2>
              <p className="text-sm text-slate-400">
                {messages.length} total • {unreadCount} unread • {selectedCount} selected
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-800/50 rounded-xl border border-slate-700/50">
            {(["all", "unread"] as const).map((option) => (
              <button
                key={option}
                onClick={() => {
                  setFilter(option);
                  setSelectedMessages([]); // Clear selection when changing filter
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${filter === option
                  ? "bg-gradient-to-r from-blue-500/20 to-emerald-500/20 text-white"
                  : "text-slate-400 hover:text-white"
                }`}
              >
                {option === "all" ? "All" : "Unread"}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchMessages}
            disabled={refreshing}
            className="p-2.5 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl text-slate-300 hover:text-white transition-all duration-200 disabled:opacity-50"
          >
            {refreshing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Action Bar - Shows when messages are selected */}
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-900/20 to-emerald-900/20 border border-blue-500/30 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center"
              >
                <CheckCircle className="w-4 h-4 text-blue-400" />
              </motion.div>
              <div>
                <span className="text-white font-medium">
                  {selectedCount} message{selectedCount !== 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={handleClearSelection}
                  className="text-xs text-slate-400 hover:text-slate-300 ml-3"
                >
                  Clear
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSelectAll}
                className="px-3 py-1.5 text-sm text-slate-300 hover:text-white bg-slate-800/30 rounded-lg"
              >
                {selectedMessages.length === filteredMessages.filter(msg => !msg.isRead).length 
                  ? "Deselect All" 
                  : "Select All Unread"
                }
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMarkAsRead}
                disabled={markingAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                {markingAsRead ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCheck className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {markingAsRead ? 'Marking...' : 'Mark as Read'}
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mark All as Read Button */}
      {unreadCount > 0 && selectedCount === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleMarkAllAsRead}
            disabled={markingAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700/50 text-slate-300 hover:text-white rounded-xl transition-all duration-200 disabled:opacity-50"
          >
            {markingAsRead ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {markingAsRead ? 'Processing...' : `Mark All (${unreadCount}) as Read`}
            </span>
          </motion.button>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-2xl flex items-center gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-xs text-slate-400 hover:text-slate-300"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {/* Messages Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {filteredMessages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 rounded-2xl"
            >
              {filter === "unread" ? (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-full flex items-center justify-center">
                    <CheckCheck className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    All caught up!
                  </h3>
                  <p className="text-slate-400">
                    No unread messages. All messages have been marked as read.
                  </p>
                </>
              ) : (
                <>
                  <Filter className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    No messages found
                  </h3>
                  <p className="text-slate-400">
                    Try changing the filter to see different messages.
                  </p>
                </>
              )}
            </motion.div>
          ) : (
            <>
              {/* Messages List */}
              {filteredMessages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                  className="relative"
                >
                  {/* Selection Checkbox */}
                  {!msg.isRead && (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="absolute top-4 left-4 z-10"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMessageSelect(msg.id);
                        }}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${selectedMessages.includes(msg.id)
                          ? "bg-gradient-to-br from-blue-500 to-emerald-500 border-transparent"
                          : "bg-slate-800/50 border-slate-600 hover:border-blue-400"
                        }`}
                      >
                        {selectedMessages.includes(msg.id) && (
                          <CheckCheck className="w-3 h-3 text-white" />
                        )}
                      </button>
                    </motion.div>
                  )}
                  
                  <div className={!msg.isRead ? "pl-12" : ""}>
                    <ContactMessageCard 
                      message={msg} 
                      isSelected={selectedMessages.includes(msg.id)}
                      onSelectToggle={() => handleMessageSelect(msg.id)}
                    />
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Selection Hint */}
      {unreadCount > 0 && selectedCount === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 text-sm text-slate-500"
        >
          <AlertCircle className="w-4 h-4" />
          <span>Click the checkbox on unread messages to select multiple</span>
        </motion.div>
      )}
    </div>
  );
};

export default ContactInbox;