import { useEffect, useState } from "react";
import { getSubmissionsForAssignment } from "../services/submission.api";
import { saveGrade, publishGrade } from "../services/grade.api";
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
  Percent,
  MessageSquare,
  Calendar,
  User
} from "lucide-react";

/* =======================
   Types
   ======================= */

interface Submission {
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
  };
}

/* =======================
   Main Component
   ======================= */

const TeacherSubmissions = ({ assignmentId }: { assignmentId: string }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await getSubmissionsForAssignment(assignmentId);
      setSubmissions(data);
    } catch (err) {
      setError("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSubmissionStatusColor = (state: string) => {
    switch (state) {
      case "SUBMITTED":
        return "bg-emerald-100 text-emerald-800";
      case "DRAFT":
        return "bg-amber-100 text-amber-800";
      case "LOCKED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getGradeStatus = (grade: Submission['grade']) => {
    if (!grade) return "Ungraded";
    return grade.published ? "Published" : "Draft";
  };

  const getGradeStatusColor = (grade: Submission['grade']) => {
    if (!grade) return "bg-slate-100 text-slate-800";
    return grade.published ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800";
  };

  if (loading) {
    return (
      <div className="mt-6">
        <div className="flex items-center gap-2 text-slate-600 mb-4">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading submissions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6">
        <div className="flex items-start gap-3 p-4 bg-red-100 border border-red-300 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Users className="w-5 h-5" />
          Student Submissions
          <span className="ml-1 px-2 py-0.5 bg-blue-800 text-xs rounded-full">
            {submissions.length}
          </span>
        </button>
        
        {submissions.length > 0 && (
          <div className="text-sm text-slate-600">
            {submissions.filter(s => s.grade?.published).length} graded
          </div>
        )}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {submissions.length === 0 ? (
              <div className="bg-slate-150 border border-slate-300/50 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-1">No Submissions Yet</h4>
                <p className="text-sm text-slate-600">
                  Students haven't submitted their work for this assignment.
                </p>
              </div>
            ) : (
              submissions.map((submission) => (
                <SubmissionRow
                  key={submission.id}
                  submission={submission}
                  onUpdated={fetchSubmissions}
                  formatDate={formatDate}
                  getSubmissionStatusColor={getSubmissionStatusColor}
                  getGradeStatus={getGradeStatus}
                  getGradeStatusColor={getGradeStatusColor}
                />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherSubmissions;

/* =======================
   Submission Row
   ======================= */

const SubmissionRow = ({
  submission,
  onUpdated,
  formatDate,
  getSubmissionStatusColor,
  getGradeStatusColor,
}: {
  submission: Submission;
  onUpdated: () => void;
  formatDate: (date: string) => string;
  getSubmissionStatusColor: (state: string) => string;
  getGradeStatus: (grade: Submission['grade']) => string;
  getGradeStatusColor: (grade: Submission['grade']) => string;
}) => {
  const [score, setScore] = useState<number | "">(
    submission.grade?.score ?? ""
  );
  const [feedback, setFeedback] = useState(
    submission.grade?.feedback ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(!submission.grade?.published);

  const handleSave = async () => {
    if (score === "") {
      setError("Score is required");
      return;
    }

    if (typeof score === "number" && (score < 0 || score > 100)) {
      setError("Score must be between 0 and 100");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await saveGrade(
        submission.id,
        Number(score),
        feedback || undefined
      );

      setIsEditing(false);
      onUpdated();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save grade");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!submission.grade?.id) return;

    try {
      setSaving(true);
      setError(null);

      await publishGrade(submission.grade.id);
      onUpdated();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to publish grade");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">{submission.student.email}</h4>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getSubmissionStatusColor(submission.state)}`}>
                {submission.state === "SUBMITTED" ? "Submitted" : 
                 submission.state === "DRAFT" ? "Draft" : "Locked"}
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getGradeStatusColor(submission.grade)}`}>
                {submission.grade?.published ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    Published
                  </>
                ) : submission.grade ? (
                  <>
                    <Edit2 className="w-3 h-3" />
                    Draft
                  </>
                ) : (
                  "Ungraded"
                )}
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-1 text-sm text-slate-600 mb-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(submission.submittedAt)}</span>
          </div>
          {submission.downloadUrl && (
            <a
              href={submission.downloadUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              <Download className="w-4 h-4" />
              Download
            </a>
          )}
        </div>
      </div>

      {/* Grade Section */}
      <div className="pt-4 border-t border-slate-200">
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-3 p-3 bg-red-100 border border-red-300 rounded-lg mb-4"
            >
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grade Status: Published */}
        {submission.grade && submission.grade.published && !isEditing ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-emerald-800">Grade Published</h5>
                  <p className="text-sm text-slate-600">
                    Score: <span className="font-bold text-slate-800">{submission.grade.score}/100</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 border border-slate-400 hover:bg-slate-50 text-slate-700 text-sm rounded-lg transition-colors duration-200"
              >
                Edit Grade
              </button>
            </div>
            
            {submission.grade.feedback && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <MessageSquare className="w-4 h-4" />
                  Feedback
                </div>
                <p className="text-sm text-slate-700">{submission.grade.feedback}</p>
              </div>
            )}
          </div>
        ) : (
          /* Grade Form: Editing or New */
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Score Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-800">
                  Score (0-100)
                  <span className="text-red-600 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={score}
                    onChange={(e) => setScore(e.target.value === "" ? "" : Number(e.target.value))}
                    disabled={saving}
                    className="w-full px-4 py-3 bg-white border border-slate-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 disabled:opacity-60 text-slate-900 shadow-sm"
                    placeholder="0-100"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Percent className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving || score === ""}
                    className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : submission.grade ? (
                      <>
                        <Edit2 className="w-5 h-5" />
                        Update
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Save Grade
                      </>
                    )}
                  </button>
                  
                  {submission.grade && !submission.grade.published && (
                    <button
                      onClick={handlePublish}
                      disabled={saving}
                      className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Publish
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Feedback Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-800">
                Feedback
                <span className="text-slate-600 font-normal ml-1">(optional)</span>
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                disabled={saving}
                rows={3}
                className="w-full px-4 py-3 bg-white border border-slate-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 resize-none disabled:opacity-60 text-slate-900 placeholder-slate-600 shadow-sm"
                placeholder="Provide constructive feedback for the student..."
              />
            </div>

            {/* Status Info */}
            <div className="flex items-center justify-between text-sm text-slate-600">
              <div className="flex items-center gap-4">
                {submission.grade && !submission.grade.published && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>Grade saved as draft</span>
                  </div>
                )}
              </div>
              
              {submission.grade && !submission.grade.published && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-sm border border-slate-400 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};