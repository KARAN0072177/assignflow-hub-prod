import { Classroom, ClassroomStatus } from "../../models/classroom.model";
import { Types } from "mongoose";
import { Membership } from "../../models/membership.model";
import { Assignment, AssignmentState } from "../../models/assignment.model";
import { User, UserRole } from "../../models/user.model";
import sanitizeHtml from "sanitize-html";
import { generateDownloadUrl } from "../../utils/s3-download";

const generateJoinCode = (): string => {
  const letters = Math.random().toString(36).substring(2, 6).toUpperCase();
  const numbers = Math.floor(1000 + Math.random() * 9000);
  return `${letters}-${numbers}`;
};


// Create a new classroom by a teacher

export const createClassroom = async (
  teacherId: Types.ObjectId,
  name: string,
  description?: string
) => {
  // 0. Sanitize user input (WRITE-time protection)
  const cleanName = sanitizeHtml(name.trim(), {
    allowedTags: [],
    allowedAttributes: {},
  });

  const cleanDescription = description
    ? sanitizeHtml(description.trim(), {
        allowedTags: [],
        allowedAttributes: {},
      })
    : undefined;

  // Optional but recommended: basic validation
  if (!cleanName) {
    throw new Error("Classroom name is required");
  }

  let code = "";
  let exists = true;

  while (exists) {
    code = generateJoinCode();
    exists = !!(await Classroom.findOne({ code }));
  }

  const classroom = await Classroom.create({
    name: cleanName,
    description: cleanDescription,
    code,
    teacherId,
    status: ClassroomStatus.ACTIVE,
  });

  return classroom;
};


// Student joins a classroom using join code

export const joinClassroomByCode = async (
  studentId: Types.ObjectId,
  code: string
) => {
  const classroom = await Classroom.findOne({ code, status: "ACTIVE" });
  if (!classroom) {
    throw new Error("Invalid classroom code");
  }

  // Membership creation (unique index prevents duplicates)
  const membership = await Membership.create({
    studentId,
    classroomId: classroom._id,
  });

  return {
    classroomId: classroom._id,
    name: classroom.name,
  };
};

// Get all classrooms a student is enrolled in
export const getStudentClassrooms = async (studentId: Types.ObjectId) => {
  const memberships = await Membership.find({ studentId }).select(
    "classroomId"
  );

  const classroomIds = memberships.map((m) => m.classroomId);

  const classrooms = await Classroom.find({
    _id: { $in: classroomIds },
    status: ClassroomStatus.ACTIVE,
  })
    .select("name description code createdAt")
    .sort({ createdAt: -1 })
    .lean();

  if (classrooms.length === 0) {
    return [];
  }

  // Count memberships for each classroom
  const counts = await Membership.aggregate([
    { $match: { classroomId: { $in: classroomIds } } },
    { $group: { _id: "$classroomId", count: { $sum: 1 } } },
  ]);

  const countMap = new Map<string, number>();
  counts.forEach((c) => countMap.set(c._id.toString(), c.count));

  // Count unread published assignments for this student in each classroom
  const unreadCounts = await Assignment.aggregate([
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
        unreadCount: { $sum: 1 },
      },
    },
  ]);

  const unreadMap = new Map<string, number>();
  unreadCounts.forEach((u) => unreadMap.set(u._id.toString(), u.unreadCount));

  return classrooms.map((c) => ({
    id: c._id.toString(),
    name: c.name,
    description: c.description || "",
    code: c.code,
    createdAt: c.createdAt,
    studentCount: countMap.get(c._id.toString()) || 0,
    unreadAssignmentsCount: unreadMap.get(c._id.toString()) || 0,
  }));
};

// Get all classrooms created by a teacher
export const getTeacherClassrooms = async (teacherId: Types.ObjectId) => {
  const classrooms = await Classroom.find({
    teacherId,
    status: ClassroomStatus.ACTIVE,
  })
    .select("name description code createdAt")
    .sort({ createdAt: -1 })
    .lean();

  if (classrooms.length === 0) {
    return [];
  }

  const classroomIds = classrooms.map((c) => c._id);

  // Count memberships for each classroom
  const counts = await Membership.aggregate([
    { $match: { classroomId: { $in: classroomIds } } },
    { $group: { _id: "$classroomId", count: { $sum: 1 } } },
  ]);

  const countMap = new Map<string, number>();
  counts.forEach((c) => countMap.set(c._id.toString(), c.count));

  return classrooms.map((c) => ({
    id: c._id.toString(),
    name: c.name,
    description: c.description || "",
    code: c.code,
    createdAt: c.createdAt,
    studentCount: countMap.get(c._id.toString()) || 0,
  }));
};

