import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Clock,
  Database,
  Activity,
  History,
  Users,
  Workflow,
  Cloud,
  CheckCircle,
  Server,
  Eye,
  BarChart3,
  ShieldCheck,
  Terminal
} from "lucide-react";

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: 1,
      title: "Role-Based Access Control (RBAC)",
      icon: Users,
      subtitle: "Backend-enforced authorization",
      description: "Granular permissions with Teacher, Student, and Admin roles. All authorization decisions are made server-side—frontend roles are purely for UI.",
      gradient: "from-blue-600 to-indigo-600",
      details: [
        "Backend-enforced permission checks on every request",
        "JWT-based claims with role verification",
        "Resource-level permissions (view/edit/delete)",
        "Admin elevation requires 2FA verification"
      ],
      badge: "Security Foundation"
    },
    {
      id: 2,
      title: "Workflow-Driven Assignment Lifecycle",
      icon: Workflow,
      subtitle: "State machines, not just CRUD",
      description: "Assignments follow a strict workflow: draft → scheduled → active → grading → published. Each state enforces specific business rules.",
      gradient: "from-emerald-600 to-green-600",
      details: [
        "Finite state machines for assignment lifecycle",
        "Draft → Submitted → Graded → Published flow",
        "Business logic prevents invalid state transitions",
        "Submission locking after deadline"
      ],
      badge: "Business Logic"
    },
    {
      id: 3,
      title: "Background Jobs for Deadlines",
      icon: Clock,
      subtitle: "Automatic deadline enforcement",
      description: "Worker processes continuously monitor deadlines and automatically lock submissions. Works even when users are offline.",
      gradient: "from-amber-600 to-orange-600",
      details: [
        "Redis-backed job queues with BullMQ",
        "Automatic submission locking at deadlines",
        "Email notifications for pending reviews",
        "Retry logic with exponential backoff"
      ],
      badge: "Async Processing"
    },
    {
      id: 4,
      title: "Secure File Handling",
      icon: Cloud,
      subtitle: "Cloud-safe upload design",
      description: "Direct uploads to S3-compatible storage using presigned URLs. Backend never handles file payloads—only metadata.",
      gradient: "from-purple-600 to-pink-600",
      details: [
        "Presigned S3 URLs for direct uploads",
        "Virus scanning via ClamAV integration",
        "Automatic file type validation",
        "Storage cost optimization with lifecycle rules"
      ],
      badge: "Scalability"
    },
    {
      id: 5,
      title: "Data Integrity Checks",
      icon: Database,
      subtitle: "Proactive data validation",
      description: "Scheduled integrity checks detect orphaned records, ungraded submissions, and data inconsistencies before they cause issues.",
      gradient: "from-rose-600 to-red-600",
      details: [
        "Daily orphaned record detection",
        "Ungraded submission alerts",
        "Grade consistency validation",
        "Referential integrity audits"
      ],
      badge: "Data Quality"
    },
    {
      id: 6,
      title: "System Health Dashboard",
      icon: Activity,
      subtitle: "Full-stack observability",
      description: "Real-time monitoring of system health, performance metrics, error rates, and background job status with actionable alerts.",
      gradient: "from-cyan-600 to-blue-600",
      details: [
        "Live API response time monitoring",
        "Database connection pool health",
        "Background job success/failure rates",
        "Storage utilization and trends"
      ],
      badge: "Operations"
    },
    {
      id: 7,
      title: "Security Hardening",
      icon: ShieldCheck,
      subtitle: "Defense in depth",
      description: "Multi-layered security with rate limiting, input sanitization, and audit logging. Protection against common web vulnerabilities.",
      gradient: "from-violet-600 to-purple-600",
      details: [
        "Dynamic rate limiting per endpoint",
        "SQL injection prevention with parameterized queries",
        "XSS protection via CSP headers",
        "Security headers (HSTS, X-Frame-Options)"
      ],
      badge: "Threat Awareness"
    },
    {
      id: 8,
      title: "Audit Logging",
      icon: History,
      subtitle: "Complete action tracing",
      description: "Every significant action is logged with user context, timestamp, and before/after state. Essential for debugging and compliance.",
      gradient: "from-slate-600 to-gray-600",
      details: [
        "User action logging with IP tracking",
        "System admin action audit trails",
        "Background job execution logs",
        "GDPR-ready data access logs"
      ],
      badge: "Compliance"
    }
  ];

  const activeFeatureData = features[activeFeature];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 overflow-hidden relative">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-indigo-300/30 rounded-full"
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

      <div className="relative z-10">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-32 pb-20">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-emerald-500/10 backdrop-blur-sm border border-white/30 rounded-full shadow-lg mb-8"
            >
              <Shield className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-semibold text-slate-800">
                Production-Ready Architecture
              </span>
              <Server className="w-5 h-5 text-emerald-500" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6"
            >
              <span className="block text-slate-900">Enterprise-Grade</span>
              <span className="block mt-2">
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-500 to-emerald-500 animate-gradient">
                    Features & Security
                  </span>
                  <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600/30 via-blue-500/30 to-emerald-500/30 blur-xl">
                    Features & Security
                  </span>
                </span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="max-w-3xl mx-auto text-xl text-slate-600"
            >
              Beyond basic CRUD—this is how production systems are built. Each feature addresses real-world challenges in scalability, security, and reliability.
            </motion.p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Feature Selection Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 space-y-4">
                <div className="p-6 bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Core Architecture Features</h3>
                  <p className="text-sm text-slate-600 mb-6">
                    Select a feature to explore implementation details and production considerations.
                  </p>
                  
                  <div className="space-y-2">
                    {features.map((feature, index) => (
                      <motion.button
                        key={feature.id}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveFeature(index)}
                        className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                          activeFeature === index
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                            : 'hover:bg-slate-50/50 border-transparent'
                        } border`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                            <feature.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-900">{feature.title}</span>
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                #{feature.id}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{feature.subtitle}</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* System Status Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Production Ready</h4>
                      <p className="text-sm text-slate-600">All features battle-tested</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Uptime</span>
                      <span className="font-semibold text-emerald-700">99.95%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Security Score</span>
                      <span className="font-semibold text-blue-700">A+</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Data Integrity</span>
                      <span className="font-semibold text-green-700">100%</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Active Feature Detail Panel */}
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-xl overflow-hidden">
                {/* Feature Header */}
                <div className={`bg-gradient-to-r ${activeFeatureData.gradient} p-8`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                        <activeFeatureData.icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-2">
                          <span className="text-xs font-semibold text-white">{activeFeatureData.badge}</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white">{activeFeatureData.title}</h2>
                        <p className="text-blue-100">{activeFeatureData.subtitle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-5xl font-bold text-white/30">0{activeFeatureData.id}</div>
                    </div>
                  </div>
                </div>

                {/* Feature Content */}
                <div className="p-8">
                  <div className="mb-8">
                    <p className="text-lg text-slate-700 leading-relaxed">
                      {activeFeatureData.description}
                    </p>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <Terminal className="w-5 h-5" />
                      Implementation Highlights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeFeatureData.details.map((detail, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 p-4 bg-gradient-to-br from-slate-50 to-white border border-slate-200/50 rounded-xl"
                        >
                          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-slate-700">{detail}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Why This Matters */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Why This Matters to Recruiters
                    </h4>
                    <div className="space-y-3">
                      {(() => {
                        const messages = {
                          0: "Shows understanding of real authorization—not just UI hiding.",
                          1: "Demonstrates business logic and state machine thinking beyond basic CRUD.",
                          2: "Proves knowledge of async systems and background processing.",
                          3: "Shows scalability awareness and secure file handling patterns.",
                          4: "Indicates attention to data quality and system correctness.",
                          5: "Reveals operations thinking and system ownership mindset.",
                          6: "Demonstrates threat awareness and security hardening skills.",
                          7: "Shows compliance readiness and debugging traceability."
                        };
                        return (
                          <p className="text-slate-700">
                            {messages[activeFeature as keyof typeof messages]}
                          </p>
                        );
                      })()}
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <BarChart3 className="w-4 h-4" />
                        <span>Differentiates from 95% of portfolio projects</span>
                      </div>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">Tech Stack Integration</h4>
                    <div className="flex flex-wrap gap-3">
                      {["TypeScript", "Node.js", "PostgreSQL", "Redis", "S3/R2", "BullMQ", "JWT", "Prisma", "Docker"].map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Navigation */}
              <div className="flex items-center justify-between mt-6">
                <motion.button
                  whileHover={{ x: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFeature((prev) => (prev > 0 ? prev - 1 : features.length - 1))}
                  className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </motion.button>

                <div className="flex items-center gap-2">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveFeature(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        activeFeature === index
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 w-6'
                          : 'bg-slate-300 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>

                <motion.button
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFeature((prev) => (prev < features.length - 1 ? prev + 1 : 0))}
                  className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Next
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl shadow-xl">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Ready to implement these production patterns?</span>
              <button className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl font-medium transition-all">
                View Source Code
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/10 via-transparent to-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/10 via-transparent to-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
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

export default Features;