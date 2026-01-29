import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import CreateAssignmentForm from "../components/CreateAssignmentForm";
import SubmissionBox from "../components/SubmissionBox";
import TeacherSubmissions from "../components/TeacherSubmissions";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  FileText,
  Users,
  AlertCircle,
  Loader2,
  Clock,
  Lock,
  CheckCircle,
  Edit2,
  Award,
  FolderOpen,
  ArrowLeft
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface Classroom {
  id: string;
  name: string;
  description?: string;
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

  const role = localStorage.getItem("userRole");
  const isTeacher = role === "TEACHER";
  const accentColor = isTeacher ? "blue" : "emerald";

  useEffect(() => {
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
          err?.response?.data?.message ||
          "Failed to load classroom details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAssignmentStatusColor = (state: string, type: string) => {
    if (state === "PUBLISHED") {
      return type === "GRADED" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800";
    }
    return "bg-slate-100 text-slate-800";
  };

  const getAssignmentIcon = (type: string) => {
    if (type === "GRADED") return <Award className="w-4 h-4" />;
    return <FolderOpen className="w-4 h-4" />;
  };

  const getSubmissionStatus = (submission: any) => {
    if (!submission) return null;
    
    switch (submission.state) {
      case "DRAFT":
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800"><Edit2 className="w-3 h-3" /> Draft</span>;
      case "SUBMITTED":
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800"><CheckCircle className="w-3 h-3" /> Submitted</span>;
      case "LOCKED":
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-800"><Lock className="w-3 h-3" /> Locked</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center py-8">
        <div className="text-center">
          <Loader2 className={`w-8 h-8 text-${accentColor}-600 animate-spin mx-auto mb-4`} />
          <p className="text-slate-700">Loading classroom details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center py-8">
        <div className="max-w-md mx-auto p-6">
          <div className="flex items-center gap-3 p-4 bg-red-100 border border-red-300 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!classroom) return null;

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          {/* Back Button */}
          <div className="mb-6">
            <Link
              to="/dashboard/classrooms/my"
              className="inline-flex items-center text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Back to classrooms
            </Link>
          </div>

          {/* Classroom Info */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 bg-${accentColor}-100 rounded-xl`}>
                <BookOpen className={`w-8 h-8 text-${accentColor}-700`} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">{classroom.name}</h1>
                {classroom.description && (
                  <p className="text-slate-600 mt-2 max-w-2xl">{classroom.description}</p>
                )}
                <div className="flex items-center gap-4 mt-3">
                  <div className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full ${isTeacher ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    <Users className="w-4 h-4" />
                    <span className="font-medium">{isTeacher ? 'Teacher' : 'Student'}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                    <FileText className="w-4 h-4" />
                    <span>{assignments.length} assignment{assignments.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Assignments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-8"
        >
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-${accentColor}-50 rounded-lg`}>
                <FileText className={`w-5 h-5 text-${accentColor}-700`} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Assignments</h2>
            </div>
            
            {assignments.length > 0 && (
              <div className="text-sm text-slate-600">
                Showing {assignments.length} assignment{assignments.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Teacher-only: Create assignment */}
          {isTeacher && (
            <CreateAssignmentForm
              classroomId={id!}
              onCreated={() => window.location.reload()}
            />
          )}

          {/* Assignments List */}
          <AnimatePresence>
            {assignments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-150 border border-slate-300/50 rounded-xl p-8 sm:p-12 text-center shadow-sm"
              >
                <div className={`w-16 h-16 bg-${accentColor}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <FileText className={`w-8 h-8 text-${accentColor}-600`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  No assignments yet
                </h3>
                <p className="text-slate-600 mb-6 max-w-sm mx-auto">
                  {isTeacher 
                    ? "Create your first assignment to get started"
                    : "No assignments have been posted yet by your teacher"}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {assignments.map((assignment, index) => (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -2 }}
                    className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    {/* Assignment Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 ${assignment.type === "GRADED" ? 'bg-emerald-50' : 'bg-blue-50'} rounded-lg`}>
                          {getAssignmentIcon(assignment.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 text-lg">{assignment.title}</h3>
                          <div className="flex items-center gap-3 mt-2">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getAssignmentStatusColor(assignment.state, assignment.type)}`}>
                              {assignment.state === "PUBLISHED" ? "Published" : "Draft"}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${assignment.type === "GRADED" ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-blue-800'}`}>
                              {assignment.type === "GRADED" ? "Graded" : "Material"}
                            </span>
                          </div>
                        </div>
                      </div>
                      {!isTeacher && assignment.submission && (
                        <div className="flex-shrink-0">
                          {getSubmissionStatus(assignment.submission)}
                        </div>
                      )}
                    </div>

                    {/* Assignment Description */}
                    {assignment.description && (
                      <p className="text-slate-600 mb-4">{assignment.description}</p>
                    )}

                    {/* Assignment Details */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        {assignment.dueDate && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Due: {formatDate(assignment.dueDate)}</span>
                          </div>
                        )}
                      </div>

                      {/* Student Actions */}
                      {!isTeacher && assignment.type === "GRADED" && assignment.state === "PUBLISHED" && (
                        <div className="flex items-center gap-3">
                          {assignment.submission === null && (
                            <div className="text-right">
                              <p className="text-sm text-slate-600 mb-1">No submission yet</p>
                              <SubmissionBox assignmentId={assignment.id} />
                            </div>
                          )}
                          
                          {assignment.submission?.state === "DRAFT" && (
                            <div className="text-right">
                              <p className="text-sm text-amber-600 mb-1">Draft in progress</p>
                              <SubmissionBox assignmentId={assignment.id} />
                            </div>
                          )}
                          
                          {assignment.submission?.state === "SUBMITTED" && (
                            <div className="flex items-center gap-2 text-emerald-600">
                              <CheckCircle className="w-5 h-5" />
                              <span className="font-medium">Submitted</span>
                            </div>
                          )}
                          
                          {assignment.submission?.state === "LOCKED" && (
                            <div className="flex items-center gap-2 text-red-600">
                              <Lock className="w-5 h-5" />
                              <span className="font-medium">Submission Locked</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Teacher Actions */}
                      {isTeacher && assignment.type === "GRADED" && (
                        <TeacherSubmissions assignmentId={assignment.id} />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-slate-600">
            {isTeacher 
              ? "Manage assignments and view student submissions from this dashboard"
              : "Submit your assignments before the due date to avoid missing deadlines"}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ClassroomDetail;