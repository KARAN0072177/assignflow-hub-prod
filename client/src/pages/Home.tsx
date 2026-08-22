import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Typewriter from "typewriter-effect";
import {
  ArrowRight,
  ArrowUp,
  Sparkles,
  BookOpen,
  Users,
  Shield,
  Zap,
  CheckCircle,
  Check,
  Copy,
  FileText,
  Clock,
  Award,
  GraduationCap,
  ChevronDown,
  Layers,
  HelpCircle,
} from "lucide-react";
import Testimonials from "../components/Testimonials";
import Features from "../components/Features";
import NewsletterSubscribe from "../components/NewsletterSubscribe";
import { Helmet } from "react-helmet-async";

const SAMPLE_CLASSES = [
  {
    id: "phy",
    name: "Physics 101: Mechanics",
    code: "PHY101",
    students: 38,
    avg: "88.5%",
    tasks: [
      {
        title: "Lab 4: Wave Mechanics & Optics",
        status: "Needs Grading",
        statusColor: "bg-amber-50 text-amber-700 border-amber-200",
        due: "Submitted by 36/38",
        badge: "4 Pending",
      },
      {
        title: "Midterm Research Essay",
        status: "Due in 2 days",
        statusColor: "bg-blue-50 text-blue-700 border-blue-200",
        due: "Due Fri, 11:59 PM",
        badge: "Active",
      },
      {
        title: "Thermodynamics Problem Set",
        status: "Graded",
        statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        due: "Class Avg: 94.2%",
        badge: "Published",
      },
    ],
  },
  {
    id: "cs",
    name: "CS 102: Data Structures",
    code: "CS102",
    students: 45,
    avg: "91.0%",
    tasks: [
      {
        title: "Assignment 3: Binary Search Trees",
        status: "Graded",
        statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        due: "Class Avg: 92.5%",
        badge: "Published",
      },
      {
        title: "Graph Algorithms Lab Report",
        status: "Needs Grading",
        statusColor: "bg-amber-50 text-amber-700 border-amber-200",
        due: "Submitted by 42/45",
        badge: "6 Pending",
      },
      {
        title: "Final Capstone Proposal",
        status: "Due in 4 days",
        statusColor: "bg-blue-50 text-blue-700 border-blue-200",
        due: "Due Next Mon",
        badge: "Active",
      },
    ],
  },
  {
    id: "math",
    name: "MATH 201: Linear Algebra",
    code: "MTH201",
    students: 32,
    avg: "86.4%",
    tasks: [
      {
        title: "Matrix Decomposition Quiz",
        status: "Graded",
        statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        due: "Class Avg: 89.0%",
        badge: "Published",
      },
      {
        title: "Vector Spaces Proof Set",
        status: "Due Tomorrow",
        statusColor: "bg-rose-50 text-rose-700 border-rose-200",
        due: "Due at 11:59 PM",
        badge: "Urgent",
      },
      {
        title: "Eigenvalues & Eigenvectors",
        status: "Published",
        statusColor: "bg-slate-100 text-slate-700 border-slate-200",
        due: "Reading Resource",
        badge: "Material",
      },
    ],
  },
];

