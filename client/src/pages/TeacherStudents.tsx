import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  BookOpen,
  PlusCircle,
  Search,
  Copy,
  Check,
  AlertCircle,
  GraduationCap,
  Calendar,
  Mail,
  UserCheck,
  Sparkles,
  ExternalLink,
  Layers,
  BarChart3,
} from "lucide-react";
import { getTeacherClassroomStudents } from "../services/classroom.api";
import type { TeacherClassroomWithStudents } from "../services/classroom.api";
import {
  getTeacherStudentsAnalytics,
  type TeacherAnalyticsData,
} from "../services/grade.api";
import { StudentPerformanceAnalytics } from "../components/StudentPerformanceAnalytics";
import { TeacherAiInsightsTab } from "../components/TeacherAiInsightsTab";

const TeacherStudents = () => {
  const [activeTab, setActiveTab] = useState<"analytics" | "roster" | "insights">("analytics");
  const [classrooms, setClassrooms] = useState<TeacherClassroomWithStudents[]>([]);
  const [analytics, setAnalytics] = useState<TeacherAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<string>("ALL");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [rosterData, analyticsData] = await Promise.all([
          getTeacherClassroomStudents(),
          getTeacherStudentsAnalytics(),
        ]);
        setClassrooms(rosterData);
        setAnalytics(analyticsData);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Failed to load students data and analytics. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Aggregated Stats for Roster view
  const stats = useMemo(() => {
    const totalClasses = classrooms.length;
    const totalEnrollments = classrooms.reduce(
      (sum, c) => sum + (c.studentCount || c.students?.length || 0),
      0
    );
    const uniqueStudentEmails = new Set<string>();
    classrooms.forEach((c) => {
      c.students?.forEach((s) => uniqueStudentEmails.add(s.email.toLowerCase()));
    });

    const averagePerClass =
      totalClasses > 0 ? (totalEnrollments / totalClasses).toFixed(1) : "0";

    return {
      totalClasses,
      totalEnrollments,
      uniqueStudents: uniqueStudentEmails.size,
      averagePerClass,
    };
  }, [classrooms]);

  // Filtered Classrooms & Students for Roster View
  const filteredClassrooms = useMemo(() => {
    return classrooms
      .filter((c) => {
        if (selectedClassId !== "ALL" && c.id !== selectedClassId) {
          return false;
        }
        return true;
      })
      .map((c) => {
        const query = searchTerm.toLowerCase().trim();
        if (!query) return c;

        const classMatches =
          c.name.toLowerCase().includes(query) ||
          c.code.toLowerCase().includes(query);

        const matchingStudents = c.students.filter((s) =>
          s.email.toLowerCase().includes(query)
        );

        if (classMatches) {
          return c;
        }

        return {
          ...c,
          students: matchingStudents,
        };
      })
      .filter((c) => {
        const query = searchTerm.toLowerCase().trim();
        if (!query) return true;
        const classMatches =
          c.name.toLowerCase().includes(query) ||
          c.code.toLowerCase().includes(query);
        return classMatches || c.students.length > 0;
      });
  }, [classrooms, selectedClassId, searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3">
        <AlertCircle className="w-5 h-5" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-blue-100 rounded-xl text-blue-700 shadow-sm">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Students &amp; Performance Analytics
            </h1>
            <p className="text-slate-600 text-sm mt-0.5">
              Comprehensive grade analytics, score distributions, and class rosters across all your classrooms
            </p>
          </div>
        </div>

        <Link
          to="/dashboard/classrooms/create"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200 active:scale-95 text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Classroom</span>
        </Link>
      </motion.div>

      {/* Primary Section Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/70 border border-slate-300/60 rounded-2xl max-w-fit shadow-2xs">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "analytics"
              ? "bg-white text-blue-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          }`}
        >
          <BarChart3 className="w-4 h-4 text-blue-600" />
          <span>Student Grade Analytics &amp; Charts</span>
          {analytics && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] bg-blue-50 text-blue-700 font-extrabold border border-blue-200">
              {analytics.summary.totalUniqueStudents}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("roster")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "roster"
              ? "bg-white text-blue-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          }`}
        >
          <Users className="w-4 h-4 text-slate-600" />
          <span>Class Rosters &amp; Enrollments</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] bg-slate-100 text-slate-700 font-extrabold border border-slate-200">
            {classrooms.length} Classes
          </span>
        </button>

        <button
          onClick={() => setActiveTab("insights")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "insights"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs"
              : "text-indigo-600 hover:text-indigo-800 hover:bg-white/50"
          }`}
        >
          <Sparkles className={`w-4 h-4 ${activeTab === "insights" ? "text-blue-100" : "text-indigo-500"}`} />
          <span>AI Insights</span>
        </button>
      </div>

      {/* Tab 1: Global Student Performance Analytics */}
      {activeTab === "analytics" && analytics && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <StudentPerformanceAnalytics analytics={analytics} />
        </motion.div>
      )}

      {/* Tab 1.5: AI Insights */}
      {activeTab === "insights" && (
        <TeacherAiInsightsTab />
      )}

      {/* Tab 2: Class Rosters & Enrollments */}
      {activeTab === "roster" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-8"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Enrollments */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Enrollments
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {stats.totalEnrollments}
              </div>
              <p className="text-xs text-slate-500 mt-1">Across all your classes</p>
            </div>

            {/* Unique Students */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Unique Students
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {stats.uniqueStudents}
              </div>
              <p className="text-xs text-slate-500 mt-1">Distinct registered students</p>
            </div>

            {/* Active Classrooms */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Created Classes
                </span>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {stats.totalClasses}
              </div>
              <p className="text-xs text-slate-500 mt-1">Active learning spaces</p>
            </div>

            {/* Average per Class */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Average Class Size
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {stats.averagePerClass}
              </div>
              <p className="text-xs text-slate-500 mt-1">Students per classroom</p>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student email, class name, code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Classroom Filter Dropdown */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider shrink-0">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Class Filter:</span>
              </div>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full md:w-64 py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="ALL">All Classrooms ({classrooms.length})</option>
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.studentCount || c.students?.length || 0} students)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Main Roster Container */}
          <div className="space-y-6">
            <AnimatePresence>
              {filteredClassrooms.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">
                    {searchTerm || selectedClassId !== "ALL"
                      ? "No matching classrooms or students found"
                      : "No classrooms created yet"}
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                    {searchTerm || selectedClassId !== "ALL"
                      ? "Try adjusting your search query or clear the filter to see all enrolled students."
                      : "Create your first classroom to invite students and track enrollments."}
                  </p>
                  {classrooms.length === 0 && (
                    <Link
                      to="/dashboard/classrooms/create"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm shadow-md shadow-blue-500/20"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Create Classroom
                    </Link>
                  )}
                </motion.div>
              ) : (
                filteredClassrooms.map((classroom, index) => (
                  <motion.div
                    key={classroom.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden"
                  >
                    {/* Classroom Header Bar */}
                    <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h2 className="text-xl font-bold text-slate-900">
                            {classroom.name}
                          </h2>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold">
                            <Users className="w-3.5 h-3.5" />
                            {classroom.studentCount || classroom.students?.length || 0}{" "}
                            {classroom.studentCount === 1 ? "Student" : "Students"}
                          </span>
                        </div>

                        {classroom.description && (
                          <p className="text-sm text-slate-600 line-clamp-1">
                            {classroom.description}
                          </p>
                        )}
                      </div>

                      {/* Class Metadata & Actions */}
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Join Code Badge with Copy */}
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
                          <span className="text-xs text-slate-500 font-medium">
                            Join Code:
                          </span>
                          <span className="font-mono font-bold text-sm text-blue-700">
                            {classroom.code}
                          </span>
                          <button
                            onClick={() => handleCopyCode(classroom.code)}
                            className="p-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                            title="Copy Code"
                          >
                            {copiedCode === classroom.code ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        {/* Creation Date */}
                        {classroom.createdAt && (
                          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-white border border-slate-200 rounded-xl px-3 py-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>Created {formatDate(classroom.createdAt)}</span>
                          </div>
                        )}

                        {/* View Classroom Link */}
                        <Link
                          to={`/dashboard/classrooms/${classroom.id}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium text-xs rounded-xl border border-slate-200 hover:border-blue-200 transition-colors"
                        >
                          <span>Classroom View</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Students Roster Section */}
                    <div className="p-5 sm:p-6">
                      {classroom.students.length === 0 ? (
                        <div className="py-8 px-4 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2.5">
                            <Users className="w-5 h-5" />
                          </div>
                          <p className="text-sm font-semibold text-slate-700">
                            No students enrolled yet
                          </p>
                          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                            Share join code{" "}
                            <span className="font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                              {classroom.code}
                            </span>{" "}
                            with your students so they can join this class.
                          </p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="pb-3 pl-2">#</th>
                                <th className="pb-3">Student</th>
                                <th className="pb-3">Email Address</th>
                                <th className="pb-3">Joined Date</th>
                                <th className="pb-3 text-right pr-2">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                              {classroom.students.map((student, sIdx) => {
                                const usernameVal = (student as any).username;
                                const displayName = usernameVal ? `@${usernameVal}` : student.email.split("@")[0].replace(/[._]/g, " ");
                                const initial = (usernameVal ? usernameVal[0] : student.email[0] || "S").toUpperCase();

                                return (
                                  <tr
                                    key={student.id || sIdx}
                                    className="hover:bg-slate-50/80 transition-colors group"
                                  >
                                    <td className="py-3.5 pl-2 text-xs font-mono text-slate-400">
                                      {sIdx + 1}
                                    </td>
                                    <td className="py-3.5 font-medium text-slate-900">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                                          {initial}
                                        </div>
                                        <span className="font-semibold text-slate-800">
                                          {displayName}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="py-3.5 text-slate-600 font-mono text-xs">
                                      {student.email}
                                    </td>
                                    <td className="py-3.5 text-slate-500 text-xs">
                                      {formatDateTime(student.joinedAt)}
                                    </td>
                                    <td className="py-3.5 text-right pr-2">
                                      <a
                                        href={`mailto:${student.email}`}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-600 hover:text-blue-700 text-xs font-medium rounded-lg shadow-2xs transition-colors"
                                        title={`Send email to ${student.email}`}
                                      >
                                        <Mail className="w-3.5 h-3.5" />
                                        <span>Contact</span>
                                      </a>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TeacherStudents;
