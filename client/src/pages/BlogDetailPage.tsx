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
  CheckCircle,
  Sparkles,
  Hash,
  Code,
  Image as ImageIcon,
  List
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
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(url)}`;
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

  // Function to enhance content with theme-aware styling
  const enhanceContent = (content: string) => {
    // Add gradient backgrounds to headings
    let enhanced = content.replace(
      /<h2>(.*?)<\/h2>/g,
      '<h2 class="gradient-heading"><span class="gradient-text">$1</span></h2>'
    );

    enhanced = enhanced.replace(
      /<h3>(.*?)<\/h3>/g,
      '<h3 class="gradient-subheading"><span class="gradient-subtext">$1</span></h3>'
    );

    // Enhance blockquotes with gradient border and icon
    enhanced = enhanced.replace(
      /<blockquote>(.*?)<\/blockquote>/gs,
      '<blockquote class="themed-blockquote"><Quote class="quote-icon" />$1</blockquote>'
    );

    // Enhance code blocks with gradient border
    enhanced = enhanced.replace(
      /<pre><code>(.*?)<\/code><\/pre>/gs,
      '<pre class="themed-code-block"><code>$1</code></pre>'
    );

    // Enhance lists with custom bullets
    enhanced = enhanced.replace(
      /<ul>(.*?)<\/ul>/gs,
      '<ul class="themed-list">$1</ul>'
    );

    enhanced = enhanced.replace(
      /<ol>(.*?)<\/ol>/gs,
      '<ol class="themed-list themed-ordered-list">$1</ol>'
    );

    // Enhance list items with gradient bullets
    enhanced = enhanced.replace(
      /<li>(.*?)<\/li>/g,
      '<li class="themed-list-item"><span class="bullet-gradient"></span>$1</li>'
    );

    // Enhance images with gradient overlay on hover
    enhanced = enhanced.replace(
      /<img(.*?)>/g,
      '<div class="themed-image-wrapper"><img$1 /><div class="image-gradient-overlay"></div></div>'
    );

    // Enhance links with gradient underline
    enhanced = enhanced.replace(
      /<a(.*?)>(.*?)<\/a>/g,
      '<a$1 class="themed-link">$2</a>'
    );

    // Enhance paragraphs with subtle gradient text
    enhanced = enhanced.replace(
      /<p>(.*?)<\/p>/g,
      '<p class="themed-paragraph">$1</p>'
    );

    return enhanced;
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
  const enhancedContent = enhanceContent(blog.content);

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
              {/* Metadata with badges */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50 shadow-sm">
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
                  <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50 shadow-sm">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    <span>{blog.readTime} min read</span>
                  </div>
                )}

                {blog.views && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50 shadow-sm">
                    <Eye className="w-4 h-4 text-purple-500" />
                    <span>{blog.views} views</span>
                  </div>
                )}

                {/* Reading time badge with animation */}
                <div className="flex items-center gap-2 text-sm bg-gradient-to-r from-blue-500/10 to-emerald-500/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-slate-700">Featured Article</span>
                </div>
              </div>

              {/* Title with gradient */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="block text-slate-900 mb-2">{blog.title.split(' ').slice(0, -1).join(' ')}</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500">
                  {blog.title.split(' ').slice(-1)}
                </span>
              </h1>

              {/* Excerpt with gradient border */}
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 via-emerald-500 to-purple-500 rounded-full" />
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed pl-6 italic">
                  {blog.excerpt}
                </p>
              </div>
            </motion.div>

            {/* Featured Image with gradient overlay */}
            {blog.image && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mb-12 relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent rounded-2xl z-10" />
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full rounded-2xl shadow-2xl relative z-0"
                />

                {/* Floating badge */}
                <div className="absolute top-4 right-4 z-20">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/50">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-slate-700">Featured Image</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Article Content with Theme Adaptation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="prose prose-lg max-w-none mb-12"
            >
              <div
                dangerouslySetInnerHTML={{ __html: enhancedContent }}
                className="blog-content-themed"
              />
            </motion.div>

            {/* Content Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            >
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/50 text-center">
                <Hash className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">
                  {blog.content.split(' ').length}
                </div>
                <div className="text-xs text-slate-600">Words</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/50 text-center">
                <Clock className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">{blog.readTime || 5}</div>
                <div className="text-xs text-slate-600">Minutes Read</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/50 text-center">
                <List className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">
                  {(blog.content.match(/<li>/g) || []).length}
                </div>
                <div className="text-xs text-slate-600">List Items</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/50 text-center">
                <Code className="w-5 h-5 text-amber-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">
                  {(blog.content.match(/<code>/g) || []).length}
                </div>
                <div className="text-xs text-slate-600">Code Blocks</div>
              </div>
            </motion.div>

            {/* Share Section with enhanced styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-12 pt-8 border-t border-slate-200/50 relative"
            >
              {/* Decorative gradient line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full" />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-xl">
                    <Share2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Share this article:</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Twitter */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShare('twitter')}
                    className="p-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-300 group relative"
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="w-5 h-5 text-slate-600 group-hover:text-blue-400" />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      Twitter
                    </span>
                  </motion.button>

                  {/* WhatsApp */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShare('whatsapp')}
                    className="p-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-all duration-300 group relative"
                    aria-label="Share on WhatsApp"
                  >
                    <svg
                      className="w-5 h-5 text-slate-600 group-hover:text-green-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.473-.149-.673.149-.2.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.556 4.12 1.533 5.852L.054 23.5l5.913-1.487C8.026 22.822 9.975 23.5 12 23.5c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.838 0-3.63-.497-5.195-1.436l-.371-.218-4.019 1.01 1.076-3.929-.237-.394C2.518 15.57 2 13.832 2 12 2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
                    </svg>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      WhatsApp
                    </span>
                  </motion.button>

                  {/* LinkedIn */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShare('linkedin')}
                    className="p-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-300 group relative"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      LinkedIn
                    </span>
                  </motion.button>

                  {/* Facebook */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShare('facebook')}
                    className="p-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-300 group relative"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      Facebook
                    </span>
                  </motion.button>

                  {/* Copy Link */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShare('copy')}
                    className="p-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-all duration-300 group relative"
                    aria-label="Copy link"
                  >
                    {copied ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <LinkIcon className="w-5 h-5 text-slate-600 group-hover:text-emerald-500" />
                    )}

                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      {copied ? 'Copied!' : 'Copy link'}
                    </span>
                  </motion.button>
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

      {/* Custom Styles for Themed Content */}
      <style>{`
        .bg-grid-slate-100 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(241 245 249 / 0.3)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
          mask-image: linear-gradient(to bottom, transparent, white 20%, white 80%, transparent);
        }
        
        /* Themed Blog Content Styles */
        .blog-content-themed {
          color: #334155;
          line-height: 1.8;
          font-size: 1.125rem;
        }
        
        /* Gradient Headings */
        .gradient-heading {
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          position: relative;
        }
        
        .gradient-heading::before {
          content: '';
          position: absolute;
          left: -1rem;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(to bottom, #2563eb, #10b981);
          border-radius: 2px;
        }
        
        .gradient-text {
          font-size: 2.25rem;
          font-weight: 800;
          background: linear-gradient(135deg, #2563eb, #10b981);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
        }
        
        .gradient-subheading {
          margin-top: 2rem;
          margin-bottom: 1rem;
          position: relative;
          display: inline-block;
        }
        
        .gradient-subheading::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -0.5rem;
          width: 50%;
          height: 2px;
          background: linear-gradient(90deg, #2563eb, #10b981);
          border-radius: 1px;
        }
        
        .gradient-subtext {
          font-size: 1.875rem;
          font-weight: 700;
          color: #0f172a;
        }
        
        /* Themed Paragraphs */
        .themed-paragraph {
          margin-bottom: 1.75rem;
          color: #334155;
          transition: color 0.3s;
        }
        
        .themed-paragraph:hover {
          color: #1e293b;
        }
        
        /* Themed Blockquotes */
        .themed-blockquote {
          position: relative;
          margin: 2.5rem 0;
          padding: 2rem 2rem 2rem 3.5rem;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-radius: 1rem;
          border-left: 4px solid transparent;
          border-image: linear-gradient(to bottom, #2563eb, #10b981);
          border-image-slice: 1;
          font-style: italic;
          color: #1e293b;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        .quote-icon {
          position: absolute;
          left: 1rem;
          top: 1.5rem;
          width: 1.5rem;
          height: 1.5rem;
          color: #2563eb;
          opacity: 0.5;
        }
        
        /* Themed Code Blocks */
        .themed-code-block {
          margin: 2rem 0;
          padding: 1.5rem;
          background: #0f172a;
          border-radius: 1rem;
          border: 1px solid #2563eb;
          box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2);
          overflow-x: auto;
        }
        
        .themed-code-block code {
          color: #e2e8f0;
          font-family: 'Fira Code', monospace;
          font-size: 0.875rem;
          line-height: 1.7;
        }
        
        /* Themed Lists */
        .themed-list {
          margin: 1.5rem 0;
          padding-left: 2rem;
          list-style: none;
        }
        
        .themed-list-item {
          position: relative;
          margin-bottom: 0.75rem;
          padding-left: 1.5rem;
          color: #334155;
        }
        
        .bullet-gradient {
          position: absolute;
          left: 0;
          top: 0.6rem;
          width: 0.5rem;
          height: 0.5rem;
          background: linear-gradient(135deg, #2563eb, #10b981);
          border-radius: 50%;
          transition: transform 0.3s;
        }
        
        .themed-list-item:hover .bullet-gradient {
          transform: scale(1.2);
        }
        
        .themed-ordered-list {
          counter-reset: item;
        }
        
        .themed-ordered-list .themed-list-item {
          counter-increment: item;
        }
        
        .themed-ordered-list .themed-list-item::before {
          content: counter(item) ".";
          position: absolute;
          left: -1rem;
          top: 0;
          font-weight: 600;
          background: linear-gradient(135deg, #2563eb, #10b981);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        /* Themed Images */
        .themed-image-wrapper {
          position: relative;
          margin: 2.5rem 0;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .themed-image-wrapper img {
          width: 100%;
          height: auto;
          transition: transform 0.5s;
        }
        
        .themed-image-wrapper:hover img {
          transform: scale(1.02);
        }
        
        .image-gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(16, 185, 129, 0.1));
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }
        
        .themed-image-wrapper:hover .image-gradient-overlay {
          opacity: 1;
        }
        
        /* Themed Links */
        .themed-link {
          color: #2563eb;
          text-decoration: none;
          position: relative;
          font-weight: 500;
        }
        
        .themed-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #2563eb, #10b981);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s;
        }
        
        .themed-link:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }
        
        .themed-link:hover {
          color: #10b981;
        }
        
        /* Responsive Adjustments */
        @media (max-width: 640px) {
          .gradient-text {
            font-size: 1.875rem;
          }
          
          .gradient-subtext {
            font-size: 1.5rem;
          }
          
          .themed-blockquote {
            padding: 1.5rem 1.5rem 1.5rem 3rem;
          }
        }
      `}</style>
    </>
  );
};

export default BlogDetailPage;