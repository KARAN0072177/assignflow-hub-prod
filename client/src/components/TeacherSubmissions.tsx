import { useEffect, useState } from "react";
import { getSubmissionsForAssignment } from "../services/submission.api";
import { saveGrade, publishGrade } from "../services/grade.api";

/* =======================
   Types
   ======================= */

interface Submission {
  id: string;
  student: {
    id: string;
    email: string;
  };
  state: "DRAFT" | "SUBMITTED" | "LOCKED";
  submittedAt: string;
  downloadUrl?: string | null;
  grade?: {
    id: string;
    score: number;
    feedback?: string;
    published: boolean;
  };
}

/* =======================
   Main Component
   ======================= */

const TeacherSubmissions = ({ assignmentId }: { assignmentId: string }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await getSubmissionsForAssignment(assignmentId);
      setSubmissions(data);
    } catch (err) {
      setError("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  if (loading) return <p>Loading submissions...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ marginTop: 16 }}>
      <h4>Student Submissions</h4>

      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        submissions.map((s) => (
          <SubmissionRow
            key={s.id}
            submission={s}
            onUpdated={fetchSubmissions}
          />
        ))
      )}
    </div>
  );
};

export default TeacherSubmissions;

/* =======================
   Submission Row
   ======================= */

const SubmissionRow = ({
  submission,
  onUpdated,
}: {
  submission: Submission;
  onUpdated: () => void;
}) => {
  const [score, setScore] = useState<number | "">(
    submission.grade?.score ?? ""
  );
  const [feedback, setFeedback] = useState(
    submission.grade?.feedback ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleSave = async () => {
    if (score === "") {
      setError("Score is required");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await saveGrade(
        submission.id,
        Number(score),
        feedback || undefined
      );

      onUpdated();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save grade");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!submission.grade?.id) return;

    try {
      setSaving(true);
      setError(null);

      await publishGrade(submission.grade.id);
      onUpdated();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to publish grade");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: 12,
        marginBottom: 12,
      }}
    >
      <p>
        <strong>{submission.student.email}</strong> —{" "}
        <strong>{submission.state}</strong>
      </p>

      {submission.downloadUrl && (
        <p>
          <a
            href={submission.downloadUrl}
            target="_blank"
            rel="noreferrer"
          >
            Download Submission
          </a>
        </p>
      )}

      {/* 🟡 No grade yet */}
      {!submission.grade && (
        <>
          <input
            type="number"
            placeholder="Score"
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
          />

          <textarea
            placeholder="Feedback (optional)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />

          <button onClick={handleSave} disabled={saving}>
            Save Grade
          </button>
        </>
      )}

      {/* 🔵 Grade exists but NOT published */}
      {submission.grade && !submission.grade.published && (
        <>
          <input
            type="number"
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
          />

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />

          <button onClick={handleSave} disabled={saving}>
            Save Changes
          </button>

          <button onClick={handlePublish} disabled={saving}>
            Publish Grade
          </button>
        </>
      )}

      {/* 🟢 Grade published */}
      {submission.grade && submission.grade.published && (
        <>
          <p style={{ color: "green" }}>
            Graded on{" "}
            {new Date(submission.submittedAt).toLocaleDateString()}
          </p>

          <p>
            <strong>Score:</strong> {submission.grade.score}
          </p>

          {submission.grade.feedback && (
            <p>
              <strong>Feedback:</strong> {submission.grade.feedback}
            </p>
          )}
        </>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};