import { useState } from "react";
import {
  createOrUpdateDraftSubmission,
  submitSubmission,
} from "../services/submission.api";

interface Props {
  assignmentId: string;
}

const SubmissionBox = ({ assignmentId }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [state, setState] = useState<"DRAFT" | "SUBMITTED" | "LOCKED">("DRAFT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDraftUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError(null);

      const result = await createOrUpdateDraftSubmission(assignmentId, file);
      setSubmissionId(result.submissionId);
      setState("DRAFT");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!submissionId) return;

    try {
      setLoading(true);
      setError(null);

      await submitSubmission(submissionId);
      setState("SUBMITTED");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Submit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, marginTop: 8 }}>
      <strong>Submission</strong>

      <p>Status: {state}</p>

      {state === "DRAFT" && (
        <>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <button onClick={handleDraftUpload} disabled={loading}>
            Upload / Replace Draft
          </button>

          {submissionId && (
            <button onClick={handleSubmit} disabled={loading}>
              Submit Final
            </button>
          )}
        </>
      )}

      {state === "SUBMITTED" && (
        <p style={{ color: "green" }}>
          Submission submitted successfully.
        </p>
      )}

      {state === "LOCKED" && (
        <p style={{ color: "red" }}>
          Submission is locked (deadline passed).
        </p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default SubmissionBox;