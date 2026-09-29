import { useState, type FormEvent } from "react";
import { ArrowRight, Check, AlertCircle, BookOpen } from "lucide-react";
import { subscribeNewsletter } from "../services/newsletter.api";

type SubmitStatus = {
  type: "success" | "error" | "info";
  text: string;
} | null;

const NewsletterSubscribe = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>(null);

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await subscribeNewsletter({
        email: trimmed,
        source: "website",
      });

      if (res.alreadySubscribed) {
        setStatus({ type: "info", text: res.message || "You're already subscribed to teaching updates." });
      } else if (res.resubscribed) {
        setStatus({ type: "success", text: res.message || "Welcome back! Subscribed to classroom updates." });
      } else {
        setStatus({ type: "success", text: res.message || "Subscribed. You will receive educational tips and updates." });
      }
      setEmail("");
    } catch (err: any) {
      setStatus({
        type: "error",
        text: err?.response?.data?.message || "Unable to subscribe. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 border-t border-slate-200 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="border border-slate-200 rounded-2xl p-6 sm:p-8 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xs">
          <div className="max-w-md space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>Teaching &amp; Classroom Updates</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Stay updated on teaching tools and tips.
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Occasional highlights featuring grading shortcuts, assignment templates, and platform improvements. Zero spam.
            </p>
          </div>

          <div className="w-full md:w-auto md:min-w-[340px]">
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="teacher@school.edu"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status) setStatus(null);
                  }}
                  className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-colors"
                  disabled={loading}
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 cursor-pointer shrink-0 shadow-2xs"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {status && (
                <div
                  className={`flex items-center gap-1.5 text-xs pt-1 ${
                    status.type === "error"
                      ? "text-rose-600"
                      : status.type === "info"
                      ? "text-blue-600"
                      : "text-emerald-700"
                  }`}
                >
                  {status.type === "error" ? (
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <Check className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>{status.text}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSubscribe;