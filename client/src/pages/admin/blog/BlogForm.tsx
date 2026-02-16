import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Type, 
  FileText, 
  Save, 
  Eye, 
  Sparkles,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  List
} from "lucide-react";

type Props = {
  initialData?: any;
  onSubmit: (data: any) => void;
};

const BlogForm = ({ initialData, onSubmit }: Props) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [status, setStatus] = useState(initialData?.status || "draft");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [charCount, setCharCount] = useState({
    title: 0,
    excerpt: 0,
    content: 0
  });

  useEffect(() => {
    setCharCount({
      title: title.length,
      excerpt: excerpt.length,
      content: content.length
    });
  }, [title, excerpt, content]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = "Title is required";
    else if (title.length < 5) newErrors.title = "Title must be at least 5 characters";
    else if (title.length > 200) newErrors.title = "Title must be less than 200 characters";
    
    if (!excerpt.trim()) newErrors.excerpt = "Excerpt is required";
    else if (excerpt.length < 10) newErrors.excerpt = "Excerpt must be at least 10 characters";
    else if (excerpt.length > 300) newErrors.excerpt = "Excerpt must be less than 300 characters";
    
    if (!content.trim()) newErrors.content = "Content is required";
    else if (content.length < 50) newErrors.content = "Content must be at least 50 characters";
    
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Mark all fields as touched to show errors
      setTouched({
        title: true,
        excerpt: true,
        content: true
      });
      return;
    }

    onSubmit({
      title,
      excerpt,
      content,
      status
    });
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const newErrors = validate();
    setErrors(newErrors);
  };

  const getFieldError = (field: string) => {
    return touched[field] && errors[field] ? errors[field] : null;
  };

  return (
    <div className="space-y-6">
      {/* Title Input */}
      <div className="space-y-2">
        <label className="flex items-center justify-between text-sm font-medium text-slate-300">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            Blog Title
            <span className="text-xs text-slate-500">(Required)</span>
          </div>
          <span className={`text-xs ${charCount.title > 180 ? 'text-amber-400' : 'text-slate-500'}`}>
            {charCount.title}/200
          </span>
        </label>
        <div className="relative">
          <input
            className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
              getFieldError('title')
                ? 'border-red-500/50 focus:ring-red-500/50'
                : 'border-slate-700/50 focus:ring-blue-500/50 focus:border-blue-500/30'
            }`}
            placeholder="Enter an engaging title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => handleBlur('title')}
          />
          {getFieldError('title') && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <AlertCircle className="w-4 h-4 text-red-400" />
            </div>
          )}
        </div>
        {getFieldError('title') && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {getFieldError('title')}
          </p>
        )}
      </div>

      {/* Excerpt Input */}
      <div className="space-y-2">
        <label className="flex items-center justify-between text-sm font-medium text-slate-300">
          <div className="flex items-center gap-2">
            <List className="w-4 h-4" />
            Excerpt
            <span className="text-xs text-slate-500">(Required)</span>
          </div>
          <span className={`text-xs ${charCount.excerpt > 250 ? 'text-amber-400' : 'text-slate-500'}`}>
            {charCount.excerpt}/300
          </span>
        </label>
        <textarea
          className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all resize-none h-20 ${
            getFieldError('excerpt')
              ? 'border-red-500/50 focus:ring-red-500/50'
              : 'border-slate-700/50 focus:ring-blue-500/50 focus:border-blue-500/30'
          }`}
          placeholder="Write a brief summary of your blog post..."
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          onBlur={() => handleBlur('excerpt')}
        />
        {getFieldError('excerpt') && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {getFieldError('excerpt')}
          </p>
        )}
      </div>

      {/* Content Input */}
      <div className="space-y-2">
        <label className="flex items-center justify-between text-sm font-medium text-slate-300">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Content
            <span className="text-xs text-slate-500">(Required - HTML supported)</span>
          </div>
          <span className={`text-xs ${charCount.content < 50 ? 'text-amber-400' : 'text-slate-500'}`}>
            {charCount.content} chars
          </span>
        </label>
        <textarea
          className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all resize-none h-40 font-mono text-sm ${
            getFieldError('content')
              ? 'border-red-500/50 focus:ring-red-500/50'
              : 'border-slate-700/50 focus:ring-blue-500/50 focus:border-blue-500/30'
          }`}
          placeholder="<p>Write your blog content here. HTML is supported for formatting...</p>"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={() => handleBlur('content')}
        />
        {getFieldError('content') && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {getFieldError('content')}
          </p>
        )}
      </div>

      {/* Status Selection */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Eye className="w-4 h-4" />
          Status
        </label>
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setStatus("draft")}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 ${
              status === "draft"
                ? "bg-gradient-to-r from-amber-500/20 to-amber-600/20 border-amber-500/30 text-amber-400"
                : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-300"
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">Draft</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setStatus("published")}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 ${
              status === "published"
                ? "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 text-emerald-400"
                : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-300"
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">Published</span>
          </motion.button>
        </div>
      </div>

      {/* HTML Tips */}
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-800/30 to-slate-900/30 border border-slate-700/50 rounded-xl">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-slate-400">HTML Supported:</span>
          <span className="text-xs bg-slate-800/50 px-2 py-1 rounded text-slate-300">p, h1-h6, strong, em, ul, li</span>
        </div>
        <div className="flex-1 text-right text-xs text-slate-500">
          <Sparkles className="w-3 h-3 inline mr-1" />
          Use HTML for rich formatting
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
      >
        <Save className="w-5 h-5" />
        {initialData ? 'Update Blog Post' : 'Save Blog Post'}
      </motion.button>

      {/* Form Status - Errors */}
      {Object.keys(errors).length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-xl"
        >
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Please fix the errors above</span>
          </div>
        </motion.div>
      )}

      {/* Success Animation */}
      <AnimatePresence>
        {Object.keys(errors).length === 0 && touched.title && touched.excerpt && touched.content && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/30 rounded-xl"
          >
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">All fields look good! Ready to save.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogForm;