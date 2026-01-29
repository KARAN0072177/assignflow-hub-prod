import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Mail,
  MessageSquare,
  HelpCircle,
  FileText,
  Shield,
  Users,
  GraduationCap,
  ExternalLink,
  Heart
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { path: "/dashboard", label: "Dashboard", icon: <BookOpen className="w-4 h-4" /> },
      { path: "/dashboard/classrooms/my", label: "Classrooms", icon: <GraduationCap className="w-4 h-4" /> },
      { path: "/dashboard/grades", label: "Grades", icon: <FileText className="w-4 h-4" /> },
    ],
    support: [
      { path: "/help", label: "Help Center", icon: <HelpCircle className="w-4 h-4" /> },
      { path: "/contact", label: "Contact Us", icon: <Mail className="w-4 h-4" /> },
      { path: "/feedback", label: "Feedback", icon: <MessageSquare className="w-4 h-4" /> },
    ],
    legal: [
      { path: "/privacy", label: "Privacy Policy", icon: <Shield className="w-4 h-4" /> },
      { path: "/terms", label: "Terms of Service", icon: <FileText className="w-4 h-4" /> },
      { path: "/cookies", label: "Cookie Policy", icon: <FileText className="w-4 h-4" /> },
    ],
    about: [
      { path: "/about", label: "About Us", icon: <Users className="w-4 h-4" /> },
      { path: "/team", label: "Our Team", icon: <Users className="w-4 h-4" /> },
      { path: "/blog", label: "Blog", icon: <BookOpen className="w-4 h-4" /> },
    ]
  };

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-white/10 rounded-lg group-hover:bg-blue-600 transition-colors duration-200">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold">AssignFlow Hub</span>
            </Link>
            <p className="text-slate-300 text-sm max-w-xs">
              Empowering educators and students with seamless classroom management and learning tools.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Heart className="w-4 h-4 text-red-400" />
              <span>Made with passion for education</span>
            </div>
          </motion.div>

          {/* Platform Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Platform
            </h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-200 group"
                  >
                    {link.icon}
                    <span>{link.label}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-200 group"
                  >
                    {link.icon}
                    <span>{link.label}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal & About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Legal
              </h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-200 group"
                    >
                      {link.icon}
                      <span>{link.label}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                About
              </h3>
              <ul className="space-y-3">
                {footerLinks.about.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-200 group"
                    >
                      {link.icon}
                      <span>{link.label}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-slate-800"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-slate-400 text-sm">
              © {currentYear} AssignFlow Hub. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <Link to="/accessibility" className="hover:text-white transition-colors">
                Accessibility
              </Link>
              <Link to="/sitemap" className="hover:text-white transition-colors">
                Sitemap
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;