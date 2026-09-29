import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  LogIn,
  UserCheck,
  ShieldCheck,
  Quote,
} from "lucide-react";
import { submitFeedback, getLatestFeedbacks } from "../services/feedback.api";
import { getMe } from "../services/auth.api";
import type { FeedbackResponse } from "../types/feedback.types";
import type { UserProfile } from "../types/auth.types";
import { Helmet } from "react-helmet-async";

const roleLabel = (role?: string) => {
  if (role === "TEACHER") return "Classroom Teacher";
  if (role === "ADMIN") return "Department Coordinator";
  return "Enrolled Student";
};

const roleBadgeStyle = (role?: string) => {
  if (role === "TEACHER") return "bg-emerald-50 text-emerald-800 border-emerald-200";
  if (role === "ADMIN") return "bg-purple-50 text-purple-800 border-purple-200";
  return "bg-blue-50 text-blue-800 border-blue-200";
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

const getRatingDescriptor = (stars: number) => {
  switch (stars) {
    case 5:
      return "5.0 / 5.0 — Outstanding Experience";
    case 4:
      return "4.0 / 5.0 — Very Good";
    case 3:
      return "3.0 / 5.0 — Satisfactory";
    case 2:
      return "2.0 / 5.0 — Needs Improvement";
    case 1:
      return "1.0 / 5.0 — Poor Experience";
    default:
      return `${stars}.0 / 5.0`;
  }
};

const FeedbackPage = () => {
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Recent community reviews
  const [communityFeedbacks, setCommunityFeedbacks] = useState<FeedbackResponse[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      getMe()
        .then((user) => {
          setCurrentUser(user);
        })
        .catch(() => {
          const storedUsername = localStorage.getItem("username");
          const storedRole = localStorage.getItem("userRole") as any;
          const storedAvatar = localStorage.getItem("userAvatar");
          if (storedUsername || storedRole) {
            setCurrentUser({
              username: storedUsername || "",
              role: storedRole || "STUDENT",
              avatarUrl: storedAvatar || undefined,
            } as any);
          }
        })
        .finally(() => setAuthChecked(true));
    } else {
      setAuthChecked(true);
    }

    // Load recent reviews
    getLatestFeedbacks()
      .then((data) => {
        if (Array.isArray(data)) {
          setCommunityFeedbacks(data.filter((f) => f.message && f.message.trim().length >= 8));
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("You must be logged in to submit a verified classroom review.");
      return;
    }

    const trimmed = message.trim();
    if (trimmed.length < 10) {
      setError("Please provide feedback with at least 10 characters.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await submitFeedback({ rating, message: trimmed }, token);

      setSuccess(true);
      setMessage("");
      setRating(5);

      // Instantly prepend new feedback to community list
      if (res && res.feedback) {
        setCommunityFeedbacks((prev) => [res.feedback, ...prev]);
      } else if (currentUser) {
        const optimisticReview: FeedbackResponse = {
          id: Date.now().toString(),
          username: currentUser.username || "You",
          name: currentUser.username || "You",
          avatarUrl: currentUser.avatarUrl || null,
          role: (currentUser.role as any) || "STUDENT",
          rating,
          message: trimmed,
          createdAt: new Date().toISOString(),
        };
        setCommunityFeedbacks((prev) => [optimisticReview, ...prev]);
      }

      // Auto clear success notice after 6 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 6000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentHandle = currentUser?.username
    ? currentUser.username.startsWith("@")
      ? currentUser.username
      : `@${currentUser.username}`
    : "@your_username";

  const currentInitials = getInitials(currentUser?.username || "You");

  return (
    <>
      <Helmet>
        <title>Submit Classroom Feedback | AssignFlow Hub</title>
        <meta
          name="description"
          content="Share your experience with AssignFlow Hub. Reviews display your real academic role, rating, and verified username to help fellow educators and students."
        />
        <link rel="canonical" href="https://assignflowhub.karanart.com/feedback" />
      </Helmet>

      <div className="min-h-screen bg-slate-50/60 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="max-w-2xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Community Voice &amp; Evaluation
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Classroom Experience &amp; Feedback
            </h1>
            <p className="text-base sm:text-lg text-slate-600 mt-2 leading-relaxed">
              Your feedback is displayed publicly alongside your verified academic role and username, helping educators and students evaluate classroom workflows.
            </p>
          </div>

          {/* Form & Live Preview Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-start mb-16">
            
            {/* Left: Input Form (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs">
              
              {/* Authenticated User Status Bar */}
              {authChecked && (
                <div className="mb-6 p-4 rounded-xl border bg-slate-50/80 flex items-center justify-between gap-3">
                  {currentUser ? (
                    <div className="flex items-center gap-3 min-w-0">
                      {currentUser.avatarUrl ? (
                        <img
                          src={currentUser.avatarUrl}
                          alt={currentHandle}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div
                          className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${roleBadgeStyle(
                            currentUser.role
                          )}`}
                        >
                          {currentInitials}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 truncate">
                            {currentHandle}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          Submitting as {roleLabel(currentUser.role)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full gap-3">
                      <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>Sign in to submit a verified classroom review with your profile.</span>
                      </div>
                      <Link
                        to="/login"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shrink-0 transition-colors"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Sign In</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Rating Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-slate-900">
                      Overall Platform Rating
                    </label>
                    <span className="text-xs font-semibold text-slate-700">
                      {getRatingDescriptor(hoveredStar || rating)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(null)}
                        className="p-1 rounded-md transition-transform hover:scale-110 focus:outline-hidden"
                        aria-label={`Rate ${star} star`}
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            star <= (hoveredStar || rating)
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-auto text-sm font-extrabold text-slate-900">
                      {rating}.0 <span className="text-slate-400 font-normal text-xs">/ 5.0</span>
                    </span>
                  </div>
                </div>

                {/* Review Message Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="feedback-message" className="text-sm font-bold text-slate-900">
                      Your Classroom Review
                    </label>
                    <span className="text-xs text-slate-500 font-mono">
                      {message.length} / 300
                    </span>
                  </div>

                  <textarea
                    id="feedback-message"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      setError(null);
                    }}
                    rows={5}
                    maxLength={300}
                    placeholder="Share how AssignFlow Hub helps you manage coursework, grade submissions, or keep up with automated deadlines..."
                    className="w-full p-4 border border-slate-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all resize-none"
                  />

                  {message.length > 0 && message.length < 10 && (
                    <div className="mt-2 text-xs text-amber-600 font-medium flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{10 - message.length} more characters required for review minimum</span>
                    </div>
                  )}
                </div>

                {/* Transparency Note */}
                <div className="text-xs text-slate-500 flex items-start gap-2 bg-slate-50/70 p-3 rounded-lg border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    Your real username, academic role ({roleLabel(currentUser?.role)}), avatar, and rating will be publicly shown on verified reviews to ensure authenticity.
                  </span>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-sm text-rose-800">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">Submission failed</div>
                      <div className="text-xs text-rose-700 mt-0.5">{error}</div>
                    </div>
                  </div>
                )}

                {/* Success Banner */}
                {success && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-sm text-emerald-900">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">Review published successfully!</div>
                      <div className="text-xs text-emerald-700 mt-0.5">
                        Your review has been verified and added to the classroom community showcase below.
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={loading || message.trim().length < 10 || !currentUser}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white disabled:text-slate-400 text-sm font-semibold rounded-xl shadow-2xs transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Publishing Review...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>
                        {!currentUser
                          ? "Sign in to Submit Review"
                          : message.trim().length < 10
                          ? "Enter at least 10 characters"
                          : "Publish Classroom Review"}
                      </span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right: Live Interactive Card Preview (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Live Public Review Preview
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Real-time rendering
                </span>
              </div>

              {/* The Live Rendered Card */}
              <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-2xs relative flex flex-col justify-between min-h-[220px]">
                <div>
                  {/* Card Header: Stars + Verified Pill */}
                  <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified {currentUser?.role === "TEACHER" ? "Teacher" : "Student"}
                    </span>
                  </div>

                  {/* Review Text Body */}
                  <p className="text-sm font-medium text-slate-800 leading-relaxed italic">
                    "{message.trim() || "Your classroom feedback and comments will appear here live as you type..."}"
                  </p>
                </div>

                {/* Author Metadata Footer */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-3">
                  {currentUser?.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentHandle}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div
                      className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${roleBadgeStyle(
                        currentUser?.role
                      )}`}
                    >
                      {currentInitials}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">
                      {currentHandle}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      {roleLabel(currentUser?.role)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Informative Guidance */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>Real Academic Verification</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Unlike generic anonymous testimonials, AssignFlow Hub connects every review to an authenticated user account with their real username, avatar, and academic role.
                </p>
              </div>
            </div>

          </div>

          {/* Community Reviews Showcase Section */}
          <div className="pt-10 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Verified Classroom Reviews
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Read genuine feedback from students and teachers actively using AssignFlow Hub.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shrink-0">
                {communityFeedbacks.length} Verified Reviews
              </span>
            </div>

            {/* Grid of Community Reviews */}
            {communityFeedbacks.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {communityFeedbacks.map((item, index) => {
                  const rawUser = item.username || item.name || "user";
                  const displayHandle = rawUser.startsWith("@") ? rawUser : `@${rawUser}`;
                  const initials = getInitials(rawUser);

                  return (
                    <div
                      key={item.id || item._id || index}
                      className="border border-slate-200 rounded-2xl p-6 bg-white shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all hover:shadow-xs"
                    >
                      <div>
                        {/* Rating + Badge */}
                        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < item.rating
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-slate-200"
                                }`}
                              />
                            ))}
                          </div>

                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified {item.role === "TEACHER" ? "Teacher" : "Student"}
                          </span>
                        </div>

                        {/* Review Content */}
                        <p className="text-sm font-medium text-slate-800 leading-relaxed italic">
                          "{item.message}"
                        </p>
                      </div>

                      {/* Author Info */}
                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-3">
                        {item.avatarUrl ? (
                          <img
                            src={item.avatarUrl}
                            alt={displayHandle}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div
                            className={`w-9 h-9 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${roleBadgeStyle(
                              item.role
                            )}`}
                          >
                            {initials}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-900 truncate">
                            {displayHandle}
                          </div>
                          <div className="text-xs text-slate-500 font-medium">
                            {roleLabel(item.role)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl p-8">
                <Quote className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <div className="text-sm font-bold text-slate-800">No community reviews yet</div>
                <div className="text-xs text-slate-500 mt-1">
                  Be the first to share your classroom experience above!
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default FeedbackPage;