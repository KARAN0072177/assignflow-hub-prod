import { useState, useEffect, useMemo, useCallback } from "react";
import {
  MessageSquare,
  FileText,
  Search,
  AlertCircle,
  Loader2,
  ChevronRight,
  Award,
  FolderOpen,
} from "lucide-react";
import {
  getTeacherDiscussionsHub,
  markAssignmentCommentsRead,
  type TeacherDiscussionsHubData,
} from "../services/comment.api";
import AssignmentComments from "../components/AssignmentComments";
import { useAppSocket } from "../context/SocketContext";

export const TeacherCommentsHub = () => {
  const [data, setData] = useState<TeacherDiscussionsHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedClassroomId, setSelectedClassroomId] = useState<string>("ALL");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { lastCommentEvent, setUnreadDiscussionsCount, refreshUnreadCount } = useAppSocket();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getTeacherDiscussionsHub();
      setData(res);

      // Auto-select first assignment if none selected
      if (!selectedAssignmentId && res.assignments && res.assignments.length > 0) {
        const withUnread = res.assignments.find((a) => a.unreadCount > 0);
        const withComments = res.assignments.find((a) => a.commentCount > 0);
        const chosen = withUnread ? withUnread._id : withComments ? withComments._id : res.assignments[0]._id;
        setSelectedAssignmentId(chosen);

        // Mark the initially selected assignment as read
        markAssignmentCommentsRead(chosen).catch(() => {});
        refreshUnreadCount().catch(() => {});
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to load discussions hub. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔔 Handle live incoming comments from WebSocket
  useEffect(() => {
    if (!lastCommentEvent || !data?.assignments) return;

    const { assignmentId, isFromTeacher } = lastCommentEvent;

    setData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        assignments: prev.assignments.map((a) => {
          if (a._id === assignmentId) {
            const isCurrentlyOpen = selectedAssignmentId === assignmentId;
            const newUnread = isCurrentlyOpen || isFromTeacher ? 0 : (a.unreadCount || 0) + 1;
            return {
              ...a,
              commentCount: (a.commentCount || 0) + 1,
              unreadCount: newUnread,
              latestCommentAt: new Date().toISOString(),
            };
          }
          return a;
        }),
      };
    });

    // If the comment is for the actively opened assignment, immediately mark as read
    if (selectedAssignmentId === assignmentId) {
      markAssignmentCommentsRead(assignmentId).catch(() => {});
    }
  }, [lastCommentEvent, selectedAssignmentId]);

  // Handle clicking an assignment -> Clear unread notifications and open
  const handleSelectAssignment = useCallback(
    async (assignmentId: string) => {
      setSelectedAssignmentId(assignmentId);

      const targetAssignment = data?.assignments?.find((a) => a._id === assignmentId);
      const unreadToClear = targetAssignment?.unreadCount || 0;

      if (unreadToClear > 0) {
        // Optimistically clear unread count for this assignment
        setData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            assignments: prev.assignments.map((a) =>
              a._id === assignmentId ? { ...a, unreadCount: 0 } : a
            ),
          };
        });

        // Decrement sidebar unread counter
        setUnreadDiscussionsCount((prev) => Math.max(0, prev - unreadToClear));

        // Persist read state on server
        try {
          await markAssignmentCommentsRead(assignmentId);
        } catch {
          // Non-blocking
        }
      }
    },
    [data?.assignments, setUnreadDiscussionsCount]
  );

  // Filter assignments by classroom and search
  const filteredAssignments = useMemo(() => {
    if (!data?.assignments) return [];

    return data.assignments.filter((a) => {
      const matchClass =
        selectedClassroomId === "ALL" || a.classroomId === selectedClassroomId;
      const matchSearch =
        !searchQuery.trim() ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchClass && matchSearch;
    });
  }, [data?.assignments, selectedClassroomId, searchQuery]);

  const activeAssignment = useMemo(() => {
    if (!data?.assignments || !selectedAssignmentId) return null;
    return data.assignments.find((a) => a._id === selectedAssignmentId) || null;
  }, [data?.assignments, selectedAssignmentId]);

  const activeClassroom = useMemo(() => {
    if (!data?.classrooms || !activeAssignment) return null;
    return (
      data.classrooms.find((c) => c._id === activeAssignment.classroomId) ||
      null
    );
  }, [data?.classrooms, activeAssignment]);

  const totalDiscussionsCount = useMemo(() => {
    if (!data?.assignments) return 0;
    return data.assignments.reduce((acc, a) => acc + (a.commentCount || 0), 0);
  }, [data?.assignments]);

  const totalUnreadCount = useMemo(() => {
    if (!data?.assignments) return 0;
    return data.assignments.reduce((acc, a) => acc + (a.unreadCount || 0), 0);
  }, [data?.assignments]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-600">
            Loading assignment discussions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3.5 bg-blue-100/70 text-blue-700 rounded-2xl shrink-0">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Assignment Discussions Hub
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                  Teacher View
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                Monitor questions, address doubts, and reply directly to student comments across all classrooms in real-time.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 bg-blue-50/70 border border-blue-100 rounded-2xl text-center">
              <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">
                Total Comments
              </p>
              <p className="text-xl font-extrabold text-blue-900">
                {totalDiscussionsCount}
              </p>
            </div>

            <div className="px-4 py-2.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-center">
              <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">
                Unread Questions
              </p>
              <p className="text-xl font-extrabold text-indigo-900">
                {totalUnreadCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Content Layout: Sidebar List + Right Discussion Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Classroom Filter + Assignment Selector */}
        <div className="lg:col-span-4 space-y-4">
          {/* Controls Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            {/* Classroom Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Classroom Filter
              </label>
              <select
                value={selectedClassroomId}
                onChange={(e) => setSelectedClassroomId(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="ALL">All Classrooms ({data?.classrooms?.length || 0})</option>
                {data?.classrooms?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Assignments List */}
          <div className="bg-white border border-slate-200 rounded-3xl p-3 shadow-xs space-y-2 max-h-[600px] overflow-y-auto">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 pt-2">
              ASSIGNMENTS ({filteredAssignments.length})
            </p>

            {filteredAssignments.length === 0 ? (
              <div className="p-6 text-center text-slate-400">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-medium">No assignments match</p>
              </div>
            ) : (
              filteredAssignments.map((assignment) => {
                const isSelected = selectedAssignmentId === assignment._id;
                const parentClassroom = data?.classrooms?.find(
                  (c) => c._id === assignment.classroomId
                );
                const unread = assignment.unreadCount || 0;

                return (
                  <button
                    key={assignment._id}
                    type="button"
                    onClick={() => handleSelectAssignment(assignment._id)}
                    className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-start justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "hover:bg-slate-50 text-slate-800"
                    }`}
                  >
                    <div className="space-y-1 truncate">
                      <div className="flex items-center gap-1.5">
                        {assignment.type === "GRADED" ? (
                          <Award
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isSelected ? "text-blue-200" : "text-blue-600"
                            }`}
                          />
                        ) : (
                          <FolderOpen
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isSelected ? "text-blue-200" : "text-purple-600"
                            }`}
                          />
                        )}
                        <p className="text-xs font-bold truncate">
                          {assignment.title}
                        </p>
                      </div>

                      <p
                        className={`text-[11px] truncate ${
                          isSelected ? "text-blue-100" : "text-slate-500"
                        }`}
                      >
                        {parentClassroom?.name || "Classroom"}
                      </p>
                    </div>

                    {/* Live Unread / Comment Count Badge */}
                    <div className="shrink-0 flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isSelected
                            ? "bg-blue-500 text-white"
                            : unread > 0
                            ? "bg-blue-600 text-white animate-pulse shadow-xs"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {unread}
                      </span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 ${
                          isSelected ? "text-white" : "text-slate-300"
                        }`}
                      />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Assignment Discussion View */}
        <div className="lg:col-span-8">
          {activeAssignment ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              {/* Assignment Banner */}
              <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                      {activeClassroom?.name || "Classroom"}
                    </span>
                    <span className="text-xs text-slate-400">
                      Code: <strong className="font-mono text-slate-700">{activeClassroom?.code}</strong>
                    </span>
                  </div>

                  <h2 className="text-lg font-extrabold text-slate-900">
                    {activeAssignment.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold ${
                      activeAssignment.type === "GRADED"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-purple-50 text-purple-700 border border-purple-200"
                    }`}
                  >
                    {activeAssignment.type === "GRADED" ? "Graded Assignment" : "Material"}
                  </span>
                </div>
              </div>

              {/* Assignment Discussion Component */}
              <AssignmentComments
                assignmentId={activeAssignment._id}
                assignmentTitle={activeAssignment.title}
                onCommentCountChange={(newCount) => {
                  setData((prev) => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      assignments: prev.assignments.map((a) =>
                        a._id === activeAssignment._id
                          ? { ...a, commentCount: newCount }
                          : a
                      ),
                    };
                  });
                }}
              />
            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-700 mb-1">
                Select an Assignment
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Choose an assignment from the left list to view and reply to student discussions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherCommentsHub;
