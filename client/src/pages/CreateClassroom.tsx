import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createClassroom } from "../services/classroom.api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  ArrowLeft,
  Users,
  Copy,
  Check,
  PlusCircle,
  Info
} from "lucide-react";

const CreateClassroom = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{
    code: string;
    name: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCreated(null);

    if (!name.trim()) {
      setError("Classroom name is required");
      return;
    }

    try {
      setLoading(true);
      const result = await createClassroom({
        name,
        description: description || undefined,
      });

      setCreated({
        name: result.name,
        code: result.code,
      });

      setName("");
      setDescription("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create classroom");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (created?.code) {
      navigator.clipboard.writeText(created.code);
      setCopied(true);
    }
  };

  const handleReset = () => {
    setCreated(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            to="/dashboard/classrooms/my"
            className="inline-flex items-center text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back to classrooms
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
            <div className="p-2.5 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Create Classroom</h1>
              <p className="text-slate-600 text-sm mt-1">
                Set up a new learning environment for your students
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
            {!created ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-7"
              >
                {/* Name Field */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-800">
                    Classroom Name
                    <span className="text-red-600 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      required
                      minLength={2}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-3.5 bg-white border border-slate-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 placeholder-slate-600 shadow-sm"
                      placeholder="e.g., Advanced Mathematics 101"
                      autoFocus
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <BookOpen className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">
                    Choose a clear name that students will recognize
                  </p>
                </div>

                {/* Description Field */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-slate-800">
                      Description
                      <span className="text-slate-600 font-normal ml-1">(optional)</span>
                    </label>
                    <span className="text-xs text-slate-600">
                      {description.length}/500
                    </span>
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) {
                        setDescription(e.target.value);
                      }
                    }}
                    disabled={loading}
                    rows={3}
                    className="w-full px-4 py-3.5 bg-white border border-slate-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 resize-none disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 placeholder-slate-600 shadow-sm"
                    placeholder="Briefly describe the course objectives, schedule, or requirements..."
                  />
                </div>

                {/* Quick Info */}
                <div className="bg-blue-100/70 border border-blue-300 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-blue-800 mb-2">
                    <Info className="w-4 h-4" />
                    <span className="font-medium">Quick Setup Tips</span>
                  </div>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Students can join using the generated code</li>
                    <li>• You can edit classroom details later</li>
                    <li>• Start by adding assignments or materials</li>
                  </ul>
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
                    disabled={loading || !name.trim()}
                    className="w-full py-3.5 px-4 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-500 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 flex items-center justify-center gap-3 group"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating Classroom...</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                        <span>Create Classroom</span>
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
                className="space-y-8"
              >
                {/* Success Header */}
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full border-4 border-slate-150 shadow-sm">
                    <CheckCircle2 className="w-8 h-8 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      Classroom Ready!
                    </h3>
                    <p className="text-slate-700">
                      Your classroom is now active and ready for students
                    </p>
                  </div>
                </div>

                {/* Classroom Details */}
                <div className="bg-white rounded-lg border border-slate-300 p-6 space-y-6 shadow-sm">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen className="w-5 h-5 text-blue-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{created.name}</h4>
                        <p className="text-sm text-slate-600">Active classroom</p>
                      </div>
                    </div>
                  </div>

                  {/* Join Code Section */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-800">
                      Join Code for Students
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="bg-slate-100 border border-slate-400 rounded-lg px-4 py-3.5 font-mono text-lg font-bold text-slate-900 tracking-wider text-center">
                          {created.code}
                        </div>
                      </div>
                      <button
                        onClick={handleCopyCode}
                        className="inline-flex items-center justify-center w-12 h-12 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 active:scale-95"
                        title="Copy join code"
                      >
                        {copied ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <AnimatePresence>
                      {copied && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-sm text-emerald-700 text-center"
                        >
                          Code copied to clipboard
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <p className="text-xs text-slate-600 text-center">
                      Share this code with students so they can join
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3.5 px-4 border border-slate-400 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 active:scale-[0.98]"
                  >
                    Create Another
                  </button>
                  <Link
                    to="/dashboard/classrooms/my"
                    className="flex-1 py-3.5 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Users className="w-5 h-5" />
                    Go to Classroom
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
            Need assistance? Contact the administrator or check the teacher guide.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateClassroom;