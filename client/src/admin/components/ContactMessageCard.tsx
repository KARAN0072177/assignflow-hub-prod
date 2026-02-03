import { Mail, Phone, Clock, User, MessageSquare, Eye, EyeOff, Calendar } from "lucide-react";
import type { AdminContactMessage } from "../../services/adminContact.api";
import { motion } from "framer-motion";
import { useState } from "react";

const ContactMessageCard = ({
  message,
  isSelected = false,
  onSelectToggle
}: {
  message: AdminContactMessage;
  isSelected?: boolean;
  onSelectToggle?: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isRead = message.isRead || false;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getTimeColor = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 1) return "text-emerald-400";
    if (diffHours < 24) return "text-blue-400";
    if (diffHours < 72) return "text-amber-400";
    return "text-slate-400";
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer ${isSelected
        ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900"
        : ""
      } ${isRead
        ? "bg-gradient-to-br from-slate-800/40 to-slate-900/40 border-slate-700/50"
        : "bg-gradient-to-br from-blue-900/20 to-emerald-900/20 border-blue-500/30"
      } ${hovered ? "border-slate-600/50 shadow-xl shadow-black/20" : ""}`}
      onClick={() => {
        if (!isRead && onSelectToggle) {
          onSelectToggle();
        } else {
          setExpanded(!expanded);
        }
      }}
    >
      {/* Selection Overlay */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-emerald-500/20"
        />
      )}

      {/* Hover Effect */}
      {hovered && !isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10"
        />
      )}

      {/* Unread/Selected Indicator */}
      {!isRead && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4"
        >
          {isSelected ? (
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full"
            />
          ) : (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full"
            />
          )}
        </motion.div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`p-3 rounded-xl ${isRead
                ? "bg-gradient-to-br from-slate-700/50 to-slate-800/50"
                : "bg-gradient-to-br from-blue-500/20 to-emerald-500/20"
              }`}
            >
              <User className={`w-5 h-5 ${isRead ? "text-slate-400" : "text-blue-400"}`} />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`font-semibold ${isRead ? "text-white" : "text-blue-300"}`}>
                  {message.name}
                </h3>
                {!isRead && !isSelected && (
                  <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 text-blue-400 text-xs rounded-full">
                    New
                  </span>
                )}
                {isSelected && (
                  <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-xs rounded-full">
                    Selected
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm mt-1">
                <Mail className="w-3 h-3 text-slate-500" />
                <span className="text-slate-400">{message.email}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className={`flex items-center gap-1 text-xs ${getTimeColor(message.createdAt)}`}>
              <Clock className="w-3 h-3" />
              {formatDate(message.createdAt)}
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(message.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Message Preview */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">Message</span>
          </div>
          <p className={`text-slate-300 line-clamp-${expanded ? 'none' : '3'} transition-all duration-300`}>
            {message.message}
          </p>
          {message.message.length > 200 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2"
            >
              <span className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                {expanded ? 'Show less' : 'Read more...'}
              </span>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
          {message.phone && (
            <div className="flex items-center gap-2 text-sm">
              <div className="p-1.5 bg-slate-700/30 rounded-lg">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <span className="text-slate-300">{message.phone}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-slate-500">
              {isRead ? (
                <>
                  <Eye className="w-3 h-3" />
                  <span>Read</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3 h-3" />
                  <span>Unread</span>
                </>
              )}
            </div>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              className="w-6 h-6 bg-slate-700/30 rounded-full flex items-center justify-center"
            >
              <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactMessageCard;