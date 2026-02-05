import { useEffect, useState } from "react";
import { fetchSubscribers } from "./newsletter.admin.api";
import SubscribersTable from "./SubscribersTable";
import UnsubscribersTable from "./UnsubscribersTable";
import SendNewsletterForm from "./SendNewsletterForm";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Users, 
  Send, 
  BellOff, 
  BarChart3,
  Download,
  Filter,
  Sparkles,
  TrendingUp,
  Activity
} from "lucide-react";

const NewsletterPage = () => {
  const [tab, setTab] = useState<"subscribed" | "unsubscribed" | "send">("subscribed");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    subscribed: 0,
    unsubscribed: 0,
    total: 0,
    openRate: "0%",
    clickRate: "0%"
  });

  useEffect(() => {
    if (tab === "send") {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchSubscribers(tab)
      .then((fetchedData) => {
        setData(fetchedData);
        
        // Simulate stats (in real app, this would come from backend)
        if (tab === "subscribed") {
          setStats(prev => ({
            ...prev,
            subscribed: fetchedData.length,
            total: prev.unsubscribed + fetchedData.length
          }));
        } else {
          setStats(prev => ({
            ...prev,
            unsubscribed: fetchedData.length,
            total: prev.subscribed + fetchedData.length
          }));
        }
      })
      .finally(() => setLoading(false));
  }, [tab]);

  const tabConfig = [
    { key: "subscribed" as const, label: "Subscribers", icon: Users, color: "emerald" },
    { key: "unsubscribed" as const, label: "Unsubscribed", icon: BellOff, color: "red" },
    { key: "send" as const, label: "Send Newsletter", icon: Send, color: "blue" }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
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
              className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl"
            >
              <Mail className="w-6 h-6 text-blue-400" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Newsletter Center
              </h1>
              <p className="text-slate-400 mt-2">
                Manage subscribers and send email campaigns
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl"
          >
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-slate-300">Live Updates</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-emerald-500"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Subscribers"
          value={stats.subscribed}
          icon={Users}
          color="blue"
          change="+12 this week"
        />
        <StatCard
          title="Unsubscribed"
          value={stats.unsubscribed}
          icon={BellOff}
          color="red"
          change="+3 this week"
        />
        <StatCard
          title="Total Audience"
          value={stats.total}
          icon={BarChart3}
          color="purple"
          change="Growing"
        />
        <StatCard
          title="Avg. Open Rate"
          value={stats.openRate}
          icon={TrendingUp}
          color="emerald"
          change="+2.5%"
        />
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-col"
      >
        {/* Tab Buttons */}
        <div className="flex gap-2 p-1 bg-slate-800/50 border border-slate-700/50 rounded-2xl mb-6">
          {tabConfig.map(({ key, label, icon: Icon, color }) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${tab === key
                ? `bg-gradient-to-r from-${color}-500/20 to-${color}-600/20 text-white`
                : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6"
            style={{
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="relative w-12 h-12"
                >
                  <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                  <div className="absolute inset-2 border-4 border-purple-500 border-r-transparent rounded-full animate-pulse"></div>
                </motion.div>
                <div className="ml-4">
                  <p className="text-slate-300 font-medium">Loading {tab === "send" ? "form" : "subscribers"}...</p>
                  <p className="text-sm text-slate-500">Please wait a moment</p>
                </div>
              </div>
            ) : tab === "subscribed" ? (
              <SubscribersTable data={data} />
            ) : tab === "unsubscribed" ? (
              <UnsubscribersTable data={data} />
            ) : (
              <SendNewsletterForm />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex flex-wrap items-center justify-between gap-4 p-6 bg-gradient-to-r from-slate-800/30 to-slate-900/30 border border-slate-700/50 rounded-2xl"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-white font-medium">Quick Actions</h3>
            <p className="text-sm text-slate-400">Manage your newsletter efficiently</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl text-slate-300 hover:text-white transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export List</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-400 hover:text-blue-300 rounded-xl transition-all duration-200"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Advanced Filters</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = "blue", 
  change 
}: { 
  title: string; 
  value: number | string; 
  icon: any; 
  color: "blue" | "red" | "purple" | "emerald";
  change?: string;
}) => {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400",
    red: "from-red-500/20 to-red-600/20 border-red-500/30 text-red-400",
    purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400",
    emerald: "from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 text-emerald-400"
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative group overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} border ${colorClasses[color].split(' ')[2]} transition-all duration-300`}
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear"
        }}
      />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className={`text-xs font-medium ${colorClasses[color].split(' ')[3]}`}>
            {change}
          </span>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-slate-400">{title}</p>
          <p className={`text-2xl font-bold ${colorClasses[color].split(' ')[3]}`}>
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsletterPage;