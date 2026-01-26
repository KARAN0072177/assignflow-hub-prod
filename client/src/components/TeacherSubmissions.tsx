import { useEffect, useState } from "react";
import { getSubmissionsForAssignment } from "../services/submission.api";

const TeacherSubmissions = ({ assignmentId }: { assignmentId: string }) => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await getSubmissionsForAssignment(assignmentId);
      setSubmissions(data);
      setLoading(false);
    };

    fetch();
  }, [assignmentId]);

  if (loading) return <p>Loading submissions...</p>;

  return (
    <div style={{ marginTop: 8 }}>
      <strong>Student Submissions</strong>

      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <ul>
          {submissions.map((s) => (
            <li key={s.id} style={{ marginBottom: 8 }}>
              <p>
                {s.student.email} — <strong>{s.state}</strong>
              </p>

              {s.downloadUrl && (
                <a href={s.downloadUrl} target="_blank" rel="noreferrer">
                  Download
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TeacherSubmissions;