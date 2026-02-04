import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HelpCircle,
  Search,
  BookOpen,
  GraduationCap,
  User,
  Shield,
  Lock,
  AlertCircle,
  MessageSquare,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  FileText,
  Users,
  ChevronDown
} from "lucide-react";

const HelpCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSection, setExpandedSection] = useState<string | null>("getting-started");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const sections = [
    {
      id: "getting-started",
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn the basics of AssignFlow Hub",
      color: "from-blue-500 to-blue-600",
      items: [
        {
          id: "what-is",
          title: "What is AssignFlow Hub?",
          content: "AssignFlow Hub is an educational platform designed for seamless classroom management. It connects teachers and students through assignment workflows, grading systems, and collaborative features."
        },
        {
          id: "user-roles",
          title: "User Roles Explained",
          content: "• Students: Submit assignments, receive grades, view feedback\n• Teachers: Create assignments, grade submissions, manage classrooms\n• Administrators: Monitor system health, manage users, oversee operations"
        },
        {
          id: "basic-flow",
          title: "Platform Workflow",
          content: "Teachers create assignments → Students submit work → Teachers grade submissions → Students receive feedback. Each role has specific permissions and capabilities."
        }
      ]
    },
    {
      id: "student-guide",
      icon: GraduationCap,
      title: "Student Guide",
      description: "Everything students need to know",
      color: "from-emerald-500 to-emerald-600",
      items: [
        {
          id: "join-classroom",
          title: "Joining a Classroom",
          content: "You'll receive a classroom code or invitation link from your teacher. Enter the code in your dashboard to join. Once joined, you'll see all assignments for that classroom."
        },
        {
          id: "view-assignments",
          title: "Viewing Assignments",
          content: "All assignments appear in your dashboard. Each card shows:\n• Assignment title and description\n• Due date and time\n• Submission status\n• Grading status"
        },
        {
          id: "submit-assignments",
          title: "Submitting Assignments",
          content: "1. Click on the assignment\n2. Upload your files or enter text response\n3. Review your submission\n4. Click 'Submit'\n\nYou can save drafts before final submission."
        },
        {
          id: "submission-status",
          title: "Understanding Submission Status",
          content: "• Draft: Saved but not submitted\n• Submitted: Successfully submitted for grading\n• Locked: Past deadline, no further edits allowed\n• Graded: Teacher has provided feedback"
        }
      ]
    },
    {
      id: "teacher-guide",
      icon: User,
      title: "Teacher Guide",
      description: "Managing classrooms and assignments",
      color: "from-purple-500 to-purple-600",
      items: [
        {
          id: "create-classroom",
          title: "Creating a Classroom",
          content: "Navigate to 'Classrooms' in your dashboard → Click 'Create New Classroom' → Enter classroom details → Share the generated code with students."
        },
        {
          id: "create-assignments",
          title: "Creating Assignments",
          content: "In your classroom, click 'Create Assignment' → Add title, description, and instructions → Set deadlines and requirements → Publish for students."
        },
        {
          id: "upload-files",
          title: "Uploading Assignment Files",
          content: "During assignment creation, you can attach files like PDFs, documents, or images. These files become available to students once the assignment is published."
        },
        {
          id: "grade-submissions",
          title: "Grading Submissions",
          content: "1. View student submissions in the grading panel\n2. Add comments and feedback\n3. Assign grades\n4. Submit grades (students are notified automatically)"
        },
        {
          id: "deadline-management",
          title: "Deadlines & Auto-Locking",
          content: "After the deadline passes, submissions are automatically locked. Students cannot edit or resubmit after this point. You can override this if needed."
        }
      ]
    },
    {
      id: "admin-guide",
      icon: Shield,
      title: "Admin Guide",
      description: "System oversight and monitoring",
      color: "from-amber-500 to-amber-600",
      items: [
        {
          id: "admin-panel",
          title: "Accessing Admin Panel",
          content: "Administrators see an 'Admin' tab in the navigation. This panel provides system-wide monitoring and management tools."
        },
        {
          id: "system-health",
          title: "Monitoring System Health",
          content: "View real-time metrics on server performance, active users, and system resources. Monitor background job queues and service status."
        },
        {
          id: "audit-logs",
          title: "Understanding Audit Logs",
          content: "Track user activities, system events, and administrative actions. Logs include timestamps, user information, and event details for security monitoring."
        },
        {
          id: "background-jobs",
          title: "Background Job Monitoring",
          content: "Monitor automated tasks like email processing, deadline enforcement, and data cleanup. View job status, execution times, and error logs."
        },
        {
          id: "contact-messages",
          title: "Managing Contact Messages",
          content: "View all contact form submissions, mark as resolved, and respond to users. Messages are organized by status and submission date."
        },
        {
          id: "realtime-notifications",
          title: "Real-time Notifications",
          content: "WebSocket-powered notifications alert admins to system events, user reports, and urgent issues in real-time."
        }
      ]
    },
    {
      id: "account-security",
      icon: Lock,
      title: "Account & Security",
      description: "Keeping your account safe",
      color: "from-rose-500 to-rose-600",
      items: [
        {
          id: "password-security",
          title: "Password Security Basics",
          content: "• Use a strong, unique password\n• Enable two-factor authentication if available\n• Never share your credentials\n• Log out from shared devices"
        },
        {
          id: "role-access",
          title: "Role-Based Access Control",
          content: "Your permissions are based on your role (Student, Teacher, Admin). This ensures you only see features relevant to your responsibilities."
        },
        {
          id: "session-handling",
          title: "Session Management",
          content: "Your session automatically expires after a period of inactivity. You'll need to log in again to continue. This protects against unauthorized access."
        },
        {
          id: "rate-limiting",
          title: "System Protection",
          content: "To prevent abuse, the platform implements rate limiting on certain actions. If you encounter limits, wait a moment before trying again."
        }
      ]
    },
    {
      id: "troubleshooting",
      icon: AlertCircle,
      title: "Troubleshooting",
      description: "Common issues and solutions",
      color: "from-indigo-500 to-indigo-600",
      items: [
        {
          id: "login-issues",
          title: "Can't Log In",
          content: "• Check your email and password\n• Clear browser cache and cookies\n• Try incognito mode\n• Reset password if needed"
        },
        {
          id: "upload-failed",
          title: "Assignment Upload Failed",
          content: "• Check file size limits\n• Ensure file type is supported\n• Try smaller files first\n• Check internet connection"
        },
        {
          id: "submission-locked",
          title: "Submission Locked After Deadline",
          content: "This is expected behavior. Contact your teacher if you need an extension. Teachers can override deadlines if necessary."
        },
        {
          id: "page-loading",
          title: "Page Not Loading Properly",
          content: "• Refresh the page\n• Clear browser cache\n• Try a different browser\n• Check internet connection"
        },
        {
          id: "email-not-received",
          title: "Didn't Receive Email",
          content: "• Check spam/junk folder\n• Verify email address in account settings\n• Contact support if issue persists"
        }
      ]
    },
    {
      id: "contact-support",
      icon: MessageSquare,
      title: "Contact & Support",
      description: "Get help when you need it",
      color: "from-cyan-500 to-cyan-600",
      items: [
        {
          id: "contact-form",
          title: "Using the Contact Form",
          content: "For specific issues or questions, use our Contact Us page. Provide detailed information to help us assist you better."
        },
        {
          id: "reporting-issues",
          title: "What to Report",
          content: "Report technical issues, feature requests, or security concerns. Include screenshots and steps to reproduce when possible."
        },
        {
          id: "response-expectations",
          title: "Response Time",
          content: "We aim to respond to all inquiries promptly. Most requests receive a response within 24 hours during business days."
        }
      ]
    }
  ];

  const allItems = sections.flatMap(section => 
    section.items.map(item => ({
      ...item,
      sectionId: section.id,
      sectionTitle: section.title,
      sectionIcon: section.icon,
      sectionColor: section.color
    }))
  );

  const filteredItems = searchQuery
    ? allItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const handleSearchClick = () => {
    setIsSearchFocused(true);
    searchRef.current?.focus();
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setIsSearchFocused(false);
    }, 200);
  };

  const handleSearchItemClick = (item: typeof allItems[0]) => {
    setSearchQuery("");
    setIsSearchFocused(false);
    setExpandedSection(item.sectionId);
    
    setTimeout(() => {
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
        element.classList.add('highlight-item');
        setTimeout(() => {
          element.classList.remove('highlight-item');
        }, 2000);
      }
    }, 100);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.querySelector('.search-container');
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-x-hidden">
      {/* Background Elements with subtle animations */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)] pointer-events-none" />
      
      {/* Animated gradient orbs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
        className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/10 via-transparent to-emerald-500/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-purple-500/5 via-transparent to-blue-500/5 rounded-full blur-3xl pointer-events-none"
      />

      {/* Floating icons with subtle animation */}
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className={`absolute ${i % 2 === 0 ? 'right-8' : 'left-8'} ${
            i === 1 ? 'top-32' : i === 2 ? 'top-1/3' : i === 3 ? 'bottom-1/3' : 'bottom-32'
          } pointer-events-none`}
          initial={{ y: 0 }}
          animate={{ y: [0, -15, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        >
          <div className="w-10 h-10 bg-white/70 backdrop-blur-sm rounded-lg shadow-md border border-slate-200/50 flex items-center justify-center text-blue-500">
            {i === 1 && <HelpCircle className="w-5 h-5" />}
            {i === 2 && <BookOpen className="w-5 h-5" />}
            {i === 3 && <Shield className="w-5 h-5" />}
            {i === 4 && <MessageSquare className="w-5 h-5" />}
          </div>
        </motion.div>
      ))}

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-purple-500/10 backdrop-blur-sm border border-white/30 rounded-full shadow-lg mb-8"
          >
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-semibold text-slate-800">
              Clear Guidance for Every User
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            <span className="block text-slate-900">Help</span>
            <span className="block mt-2">
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 animate-gradient">
                  Center
                </span>
                <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-600/30 via-blue-500/30 to-emerald-500/30 blur-xl">
                  Center
                </span>
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto"
          >
            Everything you need to use AssignFlow Hub effectively.
            Clear answers for students, teachers, and administrators.
          </motion.p>
        </motion.div>

        {/* Search Bar with animations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto mb-16 search-container relative z-30"
        >
          <motion.div 
            className="relative group"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: isSearchFocused ? 0.3 : 0 }}
              transition={{ duration: 0.3 }}
            />
            
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 z-20" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                onClick={handleSearchClick}
                placeholder="Search for help topics..."
                className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border-2 border-slate-200/50 rounded-2xl text-slate-700 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 cursor-text relative z-20 hover:border-slate-300/70"
              />
            </div>

            <AnimatePresence>
              {isSearchFocused && searchQuery && filteredItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-white/50 rounded-2xl shadow-2xl z-40 max-h-96 overflow-y-auto"
                >
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-semibold text-slate-500 border-b border-slate-200/50">
                      {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} found
                    </div>
                    {filteredItems.map((item, index) => (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ backgroundColor: "rgba(248, 250, 252, 0.8)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSearchItemClick(item);
                        }}
                        className="w-full text-left px-4 py-3 transition-colors duration-200 border-b border-slate-200/30 last:border-b-0 flex items-start gap-3 group/result"
                      >
                        <motion.div 
                          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.sectionColor} p-1.5 flex-shrink-0`}
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <item.sectionIcon className="w-5 h-5 text-white" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-slate-500 mb-1 truncate">
                            {item.sectionTitle}
                          </div>
                          <div className="font-medium text-slate-900 truncate group-hover/result:text-blue-600 transition-colors duration-200">
                            {item.title}
                          </div>
                        </div>
                        <motion.div
                          initial={{ x: -5, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.05 + 0.1 }}
                        >
                          <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1 group-hover/result:text-blue-500 group-hover/result:translate-x-1 transition-all duration-200" />
                        </motion.div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Show message when no results */}
          {searchQuery && filteredItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 p-4 bg-gradient-to-r from-amber-50/50 to-amber-100/30 border border-amber-200 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-amber-800">No results found for "{searchQuery}"</p>
                  <p className="text-xs text-amber-700">Try different keywords or browse the sections below</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Quick Stats with hover effects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 relative z-10"
        >
          {[
            { icon: Users, value: "3 Roles", label: "Supported", color: "text-blue-600" },
            { icon: FileText, value: "7 Sections", label: "Detailed Guides", color: "text-emerald-600" },
            { icon: Clock, value: "24h", label: "Response Goal", color: "text-purple-600" },
            { icon: CheckCircle, value: "100%", label: "Real Features", color: "text-amber-600" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden group"
              onClick={() => {
                if (stat.value === "3 Roles") {
                  setExpandedSection("getting-started");
                } else if (stat.value === "7 Sections") {
                  setExpandedSection("getting-started");
                }
              }}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <div className="relative flex items-center gap-3">
                <motion.div 
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 5 }}
                >
                  <stat.icon className="w-5 h-5" />
                </motion.div>
                <div>
                  <div className="text-lg font-bold text-slate-900 group-hover:text-slate-800 transition-colors duration-200">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors duration-200">
                    {stat.label}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content with smooth animations */}
        <div className="space-y-4 relative z-10">
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * sectionIndex }}
              className="group/section"
            >
              {/* Glow effect on hover */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-emerald-500/5 rounded-2xl blur-xl opacity-0 group-hover/section:opacity-100 transition-opacity duration-500 pointer-events-none"
                whileHover={{ opacity: 0.3 }}
              />
              
              <div className="relative bg-white/95 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Section Header */}
                <motion.button
                  whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.5)" }}
                  whileTap={{ scale: 0.995 }}
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 transition-colors duration-200 relative overflow-hidden"
                  type="button"
                >
                  {/* Animated background effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-emerald-50/30 opacity-0 group-hover/section:opacity-100 transition-opacity duration-300"
                    initial={false}
                    animate={expandedSection === section.id ? { opacity: 1 } : { opacity: 0 }}
                  />
                  
                  <div className="relative flex items-center gap-4">
                    <motion.div 
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${section.color} p-2.5 flex-shrink-0 group-hover/section:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <section.icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <div className="text-left">
                      <motion.h2 
                        className="text-xl font-bold text-slate-900 mb-1 group-hover/section:text-slate-800 transition-colors duration-200"
                        whileHover={{ x: 2 }}
                      >
                        {section.title}
                      </motion.h2>
                      <p className="text-slate-600 text-sm group-hover/section:text-slate-700 transition-colors duration-200">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    className="flex-shrink-0"
                    animate={{ rotate: expandedSection === section.id ? 0 : -90 }}
                    transition={{ duration: 0.3, type: "spring" }}
                  >
                    <ChevronDown className="w-6 h-6 text-slate-400 group-hover/section:text-slate-600 transition-colors duration-200" />
                  </motion.div>
                </motion.button>

                {/* Section Content with AnimatePresence */}
                <AnimatePresence>
                  {expandedSection === section.id && (
                    <motion.div
                      key={`content-${section.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="border-t border-slate-100 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {section.items.map((item, itemIndex) => (
                            <motion.div
                              key={item.id}
                              id={item.id}
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ delay: itemIndex * 0.05 }}
                              whileHover={{ y: -2, scale: 1.01 }}
                              whileTap={{ scale: 0.98 }}
                              className="p-4 bg-gradient-to-r from-blue-50/50 to-emerald-50/50 border border-white rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer group/item relative overflow-hidden"
                              onClick={() => {
                                const element = document.getElementById(item.id);
                                if (element) {
                                  element.scrollIntoView({ 
                                    behavior: 'smooth',
                                    block: 'center'
                                  });
                                  element.classList.add('highlight-item');
                                  setTimeout(() => {
                                    element.classList.remove('highlight-item');
                                  }, 2000);
                                }
                              }}
                            >
                              {/* Hover glow effect */}
                              <motion.div 
                                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none"
                                whileHover={{ opacity: 0.2 }}
                              />
                              
                              <div className="relative flex items-start gap-3 mb-2">
                                <motion.div 
                                  className={`w-8 h-8 rounded-md bg-gradient-to-br ${section.color} p-1.5 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300`}
                                  whileHover={{ rotate: 5 }}
                                >
                                  <section.icon className="w-5 h-5 text-white" />
                                </motion.div>
                                <motion.h3 
                                  className="font-semibold text-slate-900 text-sm pt-0.5 group-hover/item:text-blue-700 transition-colors duration-200"
                                  whileHover={{ x: 2 }}
                                >
                                  {item.title}
                                </motion.h3>
                              </div>
                              <motion.p 
                                className="text-slate-700 text-sm whitespace-pre-line relative group-hover/item:text-slate-800 transition-colors duration-200"
                                initial={{ opacity: 0.9 }}
                                whileHover={{ opacity: 1 }}
                              >
                                {item.content}
                              </motion.p>
                            </motion.div>
                          ))}
                        </div>

                        {/* Section Footer */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="mt-6 pt-4 border-t border-slate-200/50"
                        >
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-slate-600">
                              {section.items.length} topic{section.items.length !== 1 ? 's' : ''} in this section
                            </div>
                            <div className="flex gap-3">
                              <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(248, 250, 252, 0.8)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setExpandedSection(null)}
                                className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100/50 rounded-lg transition-all duration-200"
                              >
                                Collapse Section
                              </motion.button>
                              {section.id === "contact-support" && (
                                <motion.a
                                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)" }}
                                  whileTap={{ scale: 0.95 }}
                                  href="/contact"
                                  className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-200 relative overflow-hidden group/contact"
                                >
                                  <motion.div 
                                    className="absolute inset-0 bg-gradient-to-r from-blue-700 to-emerald-600 opacity-0 group-hover/contact:opacity-100 transition-opacity duration-300"
                                  />
                                  <span className="relative">Contact Support</span>
                                </motion.a>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section with animations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center relative z-10"
        >
          <motion.div 
            className="p-8 bg-gradient-to-br from-blue-50/50 to-emerald-50/50 border border-blue-200/30 rounded-3xl overflow-hidden"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            {/* Animated background */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500"
              whileHover={{ opacity: 0.3 }}
            />
            
            <div className="relative max-w-2xl mx-auto">
              <motion.h3 
                className="text-2xl font-bold text-slate-900 mb-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                Still Need Help?
              </motion.h3>
              <motion.p 
                className="text-slate-600 mb-6"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                Can't find what you're looking for? Our support team is here to help.
              </motion.p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 relative overflow-hidden group/cta"
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-700 to-emerald-600 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300"
                  />
                  <MessageSquare className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Contact Support</span>
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.9)", borderColor: "rgb(147, 197, 253)" }}
                  whileTap={{ scale: 0.95 }}
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm border border-slate-300 text-slate-700 font-semibold rounded-xl hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
                >
                  <ArrowRight className="w-5 h-5" />
                  Return to Home
                </motion.a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes highlight {
          0%, 100% {
            background-color: transparent;
            box-shadow: none;
          }
          50% {
            background-color: rgba(59, 130, 246, 0.1);
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .bg-grid-slate-100 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(241 245 249 / 0.3)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
        .highlight-item {
          animation: highlight 2s ease;
        }
        .float-animation {
          animation: float 4s ease-in-out infinite;
        }
        
        /* Fix z-index issues */
        .search-container {
          position: relative;
          z-index: 30;
        }
        
        /* Improve clickability */
        button, a, [role="button"] {
          cursor: pointer !important;
          -webkit-tap-highlight-color: transparent;
        }
        
        /* Remove blue highlight on mobile */
        button:focus, a:focus {
          outline: none;
        }
        
        /* Smooth transitions */
        * {
          transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
        }
        
        /* Mobile touch improvements */
        @media (max-width: 640px) {
          button, a, input, .clickable {
            min-height: 44px;
            min-width: 44px;
          }
          
          input {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default HelpCenterPage;