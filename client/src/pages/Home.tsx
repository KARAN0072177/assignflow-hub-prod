import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUp,
  BookOpen,
  Check,
  Copy,
  FileText,
  ChevronDown,
  GraduationCap,
  Download,
  UploadCloud,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Testimonials from "../components/Testimonials";
import Features from "../components/Features";
import NewsletterSubscribe from "../components/NewsletterSubscribe";
import { Helmet } from "react-helmet-async";
import { getPublicUptime, type UptimeData } from "../services/uptime.api";
import { getFeedbackStats, type FeedbackStats } from "../services/feedback.api";

type DemoMode = "grading" | "student" | "gradebook";

const SAMPLE_ROSTER = [
  { name: "Aria Chen", id: "PHY-001", task: "Wave Mechanics & Optics", file: "chen_lab4_final.pdf", size: "2.4 MB", status: "Needs Grading", time: "Turned in 42m before cutoff", score: null },
  { name: "Marcus Vance", id: "PHY-002", task: "Wave Mechanics & Optics", file: "vance_optics_v2.pdf", size: "3.1 MB", status: "Graded", time: "Turned in 2h before cutoff", score: 95 },
  { name: "Elena Rostova", id: "PHY-003", task: "Wave Mechanics & Optics", file: "elena_wave_optics.docx", size: "1.8 MB", status: "Graded", time: "Turned in 1d before cutoff", score: 92 },
  { name: "David Kim", id: "PHY-004", task: "Wave Mechanics & Optics", file: "kim_lab4_report.pdf", size: "4.0 MB", status: "Graded", time: "Turned in 15m before cutoff", score: 88 },
];

