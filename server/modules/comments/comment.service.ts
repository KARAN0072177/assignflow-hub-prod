import { Types } from "mongoose";
import { Comment, IComment } from "../../models/comment.model";
import { Assignment } from "../../models/assignment.model";
import { Classroom } from "../../models/classroom.model";
import { Membership } from "../../models/membership.model";
import { User, UserRole } from "../../models/user.model";
import { getIO } from "../../socket";
import sanitizeHtml from "sanitize-html";

interface CreateCommentParams {
  assignmentId: Types.ObjectId;
  userId: Types.ObjectId;
  role: UserRole;
  content: string;
  parentCommentId?: Types.ObjectId;
}

/**
 * 1. Post a new comment or reply to an existing comment
 */
export const createComment = async ({
  assignmentId,
  userId,
  role,
  content,
  parentCommentId,
}: CreateCommentParams) => {
  // 1. Verify assignment exists
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    throw new Error("Assignment not found");
  }

  const classroomId = assignment.classroomId;

  // 2. Verify user has access to this classroom
  if (role === UserRole.TEACHER) {
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      throw new Error("Classroom not found");
    }
    // Check if teacher owns or has access to the classroom
    if (classroom.teacherId.toString() !== userId.toString()) {
      const isMember = await Membership.findOne({
        classroomId,
        studentId: userId,
      });
      if (!isMember) {
        throw new Error("You do not have access to this classroom");
      }
    }
  } else {
    // Student must be an active member
    const membership = await Membership.findOne({
      classroomId,
      studentId: userId,
    });
    if (!membership) {
      throw new Error("You are not enrolled in this classroom");
    }
  }

  // 3. Fetch author details
  const author = await User.findById(userId);
  if (!author) {
    throw new Error("User not found");
  }

  // 4. Sanitize comment content (XSS protection)
  const cleanContent = sanitizeHtml(content, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();

  if (!cleanContent) {
    throw new Error("Comment content cannot be empty");
  }

  if (cleanContent.length > 1000) {
    throw new Error("Comment exceeds maximum length of 1000 characters");
  }

  let replyToUserData = undefined;

  // 5. Handle reply validation
  if (parentCommentId) {
    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      throw new Error("Parent comment to reply to does not exist");
    }

    if (parentComment.assignmentId.toString() !== assignmentId.toString()) {
      throw new Error("Parent comment belongs to a different assignment");
    }

    // 🚫 RULE: User cannot reply to their own comment
    if (parentComment.authorId.toString() === userId.toString()) {
      throw new Error("Self-reply is not allowed. You cannot reply to your own comment.");
    }

    replyToUserData = {
      id: parentComment.authorId,
      email: parentComment.authorEmail,
      role: parentComment.authorRole,
    };
  }

  // 6. Create comment with author marked as having read it
  const comment = await Comment.create({
    assignmentId,
    classroomId,
    authorId: userId,
    authorRole: role,
    authorEmail: author.email,
    authorName: author.username ? `@${author.username}` : author.email.split("@")[0],
    content: cleanContent,
    parentCommentId: parentCommentId || undefined,
    replyToUser: replyToUserData,
    readBy: [userId],
  });

  // 7. 🔌 Broadcast real-time WebSocket notification
  try {
    const io = getIO();
    if (io) {
      const classroom = await Classroom.findById(classroomId);
      if (classroom) {
        // Send real-time notification to the teacher
        io.to(`teacher:${classroom.teacherId}`).emit("comment:new", {
          comment,
          assignmentId: assignmentId.toString(),
          classroomId: classroomId.toString(),
          assignmentTitle: assignment.title,
          isFromTeacher: role === UserRole.TEACHER,
        });
      }

      // Send to active assignment room for instant thread update
      io.to(`assignment:${assignmentId}`).emit("comment:new", {
        comment,
        assignmentId: assignmentId.toString(),
        classroomId: classroomId.toString(),
        assignmentTitle: assignment.title,
      });
    }
  } catch (socketErr) {
    // Non-blocking socket notification error
    console.error("Socket emit error:", socketErr);
  }

  return comment;
};

