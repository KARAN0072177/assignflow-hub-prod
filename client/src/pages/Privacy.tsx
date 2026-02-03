import { motion } from "framer-motion";
import { 
  Shield,
  Lock,
  Database,
  Mail,
  Eye,
  Users,
  FileText,
  Bell,
  AlertCircle,
  CheckCircle,
  BookOpen,
  Cpu
} from "lucide-react";

const PrivacyPage = () => {
  const sections = [
    {
      id: "introduction",
      icon: BookOpen,
      title: "Introduction",
      content: "AssignFlow Hub is an educational platform designed to facilitate classroom management, assignment workflows, and collaboration between educators and students. This Privacy Policy explains how we collect, use, and protect your information. It applies to all users, including students, teachers, administrators, and visitors."
    },
    {
      id: "information-collected",
      icon: Database,
      title: "Information We Collect",
      items: [
        {
          title: "Account Information",
          description: "Email address and role (student, teacher, or admin) for authentication and access control.",
          icon: Users
        },
        {
          title: "User-Generated Content",
          description: "Assignments, submissions, feedback, contact messages, and other content you create on the platform.",
          icon: FileText
        },
        {
          title: "Technical Data",
          description: "IP address for security and rate limiting, timestamps for activity tracking, and basic usage analytics.",
          icon: Cpu
        }
      ]
    },
    {
      id: "information-use",
      icon: Eye,
      title: "How We Use Information",
      items: [
        {
          title: "Platform Operation",
          description: "Authentication, assignment workflows, grading systems, and collaboration features.",
          icon: CheckCircle
        },
        {
          title: "Communication",
          description: "Sending confirmation emails, responding to contact requests, and important platform notifications.",
          icon: Bell
        },
        {
          title: "Security & Monitoring",
          description: "Admin oversight, security auditing, abuse prevention, and system maintenance.",
          icon: Shield
        },
        {
          title: "Improvement",
          description: "Understanding usage patterns to enhance features and user experience.",
          icon: AlertCircle
        }
      ]
    },
    {
      id: "data-security",
      icon: Lock,
      title: "Data Storage & Security",
      content: "Your data is stored in MongoDB databases with cloud storage for files. We implement standard security measures including authentication, access controls, and rate limiting. While we take reasonable precautions, no system is completely immune to risks.",
      note: "We do not store payment information or biometric data."
    },
    {
      id: "communication",
      icon: Mail,
      title: "Emails & Communication",
      content: "We send emails for account confirmation, contact form responses, and important platform notifications. You can manage notification preferences in your account settings. We do not send promotional emails unless explicitly requested."
    },
    {
      id: "data-retention",
      icon: Database,
      title: "Data Retention",
      content: "Data is retained while accounts are active. Administrative data is kept for operational purposes. Users can request data deletion through our contact form. We retain some information as required for legitimate business purposes or legal obligations."
    },
    {
      id: "policy-changes",
      icon: AlertCircle,
      title: "Changes to This Policy",
      content: "This Privacy Policy may be updated as AssignFlow Hub evolves. We will notify users of significant changes through platform notifications or email. Continued use after changes constitutes acceptance of the updated policy."
    },
    {
      id: "contact",
      icon: Users,
      title: "Contact Information",
      content: "For privacy-related questions, data requests, or concerns, please use our Contact Us page. We aim to respond to all inquiries within a reasonable timeframe.",
      action: {
        text: "Contact Us",
        link: "/contact"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />
      
      {/* Floating Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/10 via-transparent to-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-purple-500/5 via-transparent to-blue-500/5 rounded-full blur-3xl" />

      {/* Floating Icons */}
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className={`absolute ${i % 2 === 0 ? 'right-10' : 'left-10'} ${
            i === 1 ? 'top-20' : i === 2 ? 'top-1/3' : i === 3 ? 'bottom-1/3' : 'bottom-20'
          } z-0`}
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        >
          <div className="relative">
            <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50 flex items-center justify-center text-blue-500">
              {i === 1 && <Shield className="w-6 h-6" />}
              {i === 2 && <Lock className="w-6 h-6" />}
              {i === 3 && <Database className="w-6 h-6" />}
              {i === 4 && <Mail className="w-6 h-6" />}
            </div>
          </div>
        </motion.div>
      ))}

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-purple-500/10 backdrop-blur-sm border border-white/30 rounded-full shadow-lg mb-8">
            <Shield className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-semibold text-slate-800">
              Transparency & Trust
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            <span className="block text-slate-900">Privacy</span>
            <span className="block mt-2">
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 animate-gradient">
                  Policy
                </span>
                <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-600/30 via-blue-500/30 to-emerald-500/30 blur-xl">
                  Policy
                </span>
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto"
          >
            Clear, honest information about how we handle your data.
            No legal jargon—just transparency.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-sm text-slate-500"
          >
            Last updated: {new Date().toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}
          </motion.div>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-emerald-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative p-8 bg-white/90 backdrop-blur-sm border border-white/50 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Section Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 p-3 flex-shrink-0">
                    <section.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                      {section.title}
                    </h2>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-full text-slate-700">
                        Section {index + 1}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                {section.content && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-700 leading-relaxed mb-6"
                  >
                    {section.content}
                  </motion.p>
                )}

                {/* Items List */}
                {section.items && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {section.items.map((item, itemIndex) => (
                      <motion.div
                        key={itemIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * itemIndex }}
                        whileHover={{ y: -3 }}
                        className="p-4 bg-gradient-to-r from-blue-50/50 to-emerald-50/50 rounded-xl border border-white/30"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-emerald-500/20 p-2 flex-shrink-0">
                            <item.icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 mb-1">
                              {item.title}
                            </h3>
                            <p className="text-sm text-slate-600">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Note */}
                {section.note && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 bg-gradient-to-r from-amber-50 to-amber-50/50 border border-amber-200 rounded-xl"
                  >
                    <div className="flex items-center gap-2 text-amber-800">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">{section.note}</span>
                    </div>
                  </motion.div>
                )}

                {/* Action Button */}
                {section.action && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6"
                  >
                    <a
                      href={section.action.link}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      {section.action.text}
                      <span className="ml-1">→</span>
                    </a>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16"
        >
          <div className="relative p-8 bg-gradient-to-br from-blue-50/50 to-emerald-50/50 border border-blue-200/30 rounded-3xl">
            <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/10 to-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Our Commitment to You
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Transparency",
                  description: "Clear explanations without legal jargon",
                  icon: "🔍"
                },
                {
                  title: "Minimal Data",
                  description: "Only collect what we actually need",
                  icon: "📊"
                },
                {
                  title: "Your Control",
                  description: "Easy access to manage your data",
                  icon: "🎯"
                }
              ].map((item, index) => (
                <div key={index} className="p-4 bg-white/50 rounded-xl">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h4 className="font-semibold text-slate-900 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-12 pt-8 border-t border-slate-200/50"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">
                Have Questions?
              </h4>
              <p className="text-sm text-slate-600">
                We're here to help clarify anything.
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="/contact"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Contact Support
              </a>
              <a
                href="/"
                className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-slate-300 text-slate-700 font-semibold rounded-xl hover:border-blue-300 hover:text-blue-700 transition-all duration-300"
              >
                Return Home
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .bg-grid-slate-100 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(241 245 249 / 0.3)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
          mask-image: linear-gradient(to bottom, transparent, white 20%, white 80%, transparent);
        }
      `}</style>
    </div>
  );
};

export default PrivacyPage;