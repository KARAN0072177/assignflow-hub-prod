import { motion } from "framer-motion";
import { 
  Shield,
  FileText,
  Users,
  Lock,
  AlertCircle,
  CheckCircle,
  Upload,
  MessageSquare,
  Eye,
  Zap,
  Cpu,
  Target,
  Bell
} from "lucide-react";

const TermsPage = () => {
  const sections = [
    {
      id: "acceptance",
      icon: CheckCircle,
      title: "Acceptance of Terms",
      content: "By accessing and using AssignFlow Hub, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our platform. These terms apply to all users including students, teachers, administrators, and visitors."
    },
    {
      id: "purpose",
      icon: Target,
      title: "Purpose of the Platform",
      content: "AssignFlow Hub is designed for educational workflow management. It facilitates assignment creation, submission, grading, feedback, and communication between educators and students. The platform is intended for legitimate educational purposes only.",
      note: "Commercial use or system abuse is not permitted."
    },
    {
      id: "responsibilities",
      icon: Shield,
      title: "User Responsibilities",
      items: [
        {
          title: "Accurate Information",
          description: "Provide truthful and current information during registration and profile updates.",
          icon: FileText
        },
        {
          title: "Content Integrity",
          description: "Upload only appropriate, non-malicious content related to educational activities.",
          icon: Upload
        },
        {
          title: "Respectful Communication",
          description: "Maintain professional and respectful interactions with all platform users.",
          icon: MessageSquare
        },
        {
          title: "System Integrity",
          description: "Do not attempt to abuse, hack, or disrupt platform functionality.",
          icon: Cpu
        }
      ]
    },
    {
      id: "accounts",
      icon: Users,
      title: "Account Access & Roles",
      content: "Access to platform features is determined by your assigned role (student, teacher, or administrator). Each role has specific permissions and responsibilities. Sharing credentials or attempting to access unauthorized areas may result in account restrictions.",
      items: [
        {
          title: "Students",
          description: "Submit assignments, view grades, receive feedback"
        },
        {
          title: "Teachers",
          description: "Create assignments, grade submissions, provide feedback"
        },
        {
          title: "Administrators",
          description: "Monitor system activity, manage users, oversee operations"
        }
      ]
    },
    {
      id: "ownership",
      icon: Eye,
      title: "Content Ownership",
      content: "You retain ownership of all content you create and upload to AssignFlow Hub. By uploading content, you grant the platform the necessary rights to store, display, and process it for educational purposes. Administrators may access user-generated content for moderation and system administration.",
      note: "We do not claim ownership of your educational materials."
    },
    {
      id: "availability",
      icon: Zap,
      title: "Service Availability",
      content: "AssignFlow Hub is provided 'as is' and 'as available'. While we strive for reliable service, we do not guarantee uninterrupted access. We may modify, suspend, or discontinue features as needed for improvements or maintenance.",
      items: [
        {
          title: "Maintenance Windows",
          description: "Scheduled maintenance may temporarily affect availability"
        },
        {
          title: "Feature Evolution",
          description: "Features may be added, modified, or removed over time"
        }
      ]
    },
    {
      id: "termination",
      icon: Lock,
      title: "Termination",
      content: "Administrators reserve the right to restrict or terminate access in cases of misuse, violation of these terms, or system abuse. Users may stop using the platform at any time. Upon termination, content may be retained for a reasonable period for administrative purposes.",
      note: "Termination decisions are made at administrator discretion."
    },
    {
      id: "changes",
      icon: Bell,
      title: "Changes to Terms",
      content: "We may update these Terms of Service as the platform evolves. Significant changes will be communicated through platform notifications. Continued use after changes constitutes acceptance of the updated terms. The 'Last updated' date at the top of this page indicates when revisions were made."
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
              {i === 1 && <FileText className="w-6 h-6" />}
              {i === 2 && <Shield className="w-6 h-6" />}
              {i === 3 && <Users className="w-6 h-6" />}
              {i === 4 && <Lock className="w-6 h-6" />}
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
            <FileText className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-semibold text-slate-800">
              Clear & Fair Guidelines
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            <span className="block text-slate-900">Terms of</span>
            <span className="block mt-2">
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 animate-gradient">
                  Service
                </span>
                <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-600/30 via-blue-500/30 to-emerald-500/30 blur-xl">
                  Service
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
            Straightforward guidelines for using AssignFlow Hub responsibly.
            No legal jargon—just clear expectations.
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
                  <div className={`grid ${section.items.length > 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-4 mb-6`}>
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
                          {'icon' in item ? (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-emerald-500/20 p-2 flex-shrink-0">
                              <item.icon className="w-6 h-6 text-blue-600" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-emerald-500/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-lg font-semibold text-slate-700">
                                {itemIndex + 1}
                              </span>
                            </div>
                          )}
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
              </div>
            </motion.div>
          ))}
        </div>

        {/* Important Notes Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16"
        >
          <div className="relative p-8 bg-gradient-to-br from-blue-50/50 to-emerald-50/50 border border-blue-200/30 rounded-3xl">
            <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/10 to-emerald-500/10 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-blue-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Key Principles
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Educational Focus",
                  description: "Designed specifically for teaching and learning workflows",
                  icon: "🎓"
                },
                {
                  title: "Clear Boundaries",
                  description: "Defined roles and responsibilities for all users",
                  icon: "⚖️"
                },
                {
                  title: "Continuous Improvement",
                  description: "Platform evolves to better serve educational needs",
                  icon: "🚀"
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

        {/* Related Documents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-12 p-8 bg-gradient-to-br from-slate-50/50 to-white/50 border border-slate-200/50 rounded-3xl"
        >
          <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">
            Related Documents
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href="/privacy"
              className="group p-6 bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 p-3">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                    Privacy Policy
                  </h4>
                  <p className="text-sm text-slate-600">
                    How we handle and protect your data
                  </p>
                </div>
                <div className="ml-auto text-slate-400 group-hover:text-blue-500 transition-colors duration-300">
                  →
                </div>
              </div>
            </a>
            
            <a
              href="/contact"
              className="group p-6 bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 p-3">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1 group-hover:text-purple-600 transition-colors duration-300">
                    Contact Us
                  </h4>
                  <p className="text-sm text-slate-600">
                    Questions about these terms? Get in touch
                  </p>
                </div>
                <div className="ml-auto text-slate-400 group-hover:text-purple-500 transition-colors duration-300">
                  →
                </div>
              </div>
            </a>
          </div>
        </motion.div>

        {/* Acceptance Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 pt-8 border-t border-slate-200/50 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-purple-500/10 backdrop-blur-sm border border-white/30 rounded-full shadow-lg">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-semibold text-slate-800">
              Using AssignFlow Hub means you accept these Terms of Service
            </span>
          </div>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            These terms exist to ensure a safe, productive environment for all educational users.
            We appreciate your cooperation in maintaining platform integrity.
          </p>
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

export default TermsPage;