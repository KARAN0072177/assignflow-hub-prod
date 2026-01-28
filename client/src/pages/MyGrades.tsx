import { useEffect, useState } from "react";
import { getMyGrades, type StudentGrade } from "../services/grade.api";

const MyGrades = () => {
  const [grades, setGrades] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await getMyGrades();
        setGrades(data);
      } catch (err: any) {
        setError("Failed to load grades");
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  if (loading) return <p>Loading grades...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2>My Grades</h2>

      {grades.length === 0 ? (
        <p>No grades have been published yet.</p>
      ) : (
        <ul>
          {grades.map((g) => (
            <li
              key={g.assignment.id}
              style={{
                borderBottom: "1px solid #ddd",
                paddingBottom: 12,
                marginBottom: 12,
              }}
            >
              <strong>{g.assignment.title}</strong>

              <p>
                Score: <strong>{g.score}</strong>
              </p>

              {g.feedback && (
                <p style={{ color: "#555" }}>
                  Feedback: {g.feedback}
                </p>
              )}

              <p style={{ fontSize: 12, color: "#777" }}>
                Published on{" "}
                {new Date(g.gradedAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyGrades;