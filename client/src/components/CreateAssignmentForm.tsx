import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Calendar,
  Award,
  FolderOpen,
  AlertCircle,
  Loader2,
  PlusCircle,
  X,
  Info,
  FileType
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

interface Props {
  classroomId: string;
  onCreated: () => void;
}

const CreateAssignmentForm = ({ classroomId, onCreated }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"GRADED" | "MATERIAL">("GRADED");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      setError("Assignment title is required");
      return;
    }

    if (!file) {
      setError("Please select a file for the assignment");
      return;
    }

    if (type === "GRADED" && !dueDate) {
      setError("Due date is required for graded assignments");
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const token = localStorage.getItem("authToken");

      // 1. Create assignment draft
      const createRes = await axios.post(
        `${API_BASE_URL}/api/assignments`,
        {
          classroomId,
          title,
          description,
          type,
          dueDate: dueDate || undefined,
          originalFileName: file.name,
          fileType: file.name.endsWith(".pdf") ? "PDF" : "DOCX",
          fileSize: file.size,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { assignmentId, uploadUrl } = createRes.data;

      // 2. Upload file to S3
      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      // 3. Publish assignment
      await axios.patch(
        `${API_BASE_URL}/api/assignments/${assignmentId}/publish`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset form
      setTitle("");
      setDescription("");
      setDueDate("");
      setFile(null);
      setExpanded(false);

      onCreated();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      // Check file extension
      const extension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (!['pdf', 'docx'].includes(extension || '')) {
        setError("Only PDF and DOCX files are allowed");
        return;
      }
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

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <PlusCircle className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Create New Assignment</h3>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
        >
          {expanded ? "Cancel" : "New Assignment"}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-150 border border-slate-300/50 rounded-xl p-6 shadow-sm space-y-6"
          >
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

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Title Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-800">
                    Assignment Title
                    <span className="text-red-600 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g., Introduction to Calculus - Week 1"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-3 bg-white border border-slate-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 placeholder-slate-600 shadow-sm"
                      autoFocus
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <FileText className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                </div>

                {/* Type Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-800">
                    Assignment Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setType("GRADED")}
                      disabled={loading}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-200 ${type === "GRADED" ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200' : 'bg-white border-slate-400 hover:bg-slate-50'} disabled:opacity-60`}
                    >
                      <Award className={`w-5 h-5 mb-2 ${type === "GRADED" ? 'text-emerald-700' : 'text-slate-600'}`} />
                      <span className={`font-medium text-sm ${type === "GRADED" ? 'text-emerald-800' : 'text-slate-700'}`}>Graded</span>
                      <span className="text-xs text-slate-500 mt-1">For evaluation</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setType("MATERIAL")}
                      disabled={loading}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-200 ${type === "MATERIAL" ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' : 'bg-white border-slate-400 hover:bg-slate-50'} disabled:opacity-60`}
                    >
                      <FolderOpen className={`w-5 h-5 mb-2 ${type === "MATERIAL" ? 'text-blue-700' : 'text-slate-600'}`} />
                      <span className={`font-medium text-sm ${type === "MATERIAL" ? 'text-blue-800' : 'text-slate-700'}`}>Material</span>
                      <span className="text-xs text-slate-500 mt-1">Study resources</span>
                    </button>
                  </div>
                </div>

                {/* Due Date - Only for Graded */}
                {type === "GRADED" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-800">
                      Due Date
                      <span className="text-red-600 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        disabled={loading}
                        className="w-full px-4 py-3 bg-white border border-slate-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 placeholder-slate-600 shadow-sm"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">
                      Set a deadline for student submissions
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Description Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-800">
                    Description
                    <span className="text-slate-600 font-normal ml-1">(optional)</span>
                  </label>
                  <textarea
                    placeholder="Provide instructions, requirements, or additional context for this assignment..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                    rows={5}
                    className="w-full px-4 py-3 bg-white border border-slate-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 resize-none disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 placeholder-slate-600 shadow-sm"
                  />
                  <p className="text-xs text-slate-600">
                    Maximum 1000 characters. Markdown supported.
                  </p>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-800">
                    Assignment File
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
                      <div className="border-2 border-dashed border-slate-400 hover:border-blue-400 rounded-lg p-8 text-center cursor-pointer transition-all duration-200 hover:bg-blue-50/50">
                        <Upload className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                        <p className="font-medium text-slate-700 mb-1">Click to upload assignment file</p>
                        <p className="text-sm text-slate-600">PDF or DOCX files only (Max 10MB)</p>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Help Text */}
            <div className="bg-blue-50/70 border border-blue-300 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-700 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800 mb-1">
                    Assignment Guidelines
                  </h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Graded assignments require a due date and will be evaluated</li>
                    <li>• Materials are for reference only and don't require submission</li>
                    <li>• Files will be immediately available to students upon publishing</li>
                    <li>• You can edit assignment details before publishing</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                onClick={handleCreate}
                disabled={loading || !title.trim() || !file}
                className="w-full py-3.5 px-4 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-500 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 flex items-center justify-center gap-3 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating & Publishing Assignment...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                    <span>Create & Publish Assignment</span>
                  </>
                )}
              </button>
              <p className="text-xs text-slate-600 text-center mt-2">
                Assignment will be immediately published and visible to students
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CreateAssignmentForm;