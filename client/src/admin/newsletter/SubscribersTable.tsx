import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Calendar, 
  User, 
  CheckCircle, 
  Search, 
  Filter,
  Download,
  ChevronUp,
  ChevronDown,
  Eye,
  MoreVertical,
  Copy,
  Clock
} from "lucide-react";

type Props = {
  data: any[];
};

const SubscribersTable = ({ data }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"email" | "date">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: "email" | "date") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredAndSortedData = [...data]
    .filter(item => 
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === "email") {
        return sortDirection === "asc" 
          ? a.email.localeCompare(b.email)
          : b.email.localeCompare(a.email);
      } else {
        const dateA = new Date(a.subscribedAt).getTime();
        const dateB = new Date(b.subscribedAt).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
    });

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map(item => item._id));
    }
  };

  const handleRowSelect = (id: string) => {
    setSelectedRows(prev =>
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center border border-slate-700/50">
          <Mail className="w-10 h-10 text-slate-600" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No Subscribers Yet</h3>
        <p className="text-slate-400">Subscribers will appear here once they sign up for your newsletter.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="w-4 h-4 text-slate-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search subscribers..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30"
          />
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl text-slate-300 hover:text-white transition-all duration-200"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl text-slate-300 hover:text-white transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export</span>
          </motion.button>
        </div>
      </div>

      {/* Selection Bar */}
      <AnimatePresence>
        {selectedRows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-900/20 to-emerald-900/20 border border-blue-500/30 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">
                {selectedRows.length} subscriber{selectedRows.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedRows([])}
                className="text-sm text-slate-400 hover:text-slate-300"
              >
                Clear
              </button>
              <button className="text-sm text-blue-400 hover:text-blue-300 ml-4">
                Send Email
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Container */}
      <div className="bg-gradient-to-br from-slate-800/20 to-slate-900/20 border border-slate-700/30 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-800/50 to-slate-900/50">
                <th className="p-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700/50 text-blue-500 focus:ring-blue-500/50 focus:ring-offset-slate-900"
                    />
                  </div>
                </th>
                <th className="p-4">
                  <button
                    onClick={() => handleSort("email")}
                    className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      Email
                    </div>
                    {sortField === "email" && (
                      sortDirection === "asc" ? 
                        <ChevronUp className="w-4 h-4" /> : 
                        <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-4">
                  <button
                    onClick={() => handleSort("date")}
                    className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Subscribed At
                    </div>
                    {sortField === "date" && (
                      sortDirection === "asc" ? 
                        <ChevronUp className="w-4 h-4" /> : 
                        <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-4 text-sm font-medium text-slate-300">Status</th>
                <th className="p-4 text-sm font-medium text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {paginatedData.map((item, index) => (
                <motion.tr
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group hover:bg-slate-800/30 transition-colors"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(item._id)}
                      onChange={() => handleRowSelect(item._id)}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700/50 text-blue-500 focus:ring-blue-500/50 focus:ring-offset-slate-900"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{item.email}</div>
                        <div className="text-xs text-slate-500">Active subscriber</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Clock className="w-4 h-4 text-slate-500" />
                      {new Date(item.subscribedAt).toLocaleDateString()}
                      <div className="text-xs text-slate-500">
                        {new Date(item.subscribedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Subscribed
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(item.email)}
                        className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors"
                        title="Copy email"
                      >
                        <Copy className="w-4 h-4 text-slate-400 hover:text-slate-300" />
                      </button>
                      <button
                        className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4 text-slate-400 hover:text-slate-300" />
                      </button>
                      <button
                        className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors"
                        title="More options"
                      >
                        <MoreVertical className="w-4 h-4 text-slate-400 hover:text-slate-300" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t border-slate-800/50 bg-gradient-to-r from-slate-800/30 to-slate-900/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-400">
              Showing {Math.min(page * itemsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} subscribers
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronUp className="w-4 h-4 rotate-90" />
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${page === pageNum
                          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/30"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {totalPages > 5 && <span className="text-slate-500">...</span>}
                </div>
                
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 rounded-xl">
          <div className="text-sm text-slate-400 mb-1">Total Subscribers</div>
          <div className="text-xl font-bold text-white">{data.length}</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 rounded-xl">
          <div className="text-sm text-slate-400 mb-1">Active Now</div>
          <div className="text-xl font-bold text-emerald-400">{data.length}</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 rounded-xl">
          <div className="text-sm text-slate-400 mb-1">Avg. Open Rate</div>
          <div className="text-xl font-bold text-blue-400">42.5%</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 rounded-xl">
          <div className="text-sm text-slate-400 mb-1">This Month</div>
          <div className="text-xl font-bold text-purple-400">+28</div>
        </div>
      </div>
    </div>
  );
};

export default SubscribersTable;