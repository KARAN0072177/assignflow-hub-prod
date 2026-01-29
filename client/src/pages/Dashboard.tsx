import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  Award,
  PlusCircle,
  Calendar,
  Clock,
  TrendingUp,
  BarChart3,
  ChevronRight,
  FileText,
  GraduationCap,
  FolderOpen,
  CheckCircle2,
  ArrowRight,
  Loader2
} from "lucide-react";

const Dashboard = () => {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isTeacher = role === "TEACHER";
  const accentColor = isTeacher ? "blue" : "emerald";

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const storedRole = localStorage.getItem("userRole");

      if (!token || !storedRole) {
        navigate("/login");
        return;
      }

      setRole(storedRole);
      setIsLoading(false);
    };

    // Small delay for smoother transition
    const timer = setTimeout(checkAuth, 150);
    return () => clearTimeout(timer);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <Loader2 className={`w-8 h-8 text-${accentColor}-600 animate-spin mx-auto mb-4`} />
          <p className="text-slate-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const quickActions = isTeacher
    ? [
        {
          title: "Create Classroom",
          description: "Set up a new learning environment",
          icon: PlusCircle,
          path: "/dashboard/classrooms/create",
          color: "bg-blue-50 text-blue-700",
          hoverColor: "hover:bg-blue-100"
        },
        {
          title: "My Classrooms",
          description: "Manage your existing classrooms",
          icon: BookOpen,
          path: "/dashboard/classrooms/my",
          color: "bg-blue-50 text-blue-700",
          hoverColor: "hover:bg-blue-100"
        },
        {
          title: "View Assignments",
          description: "Review student submissions",
          icon: FileText,
          path: "/dashboard/classrooms/my",
          color: "bg-blue-50 text-blue-700",
          hoverColor: "hover:bg-blue-100"
        }
      ]
    : [
        {
          title: "Join Classroom",
          description: "Enter a code to join a new class",
          icon: Users,
          path: "/dashboard/classrooms/join",
          color: "bg-emerald-50 text-emerald-700",
          hoverColor: "hover:bg-emerald-100"
        },
        {
          title: "My Classrooms",
          description: "Access your learning spaces",
          icon: BookOpen,
          path: "/dashboard/classrooms/my",
          color: "bg-emerald-50 text-emerald-700",
          hoverColor: "hover:bg-emerald-100"
        },
        {
          title: "My Grades",
          description: "View your assignment scores",
          icon: Award,
          path: "/dashboard/grades",
          color: "bg-emerald-50 text-emerald-700",
          hoverColor: "hover:bg-emerald-100"
        }
      ];

  const upcomingItems = [
    {
      title: isTeacher ? "New Assignment Setup" : "Math Assignment",
      description: isTeacher ? "Prepare for next week" : "Due in 3 days",
      icon: Calendar,
      time: isTeacher ? "2 days" : "3 days"
    },
    {
      title: isTeacher ? "Grade Submissions" : "Science Project",
      description: isTeacher ? "Review pending work" : "Due in 1 week",
      icon: Clock,
      time: isTeacher ? "5 pending" : "7 days"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 sm:mb-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 bg-${accentColor}-100 rounded-xl`}>
                <GraduationCap className={`w-7 h-7 text-${accentColor}-700`} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                  Welcome back, {isTeacher ? "Educator" : "Learner"}! 👋
                </h1>
                <p className="text-slate-600 mt-1">
                  {isTeacher 
                    ? "Manage your classrooms and track student progress"
                    : "Access your classes, assignments, and grades"}
                </p>
              </div>
            </div>
            
            <div className={`inline-flex items-center gap-2 px-4 py-2.5 bg-${accentColor}-100 border border-${accentColor}-300 rounded-lg`}>
              <div className={`w-2 h-2 rounded-full bg-${accentColor}-600`}></div>
              <span className={`font-medium text-${accentColor}-800`}>
                {isTeacher ? "Teacher Account" : "Student Account"}
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Active Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <p className="font-bold text-slate-800">Online</p>
                  </div>
                </div>
                <div className={`p-2 bg-${accentColor}-50 rounded-lg`}>
                  <CheckCircle2 className={`w-5 h-5 text-${accentColor}-600`} />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Role</p>
                  <p className="text-lg font-bold text-slate-800">
                    {isTeacher ? "Teacher" : "Student"}
                  </p>
                </div>
                <div className={`p-2 bg-${accentColor}-50 rounded-lg`}>
                  <Users className={`w-5 h-5 text-${accentColor}-600`} />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Platform</p>
                  <p className="text-lg font-bold text-slate-800">AssignFlow Hub</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <FolderOpen className="w-5 h-5 text-slate-600" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-${accentColor}-50 rounded-lg`}>
                <TrendingUp className={`w-5 h-5 text-${accentColor}-700`} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Quick Actions</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  to={action.path}
                  className={`block h-full border border-slate-300 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 ${action.hoverColor}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 ${action.color} rounded-lg`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 className="font-semibold text-slate-800 text-lg mb-2">
                    {action.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    {action.description}
                  </p>
                  <div className={`inline-flex items-center gap-1 text-sm font-medium text-${accentColor}-700`}>
                    <span>Get started</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming & Help Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 bg-${accentColor}-50 rounded-lg`}>
                <Calendar className={`w-5 h-5 text-${accentColor}-700`} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                {isTeacher ? "Tasks" : "Upcoming"}
              </h2>
            </div>

            <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm">
              <div className="space-y-4">
                {upcomingItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 ${isTeacher ? 'bg-blue-50' : 'bg-emerald-50'} rounded-lg`}>
                        <item.icon className={`w-5 h-5 ${isTeacher ? 'text-blue-700' : 'text-emerald-700'}`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800">{item.title}</h4>
                        <p className="text-sm text-slate-600">{item.description}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-slate-200">
                <p className="text-sm text-slate-600 text-center">
                  {isTeacher 
                    ? "Check your classrooms for detailed information"
                    : "Visit your classrooms to see all assignments"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Help & Guidance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 bg-${accentColor}-50 rounded-lg`}>
                <BarChart3 className={`w-5 h-5 text-${accentColor}-700`} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                {isTeacher ? "Teaching Resources" : "Study Tips"}
              </h2>
            </div>

            <div className={`bg-${accentColor}-50/70 border border-${accentColor}-300 rounded-xl p-5 shadow-sm`}>
              <div className="space-y-4">
                <div className={`p-3 bg-white/80 border border-${accentColor}-200 rounded-lg`}>
                  <h4 className="font-semibold text-slate-800 mb-2">
                    {isTeacher ? "Assignment Management" : "Submission Tips"}
                  </h4>
                  <p className="text-sm text-slate-700">
                    {isTeacher
                      ? "Create clear assignments with due dates to help students stay organized."
                      : "Submit assignments before deadlines and save drafts regularly."}
                  </p>
                </div>
                <div className={`p-3 bg-white/80 border border-${accentColor}-200 rounded-lg`}>
                  <h4 className="font-semibold text-slate-800 mb-2">
                    {isTeacher ? "Student Engagement" : "Grade Tracking"}
                  </h4>
                  <p className="text-sm text-slate-700">
                    {isTeacher
                      ? "Use join codes to easily add students to your classrooms."
                      : "Check your grades regularly to track your academic progress."}
                  </p>
                </div>
                <div className={`p-3 bg-white/80 border border-${accentColor}-200 rounded-lg`}>
                  <h4 className="font-semibold text-slate-800 mb-2">
                    {isTeacher ? "Quick Actions" : "Quick Access"}
                  </h4>
                  <p className="text-sm text-slate-700">
                    {isTeacher
                      ? "Use the quick action buttons above to navigate efficiently."
                      : "Use the navigation sidebar to quickly access different sections."}
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-slate-200">
                <p className="text-xs text-slate-600 text-center">
                  Need help? Contact {isTeacher ? "administrator" : "your teacher"} for assistance.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 pt-6 border-t border-slate-300"
        >
          <p className="text-sm text-slate-600 text-center">
            {isTeacher
              ? "AssignFlow Hub helps you create engaging learning experiences for your students."
              : "AssignFlow Hub helps you organize your learning and track your progress."}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;