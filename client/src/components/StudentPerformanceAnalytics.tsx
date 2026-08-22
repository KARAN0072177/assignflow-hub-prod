import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Award,
  TrendingUp,
  Search,
  BookOpen,
  Mail,
  AlertTriangle,
  Sparkles,
  Download,
  Filter,
  X,
  FileCheck,
  Layers,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import type {
  TeacherAnalyticsData,
  StudentAnalyticsProfile,
} from "../services/grade.api";

interface Props {
  analytics: TeacherAnalyticsData;
}

const TIER_COLORS: Record<string, string> = {
  "High Achiever": "#10b981", // emerald
  "Good Standing": "#3b82f6", // blue
  "Needs Support": "#f59e0b", // amber
  "Not Graded": "#94a3b8", // slate
};

const PIE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ea580c", "#ef4444"];

export const StudentPerformanceAnalytics = ({ analytics }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClassFilter, setSelectedClassFilter] = useState("ALL");
  const [selectedTierFilter, setSelectedTierFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"score_desc" | "score_asc" | "name" | "submissions">("score_desc");
  const [selectedStudent, setSelectedStudent] = useState<StudentAnalyticsProfile | null>(null);

  const { students, summary, gradeDistribution, classroomsSummary } = analytics;

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        // Search filter
        const query = searchTerm.toLowerCase().trim();
        if (query) {
          const matchEmail = s.email.toLowerCase().includes(query);
          const matchName = s.name.toLowerCase().includes(query);
          const matchClass = s.classrooms.some((c) =>
            c.name.toLowerCase().includes(query)
          );
          if (!matchEmail && !matchName && !matchClass) return false;
        }

        // Classroom filter
        if (selectedClassFilter !== "ALL") {
          const inClass = s.classrooms.some(
            (c) => c.id === selectedClassFilter
          );
          if (!inClass) return false;
        }

        // Tier filter
        if (selectedTierFilter !== "ALL") {
          if (s.performanceTier !== selectedTierFilter) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "score_desc") {
          const scoreA = a.averageScore ?? -1;
          const scoreB = b.averageScore ?? -1;
          return scoreB - scoreA;
        }
        if (sortBy === "score_asc") {
          const scoreA = a.averageScore ?? 999;
          const scoreB = b.averageScore ?? 999;
          return scoreA - scoreB;
        }
        if (sortBy === "submissions") {
          return b.totalSubmitted - a.totalSubmitted;
        }
        return a.name.localeCompare(b.name);
      });
  }, [students, searchTerm, selectedClassFilter, selectedTierFilter, sortBy]);

  // Top 8 comparative students for Bar chart
  const topStudentsChartData = useMemo(() => {
    return students
      .filter((s) => s.averageScore !== null)
      .slice(0, 10)
      .map((s) => ({
        name: s.name.length > 12 ? `${s.name.substring(0, 10)}...` : s.name,
        fullName: s.name,
        email: s.email,
        score: s.averageScore,
        tier: s.performanceTier,
      }));
  }, [students]);

  // Performance Donut chart data
  const tierPieData = useMemo(() => {
    return [
      { name: "High Achievers (≥85%)", value: summary.highAchieversCount, color: "#10b981" },
      { name: "Good Standing (70-84%)", value: summary.goodStandingCount, color: "#3b82f6" },
      { name: "Needs Support (<70%)", value: summary.needsSupportCount, color: "#f59e0b" },
      { name: "Not Graded", value: summary.ungradedCount, color: "#94a3b8" },
    ].filter((d) => d.value > 0);
  }, [summary]);

  // Export to CSV
  const handleExportCSV = () => {
    if (students.length === 0) return;

    const headers = [
      "Student Name",
      "Email",
      "Enrolled Classes",
      "Total Assigned",
      "Total Submitted",
      "Total Graded",
      "Average Score (%)",
      "Letter Grade",
      "Performance Tier",
      "Joined Date",
    ];

    const rows = students.map((s) => [
      `"${s.name}"`,
      `"${s.email}"`,
      `"${s.classrooms.map((c) => c.name).join(", ")}"`,
      s.totalAssigned,
      s.totalSubmitted,
      s.totalGraded,
      s.averageScore !== null ? s.averageScore : "N/A",
      `"${s.letterGrade}"`,
      `"${s.performanceTier}"`,
      `"${new Date(s.joinedAt).toLocaleDateString()}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `student_performance_analytics_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getScoreBadgeClass = (score: number | null) => {
    if (score === null) return "bg-slate-100 text-slate-700 border-slate-200";
    if (score >= 90) return "bg-emerald-50 text-emerald-800 border-emerald-200";
    if (score >= 80) return "bg-blue-50 text-blue-800 border-blue-200";
    if (score >= 70) return "bg-amber-50 text-amber-800 border-amber-200";
    if (score >= 60) return "bg-orange-50 text-orange-800 border-orange-200";
    return "bg-rose-50 text-rose-800 border-rose-200";
  };

  return (
    <div className="space-y-8">
      {/* 1. Global KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Unique Students */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Students
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {summary.totalUniqueStudents}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enrolled across {summary.totalClassrooms} active classroom{summary.totalClassrooms !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Global Average Grade */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Overall Class Average
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {summary.overallAverageScore !== null ? `${summary.overallAverageScore}%` : "N/A"}
            </span>
            {summary.overallAverageScore !== null && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                {summary.overallAverageScore >= 80 ? "Above Target" : "Standard"}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Calculated across all evaluated submissions
          </p>
        </div>

        {/* High Achievers */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              High Achievers
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {summary.highAchieversCount}
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            {summary.totalUniqueStudents > 0
              ? `${((summary.highAchieversCount / summary.totalUniqueStudents) * 100).toFixed(0)}% of total students (≥85%)`
              : "No students"}
          </p>
        </div>

        {/* Needs Attention */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Needs Support
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {summary.needsSupportCount}
          </div>
          <p className="text-xs text-amber-600 font-medium mt-1">
            Students averaging below 70%
          </p>
        </div>
      </div>

      {/* 2. Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Grade Distribution Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Grade Tier Distribution
              </h3>
              <p className="text-xs text-slate-500">
                Count of students across standard performance grade bands
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>5 Grade Tiers</span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="grade" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white rounded-xl p-3 shadow-xl text-xs space-y-1">
                          <p className="font-bold text-white">{data.tier}</p>
                          <p className="text-slate-300">
                            Students: <span className="font-bold text-white">{data.count}</span> ({data.percentage}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Legend Chips */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 border-t border-slate-100 text-xs text-slate-600">
            {gradeDistribution.map((tier) => (
              <div key={tier.grade} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tier.color }} />
                <span>
                  {tier.grade}: <strong className="text-slate-900">{tier.count}</strong> ({tier.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Breakdown Donut Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Performance Standing
            </h3>
            <p className="text-xs text-slate-500">
              Student categorization by achievement benchmark
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            {tierPieData.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-8">
                No student grade data available yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tierPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {tierPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white rounded-xl p-2.5 text-xs shadow-lg">
                            <span className="font-semibold">{data.name}: </span>
                            <span className="font-bold text-white">{data.value}</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="space-y-2 pt-1 border-t border-slate-100">
            {tierPieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value} students</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparative Student Averages Bar Chart */}
      {topStudentsChartData.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Top Student Grade Comparison
              </h3>
              <p className="text-xs text-slate-500">
                Individual grade averages across enrolled classrooms
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg px-2.5 py-1 font-semibold">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Comparative Benchmark</span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topStudentsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} interval={0} angle={-15} textAnchor="end" />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white rounded-xl p-3 shadow-xl text-xs space-y-1">
                          <p className="font-bold text-white capitalize">{data.fullName}</p>
                          <p className="text-slate-400 font-mono text-[11px]">{data.email}</p>
                          <p className="text-slate-300 pt-1">
                            Average Grade: <span className="font-bold text-emerald-400">{data.score}%</span>
                          </p>
                          <p className="text-slate-300">
                            Tier: <span className="font-bold text-white">{data.tier}</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="score" radius={[8, 8, 0, 0]} fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 3. Filter, Search & Export Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name or email..."
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

        {/* Filter Controls & Export Button */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Class Filter */}
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="ALL">All Classrooms ({classroomsSummary.length})</option>
            {classroomsSummary.map((c) => (
              <option key={c.classroomId} value={c.classroomId}>
                {c.classroomName}
              </option>
            ))}
          </select>

          {/* Tier Filter */}
          <select
            value={selectedTierFilter}
            onChange={(e) => setSelectedTierFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="ALL">All Performance Tiers</option>
            <option value="High Achiever">High Achievers (≥85%)</option>
            <option value="Good Standing">Good Standing (70-84%)</option>
            <option value="Needs Support">Needs Support (&lt;70%)</option>
            <option value="Not Graded">Not Graded Yet</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="score_desc">Highest Grade</option>
            <option value="score_asc">Lowest Grade</option>
            <option value="submissions">Most Submissions</option>
            <option value="name">Student Name (A-Z)</option>
          </select>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            disabled={students.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4. Comprehensive Student Performance Analytics Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Student Performance Master Table
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredStudents.length} of {students.length} enrolled students
            </p>
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Filter className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">
              No matching student records found
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try modifying your search keywords, classroom filter, or tier filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3.5 pl-6">#</th>
                  <th className="py-3.5">Student</th>
                  <th className="py-3.5">Enrolled Classrooms</th>
                  <th className="py-3.5">Submissions</th>
                  <th className="py-3.5">Average Score</th>
                  <th className="py-3.5">Grade / Tier</th>
                  <th className="py-3.5 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredStudents.map((student, idx) => {
                  const initial = (student.name[0] || "S").toUpperCase();
                  const score = student.averageScore;

                  return (
                    <tr
                      key={student.studentId}
                      className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                      onClick={() => setSelectedStudent(student)}
                    >
                      {/* Rank Index */}
                      <td className="py-4 pl-6 text-xs font-mono text-slate-400">
                        {idx + 1}
                      </td>

                      {/* Student Info */}
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs shrink-0">
                            {initial}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 capitalize text-sm">
                              {student.name}
                            </p>
                            <p className="text-xs text-slate-500 font-mono">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Enrolled Classes Badges */}
                      <td className="py-4">
                        <div className="flex flex-wrap gap-1 max-w-[220px]">
                          {student.classrooms.map((cls) => (
                            <span
                              key={cls.id}
                              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 truncate max-w-[140px]"
                              title={cls.name}
                            >
                              {cls.name}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Submissions & Rate */}
                      <td className="py-4">
                        <div className="space-y-1">
                          <span className="font-bold text-xs text-slate-800">
                            {student.totalGraded} / {student.totalAssigned} Graded
                          </span>
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{ width: `${Math.min(student.submissionRate, 100)}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {student.submissionRate}% completed
                          </span>
                        </div>
                      </td>

                      {/* Average Score */}
                      <td className="py-4">
                        {score !== null ? (
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-base font-extrabold px-2.5 py-1 rounded-xl border ${getScoreBadgeClass(
                                score
                              )}`}
                            >
                              {score}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-500 border border-slate-200">
                            No Grades Yet
                          </span>
                        )}
                      </td>

                      {/* Grade Letter & Tier Badge */}
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center text-white"
                            style={{
                              backgroundColor:
                                TIER_COLORS[student.performanceTier] || "#94a3b8",
                            }}
                          >
                            {student.letterGrade}
                          </span>
                          <span
                            className="text-xs font-semibold"
                            style={{
                              color:
                                TIER_COLORS[student.performanceTier] || "#64748b",
                            }}
                          >
                            {student.performanceTier}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold rounded-xl transition-all shadow-2xs cursor-pointer"
                        >
                          <span>Drilldown</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Student Drilldown Slide-Over Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-lg flex items-center justify-center shadow-md">
                    {(selectedStudent.name[0] || "S").toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 capitalize">
                      {selectedStudent.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      {selectedStudent.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Student Summary KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Average</span>
                  <p className="text-xl font-extrabold text-slate-900 mt-0.5">
                    {selectedStudent.averageScore !== null ? `${selectedStudent.averageScore}%` : "N/A"}
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Grade</span>
                  <p className="text-xl font-extrabold text-blue-700 mt-0.5">
                    {selectedStudent.letterGrade}
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Highest</span>
                  <p className="text-xl font-extrabold text-emerald-600 mt-0.5">
                    {selectedStudent.highestScore !== null ? `${selectedStudent.highestScore}%` : "N/A"}
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Graded</span>
                  <p className="text-xl font-extrabold text-slate-900 mt-0.5">
                    {selectedStudent.totalGraded} / {selectedStudent.totalAssigned}
                  </p>
                </div>
              </div>

              {/* Enrolled Classes */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Enrolled Classrooms ({selectedStudent.classrooms.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.classrooms.map((c) => (
                    <div
                      key={c.id}
                      className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 font-medium flex items-center gap-2"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>{c.name}</span>
                      <span className="font-mono text-[10px] text-blue-600 bg-white px-1.5 py-0.5 rounded border border-blue-200">
                        {c.code}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grade Progression Line Chart (if > 1 grade) */}
              {selectedStudent.gradesHistory.length > 1 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Grade Progression Over Time
                  </span>
                  <div className="h-44 w-full bg-slate-50/70 border border-slate-200 rounded-2xl p-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[...selectedStudent.gradesHistory].reverse().map((g) => ({
                          assignment: g.assignmentTitle.length > 10 ? `${g.assignmentTitle.substring(0, 8)}..` : g.assignmentTitle,
                          score: g.score,
                        }))}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="assignment" stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#2563eb"
                          strokeWidth={2.5}
                          dot={{ fill: "#2563eb", r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Assignment Grades History */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Graded Assignments Breakdown ({selectedStudent.gradesHistory.length})
                </span>

                {selectedStudent.gradesHistory.length === 0 ? (
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
                    No assignments have been graded for this student yet.
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {selectedStudent.gradesHistory.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
                            <h5 className="font-semibold text-xs text-slate-900">
                              {item.assignmentTitle}
                            </h5>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {item.classroomName} • Graded on{" "}
                            {new Date(item.gradedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          {item.feedback && (
                            <p className="text-xs text-slate-700 bg-white border border-slate-200 rounded-lg p-2 mt-1 italic">
                              "{item.feedback}"
                            </p>
                          )}
                        </div>

                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-xl border shrink-0 ${getScoreBadgeClass(
                            item.score
                          )}`}
                        >
                          {item.score}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <a
                  href={`mailto:${selectedStudent.email}?subject=Feedback on your classroom progress`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email to {selectedStudent.name.split(" ")[0]}</span>
                </a>

                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
