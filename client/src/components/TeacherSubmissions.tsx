import React, { useEffect, useState, useMemo } from "react";
import { getSubmissionsForAssignment } from "../services/submission.api";
import { saveGrade } from "../services/grade.api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Download,
  Award,
  CheckCircle2,
  Edit2,
  Send,
  AlertCircle,
  Loader2,
  Calendar,
  Search,
  ChevronDown,
  ChevronUp,
  Clock,
  Filter,
  Check,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  UserCheck
} from "lucide-react";
import { UserProfileHoverCard } from "./UserProfileHoverCard";

/* =======================
   Types
   ======================= */

export interface Submission {
  id: string;
  student: {
    id: string;
    email: string;
  };
  state: "DRAFT" | "SUBMITTED" | "LOCKED";
  submittedAt: string;
  downloadUrl?: string | null;
  grade?: {
    id: string;
    score: number;
    feedback?: string;
    published: boolean;
  } | null;
}

interface Props {
  assignmentId: string;
  dueDate?: string;
}

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50];

const TeacherSubmissions = ({ assignmentId, dueDate }: Props) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  // Filters, Search & Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState<"ALL" | "PENDING" | "GRADED">("ALL");
  const [sortBy, setSortBy] = useState<"NEWEST" | "OLDEST" | "SCORE_HIGH" | "SCORE_LOW">("NEWEST");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeGradingId, setActiveGradingId] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSubmissionsForAssignment(assignmentId);
      setSubmissions(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  // Derived Stats
  const stats = useMemo(() => {
    const total = submissions.length;
    const graded = submissions.filter((s) => s.grade && s.grade.published).length;
    const pending = total - graded;
    const percentage = total > 0 ? Math.round((graded / total) * 100) : 0;

    const scores = submissions
      .filter((s) => s.grade && typeof s.grade.score === "number")
      .map((s) => s.grade!.score);
    const avgScore =
      scores.length > 0
        ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
        : null;

    return { total, graded, pending, percentage, avgScore };
  }, [submissions]);

  // Filtered & Sorted Submissions
  const filteredSubmissions = useMemo(() => {
    let result = submissions.filter((s) => {
      // Search by student email
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        if (!s.student.email.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Filter tabs
      if (filterTab === "PENDING") {
        return !s.grade || !s.grade.published;
      }
      if (filterTab === "GRADED") {
        return s.grade && s.grade.published;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "NEWEST") {
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      }
      if (sortBy === "OLDEST") {
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      }
      if (sortBy === "SCORE_HIGH") {
        const scoreA = a.grade?.score ?? -1;
        const scoreB = b.grade?.score ?? -1;
        return scoreB - scoreA;
      }
      if (sortBy === "SCORE_LOW") {
        const scoreA = a.grade?.score ?? 101;
        const scoreB = b.grade?.score ?? 101;
        return scoreA - scoreB;
      }
      return 0;
    });

    return result;
  }, [submissions, searchTerm, filterTab, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredSubmissions.length / pageSize));
  const paginatedSubmissions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSubmissions.slice(start, start + pageSize);
  }, [filteredSubmissions, currentPage, pageSize]);

  // Reset to page 1 on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterTab, pageSize]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isLate = (submittedDate: string) => {
    if (!dueDate) return false;
    return new Date(submittedDate) > new Date(dueDate);
  };

  return (
    <div className="w-full">
      {/* Trigger Button & Status Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-xs active:scale-95 ${
            expanded
              ? "bg-blue-700 text-white shadow-blue-500/20"
              : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md hover:shadow-blue-500/20"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Submissions</span>
          <span className="px-2 py-0.5 bg-blue-900/40 text-blue-100 text-xs font-bold rounded-full">
            {submissions.length}
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 ml-0.5" />
          ) : (
            <ChevronDown className="w-4 h-4 ml-0.5" />
          )}
        </button>

        {submissions.length > 0 && (
          <div className="flex items-center gap-2.5 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200/60">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>{stats.graded} graded</span>
            </span>

            {stats.pending > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-medium border border-amber-200/60">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>{stats.pending} pending</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Expanded Submissions Drawer / Panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-5 pt-5 border-t border-slate-200 space-y-5"
          >
            {/* Loading state */}
            {loading && (
              <div className="py-8 text-center text-slate-600 flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <span className="text-sm font-medium">Loading submissions...</span>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!loading && !error && submissions.length === 0 && (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">
                  No Submissions Received Yet
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Enrolled students have not submitted work for this assignment yet.
                </p>
              </div>
            )}

            {!loading && !error && submissions.length > 0 && (
              <>
                {/* 1. Progress Banner & Quick Summary */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-blue-600" />
                      <h4 className="text-sm font-bold text-slate-900">
                        Grading Progress
                      </h4>
                      <span className="text-xs text-slate-500 font-medium">
                        ({stats.graded} of {stats.total} submissions completed)
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-semibold">
                      {stats.avgScore && (
                        <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700">
                          Avg Score: <strong className="text-blue-700">{stats.avgScore}%</strong>
                        </span>
                      )}
                      <span className="px-2.5 py-1 bg-blue-600 text-white rounded-lg">
                        {stats.percentage}% Done
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.percentage}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full"
                    />
                  </div>
                </div>

                {/* 2. Search, Filter Tabs & Sorting Toolbar */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                  {/* Left: Filter Tabs */}
                  <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/60 overflow-x-auto shrink-0">
                    <button
                      onClick={() => setFilterTab("ALL")}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        filterTab === "ALL"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      All ({submissions.length})
                    </button>
                    <button
                      onClick={() => setFilterTab("PENDING")}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        filterTab === "PENDING"
                          ? "bg-amber-500 text-white shadow-xs"
                          : "text-slate-600 hover:text-amber-700"
                      }`}
                    >
                      Needs Grading ({stats.pending})
                    </button>
                    <button
                      onClick={() => setFilterTab("GRADED")}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        filterTab === "GRADED"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-emerald-700"
                      }`}
                    >
                      Graded ({stats.graded})
                    </button>
                  </div>

                  {/* Right: Search & Sort Controls */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 grow md:grow-0">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-60">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search student email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Filter className="w-3.5 h-3.5 text-slate-400" />
                      <select
                        value={sortBy}
                        onChange={(e: any) => setSortBy(e.target.value)}
                        className="py-1.5 px-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                      >
                        <option value="NEWEST">Newest First</option>
                        <option value="OLDEST">Oldest First</option>
                        <option value="SCORE_HIGH">Highest Score</option>
                        <option value="SCORE_LOW">Lowest Score</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. High-Density Submissions Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white">
                  {paginatedSubmissions.length === 0 ? (
                    <div className="py-12 text-center text-slate-500">
                      <Search className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <p className="text-sm font-semibold text-slate-700">
                        No submissions match your filter
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Try clearing search term or switching to "All" tab.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                            <th className="py-3 pl-4 w-12">#</th>
                            <th className="py-3">Student</th>
                            <th className="py-3">Submitted Date</th>
                            <th className="py-3">Attachment</th>
                            <th className="py-3">Grade Status</th>
                            <th className="py-3 pr-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                          {paginatedSubmissions.map((submission, index) => {
                            const globalIndex =
                              (currentPage - 1) * pageSize + index + 1;
                            const isRowGrading =
                              activeGradingId === submission.id;
                            const late = isLate(submission.submittedAt);
                            const studentUsername = (submission.student as any).username;
                            const displayName = studentUsername
                              ? `@${studentUsername}`
                              : submission.student.email.split("@")[0];
                            const initial = (studentUsername ? studentUsername[0] : submission.student.email[0] || "S").toUpperCase();

                            return (
                              <React.Fragment key={submission.id}>
                                <tr
                                  className={`transition-colors ${
                                    isRowGrading
                                      ? "bg-blue-50/40"
                                      : "hover:bg-slate-50/70"
                                  }`}
                                >
                                  {/* Index */}
                                  <td className="py-3.5 pl-4 text-xs font-mono text-slate-400">
                                    {globalIndex}
                                  </td>

                                  {/* Student Name, Avatar & Email */}
                                  <td className="py-3.5">
                                    <UserProfileHoverCard
                                      identifier={displayName}
                                      userId={submission.student.id}
                                      fallbackName={displayName}
                                      fallbackRole="STUDENT"
                                    >
                                      <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full aspect-square bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs shrink-0 overflow-hidden ring-1 ring-slate-200">
                                          {(submission.student as any).avatarUrl ? (
                                            <img
                                              src={(submission.student as any).avatarUrl}
                                              alt={displayName}
                                              className="w-full h-full object-cover"
                                            />
                                          ) : (
                                            initial
                                          )}
                                        </div>
                                        <div className="truncate max-w-[180px] sm:max-w-[240px]">
                                          <p className="font-semibold text-slate-900 text-xs sm:text-sm group-hover:text-blue-600 transition-colors truncate">
                                            {displayName}
                                          </p>
                                          <p className="text-[11px] text-slate-500 font-mono truncate">
                                            {submission.student.email}
                                          </p>
                                        </div>
                                      </div>
                                    </UserProfileHoverCard>
                                  </td>

                                  {/* Submitted Date & Late Badge */}
                                  <td className="py-3.5">
                                    <div className="flex flex-col gap-0.5">
                                      <span className="text-xs text-slate-600 flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-slate-400" />
                                        {formatDate(submission.submittedAt)}
                                      </span>
                                      {late && (
                                        <span className="inline-flex items-center text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.2 rounded border border-red-200 w-fit">
                                          Late Submission
                                        </span>
                                      )}
                                    </div>
                                  </td>

                                  {/* Attachment Download */}
                                  <td className="py-3.5">
                                    {submission.downloadUrl ? (
                                      <a
                                        href={submission.downloadUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors"
                                        title="Download Submitted File"
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                        <span>Download</span>
                                      </a>
                                    ) : (
                                      <span className="text-xs text-slate-400">
                                        No file attached
                                      </span>
                                    )}
                                  </td>

                                  {/* Grade Status Badge */}
                                  <td className="py-3.5">
                                    {submission.grade?.published ? (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                        {submission.grade.score}/100
                                      </span>
                                    ) : submission.grade ? (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200">
                                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                                        Draft ({submission.grade.score}/100)
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                        Needs Grading
                                      </span>
                                    )}
                                  </td>

                                  {/* Action */}
                                  <td className="py-3.5 pr-4 text-right">
                                    <button
                                      onClick={() =>
                                        setActiveGradingId(
                                          isRowGrading ? null : submission.id
                                        )
                                      }
                                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                        isRowGrading
                                          ? "bg-slate-200 text-slate-800"
                                          : submission.grade?.published
                                          ? "bg-white border border-slate-300 hover:border-blue-400 text-slate-700 hover:text-blue-700 shadow-2xs"
                                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                                      }`}
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                      <span>
                                        {isRowGrading
                                          ? "Close"
                                          : submission.grade?.published
                                          ? "Edit Grade"
                                          : "Grade"}
                                      </span>
                                    </button>
                                  </td>
                                </tr>

                                {/* Interactive Inline Grading Drawer */}
                                {isRowGrading && (
                                  <tr>
                                    <td
                                      colSpan={6}
                                      className="p-0 bg-slate-50/80 border-b border-blue-100"
                                    >
                                      <InlineGradingCard
                                        submission={submission}
                                        onUpdated={() => {
                                          fetchSubmissions();
                                        }}
                                        onClose={() => setActiveGradingId(null)}
                                      />
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* 4. Pagination Footer */}
                  {filteredSubmissions.length > 0 && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <span>Showing</span>
                        <span className="font-semibold text-slate-900">
                          {(currentPage - 1) * pageSize + 1}-
                          {Math.min(
                            currentPage * pageSize,
                            filteredSubmissions.length
                          )}
                        </span>
                        <span>of</span>
                        <span className="font-semibold text-slate-900">
                          {filteredSubmissions.length}
                        </span>
                        <span>submissions</span>

                        <span className="mx-2 text-slate-300">|</span>

                        <label className="flex items-center gap-1.5">
                          <span>Rows:</span>
                          <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="bg-white border border-slate-200 rounded-md py-0.5 px-1.5 text-xs text-slate-800 font-medium cursor-pointer"
                          >
                            {ITEMS_PER_PAGE_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      {/* Page Switcher */}
                      {totalPages > 1 && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              setCurrentPage((p) => Math.max(1, p - 1))
                            }
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700"
                            title="Previous Page"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 font-medium">
                            Page {currentPage} of {totalPages}
                          </span>
                          <button
                            onClick={() =>
                              setCurrentPage((p) =>
                                Math.min(totalPages, p + 1)
                              )
                            }
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700"
                            title="Next Page"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherSubmissions;

/* =========================================================================
   Inline Grading Card (Compact, Responsive, and Fast)
   ========================================================================= */

const PRESET_SCORES = [100, 95, 90, 85, 80, 75, 50];
const QUICK_FEEDBACK_TAGS = [
  "Excellent work! 👍",
  "Well structured & clean solution",
  "Good effort, minor improvements needed",
  "Please review formatting guidelines",
  "Incomplete submission, needs revision",
];

const InlineGradingCard = ({
  submission,
  onUpdated,
  onClose,
}: {
  submission: Submission;
  onUpdated: () => void;
  onClose: () => void;
}) => {
  const [score, setScore] = useState<number | "">(
    submission.grade?.score ?? ""
  );
  const [feedback, setFeedback] = useState(submission.grade?.feedback ?? "");
  const [savingAction, setSavingAction] = useState<"draft" | "publish" | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (autoPublish = false) => {
    if (score === "") {
      setError("Please enter a grade score (0 - 100)");
      return;
    }

    const numScore = Number(score);
    if (isNaN(numScore) || numScore < 0 || numScore > 100) {
      setError("Score must be between 0 and 100");
      return;
    }

    try {
      setSavingAction(autoPublish ? "publish" : "draft");
      setError(null);

      // Save or update grade with autoPublish flag
      await saveGrade(submission.id, numScore, feedback || undefined, autoPublish);

      onUpdated();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save grade");
    } finally {
      setSavingAction(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 sm:p-6 border-l-4 border-blue-600 bg-gradient-to-r from-blue-50/50 via-white to-white space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-blue-600" />
          <h5 className="text-sm font-bold text-slate-900">
            Grading Submission:{" "}
            <span className="font-mono text-blue-700">{submission.student.email}</span>
          </h5>
        </div>

        {submission.grade?.published && (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            ✓ Currently Published
          </span>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grade Input Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Score & Quick Presets (5 cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Score (0 - 100%) <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={score}
              onChange={(e) =>
                setScore(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="e.g. 95"
              className="w-full pl-4 pr-9 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              %
            </div>
          </div>

          {/* Quick Score Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400 font-medium mr-1">
              Quick:
            </span>
            {PRESET_SCORES.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setScore(val)}
                className={`px-2 py-0.5 rounded-lg text-xs font-medium border transition-colors ${
                  score === val
                    ? "bg-blue-600 text-white border-blue-600 font-bold"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {val}%
              </button>
            ))}
          </div>
        </div>

        {/* Feedback & Suggestions (8 cols) */}
        <div className="lg:col-span-8 space-y-2.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Feedback for Student{" "}
            <span className="text-slate-400 font-normal normal-case">
              (optional)
            </span>
          </label>

          <textarea
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write constructive notes, strengths, or areas for improvement..."
            className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs resize-none"
          />

          {/* Quick Feedback Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span className="text-[11px] text-slate-400 font-medium">
              Suggestions:
            </span>
            {QUICK_FEEDBACK_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() =>
                  setFeedback((prev) => (prev ? `${prev}\n${tag}` : tag))
                }
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50/50 transition-colors truncate max-w-[200px]"
                title={tag}
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-slate-200/60">
        <button
          type="button"
          onClick={onClose}
          disabled={savingAction !== null}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
        >
          Cancel
        </button>

        {/* Save as Draft */}
        <button
          type="button"
          onClick={() => handleSave(false)}
          disabled={savingAction !== null || score === ""}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:border-blue-400 text-slate-800 hover:text-blue-700 font-semibold rounded-xl text-xs transition-colors shadow-2xs disabled:opacity-50"
        >
          {savingAction === "draft" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
          ) : (
            <Check className="w-3.5 h-3.5 text-blue-600" />
          )}
          <span>Save Draft</span>
        </button>

        {/* Publish Grade */}
        <button
          type="button"
          onClick={() => handleSave(true)}
          disabled={savingAction !== null || score === ""}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs disabled:opacity-50"
        >
          {savingAction === "publish" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          <span>
            {submission.grade?.published ? "Update & Publish" : "Save & Publish"}
          </span>
        </button>
      </div>
    </motion.div>
  );
};