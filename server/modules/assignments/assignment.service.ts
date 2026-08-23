import { Assignment, AssignmentState, AssignmentType } from "../../models/assignment.model";
import { Classroom } from "../../models/classroom.model";
import { Types } from "mongoose";
import { generateAssignmentUploadUrl } from "../../utils/s3";
import { Membership } from "../../models/membership.model";
import { Submission } from "../../models/submission.model";
import { logAuditEvent } from "../../utils/auditLogger";
import sanitizeHtml from "sanitize-html";
import { getIO } from "../../socket";

interface CreateAssignmentParams {
  teacherId: Types.ObjectId;
  classroomId: Types.ObjectId;
  title: string;
  description?: string;
  type: AssignmentType;
  dueDate?: Date;
  originalFileName: string;
  fileType: "PDF" | "DOCX" | "XLSX" | "PPTX";
  fileSize: number;
}


// Create assignment draft and generate S3 upload URL for the assignment file upload

export const createAssignmentDraft = async ({
  teacherId,
  classroomId,
  title,
  description,
  type,
  dueDate,
  originalFileName,
  fileType,
  fileSize,
}: CreateAssignmentParams) => {
  // 0. Sanitize user input (WRITE-time protection)
  const cleanTitle = sanitizeHtml(title, {
    allowedTags: [],
    allowedAttributes: {},
  });

  const cleanDescription = description
    ? sanitizeHtml(description, {
      allowedTags: [],
      allowedAttributes: {},
    })
    : undefined;
  // 1. Verify classroom ownership
  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new Error("Classroom not found");
  }

  if (!classroom.teacherId.equals(teacherId)) {
    throw new Error("Not authorized to create assignment in this classroom");
  }

  // 2. Create assignment in DRAFT
  const assignment = await Assignment.create({
    classroomId,
    teacherId,
    title: cleanTitle,
    description: cleanDescription,
    type,
    dueDate,
    state: AssignmentState.DRAFT,
    fileKey: "PENDING",
    fileType,
    fileSize,
    readBy: [teacherId],
  });

  // 3. Generate S3 upload URL
  const { uploadUrl, fileKey } = await generateAssignmentUploadUrl({
    classroomId: classroomId.toString(),
    assignmentId: assignment._id.toString(),
    originalFileName,
    fileType,
  });

  // 4. Update assignment with real fileKey
  assignment.fileKey = fileKey;
  await assignment.save();

  return {
    assignmentId: assignment._id,
    uploadUrl,
    fileKey,
  };
};


// Publish an assignment (change state from DRAFT to PUBLISHED)

export const publishAssignment = async (
  assignmentId: Types.ObjectId,
  teacherId: Types.ObjectId
) => {
  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  if (!assignment.teacherId.equals(teacherId)) {
    throw new Error("Not authorized to publish this assignment");
  }

  if (assignment.state !== AssignmentState.DRAFT) {
    throw new Error("Assignment is already published");
  }

  assignment.state = AssignmentState.PUBLISHED;
  if (!assignment.readBy) {
    assignment.readBy = [teacherId];
  } else if (!assignment.readBy.some((id) => id.equals(teacherId))) {
    assignment.readBy.push(teacherId);
  }

  await assignment.save();

  // ⚡ Live WebSocket Broadcast to Classroom and Students
  try {
    const io = getIO();
    if (io) {
      const payload = {
        assignmentId: assignment._id.toString(),
        classroomId: assignment.classroomId.toString(),
        title: assignment.title,
        type: assignment.type,
        dueDate: assignment.dueDate,
        createdAt: assignment.createdAt,
      };

      // Broadcast to classroom room
      io.to(`classroom:${assignment.classroomId}`).emit("assignment:new", payload);

      // Notify all enrolled student member rooms directly
      const memberships = await Membership.find({
        classroomId: assignment.classroomId,
      }).select("studentId");

      memberships.forEach((m) => {
        io.to(`user:${m.studentId}`).emit("assignment:new", payload);
      });
    }
  } catch (socketErr) {
    console.error("Socket emit error on publish assignment:", socketErr);
  }

  return assignment;
};

/**
 * Mark all published assignments in a classroom as read for a student
 */
export const markClassroomAssignmentsAsRead = async (
  classroomId: Types.ObjectId,
  studentId: Types.ObjectId
) => {
  await Assignment.updateMany(
    {
      classroomId,
      state: AssignmentState.PUBLISHED,
      readBy: { $ne: studentId },
    },
    {
      $addToSet: { readBy: studentId },
    }
  );

  // Notify socket client of read state update
  try {
    const io = getIO();
    if (io) {
      io.to(`user:${studentId}`).emit("assignment:read", {
        classroomId: classroomId.toString(),
      });
    }
  } catch (socketErr) {
    console.error("Socket emit error on mark read:", socketErr);
  }

  return { success: true, classroomId: classroomId.toString() };
};

/**
 * Get total unread assignments count & per-classroom breakdown for a student
 */
export const getStudentUnreadAssignments = async (studentId: Types.ObjectId) => {
  const memberships = await Membership.find({ studentId }).select("classroomId");
  const classroomIds = memberships.map((m) => m.classroomId);

  if (classroomIds.length === 0) {
    return {
      totalUnread: 0,
      classroomUnread: {} as Record<string, number>,
    };
  }

  const unreadAggregation = await Assignment.aggregate([
    {
      $match: {
        classroomId: { $in: classroomIds },
        state: AssignmentState.PUBLISHED,
        readBy: { $ne: studentId },
      },
    },
    {
      $group: {
        _id: "$classroomId",
        count: { $sum: 1 },
      },
    },
  ]);

  const classroomUnread: Record<string, number> = {};
  let totalUnread = 0;

  unreadAggregation.forEach((item) => {
    const cid = item._id.toString();
    classroomUnread[cid] = item.count;
    totalUnread += item.count;
  });

  return {
    totalUnread,
    classroomUnread,
  };
};




// Get assignments for a classroom based on user role (TEACHER or STUDENT)


export const getAssignmentsForClassroom = async (
  classroomId: Types.ObjectId,
  userId: Types.ObjectId,
  role: "TEACHER" | "STUDENT"
) => {
  // Verify classroom exists
  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new Error("Classroom not found");
  }

  // Teacher: must own classroom
  if (role === "TEACHER") {
    if (!classroom.teacherId.equals(userId)) {
      throw new Error("Access denied");
    }

    return Assignment.find({
      classroomId,
      teacherId: userId,
    }).sort({ createdAt: -1 });
  }

  // Student: must be member + see only PUBLISHED
  // Student: must be member + see only PUBLISHED
  if (role === "STUDENT") {
    const membership = await Membership.findOne({
      studentId: userId,
      classroomId,
    });

    if (!membership) {
      throw new Error("Access denied");
    }

    const assignments = await Assignment.find({
      classroomId,
      state: AssignmentState.PUBLISHED,
    }).sort({ createdAt: -1 });

    const assignmentsWithSubmission = await Promise.all(
      assignments.map(async (assignment) => {
        const submission = await Submission.findOne({
          assignmentId: assignment._id,
          studentId: userId,
        }).select("_id state");

        return {
          assignment,
          submission: submission
            ? {
              id: submission._id,
              state: submission.state,
            }
            : null,
        };
      })
    );

    return assignmentsWithSubmission;
  }
  throw new Error("Access denied");
};