import { apiClient } from "./apiClient";

export interface CommentUser {
  id: string;
  email: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
}

export interface AssignmentCommentItem {
  _id: string;
  assignmentId: string;
  classroomId: string;
  authorId: string;
  authorRole: "STUDENT" | "TEACHER" | "ADMIN";
  authorEmail: string;
  authorName?: string;
  content: string;
  parentCommentId?: string;
  replyToUser?: CommentUser;
  readBy?: string[];
  isVerifiedAnswer?: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  replies?: AssignmentCommentItem[];
}

export interface AssignmentCommentsResponse {
  assignment: {
    id: string;
    title: string;
    classroomId: string;
  };
  comments: AssignmentCommentItem[];
  totalCount: number;
}

export interface TeacherDiscussionsHubData {
  classrooms: { _id: string; name: string; code: string }[];
  assignments: {
    _id: string;
    title: string;
    type: "GRADED" | "MATERIAL";
    classroomId: string;
    dueDate?: string;
    state: string;
    commentCount: number;
    unreadCount: number;
    latestCommentAt?: string;
  }[];
  totalUnread?: number;
  activeDiscussion?: AssignmentCommentsResponse | null;
}

/**
 * Fetch comments and replies for a specific assignment
 */
export const getAssignmentComments = async (
  assignmentId: string
): Promise<AssignmentCommentsResponse> => {
  const res = await apiClient.get<AssignmentCommentsResponse>(
    `/api/comments/assignment/${assignmentId}`
  );
  return res.data;
};

/**
 * Post a new comment or reply
 */
export const postComment = async (payload: {
  assignmentId: string;
  content: string;
  parentCommentId?: string;
}): Promise<AssignmentCommentItem> => {
  const res = await apiClient.post<AssignmentCommentItem>(
    "/api/comments",
    payload
  );
  return res.data;
};

/**
 * Mark assignment comments as read
 */
export const markAssignmentCommentsRead = async (
  assignmentId: string
): Promise<{ success: boolean }> => {
  const res = await apiClient.post<{ success: boolean }>(
    `/api/comments/assignment/${assignmentId}/read`
  );
  return res.data;
};

/**
 * Fetch teacher total unread discussions count
 */
export const getTeacherUnreadDiscussionsCount = async (): Promise<{
  totalUnread: number;
}> => {
  const res = await apiClient.get<{ totalUnread: number }>(
    "/api/comments/teacher/unread-count"
  );
  return res.data;
};

/**
 * Fetch teacher discussions hub across classrooms
 */
export const getTeacherDiscussionsHub = async (
  classroomId?: string,
  assignmentId?: string
): Promise<TeacherDiscussionsHubData> => {
  const params: Record<string, string> = {};
  if (classroomId) params.classroomId = classroomId;
  if (assignmentId) params.assignmentId = assignmentId;

  const res = await apiClient.get<TeacherDiscussionsHubData>(
    "/api/comments/teacher/hub",
    { params }
  );
  return res.data;
};

/**
 * Toggle Instructor Verified Answer / Pin Solution
 */
export const toggleVerifiedAnswer = async (
  commentId: string
): Promise<AssignmentCommentItem> => {
  const res = await apiClient.patch<AssignmentCommentItem>(
    `/api/comments/${commentId}/verify`
  );
  return res.data;
};

/**
 * Delete a comment
 */
export const deleteComment = async (
  commentId: string
): Promise<{ success: boolean; message: string }> => {
  const res = await apiClient.delete<{ success: boolean; message: string }>(
    `/api/comments/${commentId}`
  );
  return res.data;
};
