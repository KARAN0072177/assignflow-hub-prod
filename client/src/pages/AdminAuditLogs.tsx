import { useEffect, useState } from "react";
import { getAuditLogs, type AuditLog } from "../services/auditLog.api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  User,
  Activity,
  Database,
  Eye,
  Filter,
  Search,
  Loader2,
  ChevronUp,
  CheckCircle,
  PlusCircle,
  Edit,
  Trash2,
  Shield,
  Download,
  RefreshCw,
  Hash,
  FileText,
  ChevronLeft,
  ChevronRight,
  File,
  FileJson,
  FileSpreadsheet,
  X
} from "lucide-react";

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState<string>("all");
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<"json" | "txt" | "excel">("json");

  const recordsPerPage = 10;

  const fetchLogs = async () => {
    try {
      const data = await getAuditLogs();
      setLogs(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLogs();
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE':
        return <PlusCircle className="w-4 h-4" />;
      case 'UPDATE':
        return <Edit className="w-4 h-4" />;
      case 'DELETE':
        return <Trash2 className="w-4 h-4" />;
      case 'LOGIN':
        return <Shield className="w-4 h-4" />;
      case 'PUBLISH':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'UPDATE':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'DELETE':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'LOGIN':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'PUBLISH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchQuery === "" || 
      log.actorRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(log.metadata || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = selectedAction === "all" || log.action === selectedAction;

    return matchesSearch && matchesAction;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredLogs.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  const uniqueActions = Array.from(new Set(logs.map(log => log.action)));

  const handleExport = () => {
    const dataToExport = filteredLogs.map(log => ({
      timestamp: new Date(log.createdAt).toISOString(),
      actor: log.actorRole,
      action: log.action,
      entity: log.entityType,
      details: log.metadata || {}
    }));

    let content = '';
    let filename = `audit_logs_${new Date().toISOString().split('T')[0]}`;

    switch (exportFormat) {
      case 'json':
        content = JSON.stringify(dataToExport, null, 2);
        filename += '.json';
        break;
      case 'txt':
        content = dataToExport.map(log => 
          `Time: ${new Date(log.timestamp).toLocaleString()}\n` +
          `Actor: ${log.actor}\n` +
          `Action: ${log.action}\n` +
          `Entity: ${log.entity}\n` +
          `Details: ${JSON.stringify(log.details)}\n` +
          `-`.repeat(50)
        ).join('\n');
        filename += '.txt';
        break;
      case 'excel':
        // Simplified CSV for Excel
        const headers = ['Timestamp', 'Actor', 'Action', 'Entity', 'Details'];
        const rows = dataToExport.map(log => [
          new Date(log.timestamp).toISOString(),
          log.actor,
          log.action,
          log.entity,
          JSON.stringify(log.details)
        ]);
        content = [headers, ...rows].map(row => row.join(',')).join('\n');
        filename += '.csv';
        break;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    setShowExportModal(false);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const leftBound = Math.max(2, currentPage - 1);
      const rightBound = Math.min(totalPages - 1, currentPage + 1);
      
      pages.push(1);
      if (leftBound > 2) pages.push('...');
      for (let i = leftBound; i <= rightBound; i++) pages.push(i);
      if (rightBound < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="relative mx-auto w-14 h-14">
            <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-slate-400 font-medium">Loading Audit Logs</p>
          <p className="text-sm text-slate-600 mt-2">Fetching system activity records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Audit Logs
          </h1>
          <p className="text-slate-400 mt-1">
            Track system activity and user actions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowExportModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 border border-emerald-600 rounded-xl text-white transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-slate-300 hover:text-white transition-all duration-200 disabled:opacity-50"
          >
            {refreshing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">Refresh</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Stats & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Logs</p>
              <p className="text-2xl font-bold text-white mt-1">{logs.length}</p>
            </div>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Database className="w-5 h-5 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Filtered</p>
              <p className="text-2xl font-bold text-white mt-1">{filteredLogs.length}</p>
            </div>
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Filter className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Page {currentPage}</p>
              <p className="text-2xl font-bold text-white mt-1">
                {Math.min(recordsPerPage, currentLogs.length)}/{currentLogs.length}
              </p>
            </div>
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Pages</p>
              <p className="text-2xl font-bold text-white mt-1">{totalPages}</p>
            </div>
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Hash className="w-5 h-5 text-amber-400" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search logs by user, action, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-800/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => {
              setSelectedAction("all");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              selectedAction === "all"
                ? "bg-blue-600 text-white"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            All Actions
          </button>
          {uniqueActions.map((action) => (
            <button
              key={action}
              onClick={() => {
                setSelectedAction(action);
                setCurrentPage(1);
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedAction === action
                  ? getActionColor(action).replace('text-', 'text-white ')
                  : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {getActionIcon(action)}
              {action}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Logs Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Actor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Action</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Entity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Details</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Expand</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentLogs.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-500">
                        <Filter className="w-12 h-12 mb-4 opacity-30" />
                        <p className="text-lg font-medium">No logs found</p>
                        <p className="text-sm mt-1">Try adjusting your filters</p>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  currentLogs.map((log, index) => (
                    <>
                      <motion.tr
                        key={log._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onMouseEnter={() => setHoveredRow(log._id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        className={`border-b border-slate-800/30 transition-all duration-200 ${
                          hoveredRow === log._id ? 'bg-slate-800/30' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-500" />
                            <div>
                              <div className="text-sm font-medium text-white">
                                {formatTimestamp(log.createdAt)}
                              </div>
                              <div className="text-xs text-slate-500">
                                {new Date(log.createdAt).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-slate-800 rounded-lg">
                              <User className="w-3 h-3 text-slate-400" />
                            </div>
                            <span className="font-medium text-slate-300">{log.actorRole}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${getActionColor(log.action)}`}>
                            {getActionIcon(log.action)}
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-slate-500" />
                            <span className="font-medium text-slate-300">{log.entityType}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs truncate text-slate-400">
                            {log.metadata ? JSON.stringify(log.metadata) : "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setExpandedLog(expandedLog === log._id ? null : log._id)}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              expandedLog === log._id 
                                ? 'bg-blue-500/20 text-blue-400' 
                                : 'text-slate-500 hover:text-white hover:bg-slate-800/50'
                            }`}
                          >
                            {expandedLog === log._id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </motion.tr>
                      
                      {/* Expanded Details Row */}
                      <AnimatePresence>
                        {expandedLog === log._id && log.metadata && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-b border-slate-800/50"
                          >
                            <td colSpan={6} className="px-6 py-4">
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-slate-900/50 rounded-xl p-4 border border-slate-800"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-semibold text-white flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Metadata Details
                                  </h4>
                                  <button
                                    onClick={() => setExpandedLog(null)}
                                    className="p-1.5 text-slate-500 hover:text-white transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                                <pre className="text-sm text-slate-300 overflow-x-auto max-h-60 p-3 bg-slate-900/30 rounded-lg">
                                  {JSON.stringify(log.metadata, null, 2)}
                                </pre>
                              </motion.div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="text-sm text-slate-500">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredLogs.length)} of {filteredLogs.length} records
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {generatePageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                disabled={page === '...'}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : page === '...'
                    ? 'text-slate-500 cursor-default'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setShowExportModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
            >
              <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl shadow-black/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Export Audit Logs</h3>
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="p-2 text-slate-500 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="text-slate-400">
                    Export {filteredLogs.length} filtered records in your preferred format:
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setExportFormat('json')}
                      className={`p-4 rounded-xl border transition-all duration-200 flex flex-col items-center gap-2 ${
                        exportFormat === 'json'
                          ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                          : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <FileJson className="w-8 h-8" />
                      <span className="text-sm font-medium">JSON</span>
                    </button>
                    
                    <button
                      onClick={() => setExportFormat('txt')}
                      className={`p-4 rounded-xl border transition-all duration-200 flex flex-col items-center gap-2 ${
                        exportFormat === 'txt'
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                          : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <File className="w-8 h-8" />
                      <span className="text-sm font-medium">Text</span>
                    </button>
                    
                    <button
                      onClick={() => setExportFormat('excel')}
                      className={`p-4 rounded-xl border transition-all duration-200 flex flex-col items-center gap-2 ${
                        exportFormat === 'excel'
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                          : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <FileSpreadsheet className="w-8 h-8" />
                      <span className="text-sm font-medium">Excel</span>
                    </button>
                  </div>
                  
                  <div className="text-xs text-slate-500 text-center">
                    File will be downloaded automatically
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExport}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all duration-200"
                  >
                    Download Export
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Background Glow Effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-900/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default AdminAuditLogs;