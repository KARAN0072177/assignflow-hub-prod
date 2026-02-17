import { useEffect, useState, useCallback, useMemo } from "react";
import { fetchPublishedBlogs } from "../services/blog.public.api";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  Loader2
} from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  readTime?: number;
  views?: number;
  image?: string;
}

// Skeleton Loader Component - Simplified for production
const BlogCardSkeleton = () => {
  return (
    <div className="relative h-full">
      <div className="relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg overflow-hidden h-full flex flex-col">
        <div className="p-6 lg:p-8 flex-1 flex flex-col">
          {/* Metadata skeleton */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="h-4 w-20 bg-slate-200 rounded-full" />
            <div className="h-4 w-16 bg-slate-200 rounded-full" />
            <div className="h-4 w-12 bg-slate-200 rounded-full" />
          </div>

          {/* Title skeleton - 2 lines */}
          <div className="space-y-2 mb-3">
            <div className="h-6 w-3/4 bg-slate-200 rounded-lg" />
            <div className="h-6 w-1/2 bg-slate-200 rounded-lg" />
          </div>

          {/* Excerpt skeleton - 3 lines */}
          <div className="space-y-2 mb-6 flex-1">
            <div className="h-4 w-full bg-slate-200 rounded" />
            <div className="h-4 w-5/6 bg-slate-200 rounded" />
            <div className="h-4 w-4/6 bg-slate-200 rounded" />
          </div>

          {/* Read more skeleton */}
          <div className="h-5 w-24 bg-slate-200 rounded mt-auto" />
        </div>
      </div>
    </div>
  );
};

// Filter Skeleton - Now properly used
const FilterSkeleton = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
      <div className="flex items-center gap-3">
        <div className="h-8 w-16 bg-slate-200 rounded-xl" />
        <div className="flex items-center gap-2">
          <div className="h-10 w-28 bg-slate-200 rounded-xl" />
          <div className="h-10 w-28 bg-slate-200 rounded-xl" />
        </div>
      </div>
      <div className="h-8 w-48 bg-slate-200 rounded-full" />
    </div>
  );
};

const BlogListPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const postsPerPage = 6;

  // Fetch blogs on mount
  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchPublishedBlogs();
        setBlogs(data);
      } catch (err) {
        setError('Failed to load blogs. Please try again later.');
        console.error('Error loading blogs:', err);
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };

    loadBlogs();
  }, []);

  // Memoized sorted blogs for performance
  const sortedBlogs = useMemo(() => {
    return [...blogs].sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [blogs, sortOrder]);

  // Pagination calculations with useMemo
  const paginationData = useMemo(() => {
    const totalPosts = sortedBlogs.length;
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = sortedBlogs.slice(indexOfFirstPost, indexOfLastPost);
    
    return {
      totalPosts,
      totalPages,
      indexOfFirstPost,
      indexOfLastPost,
      currentPosts
    };
  }, [sortedBlogs, currentPage, postsPerPage]);

  const { totalPosts, totalPages, indexOfFirstPost, indexOfLastPost, currentPosts } = paginationData;

  // Handle page change
  const handlePageChange = useCallback((pageNumber: number) => {
    if (pageNumber === currentPage || pageNumber < 1 || pageNumber > totalPages) return;
    
    setIsFilterLoading(true);
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Simulate loading time for smooth transition
    setTimeout(() => {
      setIsFilterLoading(false);
    }, 300);
  }, [currentPage, totalPages]);

  // Handle sort change
  const handleSortChange = useCallback((order: 'newest' | 'oldest') => {
    if (order === sortOrder) return;
    
    setIsFilterLoading(true);
    setSortOrder(order);
    setCurrentPage(1);
    
    setTimeout(() => {
      setIsFilterLoading(false);
    }, 300);
  }, [sortOrder]);

  // Retry loading on error
  const handleRetry = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchPublishedBlogs();
      setBlogs(data);
    } catch (err) {
      setError('Failed to load blogs. Please try again later.');
      console.error('Error loading blogs:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = useCallback(() => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  }, [currentPage, totalPages]);

  // Don't render anything during initial load to prevent flicker
  if (isInitialLoad && isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-50 to-orange-50 mb-6">
            <BookOpen className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="group cursor-pointer relative px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Blog | AssignFlow Hub</title>
        <meta
          name="description"
          content="Latest insights, updates, and educational technology articles from AssignFlow Hub."
        />
        <link rel="canonical" href="https://assignflowhub.karanart.com/blog" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden relative">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />

        {/* Floating Particles - Only render after initial load */}
        {!isLoading && (
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-300/30 rounded-full"
                initial={{
                  x: Math.random() * 100 + '%',
                  y: Math.random() * 100 + '%',
                }}
                animate={{
                  y: [null, `-${Math.random() * 50 + 20}px`],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-20">
            
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-purple-500/10 backdrop-blur-sm border border-white/30 rounded-full shadow-lg mb-6">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-slate-800">
                  Insights & Updates
                </span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                <span className="block">Latest from the</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
                  AssignFlow Hub Blog
                </span>
              </h1>
              
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Discover insights, updates, and best practices for modern assignment management
              </p>
            </motion.div>

            {/* Filters Bar - Show FilterSkeleton when loading */}
            {isLoading ? (
              <FilterSkeleton />
            ) : (
              blogs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="mb-10"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Mobile Filter Toggle */}
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="sm:hidden flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl shadow-lg w-full justify-center"
                    >
                      <Filter className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-slate-700">Filters</span>
                    </button>

                    {/* Filter Options */}
                    <div className={`${showFilters ? 'flex' : 'hidden'} sm:flex flex-wrap items-center gap-3 w-full sm:w-auto`}>
                      <span className="text-sm font-medium text-slate-600">Sort by:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSortChange('newest')}
                          disabled={isFilterLoading}
                          className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                            sortOrder === 'newest'
                              ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-lg shadow-blue-500/30'
                              : 'bg-white/80 backdrop-blur-sm border border-slate-200/50 text-slate-700 hover:border-blue-300 hover:text-blue-600'
                          } ${isFilterLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          Newest First
                        </button>
                        <button
                          onClick={() => handleSortChange('oldest')}
                          disabled={isFilterLoading}
                          className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                            sortOrder === 'oldest'
                              ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-lg shadow-blue-500/30'
                              : 'bg-white/80 backdrop-blur-sm border border-slate-200/50 text-slate-700 hover:border-blue-300 hover:text-blue-600'
                          } ${isFilterLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          Oldest First
                        </button>
                      </div>
                    </div>

                    {/* Results Count */}
                    <div className="text-sm text-slate-600 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200/50">
                      Showing <span className="font-semibold text-blue-600">
                        {totalPosts === 0 ? 0 : indexOfFirstPost + 1}
                      </span> to <span className="font-semibold text-emerald-600">
                        {Math.min(indexOfLastPost, totalPosts)}
                      </span> of <span className="font-semibold text-purple-600">{totalPosts}</span> articles
                    </div>
                  </div>
                </motion.div>
              )
            )}

            {/* Blog Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 auto-rows-fr">
                {Array.from({ length: 6 }).map((_, index) => (
                  <BlogCardSkeleton key={index} />
                ))}
              </div>
            ) : blogs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-emerald-50 mb-6">
                  <BookOpen className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No articles yet</h3>
                <p className="text-slate-600">Check back soon for new insights and updates!</p>
              </motion.div>
            ) : (
              <>
                {/* Blog Grid with Filter Loading State */}
                <div className="relative">
                  <AnimatePresence>
                    {isFilterLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/50 backdrop-blur-sm z-20 flex items-center justify-center rounded-2xl"
                      >
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    key={`${sortOrder}-${currentPage}`}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 auto-rows-fr"
                  >
                    {currentPosts.map((blog) => (
                      <motion.article
                        key={blog._id}
                        variants={itemVariants}
                        whileHover={{ y: -4 }}
                        className="group relative h-full"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <div className="relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                          {/* Decorative gradient line */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                          
                          <div className="p-6 lg:p-8 flex-1 flex flex-col">
                            {/* Metadata */}
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                <time dateTime={blog.publishedAt}>
                                  {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </time>
                              </div>
                              
                              {blog.readTime && (
                                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>{blog.readTime} min</span>
                                </div>
                              )}
                              
                              {blog.views && (
                                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                  <Eye className="w-3.5 h-3.5 text-purple-500" />
                                  <span>{blog.views}</span>
                                </div>
                              )}
                            </div>

                            {/* Title */}
                            <h2 className="text-xl lg:text-2xl font-bold mb-3 line-clamp-2">
                              <Link 
                                to={`/blog/${blog.slug}`}
                                className="text-slate-900 hover:text-blue-600 transition-colors duration-300"
                              >
                                {blog.title}
                              </Link>
                            </h2>

                            {/* Excerpt */}
                            <p className="text-slate-600 mb-6 leading-relaxed line-clamp-3 flex-1">
                              {blog.excerpt}
                            </p>

                            {/* Read More Link */}
                            <Link
                              to={`/blog/${blog.slug}`}
                              className="group/link inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-emerald-600 transition-colors duration-300 mt-auto"
                            >
                              <span>Read More</span>
                              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                            </Link>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </motion.div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mt-12 flex items-center justify-center gap-2"
                  >
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || isFilterLoading}
                      className={`p-3 rounded-xl transition-all duration-300 ${
                        currentPage === 1 || isFilterLoading
                          ? 'bg-white/50 text-slate-400 cursor-not-allowed'
                          : 'bg-white/80 backdrop-blur-sm border border-slate-200/50 text-slate-700 hover:border-blue-300 hover:text-blue-600 hover:shadow-lg'
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-2">
                      {getPageNumbers().map((pageNum, index) => (
                        pageNum === '...' ? (
                          <span key={`dots-${index}`} className="w-10 h-10 flex items-center justify-center text-slate-500">
                            ...
                          </span>
                        ) : (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum as number)}
                            disabled={isFilterLoading}
                            className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 ${
                              currentPage === pageNum
                                ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-lg shadow-blue-500/30'
                                : 'bg-white/80 backdrop-blur-sm border border-slate-200/50 text-slate-700 hover:border-blue-300 hover:text-blue-600 hover:shadow-lg'
                            } ${isFilterLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {pageNum}
                          </button>
                        )
                      ))}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || isFilterLoading}
                      className={`p-3 rounded-xl transition-all duration-300 ${
                        currentPage === totalPages || isFilterLoading
                          ? 'bg-white/50 text-slate-400 cursor-not-allowed'
                          : 'bg-white/80 backdrop-blur-sm border border-slate-200/50 text-slate-700 hover:border-blue-300 hover:text-blue-600 hover:shadow-lg'
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Animated Gradient Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/10 via-transparent to-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-emerald-500/10 via-transparent to-blue-500/10 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .bg-grid-slate-100 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(241 245 249 / 0.3)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
          mask-image: linear-gradient(to bottom, transparent, white 20%, white 80%, transparent);
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default BlogListPage;