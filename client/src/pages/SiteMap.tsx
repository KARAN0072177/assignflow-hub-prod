import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  BookOpen,
  Mail,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Shield,
  FileText,
  Settings,
  MailCheck,
  HelpCircle,
  Accessibility,
  Scale,
  FileJson,
  Cookie,
  Sparkles,
  Map as SitemapIcon
} from "lucide-react";

const SitemapPage = () => {
  // Current date for lastmod in sitemap
  const lastmod = new Date().toISOString().split('T')[0];

  const sections = [
    {
      title: "Platform",
      icon: Home,
      links: [
        { name: "Home", path: "/", description: "Main landing page", icon: Home },
        { name: "Blog", path: "/blog", description: "Latest insights and updates", icon: BookOpen },
        { name: "Contact", path: "/contact", description: "Get in touch with us", icon: Mail },
      ]
    },
    {
      title: "Account",
      icon: UserPlus,
      links: [
        { name: "Login", path: "/login", description: "Sign in to your account", icon: LogIn },
        { name: "Register", path: "/register", description: "Create a new account", icon: UserPlus },
        { name: "Dashboard", path: "/dashboard", description: "Your personal dashboard", icon: LayoutDashboard },
      ]
    },
    {
      title: "Admin",
      icon: Shield,
      links: [
        { name: "Admin Dashboard", path: "/admin/dashboard", description: "Administration overview", icon: LayoutDashboard },
        { name: "Audit Logs", path: "/admin/audit-logs", description: "System activity logs", icon: FileText },
        { name: "System Settings", path: "/admin/system", description: "Configure platform settings", icon: Settings },
        { name: "Newsletter Management", path: "/admin/newsletter", description: "Manage email campaigns", icon: MailCheck },
      ]
    },
    {
      title: "Support",
      icon: HelpCircle,
      links: [
        { name: "Help Center", path: "/help", description: "FAQs and support resources", icon: HelpCircle },
        { name: "Accessibility", path: "/accessibility", description: "Accessibility statement", icon: Accessibility },
      ]
    },
    {
      title: "Legal",
      icon: Scale,
      links: [
        { name: "Privacy Policy", path: "/privacy", description: "How we handle your data", icon: FileJson },
        { name: "Terms of Service", path: "/terms", description: "Terms and conditions", icon: Scale },
        { name: "Cookie Policy", path: "/cookies", description: "Cookie usage information", icon: Cookie },
      ]
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Sitemap | AssignFlow Hub</title>
        <meta 
          name="description" 
          content="Complete sitemap of AssignFlow Hub - Find all pages and sections of our assignment management platform." 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://assignflowhub.karanart.com/sitemap" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Sitemap | AssignFlow Hub" />
        <meta property="og:description" content="Complete sitemap of AssignFlow Hub - Find all pages and sections of our assignment management platform." />
        <meta property="og:url" content="https://assignflowhub.karanart.com/sitemap" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Sitemap | AssignFlow Hub" />
        <meta name="twitter:description" content="Complete sitemap of AssignFlow Hub - Find all pages and sections of our assignment management platform." />
        
        {/* Structured Data - Sitemap */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Sitemap - AssignFlow Hub",
            "description": "Complete sitemap of AssignFlow Hub platform",
            "url": "https://assignflowhub.karanart.com/sitemap",
            "lastReviewed": lastmod,
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": sections.flatMap((section, sectionIndex) => 
                section.links.map((link, linkIndex) => ({
                  "@type": "SiteNavigationElement",
                  "position": sectionIndex * 10 + linkIndex + 1,
                  "name": link.name,
                  "description": link.description,
                  "url": `https://assignflowhub.karanart.com${link.path}`
                }))
              )
            }
          })}
        </script>

        {/* XML Sitemap Link */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden relative">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-20">
            
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-purple-500/10 backdrop-blur-sm border border-white/30 rounded-full shadow-lg mb-6">
                <SitemapIcon className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-slate-800">
                  Complete Site Navigation
                </span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                <span className="block">Website</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
                  Sitemap
                </span>
              </h1>
              
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Explore all sections and pages of AssignFlow Hub. This page helps you navigate 
                through our platform and find exactly what you're looking for.
              </p>

              {/* Last Updated */}
              <div className="mt-6 text-sm text-slate-500">
                Last updated: {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </motion.div>

            {/* Sitemap Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {sections.map((section) => (
                <motion.div
                  key={section.title}
                  variants={itemVariants}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                    {/* Section Header */}
                    <div className="p-6 border-b border-slate-200/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center">
                          <section.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
                      </div>
                    </div>

                    {/* Section Links */}
                    <div className="p-6">
                      <ul className="space-y-4">
                        {section.links.map((link) => (
                          <li key={link.path}>
                            <Link
                              to={link.path}
                              className="group/link flex items-start gap-3 p-2 -m-2 rounded-xl hover:bg-white/50 transition-all duration-300"
                            >
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center flex-shrink-0 group-hover/link:scale-110 transition-transform duration-300">
                                <link.icon className="w-4 h-4 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <span className="text-sm font-semibold text-slate-900 group-hover/link:text-blue-600 transition-colors duration-300">
                                  {link.name}
                                </span>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  {link.description}
                                </p>
                                <span className="text-xs text-slate-400 font-mono mt-1 block">
                                  {link.path}
                                </span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* XML Sitemap Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-16 text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm border border-slate-200/50 rounded-full">
                <FileJson className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">
                  XML Sitemap available at: 
                </span>
                <a 
                  href="/sitemap.xml"
                  className="text-sm font-mono text-blue-600 hover:text-emerald-600 transition-colors duration-300 underline underline-offset-2"
                >
                  /sitemap.xml
                </a>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { label: "Total Pages", value: sections.reduce((acc, section) => acc + section.links.length, 0) },
                { label: "Sections", value: sections.length },
                { label: "User Pages", value: 3 },
                { label: "Admin Pages", value: 4 },
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 bg-white/30 backdrop-blur-sm border border-white/50 rounded-xl">
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-xs text-slate-600 mt-1">{stat.label}</div>
                </div>
              ))}
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
      `}</style>
    </>
  );
};

export default SitemapPage;