/**
 * 2. Get all comments & threaded replies for an assignment
 */
export const getCommentsForAssignment = async (
  assignmentId: Types.ObjectId,
  userId: Types.ObjectId,
  role: UserRole
) => {
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    throw new Error("Assignment not found");
  }

  // Verify access
  if (role === UserRole.TEACHER) {
    const classroom = await Classroom.findById(assignment.classroomId);
    if (classroom && classroom.teacherId.toString() !== userId.toString()) {
      const isMember = await Membership.findOne({
        classroomId: assignment.classroomId,
        studentId: userId,
      });
      if (!isMember) {
        throw new Error("Access denied to this assignment discussion");
      }
    }
  } else {
    const membership = await Membership.findOne({
      classroomId: assignment.classroomId,
      studentId: userId,
    });
    if (!membership) {
      throw new Error("Access denied. You are not enrolled in this classroom.");
    }
  }

  // Fetch all comments for this assignment sorted chronologically
  const allComments = await Comment.find({ assignmentId })
    .sort({ createdAt: 1 })
    .lean();

  // Structure comments into threaded parent -> replies tree
  const rootComments: any[] = [];
  const repliesMap = new Map<string, any[]>();

  for (const c of allComments) {
    if (c.parentCommentId) {
      const parentId = c.parentCommentId.toString();
      if (!repliesMap.has(parentId)) {
        repliesMap.set(parentId, []);
      }
      repliesMap.get(parentId)!.push(c);
    } else {
      rootComments.push(c);
    }
  }

  const structuredComments = rootComments.map((root) => ({
    ...root,
    replies: repliesMap.get(root._id.toString()) || [],
  }));

  return {
    assignment: {
      id: assignment._id,
      title: assignment.title,
      classroomId: assignment.classroomId,
    },
    comments: structuredComments,
    totalCount: allComments.length,
  };
};

/**
 * 3. Mark all comments in an assignment as read for a user
 */
export const markAssignmentCommentsAsRead = async (
  assignmentId: Types.ObjectId,
  userId: Types.ObjectId
) => {
  await Comment.updateMany(
    { assignmentId, readBy: { $ne: userId } },
    { $addToSet: { readBy: userId } }
  );

  return { success: true };
};

/**
 * 4. Fast query for Teacher's total unread discussions count
 */
export const getTeacherUnreadCount = async (teacherId: Types.ObjectId) => {
  const classrooms = await Classroom.find({ teacherId }).select("_id").lean();
  const classroomIds = classrooms.map((c) => c._id);

  const totalUnread = await Comment.countDocuments({
    classroomId: { $in: classroomIds },
    authorId: { $ne: teacherId },
    readBy: { $ne: teacherId },
  });

  return { totalUnread };
};

/**
 * 5. Teacher Discussions Hub: Fetch all discussions and unread counts across teacher's classrooms
 */
