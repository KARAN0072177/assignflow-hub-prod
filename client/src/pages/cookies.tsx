import { motion } from "framer-motion";
import { 
  Cookie,
  Shield,
  Eye,
  Settings,
  CheckCircle,
  AlertCircle,
  Database,
  Lock
} from "lucide-react";

const CookiePolicyPage = () => {
  const sections = [
    {
      id: "what-are",
      icon: Cookie,
      title: "What Are Cookies",
      content: "Cookies are small text files that websites store on your device to remember information about your visit. They help websites function properly and remember your preferences."
    },
    {
      id: "cookies-we-use",
      icon: Database,
      title: "Cookies We Use",
      content: "AssignFlow Hub uses essential cookies for platform functionality. We do not use cookies for advertising, analytics, or tracking purposes.",
      items: [
        {
          title: "Authentication Cookies",
          description: "Stores your login session securely using JWT tokens in local storage (not traditional browser cookies)",
          icon: Shield
        },
        {
          title: "Preference Cookies",
          description: "Remembers your basic settings and preferences for a better user experience",
          icon: Settings
        }
      ]
    },
    {
      id: "third-party",
      icon: Eye,
      title: "Third-Party Cookies",
      content: "We do not use third-party advertising, tracking, or analytics cookies. We believe in respecting user privacy and minimizing data collection.",
      note: "No third-party tracking cookies are used on our platform."
    },
    {
      id: "managing",
      icon: Settings,
      title: "Managing Cookies",
      content: "You can manage or disable cookies through your browser settings. Most browsers allow you to control cookie behavior. Please note that disabling essential cookies may affect platform functionality.",
      items: [
        {
          title: "Browser Settings",
          description: "Control cookies in your browser's privacy or security settings"
        },
        {
          title: "Local Storage",
          description: "Clear local storage through browser developer tools"
        },
        {
          title: "Logout",
          description: "Logging out clears your authentication token"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />
      
      {/* Floating Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/10 via-transparent to-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-gradient-to-tl from-purple-500/5 via-transparent to-blue-500/5 rounded-full blur-3xl" />

      {/* Floating Cookies */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className={`absolute ${i % 2 === 0 ? 'right-8' : 'left-8'} ${
            i === 1 ? 'top-32' : i === 2 ? 'top-1/2' : 'bottom-32'
          } z-0`}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        >
          <div className="relative">
            <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50 flex items-center justify-center text-amber-500">
              <Cookie className="w-5 h-5" />
            </div>
          </div>
        </motion.div>
      ))}

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-purple-500/10 backdrop-blur-sm border border-white/30 rounded-full shadow-lg mb-6">
            <Cookie className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-semibold text-slate-800">
              Simple & Transparent
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          >
            <span className="block text-slate-900">Cookie</span>
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
            className="text-xl text-slate-600 max-w-2xl mx-auto"
          >
            Straight talk about cookies. We keep it minimal and respectful.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-200 rounded-full">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-800">
                No advertising cookies • No tracking cookies
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-emerald-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative p-6 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Section Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 p-2.5 flex-shrink-0">
                    <section.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">
                      {section.title}
                    </h2>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-1 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-full text-slate-700">
                        Part {index + 1}
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
                    className="text-slate-700 mb-4"
                  >
                    {section.content}
                  </motion.p>
                )}

                {/* Items List */}
                {section.items && (
                  <div className="grid grid-cols-1 gap-3 mb-4">
                    {section.items.map((item, itemIndex) => (
                      <motion.div
                        key={itemIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * itemIndex }}
                        className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50/30 to-emerald-50/30 rounded-lg"
                      >
                        {'icon' in item ? (
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-emerald-500/20 p-1.5 flex-shrink-0">
                            <item.icon className="w-5 h-5 text-blue-600" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-emerald-500/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-semibold text-slate-700">
                              {itemIndex + 1}
                            </span>
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium text-slate-900 mb-0.5">
                            {item.title}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {item.description}
                          </p>
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
                    className="p-3 bg-gradient-to-r from-amber-50 to-amber-50/50 border border-amber-200 rounded-lg"
                  >
                    <div className="flex items-center gap-2 text-amber-800">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">{section.note}</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Key Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <div className="p-6 bg-gradient-to-br from-blue-50/50 to-emerald-50/50 border border-blue-200/30 rounded-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4 text-center">
              Our Cookie Promise
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "Minimal Use",
                  description: "Only essential cookies for functionality",
                  icon: "🔒"
                },
                {
                  title: "No Tracking",
                  description: "Zero advertising or analytics cookies",
                  icon: "🚫"
                },
                {
                  title: "User Control",
                  description: "Easy management through browser settings",
                  icon: "⚙️"
                }
              ].map((item, index) => (
                <div key={index} className="p-4 bg-white/50 rounded-lg text-center">
                  <div className="text-xl mb-2">{item.icon}</div>
                  <h4 className="font-semibold text-slate-900 mb-1 text-sm">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Technical Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 p-6 bg-gradient-to-br from-slate-50/50 to-white/50 border border-slate-200/50 rounded-2xl"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-2 flex-shrink-0">
              <Lock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">
                Technical Implementation
              </h4>
              <p className="text-sm text-slate-600">
                We use JSON Web Tokens (JWT) stored in local storage for authentication, 
                not traditional browser cookies. This provides better security and control 
                while maintaining platform functionality.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Related Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 pt-6 border-t border-slate-200/50"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">
                More Information
              </h4>
              <p className="text-sm text-slate-600">
                Learn more about our privacy practices
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="/privacy"
                className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:border-blue-300 hover:text-blue-700 transition-all duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:border-emerald-300 hover:text-emerald-700 transition-all duration-300"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </motion.div>

        {/* Simple Acceptance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-slate-500">
            By using AssignFlow Hub, you accept our use of essential cookies as described above.
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

export default CookiePolicyPage;