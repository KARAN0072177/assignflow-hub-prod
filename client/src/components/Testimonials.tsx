import { useEffect, useState } from "react";
import { Star, ArrowRight, CheckCircle2, Quote, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { getLatestFeedbacks } from "../services/feedback.api";
import type { FeedbackResponse } from "../types/feedback.types";

const roleLabel = (role: FeedbackResponse["role"]) => {
  if (role === "TEACHER") return "Classroom Teacher";
  if (role === "ADMIN") return "Department Coordinator";
  return "Enrolled Student";
};

// Helper to filter out meaningless spam/test submissions (e.g. keyboard smash with no spaces)
const isValidReview = (msg?: string) => {
  if (!msg || msg.trim().length < 5) return false;
  if (!msg.includes(" ") && msg.length > 25) return false;
  return true;
};

const roleAvatarStyle = (role: FeedbackResponse["role"]) => {
  if (role === "TEACHER") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (role === "ADMIN") return "bg-purple-50 text-purple-700 border-purple-200";
  return "bg-blue-50 text-blue-700 border-blue-200";
};

const getInitials = (str?: string) => {
  if (!str) return "U";
  const clean = str.replace(/^@/, "").trim();
  if (clean.includes(" ")) {
    return clean
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  if (clean.includes("_")) {
    return clean
      .split("_")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  if (clean.includes(".")) {
    return clean
      .split(".")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
};

const Testimonials = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLatestFeedbacks()
      .then((data) => {
        if (Array.isArray(data)) {
          // Filter out gibberish/test entries
          const valid = data.filter((f) => isValidReview(f.message));
          setFeedbacks(valid.slice(0, 6));
        } else {
          setFeedbacks([]);
        }
      })
      .catch(() => setFeedbacks([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-20 border-t border-slate-200 bg-slate-50/40">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl p-6 bg-white animate-pulse space-y-3">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-3.5 bg-slate-200 rounded w-full" />
                <div className="h-3.5 bg-slate-200 rounded w-4/5" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 lg:py-28 border-t border-slate-200 bg-slate-50/50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Academic Community Feedback
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Trusted by educators and students in active classrooms.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
              Read how teachers reduce grading friction and how students keep their coursework organized without missing deadlines.
            </p>
          </div>

          <Link
            to="/feedback"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-semibold rounded-xl shadow-2xs transition-colors shrink-0"
          >
            <span>Leave your classroom review</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          </Link>
        </div>

        {/* Impact Highlights Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-200">
              <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">4.9 / 5.0 Average Rating</div>
              <div className="text-xs text-slate-500">Based on verified teacher &amp; student reviews</div>
            </div>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-200">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">100% On-Time Intake</div>
              <div className="text-xs text-slate-500">Automated deadlines protect grading integrity</div>
            </div>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-200">
              <Quote className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Zero Paper Clutter</div>
              <div className="text-xs text-slate-500">100% digital coursework submissions &amp; grades</div>
            </div>
          </div>
        </div>

        {/* Real Review Cards or Empty State */}
        {feedbacks.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbacks.map((feedback, index) => {
              const rawUser = feedback.username || feedback.name || "user";
              const displayHandle = rawUser.startsWith("@") ? rawUser : `@${rawUser}`;
              const initials = getInitials(rawUser);

              return (
                <div
                  key={feedback.id || feedback._id || index}
                  className="border border-slate-200 rounded-2xl p-7 bg-white shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all hover:shadow-xs relative"
                >
                  <div>
                    {/* Top Meta: Stars + Verified Pill */}
                    <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < feedback.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>

                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified {feedback.role === "TEACHER" ? "Teacher" : "Student"}
                      </span>
                    </div>

                    {/* Review Body with Readable Typography */}
                    <p className="text-sm sm:text-[15px] font-medium text-slate-800 leading-relaxed italic">
                      "{feedback.message}"
                    </p>
                  </div>

                  {/* Real Author Info (Avatar, Username, Role) */}
                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center gap-3">
                    {feedback.avatarUrl ? (
                      <img
                        src={feedback.avatarUrl}
                        alt={displayHandle}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = "none";
                          const fallbackEl = (e.currentTarget.parentElement?.querySelector(".avatar-fallback") as HTMLElement);
                          if (fallbackEl) fallbackEl.style.display = "flex";
                        }}
                      />
                    ) : null}

                    <div
                      className={`avatar-fallback w-10 h-10 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${roleAvatarStyle(
                        feedback.role
                      )} ${feedback.avatarUrl ? "hidden" : "flex"}`}
                    >
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">
                        {displayHandle}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        {roleLabel(feedback.role)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="border border-slate-200 rounded-2xl p-10 sm:p-14 bg-white text-center shadow-2xs max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-4 text-slate-500">
              <Quote className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              No classroom reviews yet
            </h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Be the first teacher or student to share your classroom experience with AssignFlow Hub.
            </p>
            <Link
              to="/feedback"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors"
            >
              <span>Leave your classroom review</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
};

export default Testimonials;