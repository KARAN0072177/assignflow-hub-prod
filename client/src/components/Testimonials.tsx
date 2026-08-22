import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { getLatestFeedbacks } from "../services/feedback.api";
import type { FeedbackResponse } from "../types/feedback.types";
import FeedbackCTA from "./FeedbackCTA";

const roleLabel = (role: FeedbackResponse["role"]) => {
  if (role === "TEACHER") return "Teacher";
  if (role === "ADMIN") return "Admin";
  return "Student";
};

const roleColor = (role: FeedbackResponse["role"]) => {
  if (role === "TEACHER") return "bg-blue-100 text-blue-700";
  if (role === "ADMIN") return "bg-purple-100 text-purple-700";
  return "bg-emerald-100 text-emerald-700";
};

const Testimonials = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    getLatestFeedbacks()
      .then((data) => {
        if (Array.isArray(data)) setFeedbacks(data);
        else setFeedbacks([]);
      })
      .catch(() => setFeedbacks([]))
      .finally(() => setLoading(false));
  }, []);

  const displayedFeedbacks = showAll ? feedbacks : feedbacks.slice(0, 6);

  if (loading) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-8 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-4" />
                <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                <div className="h-4 bg-slate-200 rounded w-5/6 mb-8" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-24" />
                    <div className="h-2 bg-slate-200 rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No reviews yet</h3>
          <p className="text-slate-500">Be the first to share your experience.</p>
        </div>
        <FeedbackCTA />
      </section>
    );
  }

  return (
    <>
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
              What educators &amp; students are saying
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Real feedback from teachers and students using AssignFlow Hub to streamline their academic workflow.
            </p>
          </motion.div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedFeedbacks.map((feedback, index) => (
              <motion.div
                key={feedback.id || index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ delay: (index % 3) * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-slate-50 rounded-2xl p-8 hover:bg-slate-100/80 transition-colors duration-200"
              >
                {/* Large decorative quote mark */}
                <Quote className="absolute top-6 right-6 w-8 h-8 text-slate-200 group-hover:text-slate-300 transition-colors" />

                {/* Stars */}
                {feedback.rating > 0 && (
                  <div className="flex items-center gap-0.5 mb-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < feedback.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Quote */}
                <p className="text-[15px] text-slate-700 leading-relaxed mb-8 relative z-10">
                  {feedback.message}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${roleColor(
                      feedback.role
                    )}`}
                  >
                    {feedback.name
                      ? feedback.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : roleLabel(feedback.role).slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      {feedback.name || `Verified ${roleLabel(feedback.role)}`}
                    </div>
                    <div className="text-xs text-slate-500">
                      {roleLabel(feedback.role)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Show more */}
          {feedbacks.length > 6 && !showAll && (
            <div className="mt-12 text-center">
              <button
                onClick={() => setShowAll(true)}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Show all {feedbacks.length} reviews
              </button>
            </div>
          )}
        </div>
      </section>

      <FeedbackCTA />
    </>
  );
};

export default Testimonials;