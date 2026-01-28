import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CreateAssignmentForm from "../components/CreateAssignmentForm";
import SubmissionBox from "../components/SubmissionBox";
import TeacherSubmissions from "../components/TeacherSubmissions";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface Classroom {
  id: string;
  name: string;
  description?: string;
}

interface Assignment {
  id: string;
  title: string;
  description?: string;
  type: "GRADED" | "MATERIAL";
  state: "DRAFT" | "PUBLISHED";
  dueDate?: string;
  submission: {
    id: string;
    state: "DRAFT" | "SUBMITTED" | "LOCKED";
  } | null;
}

const ClassroomDetail = () => {
  const { id } = useParams<{ id: string }>();

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const role = localStorage.getItem("userRole");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        // 1. Fetch classroom details
        const classroomRes = await axios.get(
          `${API_BASE_URL}/api/classrooms/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setClassroom(classroomRes.data);

        // 2. Fetch assignments
        const assignmentsRes = await axios.get(
          `${API_BASE_URL}/api/classrooms/${id}/assignments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAssignments(assignmentsRes.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
          "Failed to load classroom details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) return <p>Loading classroom...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!classroom) return null;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2>{classroom.name}</h2>

      {classroom.description && (
        <p style={{ color: "#555" }}>{classroom.description}</p>
      )}

      <hr style={{ margin: "24px 0" }} />

      <section>
        <h3>Assignments</h3>

        {/* Teacher-only: Create assignment */}
        {role === "TEACHER" && (
          <CreateAssignmentForm
            classroomId={id!}
            onCreated={() => window.location.reload()}
          />
        )}

        {assignments.length === 0 ? (
          <p style={{ color: "#777" }}>
            No assignments have been posted yet.
          </p>
        ) : (
          <ul>
            {assignments.map((a) => (
              <li key={a.id} style={{ marginBottom: 16 }}>
                <strong>{a.title}</strong>

                {a.description && <p>{a.description}</p>}

                <p style={{ fontSize: 14, color: "#666" }}>
                  Type: {a.type} | Status: {a.state}
                  {a.dueDate && (
                    <> | Due: {new Date(a.dueDate).toLocaleDateString()}</>
                  )}
                </p>

                {/* 👩‍🎓 STUDENT */}
                {role === "STUDENT" &&
                  a.type === "GRADED" &&
                  a.state === "PUBLISHED" && (
                    <>
                      {/* No submission yet */}
                      {a.submission === null && (
                        <SubmissionBox assignmentId={a.id} />
                      )}

                      {/* Draft exists */}
                      {a.submission?.state === "DRAFT" && (
                        <SubmissionBox assignmentId={a.id} />
                      )}

                      {/* Submitted */}
                      {a.submission?.state === "SUBMITTED" && (
                        <p style={{ color: "green" }}>
                          Assignment submitted successfully.
                        </p>
                      )}

                      {/* Locked */}
                      {a.submission?.state === "LOCKED" && (
                        <p style={{ color: "red" }}>
                          Submission locked (deadline passed).
                        </p>
                      )}
                    </>
                  )}

                {/* 👨‍🏫 TEACHER */}
                {role === "TEACHER" && a.type === "GRADED" && (
                  <TeacherSubmissions assignmentId={a.id} />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ClassroomDetail;