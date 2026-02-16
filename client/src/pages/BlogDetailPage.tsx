import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fetchBlogBySlug } from "../services/blog.public.api";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { 
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  BookOpen,
  Eye,
  Twitter,
  Linkedin,
  Facebook,
  Link as LinkIcon,
  CheckCircle
} from "lucide-react";

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug) {
      setIsLoading(true);
      fetchBlogBySlug(slug)
        .then(setBlog)
        .finally(() => setIsLoading(false));
    }
  }, [slug]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = blog?.title || '';
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-emerald-600/20 rounded-full blur-xl" />
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-50 to-orange-50 mb-6">
            <BookOpen className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Article not found</h2>
          <p className="text-slate-600 mb-6">The blog post you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/blog')}
            className="group cursor-pointer relative px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </button>
        </div>
      </div>
    );
  }

  const blogUrl = `https://assignflowhub.karanart.com/blog/${blog.slug}`;

  return (
    <>
      <Helmet>
        <title>{blog.title} | AssignFlow Hub</title>
        <meta name="description" content={blog.excerpt} />
        <link rel="canonical" href={blogUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        <meta property="og:url" content={blogUrl} />
        <meta property="og:type" content="article" />
        {blog.image && <meta property="og:image" content={blog.image} />}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.excerpt} />
        {blog.image && <meta name="twitter:image" content={blog.image} />}

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: blog.title,
            description: blog.excerpt,
            datePublished: blog.publishedAt,
            dateModified: blog.updatedAt || blog.publishedAt,
            author: {
              "@type": "Organization",
              name: "AssignFlow Hub"
            },
            publisher: {
              "@type": "Organization",
              name: "AssignFlow Hub",
              logo: {
                "@type": "ImageObject",
                url: "https://assignflowhub.karanart.com/logo.png"
              }
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": blogUrl
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden relative">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />

        {/* Floating Particles */}
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

        {/* Main Content */}
        <div className="relative z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-20">
            
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <button
                onClick={() => navigate('/blog')}
                className="group inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors duration-300"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                <span>Back to all articles</span>
              </button>
            </motion.div>

            {/* Article Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200/50">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <time dateTime={blog.publishedAt}>
                    {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                
                {blog.readTime && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200/50">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    <span>{blog.readTime} min read</span>
                  </div>
                )}
                
                {blog.views && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200/50">
                    <Eye className="w-4 h-4 text-purple-500" />
                    <span>{blog.views} views</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                {blog.title}
              </h1>

              {/* Excerpt */}
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed border-l-4 border-gradient-to-b from-blue-600 to-emerald-500 pl-6">
                {blog.excerpt}
              </p>
            </motion.div>

            {/* Featured Image */}
            {blog.image && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mb-12 relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-emerald-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full rounded-2xl shadow-2xl relative z-10"
                />
              </motion.div>
            )}

            {/* Article Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="prose prose-lg max-w-none mb-12"
            >
              <div
                dangerouslySetInnerHTML={{ __html: blog.content }}
                className="blog-content"
              />
            </motion.div>

            {/* Share Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-12 pt-8 border-t border-slate-200/50"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <Share2 className="w-5 h-5 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Share this article:</span>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Twitter */}
                  <button
                    onClick={() => handleShare('twitter')}
                    className="p-3 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-300 group"
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="w-5 h-5 text-slate-600 group-hover:text-blue-400" />
                  </button>

                  {/* LinkedIn */}
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="p-3 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-300 group"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                  </button>

                  {/* Facebook */}
                  <button
                    onClick={() => handleShare('facebook')}
                    className="p-3 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-300 group"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                  </button>

                  {/* Copy Link */}
                  <button
                    onClick={() => handleShare('copy')}
                    className="p-3 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-all duration-300 group relative"
                    aria-label="Copy link"
                  >
                    {copied ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <LinkIcon className="w-5 h-5 text-slate-600 group-hover:text-emerald-500" />
                    )}
                    
                    {/* Tooltip */}
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      {copied ? 'Copied!' : 'Copy link'}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Read More Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-12 text-center"
            >
              <Link
                to="/blog"
                className="group cursor-pointer relative px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold rounded-2xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 overflow-hidden inline-flex items-center gap-3"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <BookOpen className="w-5 h-5 relative z-10" />
                <span className="relative z-10">More Articles</span>
                <ArrowLeft className="w-5 h-5 relative z-10 rotate-180 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
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
        
        .blog-content {
          color: #1e293b;
          line-height: 1.8;
        }
        
        .blog-content h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          color: #0f172a;
        }
        
        .blog-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          color: #0f172a;
        }
        
        .blog-content p {
          margin-bottom: 1.5rem;
        }
        
        .blog-content a {
          color: #2563eb;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.3s;
        }
        
        .blog-content a:hover {
          color: #059669;
        }
        
        .blog-content ul, .blog-content ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        
        .blog-content li {
          margin-bottom: 0.5rem;
        }
        
        .blog-content blockquote {
          border-left: 4px solid #2563eb;
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #475569;
        }
        
        .blog-content img {
          border-radius: 0.75rem;
          margin: 2rem 0;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        }
        
        .blog-content pre {
          background: #0f172a;
          color: #e2e8f0;
          padding: 1.5rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        
        .blog-content code {
          font-family: monospace;
          font-size: 0.875rem;
        }
      `}</style>
    </>
  );
};

export default BlogDetailPage;