const FAQS = [
  {
    category: "Enrollment & Codes",
    q: "How do students join a classroom in AssignFlow Hub?",
    a: "When a teacher creates a classroom, AssignFlow Hub generates a unique 6-character access code (such as PHY101). Students simply log in, click 'Join Classroom', and enter the code to immediately access coursework and materials.",
  },
  {
    category: "Submissions & Files",
    q: "What file formats and file size limits are supported?",
    a: "AssignFlow Hub supports standard educational documents including PDF (.pdf) and Microsoft Word documents (.docx) up to 10MB per submission. Both teachers and students can drag and drop documents directly onto the upload zone.",
  },
  {
    category: "Deadlines & Cutoffs",
    q: "What happens when an assignment deadline passes?",
    a: "AssignFlow Hub features automated deadline monitoring. The moment the scheduled due date and time arrives, the submission window locks automatically to maintain fairness and academic integrity across the classroom.",
  },
  {
    category: "Grading & Feedback",
    q: "Can teachers save grading feedback as a draft before publishing?",
    a: "Yes. Teachers can review submissions, assign scores, and draft comments privately. When ready, teachers can publish evaluations with 1-click so all students receive their scores simultaneously.",
  },
  {
    category: "Gradebook & Exports",
    q: "Can teachers export student grade reports for school administration?",
    a: "Yes! The Teacher Gradebook includes a 1-Click CSV export tool that compiles student names, assignment completion, percentage averages, and grade tiers into a clean spreadsheet ready for school records.",
  },
  {
    category: "Access & Pricing",
    q: "Is AssignFlow Hub free for teachers and students?",
    a: "Yes. AssignFlow Hub is 100% free for teachers and students to create classrooms, publish assignments, submit homework, and track academic growth.",
  },
];

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [demoMode, setDemoMode] = useState<DemoMode>("grading");
  const [copiedCode, setCopiedCode] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeScoreInput, setActiveScoreInput] = useState<number>(95);

  const [uptimeData, setUptimeData] = useState<UptimeData>({
    uptimeRatio: "99.95",
    status: "operational",
    isLive: false,
    monitoredPeriod: "30 days",
    lastChecked: "",
  });
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStats>({
    averageRating: "4.9",
    totalReviews: 9,
    totalClassrooms: 14,
    totalAssignments: 25,
    totalSubmissions: 25,
  });

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    getPublicUptime().then((data) => {
      if (isMounted && data) {
        setUptimeData(data);
      }
    });
    getFeedbackStats().then((data) => {
      if (isMounted && data) {
        setFeedbackStats(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

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
      if (window.scrollY > 400) {
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

  const handleCopyCode = () => {
    navigator.clipboard.writeText("PHY101");
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const scrollToTestimonials = () => {
    const el = document.getElementById("testimonials");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Helmet>
        <title>AssignFlow Hub — Academic Classroom &amp; Assignment Platform</title>
        <meta
          name="description"
          content="AssignFlow Hub helps educators and students manage virtual classrooms, drag-and-drop coursework publishing, draft-safe homework submissions, and real-time grading analytics."
        />
        <link rel="canonical" href="https://assignflowhub.karanart.com/" />
        <meta property="og:title" content="AssignFlow Hub — Classroom &amp; Assignment Management" />
        <meta
          property="og:description"
          content="Streamlined virtual classrooms, drag-and-drop coursework submissions, and transparent gradebook analytics."
        />
        <meta property="og:url" content="https://assignflowhub.karanart.com/" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">

        {/* ─── 1. HERO PRODUCT STUDIO ─── */}
        <section className="max-w-6xl mx-auto px-6 lg:px-8 pt-12 sm:pt-16 pb-16 lg:pb-24">
          {/* Header Copy with Academic Focus */}
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-900 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Modern Classroom Platform</span>
              <span className="text-blue-300">•</span>
              <span>Free for Educators &amp; Students</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              The classroom platform built for clear deadlines, effortless submissions, and faster grading.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              AssignFlow Hub brings virtual classrooms, drag-and-drop coursework publishing, draft-safe student submissions, and 1-click grading together in one clean, distraction-free platform.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all text-sm cursor-pointer shadow-sm hover:shadow active:scale-98"
              >
                <span>{isLoggedIn ? "Open Dashboard" : "Create Free Classroom"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {!isLoggedIn && (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold rounded-xl text-sm transition-colors shadow-2xs"
                >
                  Sign In to Classroom
                </Link>
              )}

              <div className="text-xs text-slate-500 font-medium sm:pl-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant 6-character class code • No credit card</span>
              </div>
            </div>
          </div>

          {/* ─── LIVE PRODUCT SHOWCASE WORKBENCH ─── */}
          <div className="mt-12 border border-slate-200 rounded-2xl overflow-hidden shadow-md bg-white">
            {/* App Window Chrome Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                </div>
                <div className="text-xs font-semibold text-slate-700 pl-3 border-l border-slate-200 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>Physics 101: Mechanics &amp; Wave Optics</span>
                </div>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center p-1 bg-slate-200/70 rounded-xl">
                {[
                  { id: "grading", label: "Teacher Grading Queue" },
                  { id: "student", label: "Student Submission Portal" },
                  { id: "gradebook", label: "Classroom Gradebook" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setDemoMode(tab.id as DemoMode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      demoMode === tab.id
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* View 1: TEACHER GRADING QUEUE */}
            {demoMode === "grading" && (
              <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white">
                {/* Left: Queue Table (7 cols) */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-600 uppercase tracking-wider text-[11px]">
                      Student Submissions (4 Received)
                    </span>
                    <span className="font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-[11px]">
                      3 Graded • 1 Awaiting Review
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {SAMPLE_ROSTER.map((row, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border text-xs transition-colors flex items-center justify-between gap-3 ${
                          row.status === "Needs Grading"
                            ? "bg-blue-50/60 border-blue-200 shadow-2xs"
                            : "bg-slate-50/70 border-slate-200/80"
                        }`}
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm truncate">
                              {row.name}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {row.id}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="truncate font-medium">{row.file}</span>
                            <span className="text-slate-300">•</span>
                            <span>{row.size}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          {row.score !== null ? (
                            <span className="font-bold text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-2xs">
                              {row.score} / 100
                            </span>
                          ) : (
                            <span className="font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                              Needs Score
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Active Evaluation Deck (5 cols) */}
                <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <div className="text-sm font-bold text-slate-900">Aria Chen</div>
                      <div className="text-xs text-slate-500">Lab 4: Wave Mechanics &amp; Optics</div>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                      Draft Review
                    </span>
                  </div>

                  {/* 1-Click Score Presets */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      1-Click Score Presets:
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs font-bold">
                      {[100, 95, 90, 85].map((s) => (
                        <button
                          key={s}
                          onClick={() => setActiveScoreInput(s)}
                          className={`py-2 rounded-lg border transition-colors cursor-pointer text-center ${
                            activeScoreInput === s
                              ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                          }`}
                        >
                          {s}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comments Box */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Teacher Comments:
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 italic">
                      "Exemplary derivation of the wave equation. Clear error analysis in section 3."
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-2 flex items-center gap-2">
                    <button className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors text-center shadow-2xs">
                      Publish Score ({activeScoreInput}%)
                    </button>
                    <button className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium cursor-pointer">
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* View 2: STUDENT SUBMISSION PORTAL */}
            {demoMode === "student" && (
              <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white">
                <div className="lg:col-span-7 space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Assignment Guidelines
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Lab 4: Wave Mechanics &amp; Optics Interferometry
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Submit your completed laboratory report documenting fringe pattern shifts and slit displacement measurements. Ensure all uncertainty calculations are included.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 font-medium text-slate-800">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>Lab4_Instructions_Optics.pdf</span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">1.4 MB</span>
                  </div>

                  {/* Submission Status */}
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Submission Uploaded &amp; Graded
                      </span>
                      <span className="font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                        Score: 95% (A)
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium pl-5">
                      vance_optics_v2.pdf (3.1 MB) • Feedback: "Outstanding mathematical derivation"
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="text-xs font-bold text-slate-700 pb-2 border-b border-slate-200 uppercase tracking-wider">
                    Student Submission Box
                  </div>

                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center space-y-2 bg-white">
                    <UploadCloud className="w-8 h-8 text-blue-600 mx-auto" />
                    <div className="text-xs sm:text-sm font-semibold text-slate-800">
                      Drag &amp; drop your coursework file
                    </div>
                    <div className="text-xs text-slate-400">
                      Supports PDF, DOCX up to 10MB
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 font-medium pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Due Friday at 11:59 PM
                    </span>
                    <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-semibold border border-amber-200">
                      Auto-locks at cutoff
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* View 3: CLASS GRADEBOOK */}
            {demoMode === "gradebook" && (
              <div className="p-5 sm:p-7 bg-white space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
                  <div>
                    <span className="text-sm font-bold text-slate-900">Physics 101 Gradebook</span>
                    <span className="text-slate-500 ml-2 font-medium">(38 Enrolled Students)</span>
                  </div>

                  <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer">
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider font-sans font-bold">
                        <th className="pb-2.5">Student Name</th>
                        <th className="pb-2.5">Student ID</th>
                        <th className="pb-2.5">Lab 1 (25%)</th>
                        <th className="pb-2.5">Lab 2 (25%)</th>
                        <th className="pb-2.5">Lab 3 (25%)</th>
                        <th className="pb-2.5">Lab 4 (25%)</th>
                        <th className="pb-2.5 text-right">Class Standing</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="py-3 font-sans font-bold text-slate-900">Aria Chen</td>
                        <td className="py-3 text-slate-400">PHY-001</td>
                        <td className="py-3">98%</td>
                        <td className="py-3">96%</td>
                        <td className="py-3">94%</td>
                        <td className="py-3 text-blue-700 font-semibold">95% (Pending)</td>
                        <td className="py-3 text-right font-bold text-emerald-700">95.8% (A)</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-sans font-bold text-slate-900">Marcus Vance</td>
                        <td className="py-3 text-slate-400">PHY-002</td>
                        <td className="py-3">88%</td>
                        <td className="py-3">90%</td>
                        <td className="py-3">84%</td>
                        <td className="py-3">95%</td>
                        <td className="py-3 text-right font-bold text-slate-900">89.2% (B+)</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-sans font-bold text-slate-900">Elena Rostova</td>
                        <td className="py-3 text-slate-400">PHY-003</td>
                        <td className="py-3">92%</td>
                        <td className="py-3">94%</td>
                        <td className="py-3">90%</td>
                        <td className="py-3">92%</td>
                        <td className="py-3 text-right font-bold text-emerald-700">92.0% (A-)</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-sans font-bold text-slate-900">David Kim</td>
                        <td className="py-3 text-slate-400">PHY-004</td>
                        <td className="py-3">85%</td>
                        <td className="py-3">82%</td>
                        <td className="py-3">88%</td>
                        <td className="py-3">88%</td>
                        <td className="py-3 text-right font-bold text-slate-900">85.7% (B)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bottom Status Ticker */}
            <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Real-time Classroom Sync Active</span>
              </div>
              <div className="flex items-center gap-3">
                <span>Class Join Code:</span>
                <button
                  onClick={handleCopyCode}
                  className="font-bold font-mono text-blue-700 hover:text-blue-800 flex items-center gap-1.5 cursor-pointer bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs"
                  title="Copy class code"
                >
                  <span>PHY101</span>
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 2. SYSTEM TELEMETRY & OPERATIONS BAR ─── */}
        <section className="border-y border-slate-200 bg-slate-50/70">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
              {/* Stat 1 */}
              <div className="py-6 px-4 first:pl-0">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {feedbackStats.totalAssignments}+
                </div>
                <div className="text-xs font-bold text-slate-700 mt-1 uppercase tracking-wider">
                  Assignments Published
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Across active courses
                </div>
              </div>

              {/* Stat 2 */}
              <div className="py-6 px-4">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {feedbackStats.totalSubmissions}+
                </div>
                <div className="text-xs font-bold text-slate-700 mt-1 uppercase tracking-wider">
                  Student Submissions
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Delivered on time
                </div>
              </div>

              {/* Stat 3 */}
              <div className="py-6 px-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {uptimeData.uptimeRatio}%
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Always Online
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-700 mt-1 uppercase tracking-wider">
                  Platform Reliability
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Accessible 24/7 at deadline hour
                </div>
              </div>

              {/* Stat 4 */}
              <div
                onClick={scrollToTestimonials}
                className="py-6 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors"
                title="View user reviews"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {feedbackStats.averageRating}
                  </span>
                  <span className="text-xs font-bold text-slate-400">/ 5.0</span>
                </div>
                <div className="text-xs font-bold text-slate-700 mt-1 uppercase tracking-wider flex items-center justify-between">
                  <span>Verified Rating</span>
                  <span className="text-xs text-blue-600 font-semibold">Reviews ↓</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  From {feedbackStats.totalReviews} teacher &amp; student reviews
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 3. HOW COURSEWORK FLOWS (HIGH-READABILITY REDESIGN OF IMAGE 1) ─── */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-4">
                Coursework Lifecycle
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                How coursework flows through AssignFlow Hub
              </h2>
              <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
                A simple, structured process designed to save educators time and keep students on track from day one.
              </p>
            </div>

            {/* 3 Visually Distinct, High-Readability Step Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Step 1: Course Setup */}
              <div className="border border-slate-200 rounded-2xl p-7 bg-white shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-6 relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                      01
                    </span>
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      Step 1: Enrollment
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    Course Setup &amp; Class Codes
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    Teachers create a classroom in seconds and receive an instant 6-character code (e.g. <strong className="text-slate-900">PHY101</strong>). Students enter this code to join the roster immediately without waiting for invites.
                  </p>
                </div>

                <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs font-medium text-blue-900 flex items-center justify-between">
                  <span>Class Code: <strong>PHY101</strong></span>
                  <span className="text-blue-700 font-semibold">Instant Join →</span>
                </div>
              </div>

              {/* Step 2: Intake & Cutoff */}
              <div className="border border-slate-200 rounded-2xl p-7 bg-white shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-6 relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                      02
                    </span>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                      Step 2: Submissions
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    Assignment Intake &amp; Deadlines
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    Teachers publish coursework prompts with PDF attachments. Students drag and drop submissions with draft auto-saving. At the scheduled cutoff, the window locks automatically.
                  </p>
                </div>

                <div className="p-3 bg-indigo-50/70 border border-indigo-200/80 rounded-xl text-xs font-medium text-indigo-900 flex items-center justify-between">
                  <span>Deadline: <strong>11:59 PM</strong></span>
                  <span className="text-indigo-700 font-semibold">Auto-Locks at Cutoff</span>
                </div>
              </div>

              {/* Step 3: Evaluation */}
              <div className="border border-slate-200 rounded-2xl p-7 bg-white shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-6 relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                      03
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      Step 3: Evaluation
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    Fast Grading &amp; Feedback
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    Teachers grade using 1-click score presets (100%, 95%, 90%) and reusable comment chips. Grades publish atomically so students receive transparent scores and feedback instantly.
                  </p>
                </div>

                <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs font-medium text-emerald-900 flex items-center justify-between">
                  <span>Release: <strong>1-Click Publish</strong></span>
                  <span className="text-emerald-700 font-semibold">Instant Student Sync</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── 4. CORE FEATURES (Bento Grid) ─── */}
        <Features />

        {/* ─── 5. HIGH-READABILITY ROLE WORKSPACES (OVERHAUL OF IMAGE 3) ─── */}
        <section className="py-20 lg:py-28 border-t border-slate-200 bg-slate-50/50">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-4">
                Tailored Experiences
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Designed for both educators and students
              </h2>
              <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
                Dedicated interfaces organized around the specific responsibilities of managing courses and completing coursework.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              
              {/* Teacher Spec Card */}
              <div className="border border-slate-200 rounded-3xl p-8 bg-white shadow-2xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900">
                        For Teachers &amp; Instructors
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Course management, publishing, and grading suite
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
                    Teacher View
                  </span>
                </div>

                {/* Scannable High-Contrast Capability Rows */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Instant Classroom Join Codes</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        Create unlimited classrooms and share a simple 6-character code with students for immediate onboarding.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Coursework Builder &amp; PDF Guidelines</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        Publish rich assignment briefs with due dates, point values, and downloadable PDF reference rubrics.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">1-Click Fast Grading &amp; Feedback Chips</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        Grade submissions quickly with preset score buttons (100%, 95%, 90%) and reusable comment chips.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Gradebook Analytics &amp; CSV Reports</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        Monitor class performance averages, view letter grade distributions, and export clean spreadsheets for school records.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800 transition-colors"
                  >
                    <span>Create a Teacher Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Student Spec Card */}
              <div className="border border-slate-200 rounded-3xl p-8 bg-white shadow-2xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900">
                        For Enrolled Students
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Homework submissions, deadlines, and grade transparency
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                    Student View
                  </span>
                </div>

                {/* Scannable High-Contrast Capability Rows */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Quick Classroom Enrollment</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        Join any class roster in seconds using the 6-character code provided by your teacher.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Draft-Safe Homework Submissions</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        Upload PDF and Word documents with automatic draft saving so your work is never lost before final turn-in.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Clear Deadlines &amp; Countdown Timers</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        Stay organized with clear cutoff indicators and status badges so you always know what is due next.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Transparent Grades &amp; Teacher Feedback</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        View evaluations, percentage scores, and teacher comments the moment grades are published.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                  >
                    <span>Join as a Student</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── 6. VERIFIED TESTIMONIALS ─── */}
        <div id="testimonials" className="scroll-mt-8">
          <Testimonials />
        </div>

        {/* ─── 7. FREQUENTLY ASKED QUESTIONS ─── */}
        <section className="py-20 lg:py-28 border-t border-slate-200 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="max-w-xl mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-4">
                Common Questions
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Frequently asked questions
              </h2>
              <p className="text-base text-slate-600 mt-2.5 leading-relaxed">
                Clear answers regarding classroom setup, document submissions, and gradebook management.
              </p>
            </div>

            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {FAQS.map((faq, fIdx) => {
                const isOpen = openFaqIndex === fIdx;

                return (
                  <div key={fIdx} className="py-4">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                      className="w-full text-left flex items-start justify-between gap-4 cursor-pointer group py-1"
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                          {faq.category}
                        </span>
                        <div className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {faq.q}
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 mt-1.5 ${
                          isOpen ? "rotate-180 text-blue-600" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="pt-3 pb-2 text-sm text-slate-600 leading-relaxed max-w-3xl">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── 8. NEWSLETTER DISPATCH ─── */}
        <NewsletterSubscribe />

        {/* ─── 9. NATURAL ACADEMIC FINAL CALL TO ACTION (REDESIGN OF IMAGE 5) ─── */}
        <section className="py-20 lg:py-24 border-t border-slate-200 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Bring simplicity and clarity to your classroom.
            </h2>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
              Create your virtual classroom in under a minute, share your 6-character access code with students, and start publishing coursework today.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={handleGetStarted}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all text-sm cursor-pointer shadow-md hover:shadow-lg active:scale-98"
              >
                <span>{isLoggedIn ? "Open Dashboard" : "Create Free Classroom"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {!isLoggedIn && (
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-semibold rounded-xl text-sm transition-colors shadow-2xs"
                >
                  Sign In to Classroom
                </Link>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Free for educational use
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Setup in under 60 seconds
              </span>
            </div>
          </div>
        </section>

        {/* ─── BACK TO TOP ─── */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-slate-900 text-white shadow-xl hover:bg-blue-600 transition-colors cursor-pointer border border-slate-700/50"
            aria-label="Back to top"
            title="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}
      </div>
    </>
  );
};

export default Home;