const FAQS = [
  {
    q: "How do students join a classroom in AssignFlow Hub?",
    a: "Every classroom created by a teacher is automatically assigned a unique 6-character access code (e.g. PHY101). Students simply log into their account, click 'Join Classroom', and enter the code to gain instant access to all assignments and resources.",
  },
  {
    q: "What file formats and file sizes are supported for assignment submissions?",
    a: "AssignFlow Hub supports standard academic document formats including PDF (.pdf) and Microsoft Word documents (.docx) up to 10MB per submission. Both teachers and students can drag and drop files directly onto the upload zone.",
  },
  {
    q: "What happens when an assignment deadline passes?",
    a: "AssignFlow Hub features automated background deadline monitoring. Once the scheduled due date and time pass, the assignment submission window locks automatically to maintain fairness and academic integrity across the classroom.",
  },
  {
    q: "Can teachers save grading feedback as a draft before publishing?",
    a: "Yes! Teachers can review submissions, assign scores, and write constructive comments as drafts. When ready, teachers can publish grades atomically with 1-click so students receive their evaluations simultaneously.",
  },
  {
    q: "Can teachers export student grade reports for school administration?",
    a: "Absolutely. The Teacher Performance Analytics dashboard includes a 1-Click CSV export tool that compiles student names, emails, completed assignments, average percentages, and performance tiers into a clean spreadsheet.",
  },
  {
    q: "Is AssignFlow Hub free for teachers and students?",
    a: "Yes. AssignFlow Hub is free for teachers and students to create classrooms, publish coursework, turn in assignments, and track academic growth.",
  },
];

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedClassIndex, setSelectedClassIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token);
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const activeClass = SAMPLE_CLASSES[selectedClassIndex];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  return (
    <>
      <Helmet>
        <title>AssignFlow Hub — Modern Assignment &amp; Classroom Management Platform</title>
        <meta
          name="description"
          content="AssignFlow Hub helps educators and students manage virtual classrooms, assignment publishing, drag-and-drop submissions, and real-time grading analytics effortlessly."
        />
        <link rel="canonical" href="https://assignflowhub.karanart.com/" />
        <meta property="og:title" content="AssignFlow Hub" />
        <meta
          property="og:description"
          content="Streamlined virtual classrooms, drag-and-drop coursework submissions, and transparent gradebook analytics."
        />
        <meta property="og:url" content="https://assignflowhub.karanart.com/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900 relative">
        {/* Subtle grid background pattern */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* 1. HERO SECTION */}
        <section className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-10 sm:pt-16 pb-20 lg:pb-28">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center"
          >
            {/* Left Column: Heading & Value Proposition */}
            <div className="lg:col-span-7 xl:col-span-6 space-y-6">
              {/* Product Badge */}
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-semibold text-blue-800 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Purpose-Built for Modern Higher Ed &amp; K-12</span>
              </motion.div>

              {/* Main Headline with Typewriter */}
              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-slate-900 leading-[1.12]"
              >
                Classroom management designed for{" "}
                <span className="text-blue-600 block sm:inline">
                  <Typewriter
                    options={{
                      strings: [
                        "Modern Educators.",
                        "Ambitious Students.",
                        "Faster Grading.",
                        "Engaging Classes.",
                        "Zero Paperwork.",
                      ],
                      autoStart: true,
                      loop: true,
                      delay: 50,
                      deleteSpeed: 30,
                    }}
                  />
                </span>
              </motion.h1>

              {/* Value Subheading */}
              <motion.p
                variants={fadeInUp}
                className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl"
              >
                AssignFlow Hub brings virtual classroom workspaces, drag-and-drop coursework publishing, stress-free student submissions, and instant grading analytics together in one distraction-free platform.
              </motion.p>

              {/* 3 Core Value Bullet Points */}
              <motion.div variants={fadeInUp} className="space-y-2.5 pt-1">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span><strong>Instant 6-Character Join Codes</strong> for effortless student enrollment</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span><strong>Drag-and-Drop Submissions</strong> with auto-saved draft states</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span><strong>Real-Time Gradebook &amp; Analytics</strong> for transparent student growth</span>
                </div>
              </motion.div>

              {/* CTA Action Buttons */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3.5 items-stretch sm:items-center pt-2">
                <button
                  onClick={handleGetStarted}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all active:scale-95 text-sm cursor-pointer"
                >
                  <span>{isLoggedIn ? "Open Dashboard" : "Get Started Free"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {!isLoggedIn && (
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 font-semibold rounded-xl text-sm transition-colors shadow-2xs"
                  >
                    <span>Sign In to Classroom</span>
                  </Link>
                )}
              </motion.div>

              {/* Trust Indicators */}
              <motion.div variants={fadeInUp} className="pt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Free for teachers &amp; students</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Data privacy compliant</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Setup in &lt; 60 seconds</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Interactive Classroom Command Center Mockup */}
            <div className="lg:col-span-5 xl:col-span-6 lg:pl-4">
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60 p-6 sm:p-7 space-y-5"
              >
                {/* Top Interactive Tabs: Switch Demo Class */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                      Class:
                    </span>
                    {SAMPLE_CLASSES.map((cls, idx) => (
                      <button
                        key={cls.id}
                        onClick={() => setSelectedClassIndex(idx)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          selectedClassIndex === idx
                            ? "bg-slate-900 text-white shadow-2xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {cls.name.split(":")[0]}
                      </button>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Class
                  </span>
                </div>

                {/* Selected Classroom Banner Card */}
                <div className="p-4 bg-gradient-to-br from-blue-50/80 via-slate-50 to-indigo-50/40 border border-blue-200/80 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        {activeClass.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        <span>{activeClass.students} Enrolled</span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-700">
                          {activeClass.avg} Class Avg
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Join Code with Copy Button */}
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-2xs shrink-0">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Code:</span>
                    <span className="font-mono font-bold text-xs text-blue-700">
                      {activeClass.code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(activeClass.code)}
                      className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer"
                      title="Copy join code"
                    >
                      {copiedCode === activeClass.code ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Coursework & Grading Queue */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider px-1">
                    <span>Active Coursework &amp; Submissions</span>
                    <span>Status</span>
                  </div>

                  {activeClass.tasks.map((task, tIdx) => (
                    <div
                      key={tIdx}
                      className="p-3.5 bg-slate-50 hover:bg-blue-50/40 border border-slate-200 rounded-xl flex items-center justify-between gap-3 transition-colors group cursor-default"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                          <h4 className="font-semibold text-xs text-slate-900 truncate">
                            {task.title}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-500 pl-6">
                          {task.due}
                        </p>
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border shrink-0 ${task.statusColor}`}
                      >
                        {task.badge}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Live Synchronized Activity Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Real-time WebSocket Sync Active</span>
                  </div>
                  <span className="font-semibold text-blue-600 hover:text-blue-700">
                    Full Roster →
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* 2. ACADEMIC METRIC PROOF STRIP */}
        <section className="border-y border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-100">
              {[
                { value: "10,000+", label: "Assignments Evaluated", sub: "Fast, fair feedback loop" },
                { value: "94%", label: "Time Saved", sub: "On coursework grading & administration" },
                { value: "99.95%", label: "Platform Uptime", sub: "Always accessible at deadline hour" },
                { value: "4.9 / 5.0", label: "Educator & Student Rating", sub: "Across 2,400+ active classrooms" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="py-8 px-6 lg:px-8 first:pl-0"
                >
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-slate-800 mb-0.5">{stat.label}</div>
                  <div className="text-xs text-slate-400">{stat.sub}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. HOW IT WORKS 3-STEP ACADEMIC WORKFLOW */}
        <section className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-center max-w-3xl mx-auto mb-16 space-y-3"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-semibold text-blue-700 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                Simple 3-Step Lifecycle
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                How AssignFlow Hub streamlines education
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                From creating a classroom to final gradebook analytics, the platform removes friction so teachers and students can focus on learning.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white border border-slate-200 rounded-3xl p-7 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 font-extrabold text-lg flex items-center justify-center mb-6 shadow-2xs">
                    01
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    Create or Join in Seconds
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    Teachers generate instant 6-character access codes. Students enter the code to join the class roster immediately with zero tedious configuration.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-blue-700 font-bold flex items-center justify-between">
                  <span>Invite: PHY101</span>
                  <span className="text-[11px] text-slate-500 font-sans font-medium">Instant Enrollment</span>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white border border-slate-200 rounded-3xl p-7 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 font-extrabold text-lg flex items-center justify-center mb-6 shadow-2xs">
                    02
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    Drag, Drop &amp; Submit
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    Teachers publish rich coursework prompts with PDF attachments. Students drag and drop submissions with draft auto-saving before final turn-in.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-indigo-700 font-bold flex items-center justify-between">
                  <span>Upload: lab4_report.pdf</span>
                  <span className="text-[11px] text-emerald-600 font-sans font-semibold">Auto-Saved</span>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.45, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white border border-slate-200 rounded-3xl p-7 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 font-extrabold text-lg flex items-center justify-center mb-6 shadow-2xs">
                    03
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    Evaluate &amp; Track Growth
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    Teachers grade rapidly with 1-click score presets and constructive feedback chips. Students receive transparent scores with deep grade analytics.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-emerald-700 font-bold flex items-center justify-between">
                  <span>Score: 95 / 100</span>
                  <span className="text-[11px] text-blue-600 font-sans font-semibold">1-Click Published</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 4. PRODUCT FEATURES SHOWCASE */}
        <Features />

        {/* 5. DUAL EXPERIENCE: TEACHERS VS STUDENTS */}
        <section className="py-20 lg:py-28 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-center max-w-3xl mx-auto mb-16 space-y-3"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                Tailored Perspectives
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Designed for both sides of the classroom
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Whether you are managing multiple courses or submitting weekly coursework, AssignFlow Hub adapts to your exact academic role.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Teacher Experience Box */}
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="bg-gradient-to-br from-blue-50/70 via-white to-slate-50 border border-blue-200/80 rounded-3xl p-8 shadow-xs space-y-6"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      Teacher Dashboard
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                      Effortless Class &amp; Grading Control
                    </h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    "Create unlimited classrooms with shareable 6-digit access codes",
                    "Drag-and-drop coursework publishing with PDF attachments and due dates",
                    "Centralized grading queue with 1-click score presets (100%, 95%, 90%)",
                    "Atomic grade publishing with constructive feedback commentary",
                    "Global student performance analytics with grade distribution charts & CSV export",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800"
                  >
                    <span>Explore Teacher Tools</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>

              {/* Student Experience Box */}
              <motion.div
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="bg-gradient-to-br from-emerald-50/70 via-white to-slate-50 border border-emerald-200/80 rounded-3xl p-8 shadow-xs space-y-6"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Student Experience
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                      Clear Deadlines &amp; Transparent Growth
                    </h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    "Join any class instantly with a 6-character code from your teacher",
                    "Drag-and-drop homework submissions with support for PDF and DOCX files",
                    "Save draft submissions before final turn-in to avoid accidental uploads",
                    "Access transparent gradebook showing percentage scores & teacher feedback",
                    "Download your original submitted documents at any time for your records",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>Explore Student Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 6. COMMUNITY TESTIMONIALS */}
        <Testimonials />

        {/* 7. FREQUENTLY ASKED QUESTIONS (FAQ) */}
        <section className="py-20 lg:py-28 bg-slate-50 border-y border-slate-200">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-center max-w-2xl mx-auto mb-16 space-y-3"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-semibold text-blue-700 uppercase tracking-wider">
                <HelpCircle className="w-3.5 h-3.5" />
                Answers to Common Inquiries
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Everything you need to know about joining classrooms, submitting work, and grading.
              </p>
            </motion.div>

            <div className="space-y-3.5">
              {FAQS.map((faq, fIdx) => {
                const isOpen = openFaqIndex === fIdx;

                return (
                  <motion.div
                    key={fIdx}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ delay: fIdx * 0.05, duration: 0.4 }}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs transition-all"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      <span className="text-sm sm:text-base">{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                          isOpen ? "rotate-180 text-blue-600" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 8. NEWSLETTER SUBSCRIPTION */}
        <NewsletterSubscribe />

        {/* 9. FINAL HIGH-IMPACT EDUCATOR CALL TO ACTION */}
        <section className="py-20 lg:py-24 bg-slate-900 text-white">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mx-auto px-6 lg:px-8 text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-semibold text-blue-300">
              <Award className="w-3.5 h-3.5" />
              <span>Join 2,400+ Educators &amp; Students Worldwide</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Ready to streamline your classroom workflow?
            </h2>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Create your first virtual classroom in under 60 seconds, share your 6-character access code with students, and start publishing assignments today.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={handleGetStarted}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all text-sm cursor-pointer"
              >
                <span>{isLoggedIn ? "Open Dashboard" : "Create Free Account"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {!isLoggedIn && (
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-400">
              <span>✓ Free for educational use</span>
              <span>✓ No credit card required</span>
              <span>✓ Instant setup</span>
            </div>
          </motion.div>
        </section>

        {/* FLOATING BACK TO TOP BUTTON */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 16 }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:bg-blue-600 transition-colors border border-slate-700/50 flex items-center justify-center cursor-pointer group"
              aria-label="Back to top"
              title="Back to top"
            >
              <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Home;