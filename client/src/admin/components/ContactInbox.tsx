import { useEffect, useState, useMemo } from "react";
import ContactMessageCard from "./ContactMessageCard";
import { 
  getAdminContacts, 
  markMessagesAsReadBulk 
} from "../../services/adminContact.api";
import { useAdminSocket } from "../AdminSocketProvider";
import type { AdminContactMessage } from "../../services/adminContact.api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  RefreshCw, 
  Loader2, 
  Inbox, 
  CheckCircle, 
  Eye,
  CheckCheck,
  AlertTriangle,
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  User,
  SortAsc,
  SortDesc,
  X,
  EyeOff} from "lucide-react";

const ITEMS_PER_PAGE = 10;

type SortField = 'date' | 'name' | 'email';
type SortDirection = 'asc' | 'desc';
type FilterStatus = 'all' | 'unread' | 'read';
type DateFilter = 'all' | 'today' | 'yesterday' | 'last7days' | 'last30days' | 'custom';

const ContactInbox = () => {
  const [messages, setMessages] = useState<AdminContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [markingAsRead, setMarkingAsRead] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Advanced filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const { lastEvent } = useAdminSocket();

  const fetchMessages = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    setRefreshing(true);
    setError(null);
    try {
      const data = await getAdminContacts(token);
      setMessages(data);
      setSelectedMessages([]); // Clear selection on refresh
      setCurrentPage(1); // Reset to first page on refresh
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setError("Failed to load messages. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // 🔔 React to real-time contact events
  useEffect(() => {
    if (lastEvent?.type === "contact:new") {
      fetchMessages();
    }
  }, [lastEvent]);

  // Filter and sort messages
  const filteredAndSortedMessages = useMemo(() => {
    let filtered = [...messages];

    // Status filter
    if (filterStatus === 'read') {
      filtered = filtered.filter(msg => msg.isRead);
    } else if (filterStatus === 'unread') {
      filtered = filtered.filter(msg => !msg.isRead);
    }

    // Date filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const last7Days = new Date(today);
    last7Days.setDate(last7Days.getDate() - 7);
    const last30Days = new Date(today);
    last30Days.setDate(last30Days.getDate() - 30);

    filtered = filtered.filter(msg => {
      const msgDate = new Date(msg.createdAt);
      
      switch (dateFilter) {
        case 'today':
          return msgDate >= today;
        case 'yesterday':
          return msgDate >= yesterday && msgDate < today;
        case 'last7days':
          return msgDate >= last7Days;
        case 'last30days':
          return msgDate >= last30Days;
        case 'custom':
          if (!customStartDate || !customEndDate) return true;
          const start = new Date(customStartDate);
          const end = new Date(customEndDate);
          end.setHours(23, 59, 59, 999);
          return msgDate >= start && msgDate <= end;
        default:
          return true;
      }
    });

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(msg => 
        msg.name.toLowerCase().includes(term) ||
        msg.email.toLowerCase().includes(term) ||
        (msg.phone && msg.phone.includes(term)) ||
        msg.message.toLowerCase().includes(term)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'date':
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [messages, filterStatus, dateFilter, customStartDate, customEndDate, searchTerm, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedMessages.length / ITEMS_PER_PAGE);
  const paginatedMessages = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedMessages.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedMessages, currentPage]);

  const handleMessageSelect = (messageId: string) => {
    setSelectedMessages(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleSelectAll = () => {
    const visibleUnread = paginatedMessages.filter(msg => !msg.isRead).map(msg => msg.id);
    if (selectedMessages.length === visibleUnread.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(visibleUnread);
    }
  };

  const handleSelectAllFiltered = () => {
    const allFilteredUnread = filteredAndSortedMessages.filter(msg => !msg.isRead).map(msg => msg.id);
    setSelectedMessages(allFilteredUnread);
  };

  const handleMarkAsRead = async () => {
    if (selectedMessages.length === 0) return;

    const token = localStorage.getItem("authToken");
    if (!token) return;

    setMarkingAsRead(true);
    setError(null);
    try {
      const response = await markMessagesAsReadBulk(token, selectedMessages);
      console.log("Bulk mark as read response:", response);
      
      // Update local state
      setMessages(prev => prev.map(msg => 
        selectedMessages.includes(msg.id) 
          ? { ...msg, isRead: true }
          : msg
      ));

      // Clear selection
      setSelectedMessages([]);
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
      setError("Failed to mark messages as read. Please try again.");
    } finally {
      setMarkingAsRead(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const unreadMessages = filteredAndSortedMessages.filter(msg => !msg.isRead);
    if (unreadMessages.length === 0) return;

    setMarkingAsRead(true);
    setError(null);
    try {
      const unreadIds = unreadMessages.map(msg => msg.id);
      const response = await markMessagesAsReadBulk(token, unreadIds);
      console.log("Mark all as read response:", response);

      // Update local state
      setMessages(prev => prev.map(msg => 
        ({ ...msg, isRead: true })
      ));

      // Clear selection
      setSelectedMessages([]);
    } catch (error) {
      console.error("Failed to mark all messages as read:", error);
      setError("Failed to mark messages as read. Please try again.");
    } finally {
      setMarkingAsRead(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedMessages([]);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setDateFilter('all');
    setCustomStartDate('');
    setCustomEndDate('');
    setSortField('date');
    setSortDirection('desc');
    setCurrentPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of messages container
    const container = document.getElementById('messages-container');
    if (container) {
      container.scrollTop = 0;
    }
  };

  const unreadCount = messages.filter(msg => !msg.isRead).length;
  const selectedCount = selectedMessages.length;
  const filteredCount = filteredAndSortedMessages.length;
  const readCount = messages.filter(msg => msg.isRead).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative w-16 h-16"
        >
          <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <div className="absolute inset-2 border-4 border-emerald-500 border-r-transparent rounded-full animate-pulse"></div>
        </motion.div>
        <div className="ml-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 font-medium"
          >
            Loading Messages
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-slate-500"
          >
            Fetching contact requests...
          </motion.p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[400px] p-8"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-2xl flex items-center justify-center border border-red-500/30 mb-6">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Error Loading Messages
        </h3>
        <p className="text-slate-400 text-center max-w-md mb-4">
          {error}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchMessages}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl text-slate-300 hover:text-white transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm font-medium">Try Again</span>
        </motion.button>
      </motion.div>
    );
  }

  if (messages.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[400px] p-8"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="relative mb-6"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center border border-slate-700/50">
            <Inbox className="w-12 h-12 text-slate-600" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-full flex items-center justify-center">
            <Mail className="w-5 h-5 text-blue-400" />
          </div>
        </motion.div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Inbox Empty
        </h3>
        <p className="text-slate-400 text-center max-w-md mb-6">
          No contact messages have been submitted yet. 
          Messages will appear here when users reach out via the contact form.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchMessages}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl text-slate-300 hover:text-white transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm font-medium">Refresh</span>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                <Inbox className="w-5 h-5 text-blue-400" />
              </div>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 text-xs rounded-full flex items-center justify-center font-bold"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </motion.span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Contact Messages
              </h2>
              <p className="text-sm text-slate-400">
                {messages.length} total • {unreadCount} unread • {readCount} read
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchMessages}
            disabled={refreshing}
            className="p-2.5 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl text-slate-300 hover:text-white transition-all duration-200 disabled:opacity-50"
            title="Refresh messages"
          >
            {refreshing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Advanced Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="w-4 h-4 text-slate-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, phone, or message..."
            className="w-full pl-10 pr-10 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-700/50 rounded"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-medium">Status</label>
            <div className="flex gap-1 p-1 bg-slate-800/50 rounded-xl border border-slate-700/50">
              {(['all', 'unread', 'read'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${filterStatus === status
                    ? "bg-gradient-to-r from-blue-500/20 to-emerald-500/20 text-white"
                    : "text-slate-400 hover:text-white"
                  }`}
                >
                  {status === 'all' ? 'All' : status === 'unread' ? 'Unread' : 'Read'}
                </button>
              ))}
            </div>
          </div>

          {/* Date Filter */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-medium">Date Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as DateFilter)}
              className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Custom Date Range */}
          {dateFilter === 'custom' && (
            <div className="lg:col-span-2 space-y-2">
              <label className="text-xs text-slate-400 font-medium">Custom Date Range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30"
                />
                <span className="text-slate-500 self-center">to</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sort Controls & Clear Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Sort by:</span>
            <div className="flex gap-2">
              {(['date', 'name', 'email'] as const).map((field) => (
                <button
                  key={field}
                  onClick={() => handleSort(field)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${sortField === field
                    ? "bg-gradient-to-r from-blue-500/20 to-emerald-500/20 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/30"
                  }`}
                >
                  {field === 'date' ? <Calendar className="w-3 h-3" /> :
                   field === 'name' ? <User className="w-3 h-3" /> :
                   <Mail className="w-3 h-3" />}
                  {field === 'date' ? 'Date' : field === 'name' ? 'Name' : 'Email'}
                  {sortField === field && (
                    sortDirection === 'asc' ? 
                      <SortAsc className="w-3 h-3" /> : 
                      <SortDesc className="w-3 h-3" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">
              Showing {filteredCount} of {messages.length} messages
            </span>
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-slate-800/30 rounded-lg transition-all"
            >
              <X className="w-3 h-3" />
              Clear Filters
            </button>
          </div>
        </div>
      </motion.div>

      {/* Action Bar - Shows when messages are selected */}
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gradient-to-r from-blue-900/20 to-emerald-900/20 border border-blue-500/30 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center"
              >
                <CheckCircle className="w-4 h-4 text-blue-400" />
              </motion.div>
              <div>
                <span className="text-white font-medium">
                  {selectedCount} message{selectedCount !== 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={handleClearSelection}
                  className="text-xs text-slate-400 hover:text-slate-300 ml-3"
                >
                  Clear
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSelectAll}
                className="px-3 py-1.5 text-sm text-slate-300 hover:text-white bg-slate-800/30 rounded-lg"
              >
                Select All on Page
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSelectAllFiltered}
                className="px-3 py-1.5 text-sm text-slate-300 hover:text-white bg-slate-800/30 rounded-lg"
              >
                Select All Filtered
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMarkAsRead}
                disabled={markingAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                {markingAsRead ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCheck className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {markingAsRead ? 'Marking...' : 'Mark as Read'}
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mark All Filtered as Read Button */}
      {filteredAndSortedMessages.filter(msg => !msg.isRead).length > 0 && selectedCount === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <span className="text-sm text-slate-400">
            {filteredAndSortedMessages.filter(msg => !msg.isRead).length} unread in current filter
          </span>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleMarkAllAsRead}
            disabled={markingAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700/50 text-slate-300 hover:text-white rounded-xl transition-all duration-200 disabled:opacity-50"
          >
            {markingAsRead ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {markingAsRead ? 'Processing...' : 'Mark All Filtered as Read'}
            </span>
          </motion.button>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-2xl flex items-center gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-xs text-slate-400 hover:text-slate-300"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {/* Messages Container with Fixed Height */}
      <div 
        id="messages-container"
        className="bg-gradient-to-br from-slate-800/20 to-slate-900/20 border border-slate-700/30 rounded-2xl overflow-hidden"
        style={{ height: 'calc(100vh - 400px)', minHeight: '500px', maxHeight: '800px' }}
      >
        <AnimatePresence mode="wait">
          {paginatedMessages.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full p-8"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl flex items-center justify-center border border-slate-700/50 mb-6">
                <Search className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                No messages found
              </h3>
              <p className="text-slate-400 text-center max-w-md">
                {searchTerm || filterStatus !== 'all' || dateFilter !== 'all' 
                  ? "Try adjusting your filters or search terms"
                  : "No messages match your criteria"}
              </p>
              {(searchTerm || filterStatus !== 'all' || dateFilter !== 'all') && (
                <button
                  onClick={handleClearFilters}
                  className="mt-4 text-sm text-blue-400 hover:text-blue-300"
                >
                  Clear all filters
                </button>
              )}
            </motion.div>
          ) : (
            <div key="messages" className="h-full overflow-y-auto p-4">
              <div className="space-y-4">
                {paginatedMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    layout
                    className="relative"
                  >
                    {/* Selection Checkbox */}
                    {!msg.isRead && (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="absolute top-4 left-4 z-10"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMessageSelect(msg.id);
                          }}
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${selectedMessages.includes(msg.id)
                            ? "bg-gradient-to-br from-blue-500 to-emerald-500 border-transparent"
                            : "bg-slate-800/50 border-slate-600 hover:border-blue-400"
                          }`}
                        >
                          {selectedMessages.includes(msg.id) && (
                            <CheckCheck className="w-3 h-3 text-white" />
                          )}
                        </button>
                      </motion.div>
                    )}
                    
                    <div className={!msg.isRead ? "pl-12" : ""}>
                      <ContactMessageCard 
                        message={msg} 
                        isSelected={selectedMessages.includes(msg.id)}
                        onSelectToggle={() => handleMessageSelect(msg.id)}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      {filteredAndSortedMessages.length > ITEMS_PER_PAGE && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-800/20 border border-slate-700/30 rounded-2xl"
        >
          <div className="text-sm text-slate-400">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedMessages.length)} of {filteredAndSortedMessages.length} messages
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${currentPage === pageNum
                      ? "bg-gradient-to-r from-blue-500/20 to-emerald-500/20 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/30"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="text-slate-500">...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${currentPage === totalPages
                      ? "bg-gradient-to-r from-blue-500/20 to-emerald-500/20 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/30"
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="p-4 bg-gradient-to-br from-blue-900/20 to-blue-900/10 border border-blue-800/30 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Inbox className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Messages</p>
              <p className="text-xl font-bold text-white">{messages.length}</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-emerald-900/20 to-emerald-900/10 border border-emerald-800/30 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Eye className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Read</p>
              <p className="text-xl font-bold text-white">{readCount}</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-amber-900/20 to-amber-900/10 border border-amber-800/30 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <EyeOff className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Unread</p>
              <p className="text-xl font-bold text-white">{unreadCount}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactInbox;