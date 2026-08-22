import React, { useState } from "react";
import {
  createOrUpdateDraftSubmission,
  submitSubmission,
} from "../services/submission.api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Send,
  Clock,
  AlertCircle,
  Loader2,
  CheckCircle2,
  X,
  FileType,
  FileCheck,
  Sparkles
} from "lucide-react";

interface Props {
  assignmentId: string;
  initialSubmission?: {
    id: string;
    state: "DRAFT" | "SUBMITTED" | "LOCKED";
  } | null;
  onSubmitted?: () => void;
}

const allowedExtensions = ["pdf", "docx", "xlsx", "pptx"];
const blockedExtensions = ["zip", "dll", "bat", "exe", "sh", "cmd", "vbs", "js", "py", "html", "htm", "svg", "msi"];

const SubmissionBox = ({ assignmentId, initialSubmission, onSubmitted }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(
    initialSubmission?.id || null
  );
  const [state, setState] = useState<"DRAFT" | "SUBMITTED" | "LOCKED">(
    initialSubmission?.state || "DRAFT"
  );
  const [loadingAction, setLoadingAction] = useState<"draft" | "submit" | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // 1. Save as Draft Action
  const handleSaveDraft = async () => {
    if (!file && !submissionId) {
      setError("Please select a valid PDF, DOCX, XLSX, or PPTX file to upload");
      return;
    }

    if (file) {
      const extension = file.name.split(".").pop()?.toLowerCase() || "";
      if (blockedExtensions.includes(extension)) {
        setError(`Security violation: .${extension} files are strictly blocked.`);
        return;
      }
      if (!allowedExtensions.includes(extension)) {
        setError("Only PDF, DOCX, XLSX, and PPTX files are allowed");
        return;
      }
    }

    try {
      setLoadingAction("draft");
      setError(null);

      if (file) {
        const result = await createOrUpdateDraftSubmission(assignmentId, file);
        setSubmissionId(result.submissionId);
      }
      setState("DRAFT");
      if (onSubmitted) onSubmitted();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Draft upload failed");
    } finally {
      setLoadingAction(null);
    }
  };

  // 2. Submit Final Action (Direct 1-Click Submission supported!)
  const handleSubmitFinal = async () => {
    if (!file && !submissionId) {
      setError("Please select a file to submit");
      return;
    }

    if (file) {
      const extension = file.name.split(".").pop()?.toLowerCase() || "";
      if (blockedExtensions.includes(extension)) {
        setError(`Security violation: .${extension} files are strictly blocked.`);
        return;
      }
      if (!allowedExtensions.includes(extension)) {
        setError("Only PDF, DOCX, XLSX, and PPTX files are allowed");
        return;
      }
    }

    try {
      setLoadingAction("submit");
      setError(null);

      let currentSubId = submissionId;

      // If student hasn't uploaded draft yet, upload it first
      if (file) {
        const draftRes = await createOrUpdateDraftSubmission(assignmentId, file);
        currentSubId = draftRes.submissionId;
        setSubmissionId(draftRes.submissionId);
      }

      if (!currentSubId) {
        throw new Error("Could not process submission file");
      }

      // Submit final
      await submitSubmission(currentSubId);
      setState("SUBMITTED");
      setIsOpen(false);
      if (onSubmitted) onSubmitted();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Final submission failed");
    } finally {
      setLoadingAction(null);
    }
  };

  const [isDragging, setIsDragging] = useState(false);

  const processFile = (selectedFile: File) => {
    const extension = selectedFile.name.split(".").pop()?.toLowerCase() || "";
    if (blockedExtensions.includes(extension)) {
      setError(`Security Alert: .${extension} files are strictly blocked.`);
      return;
    }
    if (!allowedExtensions.includes(extension)) {
      setError("Only PDF, DOCX, XLSX, and PPTX files are allowed");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size exceeds maximum limit of 10MB");
      return;
    }
    setFile(selectedFile);
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // If assignment is already submitted, show clean status badge
  if (state === "SUBMITTED") {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        <span>Submitted</span>
      </div>
    );
  }

  return (
    <div>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs active:scale-95 cursor-pointer"
      >
        <Upload className="w-3.5 h-3.5" />
        <span>{submissionId ? "Edit / Submit Work" : "Submit Assignment"}</span>
      </button>

      {/* Clean Modal Dialog for Submission */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-700">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Submit Your Assignment
                    </h3>
                    <p className="text-xs text-slate-500">
                      Upload your PDF or DOCX completed work
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Info if draft exists */}
              {submissionId && (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 font-medium">
                  <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Draft saved. Ready for final submission.</span>
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* File Dropzone / Picker with Drag and Drop */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Assignment File <span className="text-red-500">*</span>
                </label>

                {file ? (
                  <div className="border border-emerald-300 bg-emerald-50/60 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 truncate">
                      <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700 shrink-0">
                        <FileType className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <p className="font-semibold text-xs text-emerald-950 truncate">
                          {file.name}
                        </p>
                        <p className="text-[11px] text-emerald-700">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      disabled={loadingAction !== null}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`block cursor-pointer transition-all duration-200 ${
                      isDragging
                        ? "border-2 border-dashed border-emerald-500 bg-emerald-50/80 ring-4 ring-emerald-500/20 scale-[1.01] rounded-2xl"
                        : "border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/30 rounded-2xl"
                    }`}
                  >
                    <input
                      type="file"
                      accept=".pdf,.docx,.xlsx,.pptx"
                      onChange={handleFileChange}
                      disabled={loadingAction !== null}
                      className="hidden"
                    />
                    <div className="p-6 text-center">
                      <Upload
                        className={`w-7 h-7 mx-auto mb-2 transition-transform ${
                          isDragging
                            ? "text-emerald-600 scale-125"
                            : "text-slate-400"
                        }`}
                      />
                      <p className="font-semibold text-xs text-slate-800">
                        {isDragging
                          ? "Drop file here to upload!"
                          : "Click to browse or drag & drop file here"}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        PDF, DOCX, XLSX, or PPTX documents (Max 10MB)
                      </p>
                    </div>
                  </label>
                )}
              </div>

              {/* Guidelines Box */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Important Note:</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  You can <strong>Save as Draft</strong> to revise later, or click{" "}
                  <strong>Submit Final</strong> to submit directly for evaluation.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={loadingAction !== null}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>

                {/* Save Draft Button */}
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={loadingAction !== null || (!file && !submissionId)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-semibold rounded-xl text-xs transition-colors disabled:opacity-50"
                >
                  {loadingAction === "draft" ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5 text-slate-600" />
                  )}
                  <span>Save Draft</span>
                </button>

                {/* Submit Final Button (Direct 1-click submission!) */}
                <button
                  type="button"
                  onClick={handleSubmitFinal}
                  disabled={loadingAction !== null || (!file && !submissionId)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-all shadow-xs shadow-emerald-500/20 disabled:opacity-50"
                >
                  {loadingAction === "submit" ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Submit Final</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubmissionBox;