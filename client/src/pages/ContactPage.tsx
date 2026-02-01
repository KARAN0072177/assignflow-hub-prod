import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Sparkles, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle,
  User,
  Mail,
  Phone,
  FileText,
  Zap,
  Shield,
  Headphones,
  Target
} from "lucide-react";
import { submitContactForm } from "../services/contact.api";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleFocus = (field: string) => {
    setActiveField(field);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await submitContactForm({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        message: form.message.trim(),
      });

      setSuccess(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (field: string) => `
    w-full p-4 bg-white/80 backdrop-blur-sm border-2 rounded-xl text-slate-700 
    placeholder-slate-500 focus:outline-none transition-all duration-300
    ${activeField === field 
      ? 'border-blue-500/50 ring-2 ring-blue-500/20 shadow-lg' 
      : 'border-slate-200/50 hover:border-slate-300'
    }
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />
      
      {/* Floating Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/10 via-transparent to-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-purple-500/5 via-transparent to-blue-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:pr-12"
          >
            {/* Header */}
            <div className="mb-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-purple-500/10 backdrop-blur-sm border border-white/30 rounded-full shadow-lg mb-6"
              >
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-semibold text-slate-800">
                  We're Here to Help
                </span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                <span className="block text-slate-900">Get In</span>
                <span className="block mt-2">
                  <span className="relative inline-block">
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 animate-gradient">
                      Touch
                    </span>
                    <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-600/30 via-blue-500/30 to-emerald-500/30 blur-xl">
                      Touch
                    </span>
                  </span>
                </span>
              </h1>

              <p className="text-xl text-slate-600 mb-2">
                Share suggestions, bug reports, inquiries, or anything else.
              </p>
              <p className="text-slate-500">
                We typically respond within 24 hours.
              </p>
            </div>

            {/* Form Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative p-8 bg-white/90 backdrop-blur-sm border border-white/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
                {/* Name Field */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                    <User className="w-4 h-4 text-blue-500" />
                    Name *
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onFocus={() => handleFocus('name')}
                    onBlur={handleBlur}
                    className={inputClasses('name')}
                    placeholder="Your full name"
                    required
                  />
                </div>

                {/* Email Field */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                    <Mail className="w-4 h-4 text-emerald-500" />
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={handleBlur}
                    className={inputClasses('email')}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                {/* Phone Field */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                    <Phone className="w-4 h-4 text-purple-500" />
                    Phone (Optional)
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    onFocus={() => handleFocus('phone')}
                    onBlur={handleBlur}
                    className={inputClasses('phone')}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Message Field */}
                <div className="mb-8">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                    <FileText className="w-4 h-4 text-amber-500" />
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    onFocus={() => handleFocus('message')}
                    onBlur={handleBlur}
                    rows={6}
                    className={inputClasses('message') + ' resize-none'}
                    placeholder="How can we help you today? Be as detailed as you'd like..."
                    required
                  />
                  <div className="text-right mt-2 text-sm text-slate-500">
                    {form.message.length}/2000
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={loading}
                  className="group relative w-full py-4 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-emerald-600 opacity-0 group-hover:opacity-100 group-disabled:opacity-0 transition-opacity duration-300" />
                  <div className="absolute inset-0 border-2 border-white/20 rounded-2xl translate-x-[-100%] group-hover:translate-x-[100%] group-disabled:translate-x-[-100%] transition-transform duration-1000" />
                  
                  <div className="relative flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="text-lg">Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        <span className="text-lg">Send Message</span>
                      </>
                    )}
                  </div>
                </motion.button>

                {/* Status Messages */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-6 p-5 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-200 rounded-2xl"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-emerald-900 mb-1">
                            Message Sent Successfully! 🎉
                          </h3>
                          <p className="text-emerald-700 text-sm">
                            Thank you for reaching out. We'll get back to you within 24 hours.
                            Check your email for a confirmation.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-6 p-5 bg-gradient-to-r from-rose-500/10 to-rose-600/10 border border-rose-200 rounded-2xl"
                    >
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-rose-900 mb-1">
                            Unable to Send Message
                          </h3>
                          <p className="text-rose-700 text-sm">{error}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:pl-12"
          >
            {/* Contact Methods */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Other Ways to Connect
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    icon: <MessageSquare className="w-6 h-6" />,
                    title: "Live Chat Support",
                    description: "Get instant help from our support team",
                    status: "Online now",
                    color: "from-blue-500 to-blue-600",
                    statusColor: "text-emerald-600"
                  },
                  {
                    icon: <Mail className="w-6 h-6" />,
                    title: "Email Support",
                    description: "support@assignflowhub.com",
                    status: "24-hour response",
                    color: "from-emerald-500 to-emerald-600",
                    statusColor: "text-blue-600"
                  },
                  {
                    icon: <Headphones className="w-6 h-6" />,
                    title: "Phone Support",
                    description: "+1 (800) 123-4567",
                    status: "Mon-Fri, 9AM-5PM EST",
                    color: "from-purple-500 to-purple-600",
                    statusColor: "text-purple-600"
                  }
                ].map((method, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    className="p-5 bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} p-3`}>
                        <div className="text-white">
                          {method.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">
                          {method.title}
                        </h3>
                        <p className="text-slate-600 text-sm mb-1">
                          {method.description}
                        </p>
                        <span className={`text-xs font-medium ${method.statusColor}`}>
                          {method.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* What We Can Help With */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                What We Can Help With
              </h2>
              
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    icon: <Zap className="w-5 h-5" />,
                    text: "Technical support and bug reports",
                    color: "text-blue-600"
                  },
                  {
                    icon: <Target className="w-5 h-5" />,
                    text: "Feature requests and suggestions",
                    color: "text-emerald-600"
                  },
                  {
                    icon: <Shield className="w-5 h-5" />,
                    text: "Security and privacy concerns",
                    color: "text-purple-600"
                  },
                  {
                    icon: <MessageSquare className="w-5 h-5" />,
                    text: "Partnership and collaboration inquiries",
                    color: "text-amber-600"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50/50 to-white/50 rounded-xl border border-white/30"
                  >
                    <div className={`${item.color}`}>
                      {item.icon}
                    </div>
                    <span className="text-slate-700">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Response Time Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8 p-6 bg-gradient-to-r from-blue-50/50 to-emerald-50/50 border border-blue-200/30 rounded-2xl"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Fast Response Guarantee
                  </h3>
                  <p className="text-slate-600 text-sm">
                    We pride ourselves on quick response times. Most inquiries receive a reply within a few hours during business days.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
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

export default ContactPage;