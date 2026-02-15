import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Home,
  LayoutDashboard,
  AlertCircle,
  ArrowLeft,
  Compass,
  MapPin,
  Cloud,
  Star,
  Rocket
} from "lucide-react";

const NotFound = () => {
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
    { icon: Cloud, className: "top-20 left-[15%] delay-0", color: "text-blue-400" },
    { icon: Star, className: "top-40 right-[20%] delay-100", color: "text-amber-400" },
    { icon: MapPin, className: "bottom-32 left-[25%] delay-200", color: "text-emerald-400" },
    { icon: Compass, className: "bottom-40 right-[15%] delay-300", color: "text-purple-400" },
  ];

  const numbers = [4, 0, 4];

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden relative flex items-center justify-center"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-blue-300/30 rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
            }}
            animate={{
              y: [null, `-${Math.random() * 50 + 20}px`],
              x: [null, `${(Math.random() - 0.5) * 30}px`],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Floating Icons */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute ${element.className} z-0`}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.3,
          }}
        >
          <div className="relative">
            <div className={`w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 flex items-center justify-center ${element.color}`}>
              <element.icon className="w-8 h-8" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl blur-xl -z-10" />
          </div>
        </motion.div>
      ))}

      {/* Main 404 Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col items-center text-center">
          
          {/* Error Code with 3D Effect */}
          <motion.div
            style={{ rotateX, rotateY }}
            className="perspective-1000 mb-8"
          >
            <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
              {numbers.map((num, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="relative"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                    className="relative"
                  >
                    <span className="text-8xl sm:text-9xl md:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500">
                      {num}
                    </span>
                    <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-600/30 via-blue-500/30 to-emerald-500/30 blur-2xl">
                      {num}
                    </span>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-purple-500/10 backdrop-blur-sm border border-white/30 rounded-full shadow-lg mb-6">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-semibold text-slate-800">
                Page Not Found
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Looks like you're lost in space
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back on track!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/"
                className="group cursor-pointer relative px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold rounded-2xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 overflow-hidden inline-flex items-center gap-3"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Home className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Go to Homepage</span>
                <ArrowLeft className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:-translate-x-1 rotate-180" />
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
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Go to Dashboard</span>
                  <Rocket className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-16 pt-8 border-t border-slate-200/50"
          >
            <p className="text-sm text-slate-500 mb-4">QUICK LINKS</p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {[
                { name: "About Us", path: "/about" },
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Contact", path: "/contact" },
                { name: "Help Center", path: "/help" },
              ].map((link, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -2 }}
                >
                  <Link
                    to={link.path}
                    className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-300 flex items-center gap-1"
                  >
                    <span>{link.name}</span>
                    <Compass className="w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            onClick={() => navigate(-1)}
            className="mt-8 text-sm text-slate-500 hover:text-blue-600 transition-colors duration-300 flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Go Back</span>
          </motion.button>
        </div>
      </div>

      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/10 via-transparent to-emerald-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500/5 via-transparent to-blue-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-emerald-500/10 via-transparent to-blue-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
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
  );
};

export default NotFound;