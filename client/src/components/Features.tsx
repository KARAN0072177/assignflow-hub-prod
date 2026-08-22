import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  UploadCloud,
  FileCheck2,
  GraduationCap,
  BarChart3,
  Clock,
  Mail,
  CheckCircle2,
  Users,
  ArrowRight,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

type RoleFilter = "ALL" | "TEACHER" | "STUDENT";

export const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");

  const allFeatures = [
    {
      id: 1,
      role: "TEACHER" as const,
      roleBadge: "Teachers & Students",
      title: "Virtual Classrooms",
      tagline: "Join with a 6-character code. No onboarding friction.",
      icon: BookOpen,
      color: "blue",
      highlights: [
        "Instant join codes for students",
        "Multi-classroom dashboard",
        "Real-time roster tracking",
      ],
      preview: {
        label: "Physics 101",
        meta: "38 students • Code: PHY101",
        status: "Active",
      },
    },
    {
      id: 2,
      role: "TEACHER" as const,
      roleBadge: "Teachers",
      title: "Assignment Publishing",
      tagline: "Drag, drop, and set a deadline. That's it.",
      icon: UploadCloud,
      color: "indigo",
      highlights: [
        "PDF & DOCX uploads",
        "Graded or study material modes",
        "Auto deadline calculation",
      ],
      preview: {
        label: "Midterm Research Project",
        meta: "Due Tue, 11:59 PM • 3.4 MB PDF",
        status: "Published",
      },
    },
    {
      id: 3,
      role: "STUDENT" as const,
      roleBadge: "Students",
      title: "Submission Hub",
      tagline: "Save drafts, submit once, know it's received.",
      icon: FileCheck2,
      color: "emerald",
      highlights: [
        "Draft mode before final submit",
        "Instant status badges",
        "Re-download your files anytime",
      ],
      preview: {
        label: "Assignment 4: Thermodynamics",
        meta: "alex.j@university.edu • Awaiting grade",
        status: "Submitted",
      },
    },
    {
      id: 4,
      role: "TEACHER" as const,
      roleBadge: "Teachers",
      title: "Grading Suite",
      tagline: "Preset scores, smart feedback, done in half the time.",
      icon: Users,
      color: "amber",
      highlights: [
        "1-click score presets (100%, 95%, 90%)",
        "Feedback suggestion chips",
        "Publish or save as draft",
      ],
      preview: {
        label: "Prof. Henderson's Review",
        meta: "Score: 95/100 • Published",
        status: "Graded",
      },
    },
    {
      id: 5,
      role: "STUDENT" as const,
      roleBadge: "Students",
      title: "Gradebook",
      tagline: "Every score, comment, and file in one place.",
      icon: GraduationCap,
      color: "cyan",
      highlights: [
        "Percentage & letter breakdown",
        "Teacher comments per assignment",
        "Syncs as soon as grades publish",
      ],
      preview: {
        label: "Your Standing",
        meta: "94.5% • A • 12 assignments",
        status: "High Standing",
      },
    },
    {
      id: 6,
      role: "TEACHER" as const,
      roleBadge: "Teachers",
      title: "Performance Analytics",
      tagline: "See where your class stands at a glance.",
      icon: BarChart3,
      color: "slate",
      highlights: [
        "Grade distribution charts",
        "Class standing breakdowns",
        "1-click CSV export",
      ],
      preview: {
        label: "CS 101 Overview",
        meta: "84.2% avg • 142 students",
        status: "Analyzed",
      },
    },
    {
      id: 7,
      role: "TEACHER" as const,
      roleBadge: "Automated",
      title: "Deadline Management",
      tagline: "Submissions lock automatically. No manual policing.",
      icon: Clock,
      color: "rose",
      highlights: [
        "Auto-lock after due date",
        "Live countdown timers",
        "Tamper-proof timestamps",
      ],
      preview: {
        label: "Assignment 3 Deadline",
        meta: "Fri, Nov 14 • 2 days left",
        status: "Auto-Lock On",
      },
    },
    {
      id: 8,
      role: "STUDENT" as const,
      roleBadge: "Communication",
      title: "Notifications",
      tagline: "Email and dashboard alerts that actually look good.",
      icon: Mail,
      color: "violet",
      highlights: [
        "Polished email receipts",
        "Live Socket.IO updates",
        "Mobile-friendly formatting",
      ],
      preview: {
        label: "New Grade Published",
        meta: "Assignment 3 • 95% • Just now",
        status: "Unread",
      },
    },
  ];

  const filteredFeatures = useMemo(() => {
    if (roleFilter === "ALL") return allFeatures;
    return allFeatures.filter(
      (f) => f.role === roleFilter || f.roleBadge.includes("Teachers & Students")
    );
  }, [roleFilter]);

  const currentFeature = filteredFeatures[activeFeature] || filteredFeatures[0] || allFeatures[0];

  const colorMap: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
    indigo: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", dot: "bg-indigo-500" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
    amber: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
    cyan: { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200", dot: "bg-cyan-500" },
    slate: { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200", dot: "bg-slate-500" },
    rose: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", dot: "bg-rose-500" },
    violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-500" },
  };

  const c = colorMap[currentFeature.color] || colorMap.blue;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
            Built for how you actually work
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            No bloat, no steep learning curve. Just the tools teachers and students need, organized by who uses them.
          </p>
        </motion.div>

        {/* Role Filter */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit mb-12"
        >
          {[
            { key: "ALL", label: "All" },
            { key: "TEACHER", label: "For Teachers" },
            { key: "STUDENT", label: "For Students" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setRoleFilter(tab.key as RoleFilter);
                setActiveFeature(0);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                roleFilter === tab.key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Feature List */}
          <div className="lg:col-span-5 space-y-1">
            {filteredFeatures.map((feature, idx) => {
              const isActive = currentFeature.id === feature.id;
              const fc = colorMap[feature.color];

              return (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(idx)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all duration-200 group ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive ? "bg-white/10 text-white" : `bg-slate-100 text-slate-600 group-hover:bg-white`
                    }`}
                  >
                    <feature.icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold truncate ${
                        isActive ? "text-white" : "text-slate-900"
                      }`}>
                        {feature.title}
                      </span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md shrink-0 ${
                        isActive ? "bg-white/15 text-white/80" : `${fc?.bg} ${fc?.text}`
                      }`}>
                        {feature.roleBadge}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 shrink-0 transition-all ${
                    isActive ? "text-white opacity-100" : "text-slate-300 opacity-0 group-hover:opacity-100"
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Right: Feature Detail */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                {/* Preview Card */}
                <div className={`rounded-2xl border ${c.border} ${c.bg} p-6 mb-8`}>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">
                        {currentFeature.preview.label}
                      </h3>
                      <p className="text-sm text-slate-600">{currentFeature.preview.meta}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-white border ${c.border} ${c.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                      {currentFeature.preview.status}
                    </span>
                  </div>

                  {/* Rich Feature Visual Preview Card */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                    {currentFeature.id === 1 && (
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                              PHY
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">Physics 101: Mechanics &amp; Waves</h4>
                              <p className="text-xs text-slate-500">Instructor: Dr. Aris Thorne</p>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                            Code: PHY101
                          </span>
                        </div>
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Users className="w-3.5 h-3.5 text-blue-600" />
                            <span>38 Students Enrolled</span>
                          </div>
                          <span className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            Classroom Active <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    )}

                    {currentFeature.id === 2 && (
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                              Graded Assignment
                            </span>
                            <h4 className="text-sm font-bold text-slate-900">Midterm Research Project: Wave Optics</h4>
                          </div>
                          <span className="text-xs font-semibold px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg shrink-0">
                            Due Tue, 11:59 PM
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                          <div className="flex items-center gap-2 text-slate-700 font-mono">
                            <FileText className="w-4 h-4 text-indigo-600" />
                            <span>Wave_Optics_Guidelines.pdf</span>
                          </div>
                          <span className="text-[11px] text-slate-500">3.4 MB</span>
                        </div>
                      </div>
                    )}

                    {currentFeature.id === 3 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">
                            Assignment 4: Thermodynamics Lab Report
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                            Submitted
                          </span>
                        </div>
                        <div className="p-3 bg-emerald-50/50 border border-emerald-200/80 rounded-xl space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Alex_Thermo_Lab_Final.pdf
                            </span>
                            <span className="text-[11px] text-slate-500">2.1 MB</span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Turned in on Nov 12, 10:45 AM • Verified timestamp
                          </p>
                        </div>
                      </div>
                    )}

                    {currentFeature.id === 4 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-slate-900">Student: Alex Johnson</span>
                            <p className="text-[11px] text-slate-500">Assignment 4 Review</p>
                          </div>
                          <span className="text-sm font-extrabold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                            Score: 95 / 100
                          </span>
                        </div>
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 italic">
                          "Outstanding mathematical derivation in section 3. Well structured lab data!"
                        </div>
                      </div>
                    )}

                    {currentFeature.id === 5 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-cyan-700">94.5%</span>
                            <span className="text-xs font-bold px-2 py-0.5 bg-cyan-100 text-cyan-800 rounded-md">
                              Grade A
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 font-medium">12 Graded Tasks</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-cyan-600 h-full rounded-full w-[94.5%]" />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                          <span>Recent: Lab 4 (95%)</span>
                          <span>Midterm (94%)</span>
                          <span>Quiz 3 (98%)</span>
                        </div>
                      </div>
                    )}

                    {currentFeature.id === 6 && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                            <span className="text-[10px] text-slate-500 font-bold block uppercase">Class Avg</span>
                            <span className="text-sm font-extrabold text-blue-700">84.2%</span>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                            <span className="text-[10px] text-slate-500 font-bold block uppercase">High Achievers</span>
                            <span className="text-sm font-extrabold text-emerald-600">68%</span>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                            <span className="text-[10px] text-slate-500 font-bold block uppercase">Students</span>
                            <span className="text-sm font-extrabold text-slate-900">142</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                          <span className="flex items-center gap-1 text-slate-500">
                            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                            Grade curve distribution active
                          </span>
                          <span className="font-semibold text-blue-600">1-Click CSV Ready</span>
                        </div>
                      </div>
                    )}

                    {currentFeature.id === 7 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-slate-900">Term Paper Due Date</span>
                            <p className="text-xs text-rose-600 font-semibold">Friday, Nov 14 @ 11:59 PM</p>
                          </div>
                          <span className="text-[11px] font-bold px-2 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
                            Auto-Lock On
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-rose-500" />
                            <span>Time Remaining:</span>
                          </span>
                          <span className="font-bold text-slate-900">2 days, 4 hours</span>
                        </div>
                      </div>
                    )}

                    {currentFeature.id === 8 && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="font-medium text-slate-700 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-violet-600" />
                            AssignFlow Notification Dispatch
                          </span>
                          <span>Just now</span>
                        </div>
                        <div className="p-2.5 bg-violet-50/50 border border-violet-200/80 rounded-xl space-y-1">
                          <h5 className="text-xs font-bold text-slate-900">
                            New Grade Published: Physics Midterm
                          </h5>
                          <p className="text-[11px] text-slate-600">
                            Dr. Aris Thorne evaluated your submission (Score: 95/100).
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Text Content */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-900 mb-2">
                      {currentFeature.title}
                    </h3>
                    <p className="text-base text-slate-500 leading-relaxed">
                      {currentFeature.tagline}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {currentFeature.highlights.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Get started free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;