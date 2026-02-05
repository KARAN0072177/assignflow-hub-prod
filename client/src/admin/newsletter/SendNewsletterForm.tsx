import { useState } from "react";
import { sendNewsletter } from "./newsletter.admin.api";
import { motion } from "framer-motion";
import { 
  Send, 
  Mail, 
  Type, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  Users,
  Eye,
  EyeOff,
  Loader2,
  Zap
} from "lucide-react";

const SendNewsletterForm = () => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'idle'; message: string }>({ type: 'idle', message: '' });
  const [sending, setSending] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  const handleSend = async () => {
    if (!subject.trim() || !content.trim()) {
      setStatus({ type: 'error', message: 'Please fill in both subject and content' });
      return;
    }

    setSending(true);
    setStatus({ type: 'idle', message: '' });

    try {
      await sendNewsletter({
        subject,
        content,
      });

      setStatus({ 
        type: 'success', 
        message: 'Newsletter sent successfully to all subscribers!' 
      });
      setSubject("");
      setContent("");
      setCharacterCount(0);
    } catch (err) {
      console.error(err);
      setStatus({ 
        type: 'error', 
        message: 'Failed to send newsletter. Please try again.' 
      });
    } finally {
      setSending(false);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setCharacterCount(newContent.length);
  };

  const emailTips = [
    "Keep subject lines under 50 characters",
    "Personalize with {name} for better engagement",
    "Include clear call-to-action",
    "Mobile-responsive design is auto-applied",
    "Preview before sending"
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg"
          >
            <Send className="w-5 h-5 text-blue-400" />
          </motion.div>
          <div>
            <h2 className="text-xl font-semibold text-white">Create Newsletter</h2>
            <p className="text-sm text-slate-400">Send email campaigns to your subscribers</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPreviewMode(!previewMode)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl text-slate-300 hover:text-white transition-all duration-200"
        >
          {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span className="text-sm font-medium">{previewMode ? 'Edit Mode' : 'Preview Mode'}</span>
        </motion.button>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className={`lg:col-span-2 space-y-6 transition-all duration-300 ${previewMode ? 'opacity-50 pointer-events-none' : ''}`}>
          {/* Subject Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Type className="w-4 h-4" />
              Subject Line
              <span className="text-xs text-slate-500">(Required)</span>
            </label>
            <div className="relative">
              <input
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all"
                placeholder="Enter newsletter subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={previewMode}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-500">
                {subject.length}/100
              </div>
            </div>
          </div>

          {/* Content Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <FileText className="w-4 h-4" />
                Newsletter Content
                <span className="text-xs text-slate-500">(Required)</span>
              </label>
              <div className="text-xs text-slate-500">
                {characterCount} characters
              </div>
            </div>
            <div className="relative">
              <textarea
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all resize-none"
                placeholder="Write your newsletter content here..."
                value={content}
                onChange={handleContentChange}
                rows={12}
                disabled={previewMode}
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400/50" />
                <span className="text-xs text-slate-500">Markdown supported</span>
              </div>
            </div>
          </div>

          {/* Send Button & Status */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
            <div className="flex-1">
              {status.type !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl ${status.type === 'success' 
                    ? 'bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/30' 
                    : 'bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30'
                  }`}
                >
                  {status.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className={`text-sm ${status.type === 'success' ? 'text-emerald-300' : 'text-red-300'}`}>
                    {status.message}
                  </span>
                </motion.div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={sending || previewMode}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Newsletter</span>
                  <Zap className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Preview & Tips Section */}
        <div className="space-y-6">
          {/* Preview Card */}
          <motion.div
            animate={previewMode ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-4 h-4 text-blue-400" />
              <h3 className="font-medium text-white">Email Preview</h3>
            </div>
            
            {previewMode ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/30 rounded-xl">
                  <div className="text-xs text-slate-400 mb-1">Subject:</div>
                  <div className="text-white font-medium">{subject || "(No subject)"}</div>
                </div>
                <div className="p-4 bg-slate-800/30 rounded-xl min-h-[200px]">
                  <div className="text-xs text-slate-400 mb-1">Content Preview:</div>
                  <div className="text-slate-300 whitespace-pre-wrap">
                    {content || "(No content yet)"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center border border-slate-700/50">
                  <Eye className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-400 text-sm">
                  Enable preview mode to see how your email will look
                </p>
              </div>
            )}
          </motion.div>

          {/* Tips Card */}
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <h3 className="font-medium text-white">Best Practices</h3>
            </div>
            
            <ul className="space-y-3">
              {emailTips.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-blue-400">{index + 1}</span>
                  </div>
                  <span className="text-slate-300">{tip}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-purple-400" />
              <h3 className="font-medium text-white">Campaign Stats</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Subscribers</span>
                <span className="text-white font-medium">1,234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Avg. Open Rate</span>
                <span className="text-emerald-400 font-medium">42.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Avg. Click Rate</span>
                <span className="text-blue-400 font-medium">18.3%</span>
              </div>
              <div className="pt-3 border-t border-slate-700/30">
                <div className="text-xs text-slate-500">
                  Based on last 30 days performance
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Variable Help */}
      <div className="p-6 bg-gradient-to-r from-slate-800/30 to-slate-900/30 border border-slate-700/50 rounded-2xl">
        <h4 className="font-medium text-white mb-3">Available Variables</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['{name}', '{email}', '{date}', '{unsubscribe_url}'].map((variable) => (
            <div
              key={variable}
              className="px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-center"
            >
              <code className="text-sm text-blue-400 font-mono">{variable}</code>
              <div className="text-xs text-slate-500 mt-1">
                {variable === '{name}' && "Subscriber's name"}
                {variable === '{email}' && "Subscriber's email"}
                {variable === '{date}' && "Current date"}
                {variable === '{unsubscribe_url}' && "Unsubscribe link"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SendNewsletterForm;