import { useState } from "react";
import { joinClassroom } from "../services/classroom.api";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Key,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Hash,
  BookOpen
} from "lucide-react";

const JoinClassroom = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState<{
    name: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setJoined(null);

    const formattedCode = code.trim().toUpperCase();
    if (!formattedCode) {
      setError("Please enter a classroom code");
      return;
    }

    try {
      setLoading(true);
      const result = await joinClassroom(formattedCode);
      setJoined({ name: result.classroom.name });
      setCode("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to join classroom");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            to="/dashboard/classrooms/my"
            className="inline-flex items-center text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back to my classrooms
          </Link>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-emerald-100 rounded-lg">
              <Users className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Join Classroom</h1>
              <p className="text-slate-600 text-sm mt-1">
                Enter a code to join a new learning environment
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-slate-150 rounded-lg border border-slate-300/50 p-6 sm:p-8 shadow-sm"
        >
          <AnimatePresence mode="wait">
            {!joined ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-7"
              >
                {/* Code Input Section */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-800">
                    Classroom Code
                    <span className="text-red-600 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={code}
                      required
                      onChange={(e) => setCode(e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-3.5 bg-white border border-slate-400 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 placeholder-slate-600 text-center font-mono text-lg tracking-wider shadow-sm"
                      placeholder="ABC-1234"
                      autoFocus
                      maxLength={20}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Key className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                    <Hash className="w-3 h-3" />
                    <span>Get the code from your teacher or instructor</span>
                  </div>
                </div>

                {/* Help Text */}
                <div className="bg-emerald-50/70 border border-emerald-300 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-emerald-700 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-emerald-800 mb-1">
                        Where to find your code
                      </h4>
                      <ul className="text-xs text-emerald-800 space-y-1">
                        <li>• Ask your teacher for the classroom join code</li>
                        <li>• Check your school email or LMS for the code</li>
                        <li>• Codes are usually 6-8 characters with numbers</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-start gap-3 p-4 bg-red-100 border border-red-300 rounded-lg"
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-800">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || !code.trim()}
                    className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-500 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 flex items-center justify-center gap-3 group"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Joining Classroom...</span>
                      </>
                    ) : (
                      <>
                        <Users className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                        <span>Join Classroom</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 text-center"
              >
                {/* Success Header */}
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full border-4 border-slate-150 shadow-sm">
                    <CheckCircle2 className="w-8 h-8 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      Successfully Joined!
                    </h3>
                    <p className="text-slate-700">
                      You're now a member of the classroom
                    </p>
                  </div>
                </div>

                {/* Classroom Details Card */}
                <div className="bg-white rounded-lg border border-slate-300 p-6 space-y-4 shadow-sm">
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <BookOpen className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">{joined.name}</h4>
                      <p className="text-sm text-slate-600">Active classroom</p>
                    </div>
                  </div>
                  
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex items-center justify-center gap-2 text-sm text-emerald-800 mb-2">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">You're all set!</span>
                    </div>
                    <p className="text-xs text-emerald-800">
                      You can now access course materials, assignments, and interact with your teacher and classmates.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setJoined(null)}
                    className="flex-1 py-3.5 px-4 border border-slate-400 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 active:scale-[0.98]"
                  >
                    Join Another
                  </button>
                  <Link
                    to="/dashboard/classrooms/my"
                    className="flex-1 py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-5 h-5" />
                    Go to Classrooms
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-slate-600">
            Having trouble joining? Contact your teacher for assistance.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default JoinClassroom;