export const getTeacherDiscussionsHub = async (
  teacherId: Types.ObjectId,
  selectedClassroomId?: string,
  selectedAssignmentId?: string
) => {
  // Fetch classrooms taught by teacher
  const classrooms = await Classroom.find({ teacherId }).select("_id name code").lean();
  const classroomIds = classrooms.map((c) => c._id);

  // Fetch all assignments across teacher's classrooms
  const assignments = await Assignment.find({
    classroomId: { $in: classroomIds },
  })
    .select("_id title type classroomId dueDate state")
    .lean();

  // Aggregate total comment counts per assignment
  const commentCounts = await Comment.aggregate([
    {
      $match: {
        classroomId: { $in: classroomIds },
      },
    },
    {
      $group: {
        _id: "$assignmentId",
        totalComments: { $sum: 1 },
        latestCommentAt: { $max: "$createdAt" },
      },
    },
  ]);

  const countMap = new Map<string, { total: number; latest: Date }>();
  commentCounts.forEach((item) => {
    countMap.set(item._id.toString(), {
      total: item.totalComments,
      latest: item.latestCommentAt,
    });
  });

  // Aggregate unread comment counts per assignment for this teacher
  const unreadCounts = await Comment.aggregate([
    {
      $match: {
        classroomId: { $in: classroomIds },
        authorId: { $ne: teacherId },
        readBy: { $ne: teacherId },
      },
    },
    {
      $group: {
        _id: "$assignmentId",
        unreadCount: { $sum: 1 },
      },
    },
  ]);

  const unreadMap = new Map<string, number>();
  let totalUnreadAcrossAll = 0;
  unreadCounts.forEach((item) => {
    unreadMap.set(item._id.toString(), item.unreadCount);
    totalUnreadAcrossAll += item.unreadCount;
  });

  // Attach comment & unread stats to assignments
  const enrichedAssignments = assignments.map((a) => {
    const stats = countMap.get(a._id.toString());
    const unread = unreadMap.get(a._id.toString()) || 0;
    return {
      ...a,
      commentCount: stats?.total || 0,
      unreadCount: unread,
      latestCommentAt: stats?.latest || null,
    };
  });

  // If specific assignment requested, fetch its comments and mark as read
  let activeDiscussion: any = null;
  if (selectedAssignmentId) {
    try {
      activeDiscussion = await getCommentsForAssignment(
        new Types.ObjectId(selectedAssignmentId),
        teacherId,
        UserRole.TEACHER
      );

      // Auto mark read for teacher
      await markAssignmentCommentsAsRead(
        new Types.ObjectId(selectedAssignmentId),
        teacherId
      );
    } catch {
      activeDiscussion = null;
    }
  }

  return {
    classrooms,
    assignments: enrichedAssignments,
    totalUnread: totalUnreadAcrossAll,
    activeDiscussion,
  };
};

/**
 * 6. Delete a comment (Author or Teacher can delete)
 */
export const deleteComment = async (
  commentId: Types.ObjectId,
  userId: Types.ObjectId,
  role: UserRole
) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new Error("Comment not found");
  }

  const isAuthor = comment.authorId.toString() === userId.toString();
  let isClassroomTeacher = false;

  if (role === UserRole.TEACHER) {
    const classroom = await Classroom.findById(comment.classroomId);
    if (classroom && classroom.teacherId.toString() === userId.toString()) {
      isClassroomTeacher = true;
    }
  }

  if (!isAuthor && !isClassroomTeacher) {
    throw new Error("You do not have permission to delete this comment");
  }

  // Also remove any direct replies
  await Comment.deleteMany({
    $or: [{ _id: commentId }, { parentCommentId: commentId }],
  });

  return { success: true, message: "Comment deleted successfully" };
};

/**
 * 7. Toggle "Instructor Verified Answer" / Pin Solution on a comment
 */
export const toggleVerifiedAnswer = async (
  commentId: Types.ObjectId,
  teacherId: Types.ObjectId
) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new Error("Comment not found");
  }

  // Verify the user is the instructor of this classroom
  const classroom = await Classroom.findById(comment.classroomId);
  if (!classroom || classroom.teacherId.toString() !== teacherId.toString()) {
    throw new Error("Only the instructor of this classroom can verify answers");
  }

  const newVerifiedState = !comment.isVerifiedAnswer;
  comment.isVerifiedAnswer = newVerifiedState;
  comment.verifiedBy = newVerifiedState ? teacherId : undefined;
  comment.verifiedAt = newVerifiedState ? new Date() : undefined;

  await comment.save();

  // Broadcast real-time verification event
  try {
    const io = getIO();
    if (io) {
      io.to(`assignment:${comment.assignmentId}`).emit("comment:verified", {
        commentId: comment._id.toString(),
        assignmentId: comment.assignmentId.toString(),
        isVerifiedAnswer: newVerifiedState,
        verifiedAt: comment.verifiedAt,
      });
    }
  } catch (socketErr) {
    console.error("Socket emit error on verify:", socketErr);
  }

  return comment;
};

