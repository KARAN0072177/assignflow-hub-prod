import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface Classroom {
  id: string;
  name: string;
  description?: string;
}

const ClassroomDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const response = await axios.get(
          `${API_BASE_URL}/api/classrooms/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setClassroom(response.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message || "Failed to load classroom"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClassroom();
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
        <p style={{ color: "#777" }}>
          No assignments have been posted yet.
        </p>
      </section>
    </div>
  );
};

export default ClassroomDetail;