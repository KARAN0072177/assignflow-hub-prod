import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  BookOpen,
  Users,
  Shield,
  Zap,
  CheckCircle,
  GraduationCap,
  TrendingUp,
  Star,
  Award
} from "lucide-react";
import Testimonials from "../components/Testimonials";
import Features from "../components/Features";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

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
    { icon: BookOpen, className: "top-1/4 left-10 delay-0", color: "text-blue-400" },
    { icon: Users, className: "top-1/3 right-10 delay-100", color: "text-emerald-400" },
    { icon: Shield, className: "bottom-1/3 left-20 delay-200", color: "text-purple-400" },
    { icon: Award, className: "bottom-1/4 right-20 delay-300", color: "text-amber-400" },
  ];

  return (

    <>
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden relative"
      onMouseMove={handleMouseMove}
    >
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

      {/* Floating Feature Icons */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute ${element.className} z-0`}
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 3,
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

      {/* Main Hero Content */}
      <div className="relative z-10">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-32 pb-20">
          {/* Header with Badge */}
          <div className="flex flex-col items-center text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-purple-500/10 backdrop-blur-sm border border-white/30 rounded-full shadow-lg">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-semibold text-slate-800">
                  Join 10,000+ educators & students worldwide
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Main Headline with 3D Effect */}
            <motion.div
              style={{ rotateX, rotateY }}
              className="perspective-1000"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
                <span className="block text-slate-900">
                  Transform Your
                </span>
                <span className="block mt-2">
                  <span className="relative inline-block">
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 animate-gradient">
                      Learning Experience
                    </span>
                    <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-600/30 via-blue-500/30 to-emerald-500/30 blur-xl">
                      Learning Experience
                    </span>
                  </span>
                </span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="max-w-3xl mx-auto mb-12"
            >
              <p className="text-xl md:text-2xl text-slate-600 leading-relaxed">
                AssignFlow Hub is the all-in-one platform that empowers educators to create engaging classrooms 
                and helps students achieve academic excellence through intuitive tools and seamless collaboration.
              </p>
            </motion.div>

            {/* CTA Buttons with Interactive Effects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="group cursor-pointer relative px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold rounded-2xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-3">
                  <span className="text-lg">
                    {isLoggedIn ? "Go to Dashboard" : "Start Free Trial"}
                  </span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
                <div className="absolute inset-0 border-2 border-white/20 rounded-2xl translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </motion.button>

              {!isLoggedIn && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="group px-8 py-4 bg-white/90 backdrop-blur-sm border-2 border-slate-300 text-slate-700 font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:border-blue-300 hover:text-blue-700 transition-all duration-300 flex items-center gap-3"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              )}
            </motion.div>

            {/* Interactive Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="max-w-5xl mx-auto"
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                  { value: "10K+", label: "Active Users", icon: Users, color: "text-blue-600" },
                  { value: "500+", label: "Classrooms", icon: BookOpen, color: "text-emerald-600" },
                  { value: "99.9%", label: "Uptime", icon: Shield, color: "text-purple-600" },
                  { value: "4.9/5", label: "Rating", icon: Star, color: "text-amber-600" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="cursor-pointer group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative p-6 bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center ${stat.color}`}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                      <div className="text-sm font-medium text-slate-600">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Feature Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {[
                  {
                    icon: Zap,
                    title: "Instant Setup",
                    description: "Get started in minutes with our intuitive interface",
                    gradient: "from-blue-500 to-blue-600"
                  },
                  {
                    icon: CheckCircle,
                    title: "Proven Results",
                    description: "Improve student engagement by 40% on average",
                    gradient: "from-emerald-500 to-emerald-600"
                  },
                  {
                    icon: GraduationCap,
                    title: "Expert Support",
                    description: "24/7 support from our education specialists",
                    gradient: "from-purple-500 to-purple-600"
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02, y: -3 }}
                    className="cursor-pointer group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 rounded-2xl blur-xl transition-opacity duration-300" style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))`, backgroundImage: `linear-gradient(135deg, ${feature.gradient})` }} />
                    <div className="relative p-6 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} p-3 mb-4`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                      <p className="text-slate-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-16 pt-8 border-t border-slate-200/50"
            >
              <p className="text-sm text-slate-500 mb-4">TRUSTED BY LEADING INSTITUTIONS</p>
              <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
                <div className="text-2xl font-bold text-slate-700">Harvard</div>
                <div className="text-2xl font-bold text-slate-700">Stanford</div>
                <div className="text-2xl font-bold text-slate-700">MIT</div>
                <div className="text-2xl font-bold text-slate-700">Oxford</div>
                <div className="text-2xl font-bold text-slate-700">Cambridge</div>
              </div>
            </motion.div>
          </div>
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
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>

    <Features />
    <Testimonials />
    </>
  );
};

export default Home;