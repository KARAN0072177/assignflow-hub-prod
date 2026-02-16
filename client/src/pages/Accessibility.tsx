import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Accessibility,
  Keyboard,
  Eye,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Mail,
  Users,
  Award,
  HeartHandshake,
  Sparkles,
  ArrowRight
} from "lucide-react";

const AccessibilityPage = () => {
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

  const features = [
    {
      icon: Keyboard,
      title: "Keyboard Navigation",
      description: "Full keyboard support - use Tab, Enter, Space, and arrow keys to navigate all interactive elements.",
      examples: ["Skip to content links", "Focus indicators", "Logical tab order"]
    },
    {
      icon: Eye,
      title: "Visual Design",
      description: "Carefully chosen colors and contrast ratios to ensure text is readable for users with visual impairments.",
      examples: ["Contrast ratio ≥ 4.5:1 for text", "No information conveyed by color alone", "Adjustable text spacing"]
    },
    {
      icon: MessageSquare,
      title: "Screen Reader Support",
      description: "Semantic HTML and ARIA labels help screen readers interpret page structure and content accurately.",
      examples: ["Proper heading hierarchy", "Descriptive alt text", "ARIA landmarks"]
    },
    {
      icon: CheckCircle,
      title: "Form Accessibility",
      description: "Forms include clear labels, validation messages, and error identification.",
      examples: ["Associated labels", "Error summaries", "Required field indicators"]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Accessibility | AssignFlow Hub</title>
        <meta 
          name="description" 
          content="AssignFlow Hub is committed to making our platform accessible to everyone. Learn about our accessibility features and how to get support." 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://assignflowhub.karanart.com/accessibility" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Accessibility | AssignFlow Hub" />
        <meta property="og:description" content="Learn about AssignFlow Hub's commitment to accessibility and how we're making our platform usable for everyone." />
        <meta property="og:url" content="https://assignflowhub.karanart.com/accessibility" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Accessibility | AssignFlow Hub" />
        <meta name="twitter:description" content="Learn about AssignFlow Hub's commitment to accessibility and how we're making our platform usable for everyone." />
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-20">
            
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-purple-500/10 backdrop-blur-sm border border-white/30 rounded-full shadow-lg mb-6">
                <Accessibility className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-slate-800">
                  Our Commitment
                </span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                <span className="block">Accessibility at</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
                  AssignFlow Hub
                </span>
              </h1>
            </motion.div>

            {/* Intro Section */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-12"
            >
              {/* Introduction */}
              <motion.div variants={itemVariants} className="prose prose-lg max-w-none">
                <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-lg">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">Our Accessibility Commitment</h2>
                      <p className="text-slate-600 leading-relaxed">
                        At AssignFlow Hub, we believe that education technology should work for everyone. 
                        We're committed to making our platform as usable and inclusive as possible, 
                        regardless of ability or the technology you use to access it.
                      </p>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed mt-4 pl-16">
                    We actively work to remove barriers and ensure that teachers, students, and administrators 
                    of all abilities can effectively use AssignFlow Hub to manage assignments and collaborate 
                    on educational workflows.
                  </p>
                </div>
              </motion.div>

              {/* Accessibility Features */}
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Award className="w-6 h-6 text-blue-600" />
                  Current Accessibility Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -4 }}
                      className="group relative h-full"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center mb-4">
                          <feature.icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                        <p className="text-sm text-slate-600 mb-4">{feature.description}</p>
                        <ul className="space-y-2">
                          {feature.examples.map((example, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-500">
                              <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                              <span>{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Ongoing Improvements */}
              <motion.div variants={itemVariants}>
                <div className="bg-gradient-to-br from-blue-50/50 to-emerald-50/50 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 p-2.5 flex-shrink-0">
                      <RefreshCw className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">Ongoing Improvements</h3>
                      <p className="text-slate-600 leading-relaxed">
                        Accessibility isn't a one-time fix—it's an ongoing commitment. As we develop new features 
                        and improve existing ones, we continuously review and enhance accessibility. Our development 
                        team regularly:
                      </p>
                      <ul className="mt-4 space-y-2">
                        {[
                          "Tests new features with assistive technologies",
                          "Reviews color contrast and visual design",
                          "Incorporates user feedback on accessibility",
                          "Stays updated on best practices and guidelines"
                        ].map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-slate-600">
                            <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Limitations */}
              <motion.div variants={itemVariants}>
                <div className="bg-amber-50/50 backdrop-blur-sm border border-amber-200/50 rounded-2xl p-8 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 p-2.5 flex-shrink-0">
                      <AlertCircle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">Honest Acknowledgement of Limitations</h3>
                      <p className="text-slate-600 leading-relaxed">
                        While we strive for the highest level of accessibility, we acknowledge that some areas 
                        of the platform may still present challenges. As a growing SaaS platform, we're working 
                        through our backlog of accessibility improvements and prioritizing fixes based on user impact.
                      </p>
                      <p className="text-slate-600 leading-relaxed mt-4">
                        If you encounter any accessibility barriers while using AssignFlow Hub, please let us know. 
                        Your feedback helps us prioritize and address issues more effectively.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Contact for Support */}
              <motion.div variants={itemVariants}>
                <div className="bg-gradient-to-br from-blue-600/5 to-emerald-600/5 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-lg text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 p-3">
                      <HeartHandshake className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Need Accessibility Support?</h3>
                  <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto mb-6">
                    If you're experiencing any accessibility issues or have suggestions for improvement, 
                    please reach out to us. We're here to help and value your feedback.
                  </p>
                  <Link
                    to="/contact"
                    className="group cursor-pointer relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold rounded-2xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Mail className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Contact Support Team</span>
                    <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <p className="text-sm text-slate-500 mt-4">
                    You can also email us directly at{" "}
                    <a 
                      href="mailto:accessibility@assignflowhub.com"
                      className="text-blue-600 hover:text-emerald-600 transition-colors duration-300"
                    >
                      accessibility@assignflowhub.com
                    </a>
                  </p>
                </div>
              </motion.div>

              {/* Footer Note */}
              <motion.div variants={itemVariants} className="text-center text-sm text-slate-500">
                <p>
                  Last updated: {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </motion.div>
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

export default AccessibilityPage;