// Get classroom by ID with access check for student or teacher roles
export const getClassroomByIdWithAccessCheck = async (
  classroomId: Types.ObjectId,
  userId: Types.ObjectId,
  role: "STUDENT" | "TEACHER"
) => {
  const classroom = await Classroom.findById(classroomId).select(
    "name description code teacherId status createdAt"
  );

  if (!classroom || classroom.status !== "ACTIVE") {
    throw new Error("Classroom not found");
  }

  // Teacher access: must own the classroom
  if (role === "TEACHER") {
    if (!classroom.teacherId.equals(userId)) {
      throw new Error("Access denied");
    }
    return classroom;
  }

  // Student access: must have membership
  if (role === "STUDENT") {
    const membership = await Membership.findOne({
      studentId: userId,
      classroomId: classroom._id,
    });

    if (!membership) {
      throw new Error("Access denied");
    }

    return classroom;
  }

  throw new Error("Access denied");
};

/**
 * Get all classrooms created by a teacher along with enrolled students
 */
export const getTeacherClassroomsWithStudents = async (
  teacherId: Types.ObjectId
) => {
  // 1. Find all active classrooms created by this teacher
  const classrooms = await Classroom.find({
    teacherId,
    status: ClassroomStatus.ACTIVE,
  })
    .sort({ createdAt: -1 })
    .lean();

  if (classrooms.length === 0) {
    return [];
  }

  const classroomIds = classrooms.map((c) => c._id);

  // 2. Find all memberships for these classrooms and populate student details
  const memberships = await Membership.find({
    classroomId: { $in: classroomIds },
  })
    .populate<{
      studentId: {
        _id: Types.ObjectId;
        email: string;
        username?: string;
        avatarKey?: string;
        createdAt: Date;
      };
    }>("studentId", "email username avatarKey createdAt")
    .sort({ createdAt: -1 })
    .lean();

  // 3. Map students to their respective classroom
  const result = await Promise.all(
    classrooms.map(async (classroom) => {
      const classMemberships = memberships.filter((m) =>
        m.classroomId.equals(classroom._id)
      );

      const students = await Promise.all(
        classMemberships
          .filter((m) => m.studentId)
          .map(async (m) => {
            let avatarUrl: string | null = null;
            if ((m.studentId as any).avatarKey) {
              try {
                avatarUrl = await generateDownloadUrl((m.studentId as any).avatarKey);
              } catch (err) {
                console.warn("Failed to generate avatar url for classroom student:", err);
              }
            }

            return {
              id: m.studentId._id.toString(),
              email: m.studentId.email,
              username: (m.studentId as any).username || null,
              avatarUrl,
              joinedAt: m.createdAt,
            };
          })
      );

      return {
        id: classroom._id.toString(),
        name: classroom.name,
        description: classroom.description || "",
        code: classroom.code,
        createdAt: classroom.createdAt,
        studentCount: students.length,
        students,
      };
    })
  );

  return result;
};

/**
 * Get all members of a specific classroom (Teacher + Enrolled Students)
 */
export const getClassroomMembers = async (
  classroomId: Types.ObjectId,
  userId: Types.ObjectId,
  role: "STUDENT" | "TEACHER"
) => {
  const classroom = await Classroom.findById(classroomId);
  if (!classroom || classroom.status !== ClassroomStatus.ACTIVE) {
    throw new Error("Classroom not found");
  }

  // Access check
  if (role === "TEACHER") {
    if (!classroom.teacherId.equals(userId)) {
      const isMember = await Membership.findOne({ classroomId, studentId: userId });
      if (!isMember) throw new Error("Access denied");
    }
  } else {
    const isMember = await Membership.findOne({ classroomId, studentId: userId });
    if (!isMember) throw new Error("Access denied");
  }

  // Fetch teacher details
  const teacher = await User.findById(classroom.teacherId)
    .select("_id email username avatarKey role")
    .lean();

  let teacherAvatarUrl: string | null = null;
  if (teacher?.avatarKey) {
    try {
      teacherAvatarUrl = await generateDownloadUrl(teacher.avatarKey);
    } catch {}
  }

  const teacherMember = teacher
    ? {
        id: teacher._id.toString(),
        email: teacher.email,
        username:
          teacher.username ||
          teacher.email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_"),
        displayName: teacher.username ? `@${teacher.username}` : teacher.email.split("@")[0],
        role: "TEACHER" as const,
        avatarUrl: teacherAvatarUrl,
      }
    : null;

  // Fetch enrolled students
  const memberships = await Membership.find({ classroomId })
    .populate<{
      studentId: {
        _id: Types.ObjectId;
        email: string;
        username?: string;
        avatarKey?: string;
        role: UserRole;
      };
    }>("studentId", "_id email username avatarKey role")
    .lean();

  const studentMembers = await Promise.all(
    memberships
      .filter((m) => m.studentId)
      .map(async (m) => {
        const s = m.studentId;
        let avatarUrl: string | null = null;
        if (s.avatarKey) {
          try {
            avatarUrl = await generateDownloadUrl(s.avatarKey);
          } catch {}
        }
        return {
          id: s._id.toString(),
          email: s.email,
          username:
            s.username ||
            s.email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_"),
          displayName: s.username ? `@${s.username}` : s.email.split("@")[0],
          role: "STUDENT" as const,
          avatarUrl,
        };
      })
  );

  return teacherMember ? [teacherMember, ...studentMembers] : studentMembers;
};