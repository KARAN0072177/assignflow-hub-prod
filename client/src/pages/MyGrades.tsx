import { useEffect, useState } from "react";
import { getMyGrades, type StudentGrade } from "../services/grade.api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  TrendingUp,
  Calendar,
  MessageSquare,
  BookOpen,
  AlertCircle,
  Loader2,
  BarChart3,
  CheckCircle2,
  Clock,
  Download,
  FileText
} from "lucide-react";

const MyGrades = () => {
  const [grades, setGrades] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await getMyGrades();
        setGrades(data);
      } catch (err: any) {
        setError("Failed to load grades");
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGradeColor = (score: number) => {
    if (score >= 90) return "text-emerald-700";
    if (score >= 80) return "text-emerald-600";
    if (score >= 70) return "text-amber-600";
    if (score >= 60) return "text-amber-700";
    return "text-red-600";
  };

  const getGradeBgColor = (score: number) => {
    if (score >= 90) return "bg-emerald-50 border-emerald-200";
    if (score >= 80) return "bg-emerald-50 border-emerald-200";
    if (score >= 70) return "bg-amber-50 border-amber-200";
    if (score >= 60) return "bg-amber-50 border-amber-200";
    return "bg-red-50 border-red-200";
  };

  const getGradeStatus = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Good";
    if (score >= 70) return "Satisfactory";
    if (score >= 60) return "Needs Improvement";
    return "Needs Attention";
  };

  const calculateAverage = () => {
    if (grades.length === 0) return 0;
    const total = grades.reduce((sum, grade) => sum + grade.score, 0);
    return Math.round((total / grades.length) * 10) / 10;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center py-8">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-700">Loading your grades...</p>
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

  const averageGrade = calculateAverage();

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-emerald-100 rounded-lg">
              <Award className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">My Grades</h1>
              <p className="text-slate-600 text-sm mt-1">
                View your assignment scores and teacher feedback
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Assignments</p>
                  <p className="text-2xl font-bold text-slate-800">{grades.length}</p>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Average Grade</p>
                  <p className={`text-2xl font-bold ${getGradeColor(averageGrade)}`}>
                    {grades.length > 0 ? averageGrade : "N/A"}
                  </p>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Performance</p>
                  <p className={`text-lg font-bold ${getGradeColor(averageGrade)}`}>
                    {grades.length > 0 ? getGradeStatus(averageGrade) : "No data"}
                  </p>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grades List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <FileText className="w-5 h-5 text-emerald-700" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Assignment Grades</h2>
            </div>
            {grades.length > 0 && (
              <div className="text-sm text-slate-600">
                {grades.length} graded assignment{grades.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          <AnimatePresence>
            {grades.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-150 border border-slate-300/50 rounded-xl p-8 sm:p-12 text-center shadow-sm"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  No Published Grades Yet
                </h3>
                <p className="text-slate-600 mb-6 max-w-sm mx-auto">
                  Your teacher hasn't published any grades yet. Grades will appear here once they've been reviewed and published.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {grades.map((grade, index) => (
                  <motion.div
                    key={grade.assignment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -2 }}
                    className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    {/* Assignment Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 ${getGradeBgColor(grade.score)} rounded-lg`}>
                          <Award className={`w-5 h-5 ${getGradeColor(grade.score)}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 text-lg">{grade.assignment.title}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getGradeBgColor(grade.score)} ${getGradeColor(grade.score)}`}>
                              {getGradeStatus(grade.score)}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800 font-medium">
                              <CheckCircle2 className="w-3 h-3" />
                              Graded
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Score Display */}
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getGradeColor(grade.score)}`}>
                          {grade.score}
                          <span className="text-sm text-slate-600">/100</span>
                        </div>
                        <div className="text-sm text-slate-600 mt-1">Final Score</div>
                      </div>
                    </div>

                    {/* Assignment Info */}
                    {grade.assignment.description && (
                      <p className="text-slate-600 mb-4">{grade.assignment.description}</p>
                    )}

                    {/* Feedback Section */}
                    {grade.feedback && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                          <MessageSquare className="w-4 h-4" />
                          Teacher Feedback
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                          <p className="text-sm text-slate-700">{grade.feedback}</p>
                        </div>
                      </div>
                    )}

                    {/* Footer Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Graded: {formatDate(grade.gradedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Submitted: {formatDate(grade.submittedAt)}</span>
                        </div>
                      </div>
                      
                      {/* Download Link if available */}
                      {grade.submissionDownloadUrl && (
                        <a
                          href={grade.submissionDownloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
                        >
                          <Download className="w-4 h-4" />
                          Your Submission
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Performance Summary */}
        {grades.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-emerald-50/70 border border-emerald-300 rounded-xl p-5"
          >
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-700 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-emerald-800 mb-1">
                  Performance Summary
                </h4>
                <p className="text-xs text-emerald-800">
                  You have received grades for {grades.length} assignment{grades.length !== 1 ? 's' : ''} with an average score of {averageGrade}/100.
                  {averageGrade >= 80 ? " Keep up the excellent work!" : 
                   averageGrade >= 70 ? " You're doing well. Keep improving!" :
                   " Review the feedback and focus on areas that need improvement."}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-slate-600">
            Questions about your grades? Contact your teacher for clarification.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default MyGrades;