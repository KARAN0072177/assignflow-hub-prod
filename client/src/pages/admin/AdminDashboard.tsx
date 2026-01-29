import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  BookOpen,
  FileText,
  Award,
  Upload,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Shield,
  Cpu,
  Activity,
  RefreshCw,
  Zap,
  Database,
  LineChart,
  AlertTriangle,
  CheckCheck,
  XCircle,
  Loader2,
  Sparkles
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const AdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/admin/analytics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalytics();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="relative mx-auto w-16 h-16"
          >
            <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <div className="absolute inset-2 border-4 border-emerald-500 border-r-transparent rounded-full animate-pulse"></div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-slate-400 font-medium"
          >
            Loading Dashboard
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-slate-600 mt-2"
          >
            Fetching system analytics...
          </motion.p>
        </div>
      </div>
    );
  }

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Activity className="w-4 h-4 text-blue-400" />;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-emerald-200 bg-clip-text text-transparent">
            System Dashboard
          </h1>
          <p className="text-slate-400 mt-2">
            Real-time analytics and system health monitoring
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={refreshing}
          className="group relative inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-slate-300 hover:text-white transition-all duration-200 disabled:opacity-50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {refreshing ? (
            <Loader2 className="w-4 h-4 animate-spin relative z-10" />
          ) : (
            <RefreshCw className="w-4 h-4 relative z-10 group-hover:rotate-180 transition-transform duration-500" />
          )}
          <span className="text-sm font-medium relative z-10">Refresh Data</span>
        </motion.button>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <HoverCard
          id="users-card"
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
          gradient="from-blue-900/30 to-blue-900/10"
          borderColor="border-blue-800/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-xs px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">
              Live
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{data.users.total}</div>
          <p className="text-sm text-slate-400">Total Users</p>
          <div className="flex items-center gap-2 mt-3 text-sm">
            {getTrendIcon(data.users.last24h, 0)}
            <span className="text-slate-400">+{data.users.last24h} today</span>
          </div>
        </HoverCard>

        <HoverCard
          id="classrooms-card"
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
          gradient="from-emerald-900/30 to-emerald-900/10"
          borderColor="border-emerald-800/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <BookOpen className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="text-xs px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
              Active
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{data.classrooms.total}</div>
          <p className="text-sm text-slate-400">Classrooms</p>
          <div className="flex items-center gap-2 mt-3 text-sm">
            {getTrendIcon(data.classrooms.last7d, 0)}
            <span className="text-slate-400">+{data.classrooms.last7d} this week</span>
          </div>
        </HoverCard>

        <HoverCard
          id="submissions-card"
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
          gradient="from-purple-900/30 to-purple-900/10"
          borderColor="border-purple-800/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-xs px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">
              Processed
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{data.submissions.total}</div>
          <p className="text-sm text-slate-400">Submissions</p>
          <div className="flex items-center gap-2 mt-3 text-sm">
            {getTrendIcon(data.submissions.last24h, 0)}
            <span className="text-slate-400">+{data.submissions.last24h} today</span>
          </div>
        </HoverCard>

        <HoverCard
          id="grades-card"
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
          gradient="from-amber-900/30 to-amber-900/10"
          borderColor="border-amber-800/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-500/20 rounded-xl">
              <Award className="w-6 h-6 text-amber-400" />
            </div>
            <div className="text-xs px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full">
              Graded
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{data.grades.published}</div>
          <p className="text-sm text-slate-400">Published Grades</p>
          <div className="flex items-center gap-2 mt-3 text-sm">
            {getTrendIcon(data.grades.publishedLast7d, 0)}
            <span className="text-slate-400">+{data.grades.publishedLast7d} this week</span>
          </div>
        </HoverCard>
      </motion.div>

      {/* Detailed Metrics Grid */}
      <div className="space-y-8">
        {/* Users Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-slate-700/50 transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">User Analytics</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <MetricCard
              id="total-users"
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              title="Total Users"
              value={data.users.total}
              icon={Users}
              trend={data.users.last24h > 0 ? 'up' : 'neutral'}
              trendText={`+${data.users.last24h} today`}
            />
            <MetricCard
              id="new-24h"
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              title="New (24h)"
              value={data.users.last24h}
              icon={Zap}
              color="text-emerald-400"
            />
            <MetricCard
              id="new-7d"
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              title="New (7d)"
              value={data.users.last7d}
              icon={TrendingUp}
              color="text-blue-400"
            />
            <MetricCard
              id="students"
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              title="Students"
              value={data.users.students}
              icon={Users}
              color="text-slate-400"
            />
            <MetricCard
              id="teachers"
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              title="Teachers"
              value={data.users.teachers}
              icon={Users}
              color="text-amber-400"
            />
          </div>
        </motion.section>

        {/* Platform Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-slate-700/50 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <BookOpen className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Platform Growth</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  id="classrooms"
                  hoveredCard={hoveredCard}
                  setHoveredCard={setHoveredCard}
                  title="Classrooms"
                  value={data.classrooms.total}
                  subtitle={`+${data.classrooms.last7d} this week`}
                  compact
                />
                <MetricCard
                  id="enrollments"
                  hoveredCard={hoveredCard}
                  setHoveredCard={setHoveredCard}
                  title="Enrollments"
                  value={data.enrollments.total}
                  subtitle={`+${data.enrollments.last7d} this week`}
                  compact
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  id="assignments"
                  hoveredCard={hoveredCard}
                  setHoveredCard={setHoveredCard}
                  title="Assignments"
                  value={data.assignments.total}
                  subtitle={`+${data.assignments.last7d} this week`}
                  compact
                />
                <MetricCard
                  id="grades"
                  hoveredCard={hoveredCard}
                  setHoveredCard={setHoveredCard}
                  title="Grades"
                  value={data.grades.total}
                  subtitle={`+${data.grades.publishedLast7d} published`}
                  compact
                />
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-slate-700/50 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Upload className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Submission Status</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <MetricCard
                  id="total-submissions"
                  hoveredCard={hoveredCard}
                  setHoveredCard={setHoveredCard}
                  title="Total"
                  value={data.submissions.total}
                  icon={Database}
                  compact
                />
                <MetricCard
                  id="draft-submissions"
                  hoveredCard={hoveredCard}
                  setHoveredCard={setHoveredCard}
                  title="Draft"
                  value={data.submissions.draft}
                  icon={FileText}
                  color="text-amber-400"
                  compact
                />
                <MetricCard
                  id="submitted-submissions"
                  hoveredCard={hoveredCard}
                  setHoveredCard={setHoveredCard}
                  title="Submitted"
                  value={data.submissions.submitted}
                  icon={CheckCircle}
                  color="text-emerald-400"
                  compact
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  id="24h-submissions"
                  hoveredCard={hoveredCard}
                  setHoveredCard={setHoveredCard}
                  title="Last 24h"
                  value={data.submissions.last24h}
                  icon={Zap}
                  color="text-blue-400"
                  compact
                />
                <MetricCard
                  id="locked-submissions"
                  hoveredCard={hoveredCard}
                  setHoveredCard={setHoveredCard}
                  title="Locked"
                  value={data.submissions.locked}
                  icon={XCircle}
                  color="text-red-400"
                  compact
                />
              </div>
            </div>
          </motion.section>
        </div>

        {/* System Health & Background Jobs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-slate-700/50 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <LineChart className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">System Health</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <HealthMetric
                  id="submission-rate"
                  hoveredCard={hoveredCard}
                  setHoveredCard={setHoveredCard}
                  title="Submission Rate"
                  value={Math.round(data.health.submissionCompletionRate * 100)}
                  unit="%"
                  color={data.health.submissionCompletionRate > 0.7 ? 'emerald' : 'amber'}
                />
                <HealthMetric
                  id="miss-rate"
                  hoveredCard={hoveredCard}
                  setHoveredCard={setHoveredCard}
                  title="Miss Rate"
                  value={Math.round(data.health.deadlineMissRate * 100)}
                  unit="%"
                  color={data.health.deadlineMissRate < 0.2 ? 'emerald' : 'red'}
                />
                <HealthMetric
                  id="grading-rate"
                  hoveredCard={hoveredCard}
                  setHoveredCard={setHoveredCard}
                  title="Grading Rate"
                  value={Math.round(data.health.gradingCompletionRate * 100)}
                  unit="%"
                  color={data.health.gradingCompletionRate > 0.8 ? 'emerald' : 'amber'}
                />
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-slate-700/50 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Cpu className="w-5 h-5 text-amber-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Background Jobs</h2>
            </div>
            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative group"
                onMouseEnter={() => setHoveredCard("background-job")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <HoverEffect id="background-job" hoveredCard={hoveredCard} />
                <div className="relative p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 backdrop-blur-sm overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-slate-300">Auto-lock Service</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-emerald-500"
                      />
                      <span className="text-xs text-slate-400">Running</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400">
                    Last run:{' '}
                    <span className="text-slate-300">
                      {data.backgroundJobs.autoLock.lastRunAt
                        ? new Date(data.backgroundJobs.autoLock.lastRunAt).toLocaleString()
                        : 'Never'}
                    </span>
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.section>
        </div>

        {/* System Alerts */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-slate-700/50 transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2 rounded-lg ${
              data.alerts.length === 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'
            }`}>
              <AlertCircle className={`w-5 h-5 ${
                data.alerts.length === 0 ? 'text-emerald-400' : 'text-red-400'
              }`} />
            </div>
            <h2 className="text-xl font-semibold text-white">System Alerts</h2>
          </div>

          <AnimatePresence mode="wait">
            {data.alerts.length === 0 ? (
              <motion.div
                key="no-alerts"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group"
                onMouseEnter={() => setHoveredCard("no-alerts")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <HoverEffect id="no-alerts" hoveredCard={hoveredCard} color="emerald" />
                <div className="relative flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl backdrop-blur-sm overflow-hidden">
                  <CheckCheck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="font-medium text-emerald-300">All systems operational</p>
                    <p className="text-sm text-emerald-400/80">No critical alerts detected</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="alerts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {data.alerts.map((alert: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="relative group"
                    onMouseEnter={() => setHoveredCard(`alert-${index}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <HoverEffect id={`alert-${index}`} hoveredCard={hoveredCard} color="red" />
                    <div className="relative flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm overflow-hidden">
                      <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-red-300">{alert}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </div>
    </div>
  );
};

