import {
  FileText,
  Clock,
  Download,
  KeyRound,
  CheckCircle2,
  FileCheck,
  Users,
} from "lucide-react";

export const Features = () => {
  return (
    <section className="py-20 lg:py-28 border-t border-slate-200/90 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-4">
            Platform Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Built for modern coursework and fair grading.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
            Every feature is designed around real classroom needs — clear deadlines, easy submissions, and organized records.
          </p>
        </div>

        {/* 4 Academic Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Feature 1: Simple Classroom Join Codes */}
          <div className="border border-slate-200 rounded-2xl p-7 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Instant Classroom Enrollment with 6-Character Codes
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Teachers generate a simple access code when creating a course. Students enter the code on their dashboard and join the class roster immediately — no email invitations, no waiting for approval.
              </p>

              {/* Visual Demo Card */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Physics 101 Access Code
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Active Roster
                  </span>
                </div>
                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                  <span className="font-mono text-xl font-extrabold text-blue-900 tracking-widest">
                    PHY101
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    38 Students Enrolled
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-200/80 flex items-center gap-2 text-xs text-slate-500 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Students can enroll in multiple classes from one account</span>
            </div>
          </div>

          {/* Feature 2: Coursework Publishing & PDF Guidelines */}
          <div className="border border-slate-200 rounded-2xl p-7 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Coursework Publishing with File Attachments
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Create assignments with rich instructions, due dates, point totals, and downloadable PDF or Word reference sheets so students always have the exact guidelines they need.
              </p>

              {/* Visual Demo Card */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    Midterm Assignment: Mechanics &amp; Waves
                  </span>
                  <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    100 Points
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <FileCheck className="w-4 h-4 text-indigo-600" />
                    <span>Lab4_Instructions_Rubric.pdf</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">2.4 MB</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-200/80 flex items-center gap-2 text-xs text-slate-500 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Supports PDF, DOCX, and academic document formats</span>
            </div>
          </div>

          {/* Feature 3: Automated Deadlines & Hard Cutoffs */}
          <div className="border border-slate-200 rounded-2xl p-7 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Automated Submission Deadlines
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Set a due date and time. When the deadline passes, submissions lock automatically across the classroom. No manual tracking or guessing whether work was turned in on time.
              </p>

              {/* Visual Demo Card */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Due Date:</span>
                  <span className="font-bold text-slate-900">Friday, Nov 14 at 11:59 PM</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-amber-50/60 border border-amber-200 rounded-lg text-xs">
                  <span className="font-semibold text-amber-900">Lock Rule:</span>
                  <span className="font-medium text-amber-800">Automatic cutoff at deadline hour</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-200/80 flex items-center gap-2 text-xs text-slate-500 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Guarantees equal and fair submission windows for all students</span>
            </div>
          </div>

          {/* Feature 4: Gradebook Analytics & CSV Export */}
          <div className="border border-slate-200 rounded-2xl p-7 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Gradebook Analytics &amp; 1-Click CSV Export
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Keep class records organized with automatic average calculations, letter grade standings, and 1-click spreadsheet export for school records or grading reports.
              </p>

              {/* Visual Demo Card */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">Physics 101 Grade Report</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                    Class Avg: 91.2%
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span>38 Students • 12 Coursework Items</span>
                  </div>
                  <span className="text-blue-700 font-semibold flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" /> CSV Ready
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-200/80 flex items-center gap-2 text-xs text-slate-500 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Exports clean spreadsheets compatible with Excel and Google Sheets</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;