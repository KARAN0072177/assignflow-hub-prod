import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Check, AlertCircle, Sparkles } from "lucide-react";
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
        setStatus({ type: "info", text: res.message || "You're already on the list." });
      } else if (res.resubscribed) {
        setStatus({ type: "success", text: res.message || "Welcome back. You're subscribed again." });
      } else {
        setStatus({ type: "success", text: res.message || "Subscribed. Check your inbox." });
      }
      setEmail("");
    } catch (err: any) {
      setStatus({
        type: "error",
        text: err?.response?.data?.message || "Something went wrong. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-xl mx-auto px-6 lg:px-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Monthly Digest</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            Product &amp; Educational Updates
          </h3>
          <p className="text-sm text-slate-500">
            New platform features, grading shortcuts, and classroom tools. Zero spam.
          </p>
        </div>

        <form onSubmit={handleSubscribe} className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="you@school.edu"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status) setStatus(null);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                disabled={loading}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {status && (
            <div
              className={`flex items-center gap-2 text-sm ${
                status.type === "error"
                  ? "text-rose-600"
                  : status.type === "info"
                  ? "text-blue-600"
                  : "text-emerald-600"
              }`}
            >
              {status.type === "error" ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <Check className="w-4 h-4 shrink-0" />
              )}
              <span>{status.text}</span>
            </div>
          )}
        </form>
      </motion.div>
    </section>
  );
};

export default NewsletterSubscribe;