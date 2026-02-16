import { useEffect, useState } from "react";
import {
  fetchAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../../../services/blog.admin.api";
import BlogForm from "./BlogForm";
import BlogList from "./BlogList";
import { motion } from "framer-motion";
import { 
  FileText, 
  Plus, 
  Edit3, 
  Eye, 
  Search,
  BookOpen,
  PenTool,
  Archive,
  Sparkles,
  AlertCircle,
  CheckCircle
} from "lucide-react";

const BlogPage = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published">("all");

  const loadBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllBlogs();
      setBlogs(data);
    } catch (err) {
      console.error("Failed to load blogs:", err);
      setError("Failed to load blogs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleCreate = async (data: any) => {
    try {
      await createBlog(data);
      await loadBlogs();
      setEditing(null);
    } catch (err) {
      console.error("Failed to create blog:", err);
      setError("Failed to create blog. Please try again.");
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      await updateBlog(editing._id, data);
      setEditing(null);
      await loadBlogs();
    } catch (err) {
      console.error("Failed to update blog:", err);
      setError("Failed to update blog. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) return;
    try {
      await deleteBlog(id);
      await loadBlogs();
    } catch (err) {
      console.error("Failed to delete blog:", err);
      setError("Failed to delete blog. Please try again.");
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: blogs.length,
    published: blogs.filter(b => b.status === "published").length,
    draft: blogs.filter(b => b.status === "draft").length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="relative mx-auto w-16 h-16"
          >
            <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <div className="absolute inset-2 border-4 border-purple-500 border-r-transparent rounded-full animate-pulse"></div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-slate-400 font-medium"
          >
            Loading Blog Posts
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-slate-600 mt-2"
          >
            Fetching your content...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl"
            >
              <FileText className="w-6 h-6 text-blue-400" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Blog Management
              </h1>
              <p className="text-slate-400 mt-2">
                Create, edit, and manage your blog posts
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 rounded-xl"
          >
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm text-emerald-400 font-medium">
              {stats.published} Published
            </span>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-xl"
          >
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-sm text-amber-400 font-medium">
              {stats.draft} Drafts
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Posts"
          value={stats.total}
          icon={BookOpen}
          color="blue"
          change="All time"
        />
        <StatCard
          title="Published"
          value={stats.published}
          icon={Eye}
          color="emerald"
          change={`${((stats.published / stats.total) * 100 || 0).toFixed(0)}% of total`}
        />
        <StatCard
          title="Drafts"
          value={stats.draft}
          icon={PenTool}
          color="amber"
          change="Pending review"
        />
        <StatCard
          title="Categories"
          value="3"
          icon={Archive}
          color="purple"
          change="Active"
        />
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-2xl flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-xs text-slate-400 hover:text-slate-300"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-slate-700/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${editing ? 'bg-amber-500/20' : 'bg-blue-500/20'}`}>
                  {editing ? (
                    <Edit3 className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Plus className="w-5 h-5 text-blue-400" />
                  )}
                </div>
                <h2 className="text-xl font-semibold text-white">
                  {editing ? "Edit Blog Post" : "Create New Blog Post"}
                </h2>
              </div>
              
              {editing && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setEditing(null)}
                  className="px-3 py-1.5 text-sm text-slate-400 hover:text-white bg-slate-800/30 rounded-lg transition-colors"
                >
                  Cancel Edit
                </motion.button>
              )}
            </div>

            <BlogForm
              key={editing?._id || 'new'} // Force re-render when switching between edit/create
              initialData={editing}
              onSubmit={editing ? handleUpdate : handleCreate}
            />
          </div>
        </motion.div>

        {/* RIGHT: Blog List Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-slate-700/50 transition-all duration-300">
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Search className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search blogs..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              {/* Blog List */}
              <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                <BlogList
                  blogs={filteredBlogs}
                  onEdit={setEditing}
                  onDelete={handleDelete}
                />
                
                {filteredBlogs.length === 0 && (
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
                      {searchTerm || statusFilter !== 'all' 
                        ? "Try adjusting your filters" 
                        : "Create your first blog post"}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-900/10 to-purple-900/10 border border-blue-500/20 rounded-2xl"
      >
        <Sparkles className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-white font-medium mb-2">Blog Management Tips</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Write clear, engaging titles for better SEO
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Use excerpts to give readers a preview
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Preview drafts before publishing
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Regular updates keep content fresh
            </li>
          </ul>
        </div>
      </motion.div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = "blue", 
  change 
}: { 
  title: string; 
  value: number | string; 
  icon: any; 
  color: "blue" | "emerald" | "amber" | "purple" | "red";
  change?: string;
}) => {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400",
    emerald: "from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 text-emerald-400",
    amber: "from-amber-500/20 to-amber-600/20 border-amber-500/30 text-amber-400",
    purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400",
    red: "from-red-500/20 to-red-600/20 border-red-500/30 text-red-400"
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative group overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} border ${colorClasses[color].split(' ')[2]} transition-all duration-300`}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear"
        }}
      />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className={`text-xs font-medium ${colorClasses[color].split(' ')[3]}`}>
            {change}
          </span>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-slate-400">{title}</p>
          <p className={`text-2xl font-bold ${colorClasses[color].split(' ')[3]}`}>
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogPage;