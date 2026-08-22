import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import CreateAssignmentForm from "../components/CreateAssignmentForm";
import SubmissionBox from "../components/SubmissionBox";
import TeacherSubmissions from "../components/TeacherSubmissions";
import AssignmentComments from "../components/AssignmentComments";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  FileText,
  Users,
  AlertCircle,
  Lock,
  CheckCircle,
  Edit2,
  Award,
  FolderOpen,
  ArrowLeft,
  CalendarX,
  Calendar,
  Copy,
  Check,
  PlusCircle,
  Hash,
  MessageSquare
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Classroom {
  id: string;
  name: string;
  description?: string;
  code?: string;
  createdAt?: string;
}

interface Assignment {
  id: string;
  title: string;
  description?: string;
  type: "GRADED" | "MATERIAL";
  state: "DRAFT" | "PUBLISHED";
  dueDate?: string;
  submission: {
    id: string;
    state: "DRAFT" | "SUBMITTED" | "LOCKED";
  } | null;
}

const ClassroomDetail = () => {
  const { id } = useParams<{ id: string }>();

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  const toggleComments = (assignmentId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [assignmentId]: !prev[assignmentId],
    }));
  };

  const role = localStorage.getItem("userRole");
  const isTeacher = role === "TEACHER";
  const accentColor = isTeacher ? "blue" : "emerald";

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken");

      // 1. Fetch classroom details
      const classroomRes = await axios.get(
        `${API_BASE_URL}/api/classrooms/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setClassroom(classroomRes.data);
      if (classroomRes.data?.name && id) {
        try {
          sessionStorage.setItem(`classroom_name_${id}`, classroomRes.data.name);
          window.dispatchEvent(
            new CustomEvent("classroom_name_updated", {
              detail: { id, name: classroomRes.data.name },
            })
          );
        } catch {
          // Storage fallback
        }
      }

      // 2. Fetch assignments
      const assignmentsRes = await axios.get(
        `${API_BASE_URL}/api/classrooms/${id}/assignments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAssignments(assignmentsRes.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to load classroom details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isDueDatePassed = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const getSubmissionStatus = (submission: any, dueDate?: string) => {
    const duePassed = isDueDatePassed(dueDate);

    if (!submission) {
      if (duePassed) {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <CalendarX className="w-3.5 h-3.5" /> Due Date Passed
          </span>
        );
      }
      return null;
    }

    switch (submission.state) {
      case "DRAFT":
        if (duePassed) {
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
              <CalendarX className="w-3.5 h-3.5" /> Overdue - Draft
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Edit2 className="w-3.5 h-3.5" /> Draft In Progress
          </span>
        );
      case "SUBMITTED":
        if (duePassed) {
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <CheckCircle className="w-3.5 h-3.5" /> Submitted (Late)
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" /> Submitted
          </span>
        );
      case "LOCKED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-800 border border-red-200">
            <Lock className="w-3.5 h-3.5" /> Submission Locked
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-700 font-medium">Loading classroom details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-2xl p-6 shadow-sm text-center">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Classroom Error</h3>
          <p className="text-sm text-slate-600 mb-6">{error}</p>
          <Link
            to="/dashboard/classrooms/my"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Classrooms
          </Link>
        </div>
      </div>
    );
  }

  if (!classroom) return null;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Navigation & Back Link */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-between"
      >
        <Link
          to="/dashboard/classrooms/my"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 font-medium text-xs shadow-2xs transition-all group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Classrooms</span>
        </Link>
      </motion.div>

      {/* Classroom Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`p-3.5 bg-${accentColor}-100 rounded-2xl text-${accentColor}-700 shadow-xs shrink-0`}>
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {classroom.name}
              </h1>
              {classroom.description && (
                <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
                  {classroom.description}
                </p>
              )}

              {/* Badges & Meta */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                    isTeacher
                      ? "bg-blue-50 text-blue-800 border border-blue-200"
                      : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{isTeacher ? "Teacher View" : "Student View"}</span>
                </span>

                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {assignments.length} assignment{assignments.length !== 1 ? "s" : ""}
                  </span>
                </span>

                {classroom.code && (
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full px-3 py-1 text-xs">
                    <Hash className="w-3 h-3 text-slate-400" />
                    <span className="text-slate-500 font-medium">Join Code:</span>
                    <span className="font-mono font-bold text-blue-700">
                      {classroom.code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(classroom.code!)}
                      className="p-0.5 text-slate-400 hover:text-blue-600 transition-colors"
                      title="Copy Code"
                    >
                      {copiedCode ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Button for Teacher */}
          {isTeacher && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-xs transition-all active:scale-95 shrink-0 ${
                showCreateForm
                  ? "bg-slate-200 text-slate-800 hover:bg-slate-300"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>{showCreateForm ? "Cancel Creation" : "New Assignment"}</span>
            </button>
          )}
        </div>
      </motion.div>

      {/* Teacher Collapsible Create Assignment Form */}
      <AnimatePresence>
        {isTeacher && showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <CreateAssignmentForm
                classroomId={id!}
                onCreated={() => {
                  setShowCreateForm(false);
                  fetchData();
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assignments Section */}
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-700">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Coursework &amp; Assignments
              </h2>
              <p className="text-xs text-slate-500">
                {assignments.length} total assignment{assignments.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <AnimatePresence>
          {assignments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center shadow-2xs"
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                No Assignments Posted Yet
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                {isTeacher
                  ? "Create your first assignment to share coursework, study material, and collect student submissions."
                  : "No coursework has been posted by your teacher yet. Check back soon!"}
              </p>
              {isTeacher && !showCreateForm && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  Create First Assignment
                </button>
              )}
            </motion.div>
          ) : (
            <div className="space-y-5">
              {assignments.map((assignment, index) => {
                const duePassed = isDueDatePassed(assignment.dueDate);

                return (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.05 }}
                    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Assignment Top Row */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`p-2.5 rounded-xl shrink-0 ${
                            assignment.type === "GRADED"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-indigo-50 text-indigo-700"
                          }`}
                        >
                          {assignment.type === "GRADED" ? (
                            <Award className="w-5 h-5" />
                          ) : (
                            <FolderOpen className="w-5 h-5" />
                          )}
                        </div>

                        <div>
                          <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                            {assignment.title}
                          </h3>

                          {/* Status & Type Pills */}
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                assignment.state === "PUBLISHED"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-slate-100 text-slate-700 border border-slate-200"
                              }`}
                            >
                              {assignment.state === "PUBLISHED" ? "Published" : "Draft"}
                            </span>

                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                assignment.type === "GRADED"
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "bg-purple-50 text-purple-700 border border-purple-200"
                              }`}
                            >
                              {assignment.type === "GRADED" ? "Graded Assignment" : "Study Material"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Student Submission Status Badge (Right aligned) */}
                      {!isTeacher && (
                        <div className="shrink-0">
                          {getSubmissionStatus(assignment.submission, assignment.dueDate)}
                        </div>
                      )}
                    </div>

                    {/* Assignment Description */}
                    {assignment.description && (
                      <p className="text-slate-600 text-sm leading-relaxed mb-4 pl-11">
                        {assignment.description}
                      </p>
                    )}

                    {/* Footer Row: Due Date & Action */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
                      {/* Due Date Indicator */}
                      <div className="flex items-center gap-2 text-xs">
                        {assignment.dueDate ? (
                          <div
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg ${
                              duePassed
                                ? "bg-red-50 text-red-700 font-semibold border border-red-200/60"
                                : "bg-slate-50 text-slate-600 border border-slate-200/60"
                            }`}
                          >
                            {duePassed ? (
                              <CalendarX className="w-3.5 h-3.5 text-red-600" />
                            ) : (
                              <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            )}
                            <span>
                              Due: {formatDate(assignment.dueDate)}
                              {duePassed && " (Past due)"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">No deadline set</span>
                        )}
                      </div>

                      {/* Actions: Discussion toggle and Student Submission */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Discussion Toggle Button */}
                        <button
                          type="button"
                          onClick={() => toggleComments(assignment.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            expandedComments[assignment.id]
                              ? "bg-blue-50 text-blue-700 border-blue-200 shadow-2xs"
                              : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                          <span>
                            {expandedComments[assignment.id]
                              ? "Hide Discussion"
                              : "Discussion / Comments"}
                          </span>
                        </button>

                        {/* Student Action: Upload / Submit */}
                        {!isTeacher &&
                          assignment.type === "GRADED" &&
                          assignment.state === "PUBLISHED" &&
                          !duePassed && (
                            <div className="flex items-center gap-2">
                              {(!assignment.submission || assignment.submission.state === "DRAFT") && (
                                <SubmissionBox
                                  assignmentId={assignment.id}
                                  initialSubmission={assignment.submission}
                                  onSubmitted={fetchData}
                                />
                              )}
                              {assignment.submission?.state === "SUBMITTED" && (
                                <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Submitted</span>
                                </div>
                              )}
                              {assignment.submission?.state === "LOCKED" && (
                                <div className="flex items-center gap-1.5 text-red-700 text-xs font-semibold bg-red-50 px-3 py-1.5 rounded-xl border border-red-200">
                                  <Lock className="w-3.5 h-3.5 text-red-600" />
                                  <span>Submission Locked</span>
                                </div>
                              )}
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Interactive Assignment Discussion Drawer */}
                    <AnimatePresence>
                      {expandedComments[assignment.id] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-5 pt-5 border-t border-slate-100 overflow-hidden"
                        >
                          <AssignmentComments
                            assignmentId={assignment.id}
                            assignmentTitle={assignment.title}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Teacher Submissions Section (Full Width Expansion) */}
                    {isTeacher && assignment.type === "GRADED" && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <TeacherSubmissions
                          assignmentId={assignment.id}
                          dueDate={assignment.dueDate}
                        />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ClassroomDetail;