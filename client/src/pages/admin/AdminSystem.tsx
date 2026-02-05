import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertTriangle,
  Info,
  Database,
  Shield,
  XCircle,
  Clock,
  Cpu,
  HardDrive,
  Network,
  Server,
  FileCheck,
  FileWarning,
  Lock,
  Key,
  Activity,
  AlertCircle,
  RefreshCw,
  Loader2,
  Binary,
  CircuitBoard,
  Cog,
  ShieldCheck,
  ShieldAlert,
  FolderOpen,
  FileText,
  HardDriveDownload,
  HardDriveUpload,
  ServerCog} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

const AdminSystem = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "linear",
              scale: {
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
            className="relative mx-auto w-20 h-20"
          >
            {/* Server Gear Loading Animation */}
            <div className="absolute inset-0">
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <Cog className="w-20 h-20 text-blue-500/30" />
              </motion.div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4"
              >
                <ServerCog className="w-12 h-12 text-emerald-500/40" />
              </motion.div>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-lg font-medium bg-gradient-to-r from-blue-300 to-emerald-300 bg-clip-text text-transparent"
          >
            Initializing System Diagnostics
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-slate-500 mt-2"
          >
            Checking system integrity and loading metrics...
          </motion.p>
        </div>
      </div>
    );
  }

  const systemHealthy = data.systemErrors.criticalLast24h === 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="p-2 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-xl"
            >
              <ServerCog className="w-6 h-6 text-blue-400" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-emerald-200 bg-clip-text text-transparent">
              System Diagnostics
            </h1>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 mt-2"
          >
            Real-time health monitoring, security logs, and system analytics
          </motion.p>
        </div>
        <motion.button
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)"
          }}
          whileTap={{ scale: 0.97 }}
          onClick={handleRefresh}
          disabled={refreshing}
          className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-slate-800/80 to-slate-900/80 hover:from-slate-800 hover:to-slate-900 border border-slate-700/50 hover:border-blue-500/30 rounded-xl text-slate-300 hover:text-white transition-all duration-300 disabled:opacity-50 overflow-hidden cursor-pointer"
        >
          {/* Button Background Glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-emerald-600/0"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear"
            }}
          />
          {refreshing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-4 h-4 relative z-10" />
            </motion.div>
          ) : (
            <motion.div
              animate={{ rotate: 0 }}
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              <RefreshCw className="w-4 h-4 relative z-10" />
            </motion.div>
          )}
          <span className="text-sm font-medium relative z-10">
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </span>
        </motion.button>
      </motion.div>

      {/* System Status Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, type: "spring" }}
        className="relative group"
        onMouseEnter={() => {
          setHoveredCard("system-status");
          setActiveSection("status");
        }}
        onMouseLeave={() => {
          setHoveredCard(null);
          setActiveSection(null);
        }}
      >
        <SystemHoverEffect 
          id="system-status" 
          hoveredCard={hoveredCard} 
          color={systemHealthy ? "emerald" : "red"}
          isActive={activeSection === "status"}
        />
        <motion.div
          whileHover={{ 
            y: -4,
            transition: { type: "spring", stiffness: 300 }
          }}
          className={`relative bg-gradient-to-br ${
            systemHealthy 
              ? "from-emerald-900/40 via-emerald-900/20 to-emerald-900/10 border-emerald-800/40" 
              : "from-red-900/40 via-red-900/20 to-red-900/10 border-red-800/40"
          } border rounded-2xl p-6 backdrop-blur-xl overflow-hidden cursor-pointer transition-all duration-300`}
          style={{
            boxShadow: systemHealthy 
              ? "0 8px 32px rgba(16, 185, 129, 0.15)" 
              : "0 8px 32px rgba(239, 68, 68, 0.15)"
          }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={systemHealthy ? { 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              } : {
                scale: [1, 1.05, 1],
                x: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 1
              }}
              className="p-3 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50"
              style={{
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)"
              }}
            >
              {systemHealthy ? (
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-8 h-8 text-red-400" />
              )}
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-white">System Status</h2>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    systemHealthy 
                      ? "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-400" 
                      : "bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400"
                  }`}
                  style={{
                    boxShadow: systemHealthy 
                      ? "0 4px 12px rgba(16, 185, 129, 0.2)" 
                      : "0 4px 12px rgba(239, 68, 68, 0.2)"
                  }}
                >
                  {systemHealthy ? "Operational" : "Degraded"}
                </motion.span>
              </div>
              <p className="text-slate-400 mt-1">
                {systemHealthy 
                  ? "All systems are functioning normally" 
                  : "Critical errors detected in the last 24 hours"}
              </p>
            </div>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Activity className={`w-6 h-6 ${systemHealthy ? 'text-emerald-400' : 'text-red-400'}`} />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* System Metadata */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative group"
        onMouseEnter={() => setActiveSection("metadata")}
        onMouseLeave={() => setActiveSection(null)}
      >
        <SystemHoverEffect 
          id="metadata-section" 
          hoveredCard={hoveredCard} 
          color="blue"
          isActive={activeSection === "metadata"}
        />
        <div className="relative bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 hover:border-blue-500/30 rounded-2xl p-6 transition-all duration-300"
             style={{
               boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
             }}
        >
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center gap-3 mb-6"
          >
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-2 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg"
            >
              <Server className="w-5 h-5 text-blue-400" />
            </motion.div>
            <h2 className="text-xl font-semibold text-white">System Metadata</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetadataCard
              id="environment"
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              label="Environment"
              value={data.metadata.environment}
              icon={CircuitBoard}
              color="blue"
            />
            <MetadataCard
              id="uptime"
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              label="Uptime"
              value={formatUptime(data.metadata.uptimeSeconds)}
              icon={Clock}
              color="emerald"
            />
            <MetadataCard
              id="version"
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              label="App Version"
              value={data.metadata.appVersion}
              icon={Binary}
              color="purple"
            />
            <MetadataCard
              id="node-version"
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              label="Node Version"
              value={data.metadata.nodeVersion}
              icon={Cog}
              color="amber"
            />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 grid grid-cols-2 gap-4"
          >
            <div className="text-sm p-3 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Clock className="w-4 h-4" />
                <span>Server Time</span>
              </div>
              <p className="text-white">{new Date(data.metadata.serverTime).toLocaleString()}</p>
            </div>
            <div className="text-sm p-3 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Cpu className="w-4 h-4" />
                <span>Process ID</span>
              </div>
              <p className="text-white">{data.metadata.processId}</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Data Integrity & Storage Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Integrity */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="relative group"
          onMouseEnter={() => setActiveSection("integrity")}
          onMouseLeave={() => setActiveSection(null)}
        >
          <SystemHoverEffect 
            id="integrity-section" 
            hoveredCard={hoveredCard} 
            color="emerald"
            isActive={activeSection === "integrity"}
          />
          <div className="relative bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 hover:border-emerald-500/30 rounded-2xl p-6 transition-all duration-300"
               style={{
                 boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
               }}
          >
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center gap-3 mb-6"
            >
              <motion.div
                whileHover={{ rotate: -15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-2 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-lg"
              >
                <FileCheck className="w-5 h-5 text-emerald-400" />
              </motion.div>
              <h2 className="text-xl font-semibold text-white">Data Integrity</h2>
            </motion.div>

            <div className="space-y-3">
              <IntegrityItem
                id="orphaned-submissions"
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
                label="Orphaned submissions"
                value={data.dataIntegrity.orphanedSubmissions}
                healthy={data.dataIntegrity.orphanedSubmissions === 0}
                description="Submissions without valid assignment"
                icon={FileWarning}
              />
              <IntegrityItem
                id="ungraded-submissions"
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
                label="Ungraded submissions"
                value={data.dataIntegrity.ungradedSubmissions}
                healthy={data.dataIntegrity.ungradedSubmissions === 0}
                description="Submitted assignments not yet graded"
                icon={FileText}
              />
              <IntegrityItem
                id="unpublished-grades"
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
                label="Unpublished grades"
                value={data.dataIntegrity.unpublishedGrades}
                healthy={data.dataIntegrity.unpublishedGrades === 0}
                description="Grades created but not released"
                icon={Lock}
              />
            </div>
          </div>
        </motion.section>

        {/* Storage Health */}
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="relative group"
          onMouseEnter={() => setActiveSection("storage")}
          onMouseLeave={() => setActiveSection(null)}
        >
          <SystemHoverEffect 
            id="storage-section" 
            hoveredCard={hoveredCard} 
            color="blue"
            isActive={activeSection === "storage"}
          />
          <div className="relative bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 hover:border-blue-500/30 rounded-2xl p-6 transition-all duration-300"
               style={{
                 boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
               }}
          >
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center gap-3 mb-6"
            >
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-2 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg"
              >
                <HardDrive className="w-5 h-5 text-blue-400" />
              </motion.div>
              <h2 className="text-xl font-semibold text-white">Storage Health</h2>
            </motion.div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <StorageMetric
                id="total-files"
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
                title="Total Files"
                value={data.storage.totalFiles}
                icon={FolderOpen}
                color="blue"
              />
              <StorageMetric
                id="total-storage"
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
                title="Storage Used"
                value={formatBytes(data.storage.totalSizeBytes)}
                icon={HardDriveUpload}
                color="emerald"
              />
              <StorageMetric
                id="avg-file-size"
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
                title="Avg File Size"
                value={formatBytes(data.storage.avgFileSizeBytes)}
                icon={HardDriveDownload}
                color="purple"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StorageBreakdown
                id="assignments"
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
                title="Assignment Uploads"
                files={data.storage.assignments.files}
                totalSize={data.storage.assignments.totalSizeBytes}
                avgSize={data.storage.assignments.avgSizeBytes}
                icon={FileText}
              />
              <StorageBreakdown
                id="submissions"
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
                title="Submission Uploads"
                files={data.storage.submissions.files}
                totalSize={data.storage.submissions.totalSizeBytes}
                avgSize={data.storage.submissions.avgSizeBytes}
                icon={Upload}
              />
            </div>
          </div>
        </motion.section>
      </div>

      {/* Security & System Errors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security & Auth */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="relative group"
          onMouseEnter={() => setActiveSection("security")}
          onMouseLeave={() => setActiveSection(null)}
        >
          <SystemHoverEffect 
            id="security-section" 
            hoveredCard={hoveredCard} 
            color="amber"
            isActive={activeSection === "security"}
          />
          <div className="relative bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 hover:border-amber-500/30 rounded-2xl p-6 transition-all duration-300"
               style={{
                 boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
               }}
          >
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center gap-3 mb-6"
            >
              <motion.div
                whileHover={{ rotate: -15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-2 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-lg"
              >
                <Shield className="w-5 h-5 text-amber-400" />
              </motion.div>
              <h2 className="text-xl font-semibold text-white">Authentication & Security</h2>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <SecurityMetric
                id="logins-24h"
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
                title="Logins (24h)"
                value={data.authSecurity.loginsLast24h}
                icon={Key}
                color="emerald"
              />
              <SecurityMetric
                id="logouts-24h"
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
                title="Logouts (24h)"
                value={data.authSecurity.logoutsLast24h}
                icon={Lock}
                color="blue"
              />
            </div>

            <IntegrityItem
              id="failed-logins"
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              label="Failed login attempts"
              value={data.authSecurity.failedLoginsLast24h}
              healthy={data.authSecurity.failedLoginsLast24h === "Not tracked"}
              description="Tracking not enabled yet"
              icon={XCircle}
              infoOnly
            />
          </div>
        </motion.section>

        {/* System Errors */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="relative group"
          onMouseEnter={() => setActiveSection("errors")}
          onMouseLeave={() => setActiveSection(null)}
        >
          <SystemHoverEffect 
            id="errors-section" 
            hoveredCard={hoveredCard} 
            color="red"
            isActive={activeSection === "errors"}
          />
          <div className="relative bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 hover:border-red-500/30 rounded-2xl p-6 transition-all duration-300"
               style={{
                 boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
               }}
          >
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center gap-3 mb-6"
            >
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-2 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-lg"
              >
                <AlertCircle className="w-5 h-5 text-red-400" />
              </motion.div>
              <h2 className="text-xl font-semibold text-white">System Errors</h2>
            </motion.div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <ErrorMetric
                id="total-errors"
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
                title="Total (24h)"
                value={data.systemErrors.totalLast24h}
                icon={XCircle}
                critical={data.systemErrors.totalLast24h > 0}
              />
              <ErrorMetric
                id="critical-errors"
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
                title="Critical (24h)"
                value={data.systemErrors.criticalLast24h}
                icon={AlertTriangle}
                critical={data.systemErrors.criticalLast24h > 0}
              />
              <ErrorMetric
                id="common-error"
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
                title="Most Common"
                value={data.systemErrors.mostCommon ? data.systemErrors.mostCommon._id : "None"}
                icon={Info}
                text
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-400 mb-2">Recent Errors</h3>
              <AnimatePresence>
                {data.systemErrors.recent.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-xl cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>No recent system errors</span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-2">
                    {data.systemErrors.recent.slice(0, 3).map((err: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 5 }}
                        className="p-3 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-lg cursor-pointer"
                      >
                        <div className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <span className="text-sm text-red-300 font-medium">{err.source}</span>
                              <span className="text-xs text-slate-400">
                                {new Date(err.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm text-slate-300 mt-1">{err.message}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Rate Limit Events */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="relative group"
        onMouseEnter={() => setActiveSection("rate-limit")}
        onMouseLeave={() => setActiveSection(null)}
      >
        <SystemHoverEffect 
          id="rate-limit-section" 
          hoveredCard={hoveredCard} 
          color="purple"
          isActive={activeSection === "rate-limit"}
        />
        <div className="relative bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 hover:border-purple-500/30 rounded-2xl p-6 transition-all duration-300"
             style={{
               boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
             }}
        >
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center gap-3 mb-6"
          >
            <motion.div
              whileHover={{ rotate: -15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-2 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg"
            >
              <Network className="w-5 h-5 text-purple-400" />
            </motion.div>
            <h2 className="text-xl font-semibold text-white">Rate Limit Events</h2>
          </motion.div>

          <AnimatePresence>
            {data.securityEvents.rateLimitHits.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-xl cursor-pointer"
              >
                <div className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>No recent rate-limit violations</span>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {data.securityEvents.rateLimitHits.slice(0, 5).map((event: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      x: 5,
                      borderColor: "rgba(168, 85, 247, 0.4)"
                    }}
                    className="p-4 bg-gradient-to-r from-slate-800/30 to-slate-900/30 border border-slate-700/50 rounded-xl cursor-pointer transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-amber-400" />
                        <span className="font-medium text-slate-300">{event.ip}</span>
                      </div>
                      <span className="text-sm text-slate-400">
                        {new Date(event.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-slate-400 mb-1">
                      {event.method} {event.endpoint}
                    </div>
                    {event.userAgent && (
                      <div className="text-xs text-slate-500 truncate">
                        {event.userAgent}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
          
          <p className="text-xs text-slate-500 mt-4 flex items-center gap-2">
            <Info className="w-3 h-3" />
            Rate-limit events are logged for observation only. No automatic bans are applied.
          </p>
        </div>
      </motion.section>
    </div>
  );
};

/* =====================
   Enhanced Helper Components
===================== */

const MetadataCard = ({
  id,
  label,
  value,
  icon: Icon,
  color = "blue",
  hoveredCard,
  setHoveredCard
}: {
  id: string;
  label: string;
  value: string | number;
  icon: any;
  color: "blue" | "emerald" | "purple" | "amber" | "red";
  hoveredCard: string | null;
  setHoveredCard: (id: string | null) => void;
}) => {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/20 text-blue-400",
    emerald: "from-emerald-500/20 to-emerald-600/20 text-emerald-400",
    purple: "from-purple-500/20 to-purple-600/20 text-purple-400",
    amber: "from-amber-500/20 to-amber-600/20 text-amber-400",
    red: "from-red-500/20 to-red-600/20 text-red-400"
  };

  return (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        y: -4,
        transition: { type: "spring", stiffness: 300 }
      }}
      className="relative group cursor-pointer"
      onMouseEnter={() => setHoveredCard(id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <SystemHoverEffect id={id} hoveredCard={hoveredCard} color={color} />
      <div className="relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-slate-600/50"
           style={{
             boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)"
           }}
      >
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]}`}
          >
            <Icon className="w-4 h-4" />
          </motion.div>
          <span className="text-sm font-medium text-slate-400">{label}</span>
        </div>
        <div className="text-lg font-bold text-white truncate">{value}</div>
      </div>
    </motion.div>
  );
};

const IntegrityItem = ({
  id,
  label,
  value,
  healthy,
  description,
  icon: Icon,
  infoOnly = false,
  hoveredCard,
  setHoveredCard
}: {
  id: string;
  label: string;
  value: number | string;
  healthy: boolean;
  description: string;
  icon: any;
  infoOnly?: boolean;
  hoveredCard: string | null;
  setHoveredCard: (id: string | null) => void;
}) => (
  <motion.div
    whileHover={{ 
      x: 8,
      transition: { type: "spring", stiffness: 300 }
    }}
    className="relative group cursor-pointer"
    onMouseEnter={() => setHoveredCard(id)}
    onMouseLeave={() => setHoveredCard(null)}
  >
    <SystemHoverEffect 
      id={id} 
      hoveredCard={hoveredCard} 
      color={infoOnly ? "slate" : healthy ? "emerald" : "red"} 
    />
    <div className="relative flex items-start gap-3 p-3 bg-gradient-to-r from-slate-800/30 to-slate-900/30 border border-slate-700/50 rounded-xl backdrop-blur-sm transition-all duration-300 hover:border-slate-600/50">
      <motion.div
        animate={infoOnly ? {} : healthy ? {
          rotate: [0, 5, -5, 0]
        } : {
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: infoOnly ? 0 : 2, 
          repeat: Infinity,
          repeatDelay: 1
        }}
        className="flex-shrink-0 mt-1"
      >
        {infoOnly ? (
          <Info className="w-5 h-5 text-slate-400" />
        ) : healthy ? (
          <CheckCircle className="w-5 h-5 text-emerald-400" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-red-400" />
        )}
      </motion.div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-slate-400" />
          <p className="font-medium text-slate-300">
            {label}
          </p>
          <motion.span
            whileHover={{ scale: 1.1 }}
            className="text-sm px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400"
          >
            {value}
          </motion.span>
        </div>
        <p className="text-sm text-slate-400 mt-1">{description}</p>
      </div>
    </div>
  </motion.div>
);

const StorageMetric = ({
  id,
  title,
  value,
  icon: Icon,
  color = "blue",
  hoveredCard,
  setHoveredCard
}: {
  id: string;
  title: string;
  value: string | number;
  icon: any;
  color: "blue" | "emerald" | "purple";
  hoveredCard: string | null;
  setHoveredCard: (id: string | null) => void;
}) => (
  <motion.div
    whileHover={{ 
      scale: 1.05,
      y: -3,
      transition: { type: "spring", stiffness: 300 }
    }}
    className="relative group cursor-pointer"
    onMouseEnter={() => setHoveredCard(id)}
    onMouseLeave={() => setHoveredCard(null)}
  >
    <SystemHoverEffect id={id} hoveredCard={hoveredCard} color={color} />
    <div className="relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm transition-all duration-300 hover:border-slate-600/50">
      <div className="flex items-center gap-2 mb-2">
        <motion.div
          whileHover={{ rotate: -15, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`p-1.5 rounded-lg ${
            color === "blue" ? "bg-gradient-to-br from-blue-500/20 to-blue-600/20" :
            color === "emerald" ? "bg-gradient-to-br from-emerald-500/20 to-emerald-600/20" :
            "bg-gradient-to-br from-purple-500/20 to-purple-600/20"
          }`}
        >
          <Icon className={`w-4 h-4 ${
            color === "blue" ? "text-blue-400" :
            color === "emerald" ? "text-emerald-400" :
            "text-purple-400"
          }`} />
        </motion.div>
        <span className="text-sm text-slate-400">{title}</span>
      </div>
      <div className={`text-lg font-bold ${
        color === "blue" ? "text-blue-400" :
        color === "emerald" ? "text-emerald-400" :
        "text-purple-400"
      }`}>
        {value}
      </div>
    </div>
  </motion.div>
);

const StorageBreakdown = ({
  id,
  title,
  files,
  totalSize,
  avgSize,
  icon: Icon,
  hoveredCard,
  setHoveredCard
}: {
  id: string;
  title: string;
  files: number;
  totalSize: number;
  avgSize: number;
  icon: any;
  hoveredCard: string | null;
  setHoveredCard: (id: string | null) => void;
}) => (
  <motion.div
    whileHover={{ 
      scale: 1.03,
      y: -2,
      transition: { type: "spring", stiffness: 300 }
    }}
    className="relative group cursor-pointer"
    onMouseEnter={() => setHoveredCard(id)}
    onMouseLeave={() => setHoveredCard(null)}
  >
    <SystemHoverEffect id={id} hoveredCard={hoveredCard} color="blue" />
    <div className="relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm transition-all duration-300 hover:border-slate-600/50">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-blue-400" />
        <h3 className="font-medium text-slate-300">{title}</h3>
      </div>
      <ul className="space-y-1.5 text-sm">
        <motion.li 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-between"
        >
          <span className="text-slate-400">Files:</span>
          <span className="text-slate-300">{files}</span>
        </motion.li>
        <motion.li 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-between"
        >
          <span className="text-slate-400">Total Size:</span>
          <span className="text-slate-300">{formatBytes(totalSize)}</span>
        </motion.li>
        <motion.li 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between"
        >
          <span className="text-slate-400">Avg Size:</span>
          <span className="text-slate-300">{formatBytes(avgSize)}</span>
        </motion.li>
      </ul>
    </div>
  </motion.div>
);

const SecurityMetric = ({
  id,
  title,
  value,
  icon: Icon,
  color = "emerald",
  hoveredCard,
  setHoveredCard
}: {
  id: string;
  title: string;
  value: number | string;
  icon: any;
  color: "emerald" | "blue" | "amber";
  hoveredCard: string | null;
  setHoveredCard: (id: string | null) => void;
}) => (
  <motion.div
    whileHover={{ 
      scale: 1.05,
      y: -3,
      transition: { type: "spring", stiffness: 300 }
    }}
    className="relative group cursor-pointer"
    onMouseEnter={() => setHoveredCard(id)}
    onMouseLeave={() => setHoveredCard(null)}
  >
    <SystemHoverEffect id={id} hoveredCard={hoveredCard} color={color} />
    <div className="relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm transition-all duration-300 hover:border-slate-600/50">
      <div className="flex items-center gap-2 mb-2">
        <motion.div
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`p-1.5 rounded-lg ${
            color === "emerald" ? "bg-gradient-to-br from-emerald-500/20 to-emerald-600/20" :
            color === "blue" ? "bg-gradient-to-br from-blue-500/20 to-blue-600/20" :
            "bg-gradient-to-br from-amber-500/20 to-amber-600/20"
          }`}
        >
          <Icon className={`w-4 h-4 ${
            color === "emerald" ? "text-emerald-400" :
            color === "blue" ? "text-blue-400" :
            "text-amber-400"
          }`} />
        </motion.div>
        <span className="text-sm text-slate-400">{title}</span>
      </div>
      <div className={`text-lg font-bold ${
        color === "emerald" ? "text-emerald-400" :
        color === "blue" ? "text-blue-400" :
        "text-amber-400"
      }`}>
        {value}
      </div>
    </div>
  </motion.div>
);

const ErrorMetric = ({
  id,
  title,
  value,
  icon: Icon,
  critical = false,
  text = false,
  hoveredCard,
  setHoveredCard
}: {
  id: string;
  title: string;
  value: number | string;
  icon: any;
  critical?: boolean;
  text?: boolean;
  hoveredCard: string | null;
  setHoveredCard: (id: string | null) => void;
}) => (
  <motion.div
    whileHover={{ 
      scale: 1.05,
      y: -3,
      transition: { type: "spring", stiffness: 300 }
    }}
    className="relative group cursor-pointer"
    onMouseEnter={() => setHoveredCard(id)}
    onMouseLeave={() => setHoveredCard(null)}
  >
    <SystemHoverEffect 
      id={id} 
      hoveredCard={hoveredCard} 
      color={critical && Number(value) > 0 ? "red" : "slate"} 
    />
    <div className={`relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 border ${
      critical && Number(value) > 0 ? "border-red-500/40 bg-gradient-to-br from-red-500/10 to-red-600/10" : "border-slate-700/50"
    } rounded-xl p-4 backdrop-blur-sm transition-all duration-300 hover:border-slate-600/50`}>
      <div className="flex items-center gap-2 mb-2">
        <motion.div
          whileHover={{ rotate: -15, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`p-1.5 rounded-lg ${
            critical && Number(value) > 0 ? "bg-gradient-to-br from-red-500/20 to-red-600/20" : "bg-gradient-to-br from-slate-700/40 to-slate-800/40"
          }`}
        >
          <Icon className={`w-4 h-4 ${
            critical && Number(value) > 0 ? "text-red-400" : "text-slate-400"
          }`} />
        </motion.div>
        <span className="text-sm text-slate-400">{title}</span>
      </div>
      <div className={`text-lg font-bold ${
        critical && Number(value) > 0 ? "text-red-400" : "text-white"
      } ${text ? 'text-sm truncate' : ''}`}>
        {value}
      </div>
    </div>
  </motion.div>
);

/* =====================
   Enhanced System-Themed Hover Effects
===================== */

const SystemHoverEffect = ({ 
  id, 
  hoveredCard, 
  color = "slate",
  isActive = false
}: { 
  id: string; 
  hoveredCard: string | null; 
  color?: "emerald" | "red" | "amber" | "blue" | "purple" | "slate";
  isActive?: boolean;
}) => {
  const isHovered = hoveredCard === id || isActive;
  const particleColor = color;

  const colorConfig = {
    emerald: {
      glow: "rgba(16, 185, 129, 0.1)",
      light: "rgba(16, 185, 129, 0.4)",
      medium: "rgba(16, 185, 129, 0.3)",
      dark: "rgba(16, 185, 129, 0.2)"
    },
    red: {
      glow: "rgba(239, 68, 68, 0.1)",
      light: "rgba(239, 68, 68, 0.4)",
      medium: "rgba(239, 68, 68, 0.3)",
      dark: "rgba(239, 68, 68, 0.2)"
    },
    blue: {
      glow: "rgba(59, 130, 246, 0.1)",
      light: "rgba(59, 130, 246, 0.4)",
      medium: "rgba(59, 130, 246, 0.3)",
      dark: "rgba(59, 130, 246, 0.2)"
    },
    amber: {
      glow: "rgba(245, 158, 11, 0.1)",
      light: "rgba(245, 158, 11, 0.4)",
      medium: "rgba(245, 158, 11, 0.3)",
      dark: "rgba(245, 158, 11, 0.2)"
    },
    purple: {
      glow: "rgba(168, 85, 247, 0.1)",
      light: "rgba(168, 85, 247, 0.4)",
      medium: "rgba(168, 85, 247, 0.3)",
      dark: "rgba(168, 85, 247, 0.2)"
    },
    slate: {
      glow: "rgba(148, 163, 184, 0.1)",
      light: "rgba(148, 163, 184, 0.4)",
      medium: "rgba(148, 163, 184, 0.3)",
      dark: "rgba(148, 163, 184, 0.2)"
    }
  };

  const colors = colorConfig[particleColor];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {/* Ambient Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.15 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${colors.glow} 0%, transparent 70%)`,
        }}
      />

      {/* Animated Gradient Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.08 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent"
        style={{
          backgroundImage: `linear-gradient(45deg, transparent, ${colors.medium}, transparent)`,
        }}
      />

      {/* System-Themed Particles */}
      {isHovered && (
        <>
          {/* Floating Database Icons */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`db-${i}`}
              className="absolute"
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                rotate: 0,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                rotate: 360,
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
                y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 1.2,
                ease: "easeInOut",
              }}
            >
              <Database className="w-4 h-4" style={{ color: colors.light }} />
            </motion.div>
          ))}

          {/* Rotating Gear Particles */}
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={`gear-${i}`}
              className="absolute"
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                rotate: 0,
                opacity: 0,
              }}
              animate={{
                rotate: i % 2 === 0 ? 360 : -360,
                opacity: [0, 0.6, 0],
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
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                delay: i * 2.5,
                ease: "easeInOut",
              }}
            >
              <Cog className="w-3 h-3" style={{ color: colors.medium }} />
            </motion.div>
          ))}

          {/* Floating Server Icons */}
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={`server-${i}`}
              className="absolute"
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                opacity: 0,
                scale: 0.5,
              }}
              animate={{
                opacity: [0, 0.7, 0],
                scale: [0.5, 1, 0.5],
                y: [
                  `${Math.random() * 100}%`,
                  `${Math.random() * 100}%`,
                  `${Math.random() * 100}%`
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 1.8,
                ease: "easeInOut",
              }}
            >
              <Server className="w-3 h-3" style={{ color: colors.light }} />
            </motion.div>
          ))}

          {/* Binary Code Stream */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`binary-${i}`}
                className="absolute text-xs font-mono font-bold"
                style={{
                  left: `${Math.random() * 100}%`,
                  color: colors.medium,
                  textShadow: `0 0 8px ${colors.light}`,
                }}
                initial={{ 
                  opacity: 0, 
                  y: -10,
                  x: Math.random() * 20 - 10 
                }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [`${Math.random() * 50}%`, `${Math.random() * 100 + 50}%`],
                  x: [
                    `${Math.random() * 20 - 10}px`,
                    `${Math.random() * 40 - 20}px`
                  ],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "linear",
                }}
              >
                {Math.random() > 0.5 ? '1' : '0'}
              </motion.div>
            ))}
          </div>

          {/* Circuit Connection Dots */}
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`dot-${i}`}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  backgroundColor: colors.medium,
                  left: `${(i * 8) % 100}%`,
                  top: `${(i * 6) % 100}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Pulsing Rings */}
          <motion.div
            className="absolute inset-0 border-2 rounded-2xl"
            style={{ borderColor: colors.light }}
            initial={{ scale: 1, opacity: 0 }}
            animate={{
              scale: [1, 1.02, 1],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Inner Data Flow Glow */}
          <motion.div
            className="absolute inset-4 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.1, 0],
              boxShadow: [
                `inset 0 0 20px 0px ${colors.dark}`,
                `inset 0 0 40px 10px ${colors.medium}`,
                `inset 0 0 20px 0px ${colors.dark}`,
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
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-500"
        style={{
          backgroundImage: `linear-gradient(${colors.medium} 1px, transparent 1px),
                            linear-gradient(90deg, ${colors.medium} 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 70%)',
        }}
      />
    </div>
  );
};

/* =====================
   Utils
===================== */

const formatBytes = (bytes: number) => {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

const formatUptime = (seconds: number) => {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

// Add missing Upload icon
const Upload = HardDriveUpload;

export default AdminSystem;