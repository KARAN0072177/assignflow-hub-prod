import { useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { 
  GraduationCap,
  User,
  Shield,
  Star,
  Sparkles,
  Quote,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { getLatestFeedbacks } from "../services/feedback.api";
import type { FeedbackResponse } from "../types/feedback.types";
import FeedbackCTA from "./FeedbackCTA";

const roleIcon = (role: FeedbackResponse["role"]) => {
  if (role === "TEACHER") return <User className="w-5 h-5" />;
  if (role === "ADMIN") return <Shield className="w-5 h-5" />;
  return <GraduationCap className="w-5 h-5" />;
};

const roleColors = {
  TEACHER: "from-blue-500 to-blue-600",
  ADMIN: "from-purple-500 to-purple-600",
  STUDENT: "from-emerald-500 to-emerald-600"
} as const;

const roleTextColors = {
  TEACHER: "text-blue-600",
  ADMIN: "text-purple-600",
  STUDENT: "text-emerald-600"
} as const;

const Testimonials = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    getLatestFeedbacks()
      .then((data) => {
        if (Array.isArray(data)) {
          setFeedbacks(data);
        } else {
          console.error("Invalid feedback data received");
          setFeedbacks([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching feedbacks:", error);
        setFeedbacks([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleNext = () => {
    if (feedbacks.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % feedbacks.length);
  };

  const handlePrev = () => {
    if (feedbacks.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);
  };

  const slideVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2
      }
    })
  };

  if (loading) {
    return (

      
      
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-purple-500/10 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg mb-4">
            <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
            <span className="text-lg font-semibold text-slate-800">
              Loading testimonials...
            </span>
          </div>
          <p className="text-slate-600 mt-2">Fetching real feedback from our community</p>
        </div>
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500/10 to-emerald-500/10 mb-6">
            <Quote className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            No feedback yet
          </h3>
          <p className="text-slate-600">
            Be the first to share your experience with AssignFlow Hub!
          </p>
        </div>
      </div>
    );
  }

  return (

    <>

    <section className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/5 via-transparent to-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-gradient-to-tr from-purple-500/5 via-transparent to-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-purple-500/10 backdrop-blur-sm border border-white/30 rounded-full shadow-lg mb-8"
          >
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-semibold text-slate-800">
              Real feedback from our community
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            <span className="block text-slate-900">Trusted by</span>
            <span className="block mt-2">
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 animate-gradient">
                  Educators & Students
                </span>
                <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-600/30 via-blue-500/30 to-emerald-500/30 blur-xl">
                  Educators & Students
                </span>
              </span>
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto"
          >
            See what real users are saying about their experience with AssignFlow Hub.
            Join thousands of satisfied educators and students.
          </motion.p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Buttons */}
          {feedbacks.length > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm border border-white/50 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6 text-slate-700" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm border border-white/50 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300"
              >
                <ChevronRight className="w-6 h-6 text-slate-700" />
              </motion.button>
            </>
          )}

          {/* Carousel Container */}
          <div className="relative h-[400px] overflow-hidden">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
              >
                <div className="h-full flex items-center justify-center px-4">
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="group cursor-pointer relative w-full max-w-3xl mx-auto"
                  >
                    {/* Card Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Main Card */}
                    <div className="relative p-8 bg-white/90 backdrop-blur-sm border border-white/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
                      {/* Quote Icon */}
                      <div className="absolute -top-6 -left-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 p-3 shadow-lg">
                        <Quote className="w-8 h-8 text-white" />
                      </div>

                      {/* Rating Stars */}
                      <div className="flex items-center gap-1 mb-6">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-6 h-6 ${
                              i < feedbacks[currentIndex].rating
                                ? "text-amber-500 fill-amber-500"
                                : "text-slate-300"
                            }`}
                          />
                        ))}
                        <span className="ml-3 text-lg font-semibold text-slate-900">
                          {feedbacks[currentIndex].rating}.0/5.0
                        </span>
                      </div>

                      {/* Testimonial Message */}
                      <motion.blockquote
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-700 italic mb-8 leading-relaxed"
                      >
                        "{feedbacks[currentIndex].message}"
                      </motion.blockquote>

                      {/* Author Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${roleColors[feedbacks[currentIndex].role]} p-1`}>
                            <div className="w-full h-full bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center">
                              {roleIcon(feedbacks[currentIndex].role)}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-lg font-bold ${roleTextColors[feedbacks[currentIndex].role]}`}>
                                {feedbacks[currentIndex].role.charAt(0) + feedbacks[currentIndex].role.slice(1).toLowerCase()}
                              </span>
                              <div className="px-3 py-1 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-full">
                                <span className="text-sm font-medium text-slate-700">
                                  Verified User
                                </span>
                              </div>
                            </div>
                            <p className="text-slate-600">
                              Member since {new Date(feedbacks[currentIndex].createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                        </div>

                        {/* Stats Badge */}
                        <div className="hidden md:block">
                          <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-emerald-50 border border-slate-200 rounded-xl">
                            <div className="text-2xl font-bold text-slate-900">
                              {currentIndex + 1}/{feedbacks.length}
                            </div>
                            <div className="text-sm text-slate-600">Testimonial</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          {feedbacks.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {feedbacks.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-gradient-to-r from-blue-500 to-emerald-500 w-8"
                      : "bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Grid View for Multiple Testimonials (Hidden on mobile) */}
          {feedbacks.length > 1 && (
            <div className="hidden lg:block mt-16">
              <div className="grid grid-cols-3 gap-6">
                {feedbacks.slice(0, 3).map((feedback, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -3 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative p-6 bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                      {/* Role Badge */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roleColors[feedback.role]} p-2`}>
                          {roleIcon(feedback.role)}
                        </div>
                        <div>
                          <div className={`text-sm font-semibold ${roleTextColors[feedback.role]}`}>
                            {feedback.role.charAt(0) + feedback.role.slice(1).toLowerCase()}
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: feedback.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Preview Message */}
                      <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                        {feedback.message}
                      </p>

                      {/* Date */}
                      <div className="text-xs text-slate-500">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
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
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      
    </section>

    <FeedbackCTA />
    </>
  );
};

export default Testimonials;