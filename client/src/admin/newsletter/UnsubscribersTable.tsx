import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Calendar, 
  User, 
  XCircle, 
  Search, 
  Filter,
  Download,
  ChevronUp,
  ChevronDown,
  MessageSquare,
  Clock,
  Ban,
  AlertCircle
} from "lucide-react";

type Props = {
  data: any[];
};

const UnsubscribersTable = ({ data }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"email" | "date" | "reason">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: "email" | "date" | "reason") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredAndSortedData = [...data]
    .filter(item => 
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.unsubscribeReason && item.unsubscribeReason.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortField === "email") {
        return sortDirection === "asc" 
          ? a.email.localeCompare(b.email)
          : b.email.localeCompare(a.email);
      } else if (sortField === "reason") {
        const reasonA = a.unsubscribeReason || "";
        const reasonB = b.unsubscribeReason || "";
        return sortDirection === "asc" 
          ? reasonA.localeCompare(reasonB)
          : reasonB.localeCompare(reasonA);
      } else {
        const dateA = new Date(a.unsubscribedAt).getTime();
        const dateB = new Date(b.unsubscribedAt).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
    });

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center border border-slate-700/50">
          <Ban className="w-10 h-10 text-slate-600" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No Unsubscribers</h3>
        <p className="text-slate-400">Great! Everyone is currently subscribed to your newsletter.</p>
      </motion.div>
    );
  }

  const reasons = {
    "too_many": "Too many emails",
    "not_relevant": "Content not relevant",
    "other": "Other reasons",
    "": "No reason provided"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Unsubscribed Users</h2>
          <p className="text-slate-400">Users who have opted out of your newsletter</p>
        </div>
        <div className="text-sm text-slate-400">
          Total: <span className="text-white font-medium">{data.length}</span> users
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Search className="w-4 h-4 text-slate-500" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by email or reason..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-gradient-to-br from-red-900/20 to-red-900/10 border border-red-800/30 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <XCircle className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Unsubscribed</p>
              <p className="text-xl font-bold text-white">{data.length}</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-amber-900/20 to-amber-900/10 border border-amber-800/30 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">No Reason Given</p>
              <p className="text-xl font-bold text-white">
                {data.filter(item => !item.unsubscribeReason).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-700/50 rounded-lg">
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">This Month</p>
              <p className="text-xl font-bold text-white">
                {data.filter(item => {
                  const date = new Date(item.unsubscribedAt);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-blue-900/20 to-blue-900/10 border border-blue-800/30 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <MessageSquare className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">With Feedback</p>
              <p className="text-xl font-bold text-white">
                {data.filter(item => item.unsubscribeReason).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gradient-to-br from-slate-800/20 to-slate-900/20 border border-slate-700/30 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-800/50 to-slate-900/50">
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
                    onClick={() => handleSort("reason")}
                    className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      Reason
                    </div>
                    {sortField === "reason" && (
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
                      Unsubscribed At
                    </div>
                    {sortField === "date" && (
                      sortDirection === "asc" ? 
                        <ChevronUp className="w-4 h-4" /> : 
                        <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-4 text-sm font-medium text-slate-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredAndSortedData.map((item, index) => (
                <motion.tr
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group hover:bg-slate-800/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-red-400" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{item.email}</div>
                        <div className="text-xs text-slate-500">Former subscriber</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="max-w-xs">
                      <div className="text-slate-300">
                        {item.unsubscribeReason 
                          ? reasons[item.unsubscribeReason as keyof typeof reasons] || item.unsubscribeReason
                          : "No reason provided"}
                      </div>
                      {item.unsubscribeReason && item.unsubscribeReason === "other" && (
                        <div className="text-xs text-slate-500 mt-1">
                          Additional feedback may be available
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Clock className="w-4 h-4 text-slate-500" />
                      {new Date(item.unsubscribedAt).toLocaleDateString()}
                      <div className="text-xs text-slate-500">
                        {new Date(item.unsubscribedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500/10 text-red-400 text-xs rounded-full">
                      <XCircle className="w-3 h-3" />
                      Unsubscribed
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredAndSortedData.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center border border-slate-700/50">
              <Search className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No results found</h3>
            <p className="text-slate-400">Try adjusting your search terms</p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 text-sm text-blue-400 hover:text-blue-300"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Table Footer */}
        {filteredAndSortedData.length > 0 && (
          <div className="p-4 border-t border-slate-800/50 bg-gradient-to-r from-slate-800/30 to-slate-900/30">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-400">
                Showing {filteredAndSortedData.length} of {data.length} unsubscribers
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl text-slate-300 hover:text-white transition-all duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">Export List</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 text-red-400 hover:text-red-300 rounded-xl transition-all duration-200"
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">Analyze Trends</span>
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Insight Card */}
      <div className="p-6 bg-gradient-to-r from-red-900/10 to-amber-900/10 border border-red-500/20 rounded-2xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-white mb-2">Unsubscription Insights</h4>
            <p className="text-sm text-slate-400">
              Monitor unsubscription reasons to improve your newsletter content and frequency.
              Common reasons include: too many emails, irrelevant content, or user preferences.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="text-sm">
                <div className="text-slate-400">Most common reason:</div>
                <div className="text-white font-medium">Too many emails</div>
              </div>
              <div className="text-sm">
                <div className="text-slate-400">Avg. time subscribed:</div>
                <div className="text-white font-medium">45 days</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnsubscribersTable;