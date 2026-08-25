import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  RefreshCw,
  Clock,
  AlertCircle,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  BarChart,
  TrendingUp,
  Target,
  Pin,
  PinOff,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  getTeacherAiInsights,
  generateTeacherAiInsights,
  deleteTeacherAiInsight,
  togglePinTeacherAiInsight,
  type TeacherAiInsight,
} from "../services/grade.api";

export const TeacherAiInsightsTab = () => {
  const [insights, setInsights] = useState<TeacherAiInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const limit = 5;

  // Deletion modal state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Pinning loading state
  const [pinningId, setPinningId] = useState<string | null>(null);

  const fetchInsights = async (page: number = currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTeacherAiInsights(page, limit);
      setInsights(data.insights || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
      setCurrentPage(data.currentPage || 1);
    } catch (err: any) {
      console.error("Failed to load insights:", err);
      setError(err?.response?.data?.message || "Failed to load insights history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights(currentPage);
  }, [currentPage]);

  // Cooldown timer
  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Clear success notification after 3s
  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(null), 3000);
      return () => clearTimeout(t);
    }
  }, [successMsg]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      await generateTeacherAiInsights();
      setCooldown(60);
      setSuccessMsg("Fresh AI insight generated successfully!");
      // Refetch page 1 to display the newly generated item
      setCurrentPage(1);
      fetchInsights(1);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to generate insights. Please try again later."
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = (insight: TeacherAiInsight) => {
    const metricsStr =
      insight.metrics && typeof insight.metrics === "object"
        ? Object.entries(insight.metrics)
            .map(([k, v]) => `• ${k}: ${v}`)
            .join("\n")
        : "";
    const actionsStr = Array.isArray(insight.actionItems)
      ? insight.actionItems.map((a, i) => `${i + 1}. ${a}`).join("\n")
      : "";

    const textToCopy = `AI Classroom Performance Insight (${formatDate(insight.generatedAt)})${
      insight.isPinned ? " [PINNED]" : ""
    }\n\nOverview:\n${insight.summary || ""}${
      metricsStr ? `\n\nKey Metrics:\n${metricsStr}` : ""
    }${actionsStr ? `\n\nRecommended Actions:\n${actionsStr}` : ""}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(insight._id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTogglePin = async (insight: TeacherAiInsight) => {
    setPinningId(insight._id);
    setError(null);
    try {
      const res = await togglePinTeacherAiInsight(insight._id);
      setSuccessMsg(res.message);
      // Refresh list to re-order pinned cards
      fetchInsights(currentPage);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update pin status.");
    } finally {
      setPinningId(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteTeacherAiInsight(deletingId);
      setSuccessMsg("Insight removed from history.");
      setDeletingId(null);

      // If this was the only item on the page and we're not on page 1, go back one page
      if (insights.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchInsights(currentPage);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete insight.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-36 h-36" />
        </div>
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                <Sparkles className="w-5 h-5 text-blue-200" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                AI Class Insights &amp; Teaching Advisor
              </h2>
            </div>
            <p className="text-blue-100/80 text-sm sm:text-base leading-relaxed">
              Generate structured, real-time insights based on your global student performance data.
              Track class averages, highlight key student percentiles, and receive actionable interventions.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <button
              onClick={handleGenerate}
              disabled={generating || cooldown > 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg active:scale-95 cursor-pointer ${
                generating || cooldown > 0
                  ? "bg-white/10 text-white/50 cursor-not-allowed border border-white/5"
                  : "bg-white text-indigo-900 hover:bg-blue-50 hover:shadow-white/20"
              }`}
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Data...</span>
                </>
              ) : cooldown > 0 ? (
                <>
                  <Clock className="w-4 h-4" />
                  <span>Wait {cooldown}s</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate New Insights</span>
                </>
              )}
            </button>
            <span className="text-xs text-blue-200/60 font-medium">
              Rate limit: 10 generations per 10 mins
            </span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-start gap-3 shadow-xs"
        >
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-500" />
          <div className="text-sm font-medium flex-1">{error}</div>
        </motion.div>
      )}

      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 shadow-xs"
        >
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-sm font-semibold">{successMsg}</div>
        </motion.div>
      )}

      {/* 2. History Feed Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 pt-2">
        <div className="flex items-center gap-2.5">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Insights History
          </h3>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200/80 text-slate-700">
            {totalCount} {totalCount === 1 ? "Snapshot" : "Snapshots"}
          </span>
        </div>

        <p className="text-xs text-slate-500 flex items-center gap-1.5">
          <Pin className="w-3.5 h-3.5 text-amber-500" />
          <span>You can pin up to 3 priority insights to the top</span>
        </p>
      </div>

      {/* 3. Loading State */}
      {loading && insights.length === 0 && (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl border border-slate-200/60 shadow-xs">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-3" />
          <p className="text-slate-600 font-medium text-sm">Loading performance insights...</p>
        </div>
      )}

      {/* 4. History Cards Feed */}
      <div className="space-y-5">
        <AnimatePresence mode="popLayout">
          {insights.map((insight, index) => {
            const isPinned = Boolean(insight.isPinned);

            return (
              <motion.div
                key={insight._id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md ${
                  isPinned
                    ? "border-amber-300 ring-2 ring-amber-400/20 shadow-amber-500/5"
                    : "border-slate-200/70"
                }`}
              >
                {/* Card Header Bar */}
                <div
                  className={`px-6 py-4 border-b flex flex-wrap items-center justify-between gap-3 ${
                    isPinned
                      ? "bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-white border-amber-200/80"
                      : "bg-slate-50/70 border-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-2xs shrink-0 ${
                        isPinned
                          ? "bg-amber-500 text-white"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {isPinned ? <Pin className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                          Performance Snapshot
                        </h4>
                        {isPinned && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                            <Pin className="w-3 h-3 fill-amber-600" />
                            PINNED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        Generated on {formatDate(insight.generatedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-xs p-1 rounded-xl border border-slate-200 shadow-2xs">
                    {/* Pin / Unpin Button */}
                    <button
                      onClick={() => handleTogglePin(insight)}
                      disabled={pinningId === insight._id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isPinned
                          ? "bg-amber-100/80 text-amber-800 hover:bg-amber-200"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                      title={isPinned ? "Unpin this insight" : "Pin to top (max 3)"}
                    >
                      {pinningId === insight._id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : isPinned ? (
                        <>
                          <PinOff className="w-3.5 h-3.5 text-amber-700" />
                          <span>Unpin</span>
                        </>
                      ) : (
                        <>
                          <Pin className="w-3.5 h-3.5" />
                          <span>Pin</span>
                        </>
                      )}
                    </button>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(insight)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
                      title="Copy formatted summary to clipboard"
                    >
                      {copiedId === insight._id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => setDeletingId(insight._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete insight"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 space-y-6">
                  {/* Summary Callout */}
                  <div className="bg-slate-50/80 border-l-4 border-blue-500 rounded-r-2xl p-4">
                    <p className="text-slate-800 leading-relaxed text-sm sm:text-base font-medium">
                      {insight.summary}
                    </p>
                  </div>

                  {/* Metrics KPI Grid */}
                  {insight.metrics &&
                    typeof insight.metrics === "object" &&
                    Object.keys(insight.metrics).length > 0 && (
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
                          Snapshot Key Metrics
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {Object.entries(insight.metrics).map(([key, value], i) => (
                            <div
                              key={i}
                              className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs hover:border-blue-200 transition-colors"
                            >
                              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide truncate">
                                {key}
                              </p>
                              <p className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                                {value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Recommended Actions */}
                  {Array.isArray(insight.actionItems) && insight.actionItems.length > 0 && (
                    <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/40 rounded-2xl p-5 border border-blue-100">
                      <h5 className="font-bold text-blue-900 text-sm flex items-center gap-2 mb-3.5">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span>Recommended Pedagogical Actions</span>
                      </h5>
                      <div className="space-y-2.5">
                        {insight.actionItems.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white/80 backdrop-blur-xs rounded-xl p-3 border border-blue-100/80 flex items-start gap-3 shadow-2xs"
                          >
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="text-slate-800 text-xs sm:text-sm leading-snug">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 5. Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 px-2">
          <p className="text-xs text-slate-500 font-medium">
            Showing Page <strong className="text-slate-800">{currentPage}</strong> of{" "}
            <strong className="text-slate-800">{totalPages}</strong> ({totalCount} total snapshots)
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Page number buttons */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  disabled={loading}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || loading}
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 6. Empty State */}
      {insights.length === 0 && !loading && !error && (
        <div className="flex flex-col items-center justify-center p-16 bg-slate-50/50 rounded-3xl border border-slate-200/80 border-dashed text-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 text-blue-400">
            <BarChart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1.5">No Performance Snapshots Yet</h3>
          <p className="text-slate-500 max-w-md text-xs sm:text-sm leading-relaxed mb-6">
            Click the "Generate New Insights" button above to evaluate current student grades,
            distributions, and trends across all your classrooms.
          </p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate First Snapshot</span>
          </button>
        </div>
      )}

      {/* 7. Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3 text-red-600">
                <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Delete Insight?</h4>
                  <p className="text-xs text-slate-500">This action cannot be undone.</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Are you sure you want to remove this performance snapshot from your history?
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  onClick={() => setDeletingId(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Snapshot</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