// Enhanced Hover Card Component with Particles
const HoverCard = ({
  id,
  children,
  hoveredCard,
  setHoveredCard,
  gradient,
  borderColor
}: {
  id: string;
  children: React.ReactNode;
  hoveredCard: string | null;
  setHoveredCard: (id: string | null) => void;
  gradient: string;
  borderColor: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="relative group"
    onMouseEnter={() => setHoveredCard(id)}
    onMouseLeave={() => setHoveredCard(null)}
  >
    <HoverEffect id={id} hoveredCard={hoveredCard} />
    <div className={`relative bg-gradient-to-br ${gradient} ${borderColor} border rounded-2xl p-6 backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-300`}>
      {children}
    </div>
  </motion.div>
);

// Enhanced Metric Card with Particles
const MetricCard = ({
  id,
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  trendText,
  color = "text-white",
  compact = false,
  hoveredCard,
  setHoveredCard
}: {
  id: string;
  title: string;
  value: number | string;
  icon?: any;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendText?: string;
  color?: string;
  compact?: boolean;
  hoveredCard: string | null;
  setHoveredCard: (id: string | null) => void;
}) => (
  <motion.div
    whileHover={{ scale: 1.03, y: -3 }}
    className="relative group"
    onMouseEnter={() => setHoveredCard(id)}
    onMouseLeave={() => setHoveredCard(null)}
  >
    <HoverEffect id={id} hoveredCard={hoveredCard} />
    <div className={`relative bg-slate-800/30 border border-slate-700/50 rounded-xl p-${compact ? '4' : '5'} backdrop-blur-sm cursor-pointer transition-all duration-200 overflow-hidden`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`flex items-center gap-3 ${compact ? 'mb-2' : 'mb-4'}`}>
          {Icon && (
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              className="p-2 bg-slate-700/50 rounded-lg"
            >
              <Icon className={`w-4 h-4 ${color}`} />
            </motion.div>
          )}
          <span className="text-sm font-medium text-slate-400">{title}</span>
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            {trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-400" />}
            {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
            {trend === 'neutral' && <Activity className="w-4 h-4 text-blue-400" />}
          </div>
        )}
      </div>
      <div className={`font-bold ${color} ${compact ? 'text-2xl' : 'text-3xl'} mb-1`}>
        {value}
      </div>
      {subtitle && (
        <p className="text-xs text-slate-500">{subtitle}</p>
      )}
      {trendText && (
        <div className="flex items-center gap-2 mt-3 text-sm">
          <span className="text-slate-400">{trendText}</span>
        </div>
      )}
    </div>
  </motion.div>
);

// Enhanced Health Metric
const HealthMetric = ({
  id,
  title,
  value,
  unit,
  color = 'emerald',
  hoveredCard,
  setHoveredCard
}: {
  id: string;
  title: string;
  value: number;
  unit: string;
  color: 'emerald' | 'amber' | 'red';
  hoveredCard: string | null;
  setHoveredCard: (id: string | null) => void;
}) => {
  const colorClasses = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative group"
      onMouseEnter={() => setHoveredCard(id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <HoverEffect id={id} hoveredCard={hoveredCard} color={color} />
      <div className={`relative p-4 rounded-xl border ${colorClasses[color]} backdrop-blur-sm cursor-pointer overflow-hidden`}>
        <div className="text-sm font-medium text-slate-300 mb-2">{title}</div>
        <div className="flex items-baseline gap-1">
          <div className={`text-2xl font-bold`}>{value}</div>
          <div className="text-sm text-slate-400">{unit}</div>
        </div>
        <div className="mt-3">
          <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${value}%` }}
              transition={{ duration: 1.5, delay: 0.3, type: "spring" }}
              className={`h-full rounded-full ${
                color === 'emerald' ? 'bg-emerald-500' :
                color === 'amber' ? 'bg-amber-500' : 'bg-red-500'
              }`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Hover Effect with Particles
const HoverEffect = ({ 
  id, 
  hoveredCard, 
  color = "default" 
}: { 
  id: string; 
  hoveredCard: string | null; 
  color?: "default" | "emerald" | "red" | "amber" | "blue" | "purple" 
}) => {
  const isActive = hoveredCard === id;
  const particleColor = color === "emerald" ? "emerald" : 
                       color === "red" ? "red" : 
                       color === "amber" ? "amber" : 
                       color === "blue" ? "blue" : 
                       color === "purple" ? "purple" : "slate";

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Animated Gradient Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 0.1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`absolute inset-0 bg-gradient-to-r ${
          particleColor === "emerald" ? "from-emerald-500/20 to-emerald-500/5" :
          particleColor === "red" ? "from-red-500/20 to-red-500/5" :
          particleColor === "amber" ? "from-amber-500/20 to-amber-500/5" :
          particleColor === "blue" ? "from-blue-500/20 to-blue-500/5" :
          particleColor === "purple" ? "from-purple-500/20 to-purple-500/5" :
          "from-slate-500/20 to-slate-500/5"
        }`}
      />

      {/* Floating Particles */}
      {isActive && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 rounded-full ${
                particleColor === "emerald" ? "bg-emerald-400/40" :
                particleColor === "red" ? "bg-red-400/40" :
                particleColor === "amber" ? "bg-amber-400/40" :
                particleColor === "blue" ? "bg-blue-400/40" :
                particleColor === "purple" ? "bg-purple-400/40" :
                "bg-slate-400/40"
              }`}
              initial={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                scale: 0,
              }}
              animate={{
                x: [
                  `${Math.random() * 100}%`,
                  `${Math.random() * 100}%`,
                  `${Math.random() * 100}%`
                ],
                y: [
                  `${Math.random() * 100}%`,
                  `${Math.random() * 100}%`,
                  `${Math.random() * 100}%`
                ],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Sparkle Effects */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute"
              initial={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                rotate: 0,
                opacity: 0,
              }}
              animate={{
                rotate: 360,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "linear",
              }}
            >
              <Sparkles className={`w-3 h-3 ${
                particleColor === "emerald" ? "text-emerald-400/60" :
                particleColor === "red" ? "text-red-400/60" :
                particleColor === "amber" ? "text-amber-400/60" :
                particleColor === "blue" ? "text-blue-400/60" :
                particleColor === "purple" ? "text-purple-400/60" :
                "text-slate-400/60"
              }`} />
            </motion.div>
          ))}

          {/* Pulse Ring */}
          <motion.div
            className="absolute inset-0 border-2 rounded-xl"
            initial={{ borderColor: "transparent" }}
            animate={{
              borderColor: [
                "transparent",
                particleColor === "emerald" ? "rgba(52, 211, 153, 0.3)" :
                particleColor === "red" ? "rgba(248, 113, 113, 0.3)" :
                particleColor === "amber" ? "rgba(251, 191, 36, 0.3)" :
                particleColor === "blue" ? "rgba(59, 130, 246, 0.3)" :
                particleColor === "purple" ? "rgba(168, 85, 247, 0.3)" :
                "rgba(148, 163, 184, 0.3)",
                "transparent"
              ],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Inner Glow */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.2, 0],
              boxShadow: [
                "inset 0 0 0 0px rgba(255,255,255,0.1)",
                `inset 0 0 30px 10px ${
                  particleColor === "emerald" ? "rgba(52, 211, 153, 0.1)" :
                  particleColor === "red" ? "rgba(248, 113, 113, 0.1)" :
                  particleColor === "amber" ? "rgba(251, 191, 36, 0.1)" :
                  particleColor === "blue" ? "rgba(59, 130, 246, 0.1)" :
                  particleColor === "purple" ? "rgba(168, 85, 247, 0.1)" :
                  "rgba(148, 163, 184, 0.1)"
                }`,
                "inset 0 0 0 0px rgba(255,255,255,0.1)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </>
      )}

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300"
           style={{
             backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
             backgroundSize: '20px 20px',
           }}
      />
    </div>
  );
};

export default AdminDashboard;