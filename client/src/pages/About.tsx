import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  BookOpen,
  Users,
  Zap,
  TrendingUp,
  Award,
  MessageCircle,
  Cloud,
  Layout,
  Server,
  Mail,
  Lock,
  Database,
  Globe,
  Clock,
  AlertCircle,
  Target,
  Rocket,
  Eye,
  Brain,
  FileText,
  Upload,
  Bell,
  UserCheck,
  RefreshCw
} from "lucide-react";

const About = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);





  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;
    
    requestAnimationFrame(() => {
      mouseX.set(x);
      mouseY.set(y);
    });
  };

  const floatingElements = [
    { icon: Rocket, className: "top-1/4 left-10 delay-0", color: "text-blue-400" },
    { icon: Target, className: "top-1/3 right-10 delay-100", color: "text-emerald-400" },
    { icon: Eye, className: "bottom-1/3 left-20 delay-200", color: "text-purple-400" },
    { icon: Brain, className: "bottom-1/4 right-20 delay-300", color: "text-amber-400" },
  ];

  const problems = [
    { icon: Clock, title: "Poor Organization", description: "Scattered assignments across multiple platforms and emails causing confusion and missed deadlines" },
    { icon: AlertCircle, title: "Slow Workflows", description: "Manual grading and feedback processes waste valuable time for educators" },
    { icon: MessageCircle, title: "Limited Real-time Communication", description: "Delayed responses and missed messages between teachers and students" },
    { icon: Eye, title: "Lack of Transparency", description: "No clear visibility into assignment progress, deadlines, and student performance" },
  ];

  const solutions = [
    { icon: Layout, title: "Centralized Management", description: "All assignments in one place with intuitive organization and drag-and-drop functionality" },
    { icon: Cloud, title: "Secure File Uploads", description: "Encrypted storage with automatic virus scanning and version history" },
    { icon: MessageCircle, title: "Real-time Communication", description: "Instant messaging, comments, and notifications for seamless collaboration" },
    { icon: UserCheck, title: "Role-based Access", description: "Granular permissions for teachers, students, and admins with custom roles" },
    { icon: Bell, title: "Automated Notifications", description: "Smart alerts for deadlines, submissions, feedback, and important updates" },
  ];

  const features = [
    { icon: BookOpen, title: "Assignment Management", description: "Create, distribute, and grade assignments with ease using our intuitive interface", color: "from-blue-500 to-blue-600" },
    { icon: MessageCircle, title: "Real-Time Chat", description: "Instant messaging between teachers and students with message history", color: "from-emerald-500 to-emerald-600" },
    { icon: Cloud, title: "Secure Cloud Storage", description: "AWS S3 powered file storage with encryption and automatic backups", color: "from-purple-500 to-purple-600" },
    { icon: Layout, title: "Admin Dashboard", description: "Comprehensive analytics and management tools for administrators", color: "from-amber-500 to-amber-600" },
    { icon: Server, title: "Background Job Processing", description: "Redis-powered queue for async tasks like email and file processing", color: "from-red-500 to-red-600" },
    { icon: Mail, title: "Email Notifications", description: "Resend API for reliable email delivery with customizable templates", color: "from-indigo-500 to-indigo-600" },
    { icon: Lock, title: "Authentication & Security", description: "JWT tokens, rate limiting, and data encryption for maximum security", color: "from-pink-500 to-pink-600" },
    { icon: Database, title: "Real-time Updates", description: "WebSocket connections for live data sync and instant notifications", color: "from-cyan-500 to-cyan-600" },
  ];

  const steps = [
    { number: "01", title: "Register or Login", description: "Users sign up as teachers or students with role-based access", icon: Users },
    { number: "02", title: "Create Assignments", description: "Teachers create and publish assignments with deadlines and attachments", icon: FileText },
    { number: "03", title: "Submit Work", description: "Students upload their completed work with file support", icon: Upload },
    { number: "04", title: "Secure Storage", description: "Files are encrypted and stored in AWS S3 with version control", icon: Cloud },
    { number: "05", title: "Real-time Updates", description: "Instant notifications and live feedback for all stakeholders", icon: RefreshCw },
  ];

  const techStack = [
    { name: "MongoDB", icon: Database, category: "Database" },
    { name: "Express", icon: Server, category: "Backend" },
    { name: "React", icon: Layout, category: "Frontend" },
    { name: "Node.js", icon: Server, category: "Runtime" },
    { name: "Redis", icon: Database, category: "Cache" },
    { name: "WebSockets", icon: Globe, category: "Real-time" },
    { name: "AWS S3", icon: Cloud, category: "Storage" },
    { name: "Resend", icon: Mail, category: "Email" },
  ];

  const visions = [
    { icon: Brain, title: "AI-Powered Features", description: "Smart assignment recommendations and automated grading assistance" },
    { icon: Zap, title: "Smarter Workflows", description: "Intelligent automation for repetitive tasks and workflow optimization" },
    { icon: Users, title: "Better Collaboration", description: "Enhanced real-time collaboration tools for groups and teams" },
    { icon: TrendingUp, title: "Scalability", description: "Handle thousands of concurrent users seamlessly with auto-scaling" },
  ];

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden relative"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 25 }).map((_, i) => (
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

      {/* Floating Feature Icons */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute ${element.className} z-0 hidden lg:block`}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.5,
          }}
        >
          <div className="relative">
            <div className={`w-14 h-14 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50 flex items-center justify-center ${element.color}`}>
              <element.icon className="w-7 h-7" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-xl blur-xl -z-10" />
          </div>
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-20">
          
          {/* Hero Section */}
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-purple-500/10 backdrop-blur-sm border border-white/30 rounded-full shadow-lg">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-semibold text-slate-800">
                  Welcome to AssignFlow Hub
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-5xl md:text-6xl font-bold text-slate-900 mb-6"
            >
              <span className="block">Revolutionizing</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
                Assignment Management
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xl text-slate-600 max-w-3xl mx-auto mb-10"
            >
              A modern assignment and workflow management platform focused on speed, 
              security, and real-time collaboration.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="group cursor-pointer relative px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold rounded-2xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 overflow-hidden inline-flex items-center gap-3"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">Get Started</span>
                  <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>

              {isLoggedIn && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/dashboard"
                    className="group px-8 py-4 bg-white/90 backdrop-blur-sm border-2 border-slate-300 text-slate-700 font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:border-blue-300 hover:text-blue-700 transition-all duration-300 inline-flex items-center gap-3"
                  >
                    <Layout className="w-5 h-5" />
                    <span>View Dashboard</span>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Problem Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">The Problem</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Traditional assignment systems are broken. Here's why.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
              {problems.map((problem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group cursor-pointer relative h-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative p-6 bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center text-red-500 mb-4 flex-shrink-0">
                      <problem.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 flex-shrink-0">{problem.title}</h3>
                    <p className="text-slate-600 flex-1">{problem.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Solution Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Solution</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                AssignFlow Hub addresses these challenges head-on.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {solutions.map((solution, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group cursor-pointer relative h-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative p-6 bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center text-blue-600 mb-4 flex-shrink-0">
                      <solution.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 flex-shrink-0">{solution.title}</h3>
                    <p className="text-slate-600 flex-1">{solution.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Key Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Key Features</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Everything you need to manage assignments efficiently
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -3 }}
                  className="group cursor-pointer relative h-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 rounded-2xl blur-xl transition-opacity duration-300" style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))`, backgroundImage: `linear-gradient(135deg, ${feature.color})` }} />
                  <div className="relative p-6 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-4 flex-shrink-0`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 flex-shrink-0">{feature.title}</h3>
                    <p className="text-sm text-slate-600 flex-1">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Simple, intuitive workflow for teachers and students
              </p>
            </div>

            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/20 via-emerald-500/20 to-purple-500/20 hidden lg:block" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 auto-rows-fr">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative h-full"
                  >
                    <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-lg relative z-10 h-full flex flex-col">
                      <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 mb-2 flex-shrink-0">
                        {step.number}
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center text-blue-600 mb-4 flex-shrink-0">
                        <step.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 flex-shrink-0">{step.title}</h3>
                      <p className="text-sm text-slate-600 flex-1">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Technology Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Technology Stack</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Built with modern, scalable technologies
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {techStack.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -3 }}
                  className="group cursor-pointer"
                >
                  <div className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3">
                    <tech.icon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="font-medium text-slate-700">{tech.name}</span>
                    <span className="text-xs px-2 py-1 bg-slate-100 rounded-full text-slate-600 whitespace-nowrap">
                      {tech.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Portfolio Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-24"
          >
            <div className="max-w-4xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-emerald-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-10 bg-white/90 backdrop-blur-sm border border-white/50 rounded-3xl shadow-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 p-4 flex-shrink-0">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Portfolio Project</h3>
                  </div>
                  <p className="text-lg text-slate-700 leading-relaxed">
                    AssignFlow Hub is a portfolio project demonstrating real-world full-stack development, 
                    scalable backend architecture, and cloud deployment practices.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Vision Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Vision</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Building the future of educational workflow management
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
              {visions.map((vision, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group cursor-pointer relative h-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative p-6 bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center text-purple-600 mb-4 flex-shrink-0">
                      <vision.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 flex-shrink-0">{vision.title}</h3>
                    <p className="text-slate-600 flex-1">{vision.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Footer CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="relative group max-w-3xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-emerald-600/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative p-12 bg-white/90 backdrop-blur-sm border border-white/50 rounded-3xl shadow-2xl">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Start using AssignFlow Hub today
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  Join thousands of educators and students revolutionizing assignment management
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Link
                    to="/login"
                    className="group cursor-pointer relative px-10 py-5 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold rounded-2xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 overflow-hidden inline-flex items-center gap-3 text-lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10">Get Started Now</span>
                    <Rocket className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/10 via-transparent to-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500/5 via-transparent to-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-emerald-500/10 via-transparent to-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Custom Animations */}
      <style>{`
        .bg-grid-slate-100 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(241 245 249 / 0.3)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
          mask-image: linear-gradient(to bottom, transparent, white 20%, white 80%, transparent);
        }
      `}</style>
    </div>
  );
};

export default About;