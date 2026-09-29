import { Types } from "mongoose";
import { Notification, NotificationType, INotification } from "../../models/notification.model";
import { Assignment } from "../../models/assignment.model";
import { Classroom } from "../../models/classroom.model";
import { Membership } from "../../models/membership.model";
import { Submission, SubmissionState } from "../../models/submission.model";
import { User, IUser } from "../../models/user.model";
import { getIO } from "../../socket";

export class NotificationService {
  /**
   * Create and real-time dispatch a notification
   */
  public static async createAndDispatch(data: {
    recipientId: Types.ObjectId;
    type: NotificationType;
    title: string;
    message: string;
    link: string;
    metadata?: any;
  }): Promise<INotification> {
    const notification = await Notification.create({
      recipientId: data.recipientId,
      type: data.type,
      title: data.title,
      message: data.message,
      link: data.link,
      metadata: data.metadata,
      isRead: false,
    });

    // ⚡ Real-time WebSocket emission to target user's private room
    try {
      const io = getIO();
      if (io) {
        io.to(`user:${data.recipientId}`).emit("notification:new", notification);
      }
    } catch (err) {
      console.error("[NotificationService] Socket emit error:", err);
    }

    return notification;
  }

  /**
   * Get user notifications & unread count
   */
  public static async getUserNotifications(userId: Types.ObjectId, limit = 20) {
    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ recipientId: userId })
        .sort({ createdAt: -1 })
        .limit(limit),
      Notification.countDocuments({ recipientId: userId, isRead: false }),
    ]);

    return {
      notifications,
      unreadCount,
    };
  }

  /**
   * Mark single notification as read
   */
  public static async markAsRead(notificationId: Types.ObjectId, userId: Types.ObjectId) {
    const updated = await Notification.findOneAndUpdate(
      { _id: notificationId, recipientId: userId },
      { $set: { isRead: true, readAt: new Date() } },
      { new: true }
    );

    const unreadCount = await Notification.countDocuments({
      recipientId: userId,
      isRead: false,
    });

    try {
      const io = getIO();
      if (io) {
        io.to(`user:${userId}`).emit("notification:count", { unreadCount });
      }
    } catch (err) {
      // non-blocking
    }

    return { updated, unreadCount };
  }

  /**
   * Mark all notifications as read for user
   */
  public static async markAllAsRead(userId: Types.ObjectId) {
    await Notification.updateMany(
      { recipientId: userId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );

    try {
      const io = getIO();
      if (io) {
        io.to(`user:${userId}`).emit("notification:count", { unreadCount: 0 });
      }
    } catch (err) {
      // non-blocking
    }

    return { success: true, unreadCount: 0 };
  }

  /**
   * Process @mentions in comment discussions (like Instagram/Slack)
   */
  public static async handleCommentMentions(params: {
    commentId: Types.ObjectId;
    author: IUser;
    content: string;
    assignmentId: Types.ObjectId;
    classroomId: Types.ObjectId;
  }) {
    const { commentId, author, content, assignmentId, classroomId } = params;

    // Regex to match @username (letters, numbers, underscores, min 3 chars)
    const mentionMatches = content.match(/@([a-zA-Z0-9_]{3,30})/g);
    if (!mentionMatches || mentionMatches.length === 0) return;

    const uniqueUsernames = Array.from(
      new Set(mentionMatches.map((m) => m.slice(1).toLowerCase()))
    );

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return;

    const authorDisplayName = author.username
      ? `@${author.username}`
      : author.email.split("@")[0];

    const snippet =
      content.length > 80 ? `${content.slice(0, 80)}...` : content;

    for (const username of uniqueUsernames) {
      // Don't notify oneself if author tagged their own username
      if (author.username?.toLowerCase() === username) continue;

      const mentionedUser = await User.findOne({
        username: { $regex: new RegExp(`^${username}$`, "i") },
      });

      if (!mentionedUser) continue;

      // Verify mentioned user is part of the classroom or is the teacher
      const classroom = await Classroom.findById(classroomId);
      if (!classroom) continue;

      const isTeacher = classroom.teacherId.toString() === mentionedUser._id.toString();
      const isStudent = await Membership.exists({
        classroomId,
        studentId: mentionedUser._id,
      });

      if (!isTeacher && !isStudent) continue;

      await this.createAndDispatch({
        recipientId: mentionedUser._id,
        type: NotificationType.MENTION,
        title: `${authorDisplayName} mentioned you`,
        message: `"${snippet}" in ${assignment.title}`,
        link: `/dashboard/classrooms/${classroomId}?tab=discussions&assignmentId=${assignmentId}`,
        metadata: {
          assignmentId,
          classroomId,
          commentId,
          authorUsername: author.username,
          authorName: authorDisplayName,
          assignmentTitle: assignment.title,
        },
      });
    }
  }

  /**
   * Check for upcoming 4-hour deadlines & lock warnings
   */
  public static async checkUpcomingDeadlines() {
    try {
      const now = new Date();
      // Target window: Due date is within the next 4 hours (now to now + 4h)
      const fourHoursFromNow = new Date(now.getTime() + 4 * 60 * 60 * 1000);

      const upcomingAssignments = await Assignment.find({
        dueDate: { $gt: now, $lte: fourHoursFromNow },
        state: "PUBLISHED",
      });

      if (!upcomingAssignments || upcomingAssignments.length === 0) return;

      for (const assignment of upcomingAssignments) {
        const classroom = await Classroom.findById(assignment.classroomId);
        if (!classroom) continue;

        // 1. 👨‍🏫 TEACHER LOCK NOTIFICATION
        // Notify teacher that assignment will lock in 4h, with pre-formatted WhatsApp share text
        const teacherId = assignment.teacherId || classroom.teacherId;
        if (teacherId) {
          const alreadyNotifiedTeacher = await Notification.exists({
            recipientId: teacherId,
            type: NotificationType.DEADLINE_TEACHER,
            "metadata.assignmentId": assignment._id,
          });

          if (!alreadyNotifiedTeacher) {
            const dueDateFormatted = new Date(assignment.dueDate!).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            const whatsAppReminderText = encodeURIComponent(
              `🚨 *Assignment Deadline Alert!* 🚨\n\nCoursework: *${assignment.title}*\nClassroom: *${classroom.name}*\nDue: *Today at ${dueDateFormatted}* (Locks in 4 hours)\n\nPlease upload and submit your coursework on AssignFlow Hub before the submission window locks!`
            );

            await this.createAndDispatch({
              recipientId: teacherId,
              type: NotificationType.DEADLINE_TEACHER,
              title: "🔒 Assignment Locking in 4 Hours",
              message: `"${assignment.title}" locks in 4 hours. Tap to alert your students via WhatsApp or announcement.`,
              link: `/dashboard/classrooms/${classroom._id}?tab=assignments`,
              metadata: {
                assignmentId: assignment._id,
                classroomId: classroom._id,
                assignmentTitle: assignment.title,
                dueDate: assignment.dueDate,
                shareText: whatsAppReminderText,
              },
            });
          }
        }

        // 2. 🎓 STUDENT DEADLINE NOTIFICATION
        // Notify students who have NOT submitted yet
        const enrolledStudents = await Membership.find({
          classroomId: assignment.classroomId,
        });

        for (const membership of enrolledStudents) {
          const studentId = membership.studentId;

          // Check if student already submitted
          const hasSubmitted = await Submission.exists({
            assignmentId: assignment._id,
            studentId,
            state: { $in: [SubmissionState.SUBMITTED, SubmissionState.LOCKED] },
          });

          if (hasSubmitted) continue;

          // Check if already notified for this assignment
          const alreadyNotifiedStudent = await Notification.exists({
            recipientId: studentId,
            type: NotificationType.DEADLINE_STUDENT,
            "metadata.assignmentId": assignment._id,
          });

          if (!alreadyNotifiedStudent) {
            await this.createAndDispatch({
              recipientId: studentId,
              type: NotificationType.DEADLINE_STUDENT,
              title: "⏰ 4 Hours Left Before Deadline!",
              message: `"${assignment.title}" is due in less than 4 hours! Submit your coursework now to avoid lockout.`,
              link: `/dashboard/classrooms/${classroom._id}?tab=assignments&assignmentId=${assignment._id}`,
              metadata: {
                assignmentId: assignment._id,
                classroomId: classroom._id,
                assignmentTitle: assignment.title,
                dueDate: assignment.dueDate,
              },
            });
          }
        }
      }
    } catch (error) {
      console.error("[NotificationService] Deadline check sweep error:", error);
    }
  }
}
