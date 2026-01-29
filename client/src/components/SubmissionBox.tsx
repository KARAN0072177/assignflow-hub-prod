import { useState } from "react";
import {
  createOrUpdateDraftSubmission,
  submitSubmission,
} from "../services/submission.api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Send,
  Clock,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Lock,
  X,
  FileType,
  ArrowUpToLine
} from "lucide-react";

interface Props {
  assignmentId: string;
}

const SubmissionBox = ({ assignmentId }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [state, setState] = useState<"DRAFT" | "SUBMITTED" | "LOCKED">("DRAFT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleDraftUpload = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx'].includes(extension || '')) {
      setError("Only PDF and DOCX files are allowed");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await createOrUpdateDraftSubmission(assignmentId, file);
      setSubmissionId(result.submissionId);
      setState("DRAFT");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!submissionId) {
      setError("Please upload a draft file first");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await submitSubmission(submissionId);
      setState("SUBMITTED");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Submit failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // If state is LOCKED, show locked message
  if (state === "LOCKED") {
    return (
      <div className="border-2 border-red-300 bg-red-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Lock className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h4 className="font-semibold text-red-800">Submission Locked</h4>
            <p className="text-sm text-red-700">The deadline for this assignment has passed.</p>
          </div>
        </div>
      </div>
    );
  }

  // If state is SUBMITTED, show success message
  if (state === "SUBMITTED") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="border-2 border-emerald-300 bg-emerald-50 rounded-lg p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-semibold text-emerald-800">Submission Complete</h4>
              <p className="text-sm text-emerald-700">Your assignment has been successfully submitted.</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setState("DRAFT");
              setFile(null);
              setSubmissionId(null);
            }}
            className="text-sm px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
          >
            Resubmit
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mt-4">
      {/* Toggle Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <Upload className="w-5 h-5" />
          Submit Assignment
        </button>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border border-slate-300 bg-slate-150 rounded-xl p-6 mt-3 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <ArrowUpToLine className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Submit Assignment</h3>
                  <p className="text-sm text-slate-600">Upload your completed work</p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Info */}
            {submissionId && (
              <div className="mb-6">
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-800">Draft saved. Ready to submit final version.</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-3 p-4 bg-red-100 border border-red-300 rounded-lg mb-6"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* File Upload Section */}
            <div className="space-y-4 mb-6">
              <label className="block text-sm font-semibold text-slate-800">
                Upload Your Work
                <span className="text-red-600 ml-1">*</span>
              </label>
              
              {file ? (
                <div className="border-2 border-dashed border-emerald-300 bg-emerald-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <FileType className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-emerald-800 truncate">{file.name}</p>
                        <p className="text-xs text-emerald-700">{formatFileSize(file.size)} • {file.type}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      disabled={loading}
                      className="p-2 text-slate-600 hover:text-red-600 transition-colors disabled:opacity-60"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="block">
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    disabled={loading}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-slate-400 hover:border-emerald-400 rounded-lg p-8 text-center cursor-pointer transition-all duration-200 hover:bg-emerald-50/50">
                    <Upload className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                    <p className="font-medium text-slate-700 mb-1">Click to upload your assignment file</p>
                    <p className="text-sm text-slate-600">PDF or DOCX files only (Max 10MB)</p>
                  </div>
                </label>
              )}
            </div>

            {/* Guidelines */}
            <div className="bg-emerald-50/70 border border-emerald-300 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-emerald-700 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-emerald-800 mb-1">
                    Submission Guidelines
                  </h4>
                  <ul className="text-xs text-emerald-800 space-y-1">
                    <li>• Upload your completed assignment in PDF or DOCX format</li>
                    <li>• Save as draft first, then submit final when ready</li>
                    <li>• You can update your draft until final submission</li>
                    <li>• Once submitted, you cannot make changes</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDraftUpload}
                disabled={loading || !file}
                className="flex-1 py-3 px-4 border border-slate-400 hover:bg-slate-50 text-slate-800 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
                Save as Draft
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading || !submissionId}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                    Submit Final
                  </>
                )}
              </button>
            </div>

            {/* Progress Info */}
            <div className="mt-4 pt-4 border-t border-slate-300">
              <div className="flex items-center justify-center gap-6 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${submissionId ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  <span>Draft Uploaded</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>Final Submission</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubmissionBox;