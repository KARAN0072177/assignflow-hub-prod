import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Eye, 
  EyeOff, 
  Calendar, 
  Clock,
  Edit3, 
  Trash2,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  User,
  Tag,
  Sparkles
} from "lucide-react";

type Props = {
  blogs: any[];
  onEdit: (blog: any) => void;
  onDelete: (id: string) => void;
};

const BlogList = ({ blogs, onEdit, onDelete }: Props) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'published' 
      ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-400 border-emerald-500/30'
      : 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-400 border-amber-500/30';
  };

  const getStatusIcon = (status: string) => {
    return status === 'published' 
      ? <Eye className="w-3 h-3" />
      : <EyeOff className="w-3 h-3" />;
  };

  // Prevent event bubbling to parent elements
  const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
    e.stopPropagation();
    callback();
  };

  if (blogs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center border border-slate-700/50">
          <FileText className="w-10 h-10 text-slate-600" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No blogs found</h3>
        <p className="text-slate-400">
          Start by creating your first blog post
        </p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <div className="space-y-4">
        {blogs.map((blog, index) => (
          <motion.div
            key={blog._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
            onMouseEnter={() => setHoveredId(blog._id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`relative group rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
              expandedId === blog._id 
                ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/80' 
                : 'bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 hover:border-slate-600/70'
            }`}
            onClick={() => setExpandedId(expandedId === blog._id ? null : blog._id)}
          >
            {/* Hover Effect - Now with pointer-events: none to not block clicks */}
            {hoveredId === blog._id && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 pointer-events-none"
              />
            )}

            <div className="p-4 relative z-10">
              {/* Main Content */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <h3 className="font-medium text-white truncate">
                        {blog.title}
                      </h3>
                    </div>
                    
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${getStatusColor(blog.status)}`}>
                      {getStatusIcon(blog.status)}
                      <span className="capitalize">{blog.status}</span>
                    </div>
                  </div>

                  {/* Excerpt Preview */}
                  {blog.excerpt && (
                    <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                      {blog.excerpt}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(blog.createdAt || blog.updatedAt)}
                    </div>
                    
                    {blog.author && (
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {blog.author}
                      </div>
                    )}
                    
                    {blog.category && (
                      <div className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" />
                        {blog.category}
                      </div>
                    )}
                    
                    {blog.readTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {blog.readTime} min read
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons - With stopPropagation */}
                <div className="flex items-center gap-2 relative z-20" onClick={(e) => e.stopPropagation()}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleButtonClick(e, () => onEdit(blog))}
                    className="p-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-lg text-amber-400 hover:text-amber-300 transition-all duration-200 cursor-pointer"
                    title="Edit blog post"
                  >
                    <Edit3 className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleButtonClick(e, () => onDelete(blog._id))}
                    className="p-2 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-all duration-200 cursor-pointer"
                    title="Delete blog post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId(expandedId === blog._id ? null : blog._id);
                    }}
                    className="p-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-400 hover:text-slate-300 transition-all duration-200 cursor-pointer"
                    title={expandedId === blog._id ? "Show less" : "Show more"}
                  >
                    {expandedId === blog._id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedId === blog._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 pt-4 border-t border-slate-700/50 overflow-hidden"
                  >
                    <div className="space-y-4">
                      {/* Full Excerpt */}
                      {blog.excerpt && (
                        <div>
                          <h4 className="text-xs font-medium text-slate-400 mb-2">Excerpt</h4>
                          <p className="text-sm text-slate-300">{blog.excerpt}</p>
                        </div>
                      )}

                      {/* Content Preview */}
                      {blog.content && (
                        <div>
                          <h4 className="text-xs font-medium text-slate-400 mb-2">Content Preview</h4>
                          <div className="text-sm text-slate-300 bg-slate-800/30 p-3 rounded-lg max-h-40 overflow-y-auto">
                            {blog.content.length > 200 
                              ? `${blog.content.substring(0, 200)}...` 
                              : blog.content}
                          </div>
                        </div>
                      )}

                      {/* Additional Actions - With stopPropagation */}
                      <div className="flex items-center justify-between pt-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              // Copy link functionality
                              navigator.clipboard.writeText(`${window.location.origin}/blog/${blog._id}`);
                              // Optional: Add toast notification here
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-xs text-slate-400 hover:text-slate-300 transition-all duration-200 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            Copy Link
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              // Preview functionality
                              window.open(`/blog/${blog._id}/preview`, '_blank');
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-xs text-slate-400 hover:text-slate-300 transition-all duration-200 cursor-pointer"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Preview
                          </motion.button>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Sparkles className="w-3 h-3" />
                          <span>Last updated {new Date(blog.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
};

export default BlogList;