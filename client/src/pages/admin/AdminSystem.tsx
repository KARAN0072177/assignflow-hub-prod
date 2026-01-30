import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Database,
  Shield,
  XCircle,
  Cpu,
  HardDrive,
  Server,
  Activity,
  ShieldCheck,
  AlertCircle,
  Clock,
  BarChart3,
  FileText,
  Users,
  Key,
  RefreshCw,
  Loader2,
  Zap,
  TrendingUp,
  AlertOctagon,
  Network,
  Database as DatabaseIcon,
  FileWarning,
  Terminal,
  Code,
  Binary,
  CircuitBoard,
  Cpu as CpuIcon,
  Waves,
  Sparkles
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Technical patterns for hover effects
const TechnicalPatterns = ({ color = "rgba(59, 130, 246, 0.05)" }) => (
  <>
    {/* Circuit pattern */}
    <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-blue-400/30 to-transparent"></div>
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-blue-400/30 to-transparent"></div>
      
      {/* Binary code animation */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-[8px] text-blue-300/30 font-mono animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.1}s`,
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </div>
        ))}
      </div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(${color} 1px, transparent 1px),
                         linear-gradient(90deg, ${color} 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
      }}></div>
    </div>
  </>
);

const AdminSystem = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"overview" | "storage" | "security" | "errors">("overview");

  const fetchSystem = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/admin/system`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data);
    } catch (error) {
      console.error("Failed to fetch system data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSystem();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSystem();
  };

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-emerald-500 border-r-transparent rounded-full animate-pulse"></div>
          </div>
          <p className="mt-6 text-slate-400 font-medium">Loading System Status</p>
          <p className="text-sm text-slate-600 mt-2">Analyzing system health and performance...</p>
        </div>
      </div>
    );
  }

  const systemHealthy = data.systemErrors.criticalLast24h === 0;
  const overallHealthScore = calculateHealthScore(data);

  function calculateHealthScore(data: any): number {
    let score = 100;

    // Deduct for critical errors
    score -= data.systemErrors.criticalLast24h * 10;

    // Deduct for data integrity issues
    if (data.dataIntegrity.orphanedSubmissions > 0) score -= 5;
    if (data.dataIntegrity.ungradedSubmissions > 100) score -= 5;

    // Deduct for storage issues
    const storageUsage = data.storage.totalSizeBytes / (1024 * 1024 * 1024); // Convert to GB
    if (storageUsage > 10) score -= 10; // Penalize if over 10GB

    return Math.max(0, Math.min(100, score));
  }

  const getHealthColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 70) return "text-amber-400";
    return "text-red-400";
  };

  const getHealthBgColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500/10";
    if (score >= 70) return "bg-amber-500/10";
    return "bg-red-500/10";
  };

  return (
    <div className="space-y-6 relative">
      {/* Animated background particles */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-500/10 rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.1,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className={`p-3 rounded-xl ${getHealthBgColor(overallHealthScore)} relative group cursor-pointer overflow-hidden`}
          >
            <TechnicalPatterns color="rgba(59, 130, 246, 0.1)" />
            <Server className={`w-8 h-8 ${getHealthColor(overallHealthScore)} relative z-10`} />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              System Dashboard
            </h1>
            <p className="text-slate-400 mt-1 flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Monitor system health, storage, and security
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/30 hover:border-blue-500/50 rounded-xl text-slate-300 hover:text-white transition-all duration-200 disabled:opacity-50 group relative overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            {refreshing ? (
              <Loader2 className="w-4 h-4 animate-spin relative z-10" />
            ) : (
              <RefreshCw className="w-4 h-4 relative z-10" />
            )}
            <span className="text-sm font-medium relative z-10">Refresh</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Health Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className={`rounded-2xl p-6 border ${systemHealthy ? 'border-emerald-500/30' : 'border-red-500/30'} ${systemHealthy ? 'bg-gradient-to-br from-emerald-900/20 to-emerald-900/10' : 'bg-gradient-to-br from-red-900/20 to-red-900/10'
          } backdrop-blur-sm relative group overflow-hidden cursor-pointer`}
      >
        <TechnicalPatterns color={systemHealthy ? "rgba(52, 211, 153, 0.05)" : "rgba(248, 113, 113, 0.05)"} />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className={`p-3 rounded-xl ${systemHealthy ? 'bg-emerald-500/20' : 'bg-red-500/20'} relative overflow-hidden group/icon`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-current/10 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"></div>
              {systemHealthy ? (
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
              ) : (
                <AlertOctagon className="w-8 h-8 text-red-400" />
              )}
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-white">
                System Status: <span className={systemHealthy ? 'text-emerald-400' : 'text-red-400'}>{systemHealthy ? 'Healthy' : 'Degraded'}</span>
              </h2>
              <p className="text-slate-400">
                {systemHealthy
                  ? 'All systems operating normally'
                  : 'Critical issues detected that require attention'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{overallHealthScore}%</div>
            <div className="text-sm text-slate-400">Health Score</div>
          </div>
        </div>

        {/* Health Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <HealthMetric
            icon={<Cpu className="w-5 h-5" />}
            label="Uptime"
            value={formatUptime(data.metadata.uptimeSeconds)}
            color="text-blue-400"
          />
          <HealthMetric
            icon={<Activity className="w-5 h-5" />}
            label="Critical Errors"
            value={data.systemErrors.criticalLast24h}
            color={data.systemErrors.criticalLast24h === 0 ? "text-emerald-400" : "text-red-400"}
            critical={data.systemErrors.criticalLast24h > 0}
          />
          <HealthMetric
            icon={<Database className="w-5 h-5" />}
            label="Storage Used"
            value={formatBytes(data.storage.totalSizeBytes)}
            color="text-purple-400"
          />
          <HealthMetric
            icon={<Users className="w-5 h-5" />}
            label="Active Logins"
            value={data.authSecurity.loginsLast24h}
            color="text-amber-400"
          />
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex items-center gap-2 border-b border-slate-800/50 relative"
      >
        {[
          { id: "overview", label: "Overview", icon: <BarChart3 className="w-4 h-4" /> },
          { id: "storage", label: "Storage", icon: <HardDrive className="w-4 h-4" /> },
          { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
          { id: "errors", label: "Errors", icon: <AlertCircle className="w-4 h-4" /> }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 relative cursor-pointer group ${selectedTab === tab.id
                ? "text-white"
                : "text-slate-400 hover:text-white"
              }`}
          >
            <div className="relative">
              {tab.icon}
              {selectedTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -inset-1 bg-blue-500/20 rounded-lg blur-sm"
                />
              )}
            </div>
            {tab.label}
            {selectedTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500"
              />
            )}
            <div className={`absolute inset-0 rounded-lg ${selectedTab === tab.id ? 'bg-blue-500/10' : 'group-hover:bg-blue-500/5'} transition-all duration-200`}></div>
          </motion.button>
        ))}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Overview Tab */}
          {selectedTab === "overview" && (
            <div className="space-y-6">
              {/* System Metadata */}
              <motion.div
                whileHover={{ scale: 1.005 }}
                className="bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 relative group overflow-hidden cursor-pointer"
              >
                <TechnicalPatterns color="rgba(59, 130, 246, 0.05)" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div 
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg"
                    >
                      <CircuitBoard className="w-5 h-5 text-blue-400" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-white">System Metadata</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { label: "Environment", value: data.metadata.environment, icon: <Server className="w-4 h-4" /> },
                      { label: "App Version", value: data.metadata.appVersion, icon: <Zap className="w-4 h-4" /> },
                      { label: "API Version", value: data.metadata.apiVersion, icon: <Network className="w-4 h-4" /> },
                      { label: "Server Time", value: new Date(data.metadata.serverTime).toLocaleString(), icon: <Clock className="w-4 h-4" /> },
                      { label: "Process ID", value: data.metadata.processId, icon: <CpuIcon className="w-4 h-4" /> },
                      { label: "Node Version", value: data.metadata.nodeVersion, icon: <DatabaseIcon className="w-4 h-4" /> }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -4, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.3)" }}
                        className="bg-gradient-to-br from-slate-800/30 to-slate-800/10 border border-slate-700/50 rounded-xl p-4 relative group/item overflow-hidden cursor-pointer"
                      >
                        <TechnicalPatterns color="rgba(255, 255, 255, 0.03)" />
                        <div className="flex items-center gap-2 mb-2">
                          <motion.div 
                            whileHover={{ scale: 1.2 }}
                            className="text-blue-400 bg-blue-500/10 p-1.5 rounded-lg"
                          >
                            {item.icon}
                          </motion.div>
                          <span className="text-sm text-slate-400">{item.label}</span>
                        </div>
                        <div className="text-white font-medium truncate">{item.value}</div>
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Data Integrity */}
              <motion.div
                whileHover={{ scale: 1.005 }}
                className="bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 relative group overflow-hidden cursor-pointer"
              >
                <TechnicalPatterns color="rgba(52, 211, 153, 0.05)" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div 
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg"
                    >
                      <Binary className="w-5 h-5 text-emerald-400" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-white">Data Integrity</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      {
                        label: "Orphaned Submissions",
                        value: data.dataIntegrity.orphanedSubmissions,
                        healthy: data.dataIntegrity.orphanedSubmissions === 0,
                        description: "Submissions without valid assignments",
                        icon: <FileWarning className="w-4 h-4" />
                      },
                      {
                        label: "Ungraded Submissions",
                        value: data.dataIntegrity.ungradedSubmissions,
                        healthy: data.dataIntegrity.ungradedSubmissions < 50,
                        description: "Submitted but not graded yet",
                        icon: <FileText className="w-4 h-4" />
                      },
                      {
                        label: "Unpublished Grades",
                        value: data.dataIntegrity.unpublishedGrades,
                        healthy: data.dataIntegrity.unpublishedGrades === 0,
                        description: "Grades not released to students",
                        icon: <FileText className="w-4 h-4" />
                      },
                      {
                        label: "Background Job Failures",
                        value: data.dataIntegrity.backgroundJobFailures,
                        healthy: data.dataIntegrity.backgroundJobFailures === "Not enabled",
                        description: "System job failures",
                        icon: <Activity className="w-4 h-4" />,
                        infoOnly: true
                      }
                    ].map((item, index) => (
                      <IntegrityItem key={index} {...item} />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Storage Tab */}
          {selectedTab === "storage" && (
            <div className="space-y-6">
              {/* Storage Overview */}
              <motion.div
                whileHover={{ scale: 1.005 }}
                className="bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 relative group overflow-hidden cursor-pointer"
              >
                <TechnicalPatterns color="rgba(168, 85, 247, 0.05)" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div 
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg"
                    >
                      <HardDrive className="w-5 h-5 text-purple-400" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-white">Storage Overview</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <StorageCard
                      title="Total Files"
                      value={data.storage.totalFiles}
                      icon={<FileText className="w-6 h-6" />}
                      color="text-blue-400"
                    />
                    <StorageCard
                      title="Total Storage"
                      value={formatBytes(data.storage.totalSizeBytes)}
                      icon={<Database className="w-6 h-6" />}
                      color="text-purple-400"
                    />
                    <StorageCard
                      title="Average File Size"
                      value={formatBytes(data.storage.avgFileSizeBytes)}
                      icon={<TrendingUp className="w-6 h-6" />}
                      color="text-emerald-400"
                    />
                  </div>

                  {/* Storage Breakdown */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <StorageBreakdown
                      title="Assignment Uploads"
                      files={data.storage.assignments.files}
                      totalSize={data.storage.assignments.totalSizeBytes}
                      avgSize={data.storage.assignments.avgSizeBytes}
                      color="blue"
                      formatBytes={formatBytes}
                    />
                    <StorageBreakdown
                      title="Submission Uploads"
                      files={data.storage.submissions.files}
                      totalSize={data.storage.submissions.totalSizeBytes}
                      avgSize={data.storage.submissions.avgSizeBytes}
                      color="purple"
                      formatBytes={formatBytes}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Storage Info Note */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 hover:border-blue-500/40 rounded-xl p-4 relative group cursor-pointer overflow-hidden"
              >
                <TechnicalPatterns color="rgba(59, 130, 246, 0.08)" />
                <div className="flex items-start gap-3 relative z-10">
                  <Code className="w-5 h-5 text-blue-400 mt-0.5 animate-pulse" />
                  <div>
                    <p className="text-sm text-slate-300">
                      <span className="font-semibold text-blue-300">INFO:</span> Storage metrics are derived from recorded file metadata. 
                      Older records may not include file size information.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Security Tab */}
          {selectedTab === "security" && (
            <div className="space-y-6">
              {/* Authentication Overview */}
              <motion.div
                whileHover={{ scale: 1.005 }}
                className="bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 relative group overflow-hidden cursor-pointer"
              >
                <TechnicalPatterns color="rgba(245, 158, 11, 0.05)" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div 
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="p-2 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg"
                    >
                      <Shield className="w-5 h-5 text-amber-400" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-white">Authentication & Security</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      {
                        label: "Successful Logins (24h)",
                        value: data.authSecurity.loginsLast24h,
                        healthy: true,
                        description: "Valid authentication events",
                        icon: <Key className="w-4 h-4" />
                      },
                      {
                        label: "Successful Logins (7d)",
                        value: data.authSecurity.loginsLast7d,
                        healthy: true,
                        description: "Weekly login volume",
                        icon: <Users className="w-4 h-4" />
                      },
                      {
                        label: "Logouts (24h)",
                        value: data.authSecurity.logoutsLast24h,
                        healthy: true,
                        description: "User-initiated logout activity",
                        icon: <Key className="w-4 h-4" />
                      },
                      {
                        label: "Failed Login Attempts",
                        value: data.authSecurity.failedLoginsLast24h,
                        healthy: data.authSecurity.failedLoginsLast24h === "Not tracked",
                        description: "Authentication failures",
                        icon: <AlertCircle className="w-4 h-4" />,
                        infoOnly: true
                      },
                      {
                        label: "Token/Auth Errors",
                        value: data.authSecurity.tokenErrorsLast24h,
                        healthy: data.authSecurity.tokenErrorsLast24h === "Not tracked",
                        description: "JWT verification failures",
                        icon: <Shield className="w-4 h-4" />,
                        infoOnly: true
                      }
                    ].map((item, index) => (
                      <IntegrityItem key={index} {...item} />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Errors Tab */}
          {selectedTab === "errors" && (
            <div className="space-y-6">
              {/* Error Overview */}
              <motion.div
                whileHover={{ scale: 1.005 }}
                className="bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 relative group overflow-hidden cursor-pointer"
              >
                <TechnicalPatterns color="rgba(248, 113, 113, 0.05)" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div 
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="p-2 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-lg"
                    >
                      <XCircle className="w-5 h-5 text-red-400" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-white">System Errors & Warnings</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <StatusCard
                      title="Total Errors (24h)"
                      value={data.systemErrors.totalLast24h}
                      color="text-slate-400"
                    />
                    <StatusCard
                      title="Critical Errors (24h)"
                      value={data.systemErrors.criticalLast24h}
                      color={data.systemErrors.criticalLast24h === 0 ? "text-emerald-400" : "text-red-400"}
                      critical={data.systemErrors.criticalLast24h > 0}
                    />
                    <StatusCard
                      title="Most Common Error"
                      value={data.systemErrors.mostCommon ? data.systemErrors.mostCommon._id : "None"}
                      color="text-amber-400"
                      text
                    />
                  </div>

                  {/* Recent Errors */}
                  <h4 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                    <Waves className="w-4 h-4" />
                    Recent Error Log
                  </h4>
                  <AnimatePresence>
                    {data.systemErrors.recent.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-center p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl relative group cursor-pointer overflow-hidden"
                      >
                        <TechnicalPatterns color="rgba(52, 211, 153, 0.08)" />
                        <div className="flex items-center gap-3 relative z-10">
                          <Sparkles className="w-5 h-5 text-emerald-400" />
                          <p className="text-emerald-300 font-medium">No recent system errors detected</p>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {data.systemErrors.recent.map((err: any, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ x: 4, boxShadow: "0 10px 30px -15px rgba(239, 68, 68, 0.3)" }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-xl p-4 relative group/item overflow-hidden cursor-pointer"
                          >
                            <TechnicalPatterns color="rgba(248, 113, 113, 0.08)" />
                            <div className="flex items-start justify-between gap-4 relative z-10">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded backdrop-blur-sm">
                                    {err.source}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    {new Date(err.createdAt).toLocaleTimeString()}
                                  </span>
                                </div>
                                <p className="text-sm text-red-300 font-medium">{err.message}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* Helper Components */
const HealthMetric = ({
  icon,
  label,
  value,
  color,
  critical = false
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  critical?: boolean
}) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02, boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.3)" }}
    className="bg-gradient-to-br from-slate-800/30 to-slate-800/10 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm relative group overflow-hidden cursor-pointer"
  >
    <TechnicalPatterns color={critical ? "rgba(248, 113, 113, 0.05)" : "rgba(59, 130, 246, 0.05)"} />
    <div className="flex items-center justify-between mb-3 relative z-10">
      <div className="flex items-center gap-2">
        <motion.div 
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.3 }}
          className={`p-2 rounded-lg ${critical ? 'bg-red-500/20' : 'bg-slate-700/50'} backdrop-blur-sm`}
        >
          <div className={color}>{icon}</div>
        </motion.div>
        <span className="text-sm text-slate-400">{label}</span>
      </div>
      {critical && (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-red-500"
        ></motion.div>
      )}
    </div>
    <div className={`text-xl font-bold ${color}`}>{value}</div>
  </motion.div>
);

const IntegrityItem = ({
  label,
  value,
  healthy,
  description,
  icon,
  infoOnly = false
}: {
  label: string;
  value: number | string;
  healthy: boolean;
  description: string;
  icon: React.ReactNode;
  infoOnly?: boolean;
}) => (
  <motion.div
    whileHover={{ x: 4, scale: 1.01 }}
    className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-br from-slate-800/30 to-slate-800/10 border border-slate-700/50 relative group overflow-hidden cursor-pointer"
  >
    <TechnicalPatterns color={infoOnly ? "rgba(100, 116, 139, 0.05)" : healthy ? "rgba(52, 211, 153, 0.05)" : "rgba(248, 113, 113, 0.05)"} />
    <motion.div 
      whileHover={{ scale: 1.1 }}
      className={`p-2 rounded-lg backdrop-blur-sm relative z-10 ${infoOnly ? 'bg-slate-700/50 text-slate-400' :
        healthy ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
      }`}
    >
      {icon}
    </motion.div>
    <div className="flex-1 relative z-10">
      <div className="flex items-center gap-2">
        <span className="font-medium text-white">{label}</span>
        <span className="text-sm text-slate-400">({value})</span>
      </div>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  </motion.div>
);

const StorageCard = ({
  title,
  value,
  icon,
  color
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string
}) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.05, boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.3)" }}
    className="bg-gradient-to-br from-slate-800/30 to-slate-800/10 border border-slate-700/50 rounded-xl p-5 backdrop-blur-sm relative group overflow-hidden cursor-pointer"
  >
    <TechnicalPatterns color="rgba(59, 130, 246, 0.05)" />
    <div className="flex items-center gap-3 mb-4 relative z-10">
      <motion.div 
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
        className={`p-2 rounded-lg ${color} bg-opacity-20 backdrop-blur-sm`}
      >
        <div className={color}>{icon}</div>
      </motion.div>
      <span className="text-sm text-slate-400">{title}</span>
    </div>
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
  </motion.div>
);

const StorageBreakdown = ({
  title,
  files,
  totalSize,
  avgSize,
  color,
  formatBytes
}: {
  title: string;
  files: number;
  totalSize: number;
  avgSize: number;
  color: 'blue' | 'purple';
  formatBytes: (bytes: number) => string;
}) => {
  const colorClasses = {
    blue: {
      text: 'text-blue-400',
      bg: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10',
      border: 'border-blue-500/20',
      pattern: 'rgba(59, 130, 246, 0.05)'
    },
    purple: {
      text: 'text-purple-400',
      bg: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10',
      border: 'border-purple-500/20',
      pattern: 'rgba(168, 85, 247, 0.05)'
    }
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02, boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.3)" }}
      className={`rounded-xl p-5 border ${colors.border} ${colors.bg} backdrop-blur-sm relative group overflow-hidden cursor-pointer`}
    >
      <TechnicalPatterns color={colors.pattern} />
      <h4 className={`font-semibold ${colors.text} mb-4 relative z-10`}>{title}</h4>
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between group/item">
          <span className="text-slate-400">Total Files</span>
          <motion.span
            whileHover={{ scale: 1.1 }}
            className="font-medium text-white px-2 py-1 rounded-lg bg-slate-800/30"
          >
            {files}
          </motion.span>
        </div>
        <div className="flex items-center justify-between group/item">
          <span className="text-slate-400">Total Size</span>
          <motion.span
            whileHover={{ scale: 1.1 }}
            className="font-medium text-white px-2 py-1 rounded-lg bg-slate-800/30"
          >
            {formatBytes(totalSize)}
          </motion.span>
        </div>
        <div className="flex items-center justify-between group/item">
          <span className="text-slate-400">Average Size</span>
          <motion.span
            whileHover={{ scale: 1.1 }}
            className="font-medium text-white px-2 py-1 rounded-lg bg-slate-800/30"
          >
            {formatBytes(avgSize)}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

const StatusCard = ({
  title,
  value,
  color,
  critical = false,
  text = false
}: {
  title: string;
  value: number | string;
  color: string;
  critical?: boolean;
  text?: boolean
}) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.05, boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.3)" }}
    className={`rounded-xl p-5 border backdrop-blur-sm relative group overflow-hidden cursor-pointer ${critical ? 'border-red-500/30 bg-gradient-to-br from-red-500/10 to-rose-500/10' : 'border-slate-700/50 bg-gradient-to-br from-slate-800/30 to-slate-800/10'
      }`}
  >
    <TechnicalPatterns color={critical ? "rgba(248, 113, 113, 0.05)" : "rgba(59, 130, 246, 0.05)"} />
    <div className="text-sm text-slate-400 mb-2 relative z-10">{title}</div>
    <div className={`text-2xl font-bold ${color} relative z-10`}>
      {text ? value : value}
    </div>
    {critical && (
      <div className="flex items-center gap-1 mt-2 text-xs text-red-400 relative z-10">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <AlertTriangle className="w-3 h-3" />
        </motion.div>
        <span>Requires attention</span>
      </div>
    )}
  </motion.div>
);

export default AdminSystem;