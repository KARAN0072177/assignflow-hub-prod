import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Send,
  Reply,
  Trash2,
  AlertCircle,
  Loader2,
  GraduationCap,
  User,
  X,
  CheckCircle2,
  AtSign,
} from "lucide-react";
import {
  getAssignmentComments,
  postComment,
  deleteComment,
  toggleVerifiedAnswer,
  type AssignmentCommentItem,
  type ClassroomMemberItem,
} from "../services/comment.api";
import { useAppSocket } from "../context/SocketContext";
import { UserProfileHoverCard } from "./UserProfileHoverCard";

interface Props {
  assignmentId: string;
  assignmentTitle?: string;
  onCommentCountChange?: (count: number) => void;
}

export const AssignmentComments = ({
  assignmentId,
  onCommentCountChange,
}: Props) => {
  const [comments, setComments] = useState<AssignmentCommentItem[]>([]);
  const [classroomMembers, setClassroomMembers] = useState<ClassroomMemberItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<AssignmentCommentItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [commentToDelete, setCommentToDelete] = useState<AssignmentCommentItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  // @mention state
  const [showMentionDialog, setShowMentionDialog] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionStartIndex, setMentionStartIndex] = useState<number>(-1);
  const [selectedMemberIndex, setSelectedMemberIndex] = useState<number>(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mentionDialogRef = useRef<HTMLDivElement>(null);

  const currentUserRole = localStorage.getItem("userRole") || "STUDENT";
  const currentUserEmail = localStorage.getItem("userEmail") || "";
  const { lastCommentEvent, socket } = useAppSocket();

  const fetchComments = async () => {
    try {
      setError(null);
      const data = await getAssignmentComments(assignmentId);
      setComments(data.comments || []);
      setTotalCount(data.totalCount || 0);
      if (data.members) {
        setClassroomMembers(data.members);
      }
      if (onCommentCountChange) {
        onCommentCountChange(data.totalCount || 0);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to load assignment comments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [assignmentId]);

  // Live WebSocket update for this specific assignment discussion
  useEffect(() => {
    if (lastCommentEvent && lastCommentEvent.assignmentId === assignmentId) {
      fetchComments();
    }
  }, [lastCommentEvent, assignmentId]);

  // Listen for real-time answer verification event
  useEffect(() => {
    if (!socket) return;

    const handleVerified = (payload: {
      commentId: string;
      assignmentId: string;
      isVerifiedAnswer: boolean;
    }) => {
      if (payload.assignmentId === assignmentId) {
        setComments((prev) =>
          prev.map((c) => {
            if (c._id === payload.commentId) {
              return { ...c, isVerifiedAnswer: payload.isVerifiedAnswer };
            }
            if (c.replies) {
              return {
                ...c,
                replies: c.replies.map((r) =>
                  r._id === payload.commentId
                    ? { ...r, isVerifiedAnswer: payload.isVerifiedAnswer }
                    : r
                ),
              };
            }
            return c;
          })
        );
      }
    };

    socket.on("comment:verified", handleVerified);
    return () => {
      socket.off("comment:verified", handleVerified);
    };
  }, [socket, assignmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (content.trim().length > 1000) {
      setError("Comment cannot exceed 1000 characters");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await postComment({
        assignmentId,
        content: content.trim(),
        parentCommentId: replyingTo ? replyingTo._id : undefined,
      });

      setContent("");
      setReplyingTo(null);
      await fetchComments();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to post comment. Please check rate limits."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle "Instructor Verified Answer" / Pin Solution
  const handleToggleVerify = async (commentId: string) => {
    try {
      setVerifyingId(commentId);
      setError(null);
      const updated = await toggleVerifiedAnswer(commentId);

      setComments((prev) =>
        prev.map((c) => {
          if (c._id === commentId) {
            return {
              ...c,
              isVerifiedAnswer: updated.isVerifiedAnswer,
              verifiedAt: updated.verifiedAt,
            };
          }
          if (c.replies) {
            return {
              ...c,
              replies: c.replies.map((r) =>
                r._id === commentId
                  ? {
                      ...r,
                      isVerifiedAnswer: updated.isVerifiedAnswer,
                      verifiedAt: updated.verifiedAt,
                    }
                  : r
              ),
            };
          }
          return c;
        })
      );
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to toggle verified solution");
    } finally {
      setVerifyingId(null);
    }
  };

  // Custom sleek modal delete handler
  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;

    try {
      setDeletingId(commentToDelete._id);
      await deleteComment(commentToDelete._id);
      setCommentToDelete(null);
      await fetchComments();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete comment");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const renderCommentContentWithMentions = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(@[a-zA-Z0-9_.-]+)/g);

    return parts.map((part, idx) => {
      if (part.startsWith("@") && part.length > 1) {
        const handle = part.slice(1);
        return (
          <UserProfileHoverCard
            key={idx}
            identifier={handle}
            fallbackName={handle}
          >
            <span className="font-semibold text-blue-600 hover:text-blue-800 underline decoration-blue-300 decoration-1 underline-offset-2">
              {part}
            </span>
          </UserProfileHoverCard>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  // Helper to check if current user authored this comment
  const isOwnComment = (authorEmail: string) => {
    if (!currentUserEmail) return false;
    return authorEmail.toLowerCase() === currentUserEmail.toLowerCase();
  };

  // Filter classroom members based on query
  const filteredMembers = useMemo(() => {
    if (!mentionQuery.trim()) return classroomMembers;
    const q = mentionQuery.toLowerCase();
    return classroomMembers.filter(
      (m) =>
        m.username.toLowerCase().includes(q) ||
        m.displayName.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q)
    );
  }, [classroomMembers, mentionQuery]);

  // Handle textarea text changes and track @ mentions
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const pos = e.target.selectionStart ?? val.length;
    setContent(val);

    const textBeforeCursor = val.slice(0, pos);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtIndex !== -1) {
      const charBeforeAt = lastAtIndex === 0 ? " " : textBeforeCursor[lastAtIndex - 1];
      if (/\s/.test(charBeforeAt)) {
        const query = textBeforeCursor.slice(lastAtIndex + 1);
        if (!/\s/.test(query) && query.length <= 30) {
          setShowMentionDialog(true);
          setMentionQuery(query);
          setMentionStartIndex(lastAtIndex);
          setSelectedMemberIndex(0);
          return;
        }
      }
    }

    setShowMentionDialog(false);
  };

  // Select a member from the mention dialog and insert @username
  const handleSelectMember = (member: ClassroomMemberItem) => {
    const textarea = textareaRef.current;
    const atIndex = mentionStartIndex;
    if (atIndex < 0) return;

    const before = content.slice(0, atIndex);
    const after = content.slice(atIndex + 1 + mentionQuery.length);
    const tag = `@${member.username} `;
    const updatedContent = before + tag + after;

    setContent(updatedContent);
    setShowMentionDialog(false);
    setMentionQuery("");
    setMentionStartIndex(-1);

    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        const cursorPosition = before.length + tag.length;
        textarea.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);
  };

  // Quick button in toolbar to trigger @ mention dialog
  const handleAtButtonClick = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const pos = textarea.selectionStart ?? content.length;
    const charBefore = pos > 0 ? content[pos - 1] : " ";
    const prefix = /\s/.test(charBefore) || pos === 0 ? "@" : " @";
    const newContent = content.slice(0, pos) + prefix + content.slice(pos);
    setContent(newContent);
    const newPos = pos + prefix.length;

    setShowMentionDialog(true);
    setMentionQuery("");
    setMentionStartIndex(newPos - 1);
    setSelectedMemberIndex(0);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  // Keyboard navigation for mention dialog
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showMentionDialog && filteredMembers.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedMemberIndex((prev) => (prev + 1) % filteredMembers.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedMemberIndex((prev) =>
          prev === 0 ? filteredMembers.length - 1 : prev - 1
        );
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        handleSelectMember(filteredMembers[selectedMemberIndex]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setShowMentionDialog(false);
      }
    }
  };

  // Click outside listener to dismiss mention dialog
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        mentionDialogRef.current &&
        !mentionDialogRef.current.contains(e.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(e.target as Node)
      ) {
        setShowMentionDialog(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Assignment Discussion
            </h4>
            <p className="text-xs text-slate-500">
              {totalCount} {totalCount === 1 ? "comment" : "comments"} •
              Questions, clarifications & peer discussions
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => fetchComments()}
          disabled={loading}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 shadow-xs"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments List */}
      {loading ? (
        <div className="py-8 flex flex-col items-center justify-center text-slate-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <p className="text-xs">Loading discussions...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center bg-slate-50/70 border border-dashed border-slate-200 rounded-2xl p-6">
          <MessageSquare className="w-8 h-8 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-700">
            No comments yet
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Have a question about this assignment? Start the discussion below.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="space-y-3">
              {/* Root Comment Card */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  comment.isVerifiedAnswer
                    ? "bg-emerald-50/40 border-emerald-300 shadow-xs ring-1 ring-emerald-400/20"
                    : comment.authorRole === "TEACHER"
                    ? "bg-blue-50/40 border-blue-200/90 shadow-xs"
                    : "bg-white border-slate-200/90 shadow-xs"
                }`}
              >
                {/* Instructor Verified Badge (if verified) */}
                {comment.isVerifiedAnswer && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-300 mb-2.5 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Instructor Verified Solution</span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    {/* User Avatar */}
                    <UserProfileHoverCard
                      identifier={comment.authorName || comment.authorEmail}
                      userId={comment.authorId}
                      fallbackName={comment.authorName || comment.authorEmail.split("@")[0]}
                      fallbackRole={comment.authorRole}
                    >
                      <div
                        className={`w-8 h-8 rounded-full aspect-square flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden ring-1 ring-slate-200 ${
                          comment.authorRole === "TEACHER"
                            ? "bg-blue-600 text-white shadow-xs shadow-blue-500/20"
                            : "bg-slate-800 text-white"
                        }`}
                      >
                        {comment.authorAvatarUrl ? (
                          <img
                            src={comment.authorAvatarUrl}
                            alt={comment.authorName || comment.authorEmail}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          comment.authorEmail.charAt(0).toUpperCase()
                        )}
                      </div>
                    </UserProfileHoverCard>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <UserProfileHoverCard
                          identifier={comment.authorName || comment.authorEmail}
                          userId={comment.authorId}
                          fallbackName={comment.authorName || comment.authorEmail.split("@")[0]}
                          fallbackRole={comment.authorRole}
                        >
                          <span className="font-semibold text-xs text-slate-900 hover:text-blue-600 transition-colors">
                            {comment.authorName || comment.authorEmail.split("@")[0]}
                          </span>
                        </UserProfileHoverCard>

                        {comment.authorRole === "TEACHER" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            <GraduationCap className="w-3 h-3" />
                            Instructor
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                            <User className="w-2.5 h-2.5" />
                            Student
                          </span>
                        )}

                        <span className="text-[11px] text-slate-400">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                        {renderCommentContentWithMentions(comment.content)}
                      </p>
                    </div>
                  </div>

                  {/* Actions (Verify Answer / Reply / Delete) */}
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Instructor Verified Answer Button (Teacher only) */}
                    {currentUserRole === "TEACHER" && (
                      <button
                        type="button"
                        onClick={() => handleToggleVerify(comment._id)}
                        disabled={verifyingId === comment._id}
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                          comment.isVerifiedAnswer
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-bold border border-emerald-200"
                            : "text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
                        }`}
                        title={
                          comment.isVerifiedAnswer
                            ? "Unmark as verified solution"
                            : "Mark as verified solution"
                        }
                      >
                        {verifyingId === comment._id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                        ) : (
                          <CheckCircle2
                            className={`w-3.5 h-3.5 ${
                              comment.isVerifiedAnswer ? "text-emerald-700" : ""
                            }`}
                          />
                        )}
                        <span className="hidden sm:inline">
                          {comment.isVerifiedAnswer
                            ? "Verified"
                            : "Verify Solution"}
                        </span>
                      </button>
                    )}

                    {/* Reply button (Allows replying to any comment, including own) */}
                    <button
                      type="button"
                      onClick={() => {
                        setReplyingTo(comment);
                        setError(null);
                        setTimeout(() => textareaRef.current?.focus(), 50);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title={isOwnComment(comment.authorEmail) ? "Reply to your comment" : "Reply to this comment"}
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>

                    {/* Delete button (Opens sleek modal) */}
                    {(currentUserRole === "TEACHER" ||
                      isOwnComment(comment.authorEmail)) && (
                      <button
                        type="button"
                        onClick={() => setCommentToDelete(comment)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete comment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Threaded Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-8 pl-4 border-l-2 border-slate-200 space-y-2.5">
                  {comment.replies.map((reply) => (
                    <div
                      key={reply._id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        reply.isVerifiedAnswer
                          ? "bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-400/20"
                          : reply.authorRole === "TEACHER"
                          ? "bg-blue-50/40 border-blue-200"
                          : "bg-slate-50/70 border-slate-200"
                      }`}
                    >
                      {/* Instructor Verified Badge for Reply */}
                      {reply.isVerifiedAnswer && (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-300 mb-2">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>Instructor Verified Solution</span>
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2">
                          <UserProfileHoverCard
                            identifier={reply.authorName || reply.authorEmail}
                            userId={reply.authorId}
                            fallbackName={reply.authorName || reply.authorEmail.split("@")[0]}
                            fallbackRole={reply.authorRole}
                          >
                            <div
                              className={`w-7 h-7 rounded-full aspect-square flex items-center justify-center text-[10px] font-bold shrink-0 overflow-hidden ring-1 ring-slate-200 ${
                                reply.authorRole === "TEACHER"
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-700 text-white"
                              }`}
                            >
                              {reply.authorAvatarUrl ? (
                                <img
                                  src={reply.authorAvatarUrl}
                                  alt={reply.authorName || reply.authorEmail}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                reply.authorEmail.charAt(0).toUpperCase()
                              )}
                            </div>
                          </UserProfileHoverCard>

                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <UserProfileHoverCard
                                identifier={reply.authorName || reply.authorEmail}
                                userId={reply.authorId}
                                fallbackName={reply.authorName || reply.authorEmail.split("@")[0]}
                                fallbackRole={reply.authorRole}
                              >
                                <span className="font-semibold text-xs text-slate-900 hover:text-blue-600 transition-colors">
                                  {reply.authorName ||
                                    reply.authorEmail.split("@")[0]}
                                </span>
                              </UserProfileHoverCard>

                              {reply.authorRole === "TEACHER" ? (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-800">
                                  Instructor
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-500">
                                  Student
                                </span>
                              )}

                              {reply.replyToUser && (
                                <span className="text-[10px] text-slate-500 font-medium">
                                  replied to{" "}
                                  <UserProfileHoverCard
                                    identifier={reply.replyToUser.email.split("@")[0]}
                                    userId={reply.replyToUser.id}
                                    fallbackName={reply.replyToUser.email.split("@")[0]}
                                    fallbackRole={reply.replyToUser.role}
                                  >
                                    <span className="text-blue-600 hover:text-blue-800 font-bold">
                                      @{reply.replyToUser.email.split("@")[0]}
                                    </span>
                                  </UserProfileHoverCard>
                                </span>
                              )}

                              <span className="text-[10px] text-slate-400">
                                {formatDate(reply.createdAt)}
                              </span>
                            </div>

                            <p className="mt-1.5 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                              {renderCommentContentWithMentions(reply.content)}
                            </p>
                          </div>
                        </div>

                        {/* Actions for Reply */}
                        <div className="flex items-center gap-1 shrink-0">
                          {/* Teacher verify solution on reply */}
                          {currentUserRole === "TEACHER" && (
                            <button
                              type="button"
                              onClick={() => handleToggleVerify(reply._id)}
                              disabled={verifyingId === reply._id}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-md transition-colors cursor-pointer ${
                                reply.isVerifiedAnswer
                                  ? "bg-emerald-100 text-emerald-800 font-bold"
                                  : "text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
                              }`}
                              title={
                                reply.isVerifiedAnswer
                                  ? "Unmark as verified solution"
                                  : "Mark as verified solution"
                              }
                            >
                              {verifyingId === reply._id ? (
                                <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />
                              ) : (
                                <CheckCircle2 className="w-3 h-3" />
                              )}
                              <span className="hidden sm:inline">
                                {reply.isVerifiedAnswer ? "Verified" : "Verify"}
                              </span>
                            </button>
                          )}

                          {/* Allow replying to a nested reply (including own) */}
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingTo(comment);
                              setError(null);
                              setTimeout(() => textareaRef.current?.focus(), 50);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                            title={isOwnComment(reply.authorEmail) ? "Reply to your comment" : "Reply in this thread"}
                          >
                            <Reply className="w-3 h-3" />
                            <span>Reply</span>
                          </button>

                          {/* Delete reply */}
                          {(currentUserRole === "TEACHER" ||
                            isOwnComment(reply.authorEmail)) && (
                            <button
                              type="button"
                              onClick={() => setCommentToDelete(reply)}
                              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                              title="Delete reply"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Comment Input Box with Dynamic @Mention Dialog */}
      <form
        onSubmit={handleSubmit}
        className="relative bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs space-y-2.5"
      >
        {/* Dynamic @Mention Classroom Members Dialog */}
        <AnimatePresence>
          {showMentionDialog && (
            <motion.div
              ref={mentionDialogRef}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full left-0 right-0 mb-2 max-h-64 bg-white border border-slate-200/90 rounded-2xl shadow-xl overflow-hidden z-40 flex flex-col"
            >
              {/* Header */}
              <div className="px-3.5 py-2 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <AtSign className="w-3.5 h-3.5 text-blue-600" />
                  <span>Mention Classroom Member</span>
                  {mentionQuery && (
                    <span className="text-slate-400 font-normal">
                      matching "@{mentionQuery}"
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  ↑↓ to navigate • Enter to select • Esc to exit
                </span>
              </div>

              {/* Member List */}
              <div className="overflow-y-auto max-h-48 divide-y divide-slate-100/80 p-1">
                {filteredMembers.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No classroom members found matching "@{mentionQuery}"
                  </div>
                ) : (
                  filteredMembers.map((member, idx) => {
                    const isSelected = idx === selectedMemberIndex;
                    const isTeacher = member.role === "TEACHER";
                    const isSelf = member.email.toLowerCase() === currentUserEmail.toLowerCase();

                    return (
                      <button
                        key={member.id}
                        type="button"
                        onMouseEnter={() => setSelectedMemberIndex(idx)}
                        onClick={() => handleSelectMember(member)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-blue-50 text-blue-900"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {/* Avatar */}
                          <div className="w-7 h-7 rounded-full aspect-square flex items-center justify-center text-xs font-bold text-white shrink-0 overflow-hidden ring-1 ring-slate-200 bg-gradient-to-br from-blue-600 to-indigo-600">
                            {member.avatarUrl ? (
                              <img
                                src={member.avatarUrl}
                                alt={member.displayName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              (member.displayName[0] || "U").toUpperCase()
                            )}
                          </div>

                          <div className="truncate">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-slate-900 truncate">
                                @{member.username}
                              </span>
                              {isSelf && (
                                <span className="text-[10px] text-slate-400 font-normal">
                                  (You)
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 font-mono block truncate">
                              {member.email}
                            </span>
                          </div>
                        </div>

                        {/* Role Badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            isTeacher
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {isTeacher ? "Instructor" : "Student"}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reply Context Banner */}
        <AnimatePresence>
          {replyingTo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-between px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800"
            >
              <div className="flex items-center gap-2 truncate">
                <Reply className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">
                  Replying to{" "}
                  <strong className="font-semibold">
                    @{replyingTo.authorName || replyingTo.authorEmail.split("@")[0]}
                    {isOwnComment(replyingTo.authorEmail) ? " (You)" : ""}
                  </strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="text-blue-500 hover:text-blue-700 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={replyingTo ? 2 : 3}
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          placeholder={
            replyingTo
              ? `Write your reply (type @ to mention a member)...`
              : "Ask a question, share feedback, or leave a note (type @ to mention)..."
          }
          maxLength={1000}
          disabled={submitting}
          className="w-full text-xs text-slate-800 placeholder-slate-400 bg-transparent border-0 focus:ring-0 focus:outline-hidden resize-none leading-relaxed"
        />

        {/* Footer controls */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>{content.length} / 1000</span>

            {/* Quick @ Mention Button */}
            <button
              type="button"
              onClick={handleAtButtonClick}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                showMentionDialog
                  ? "bg-blue-100 text-blue-700 border-blue-300 shadow-2xs"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
              }`}
              title="Mention a teacher or student in this classroom (@)"
            >
              <AtSign className="w-3 h-3 text-blue-600" />
              <span>Mention</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {replyingTo && (
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="px-3 py-1.5 text-slate-500 hover:text-slate-700 rounded-xl text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>{replyingTo ? "Send Reply" : "Post Comment"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* 🗑️ Sleek Custom Delete Confirmation Modal (NO generic alert box) */}
      <AnimatePresence>
        {commentToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => !deletingId && setCommentToDelete(null)}
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 z-10 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Delete Comment?
                  </h3>
                  <p className="text-xs text-slate-500">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs text-slate-600 max-h-24 overflow-y-auto">
                <p className="italic">
                  "
                  {commentToDelete.content.length > 120
                    ? commentToDelete.content.slice(0, 120) + "..."
                    : commentToDelete.content}
                  "
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={!!deletingId}
                  onClick={() => setCommentToDelete(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!!deletingId}
                  onClick={confirmDeleteComment}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {deletingId ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssignmentComments;
