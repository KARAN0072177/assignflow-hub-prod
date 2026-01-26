import { useState } from "react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface Props {
  classroomId: string;
  onCreated: () => void;
}

const CreateAssignmentForm = ({ classroomId, onCreated }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"GRADED" | "MATERIAL">("GRADED");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const token = localStorage.getItem("authToken");

      // 1. Create assignment draft
      const createRes = await axios.post(
        `${API_BASE_URL}/api/assignments`,
        {
          classroomId,
          title,
          description,
          type,
          dueDate: dueDate || undefined,
          originalFileName: file.name,
          fileType: file.name.endsWith(".pdf") ? "PDF" : "DOCX",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { assignmentId, uploadUrl } = createRes.data;

      // 2. Upload file to S3
      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      // 3. Publish assignment
      await axios.patch(
        `${API_BASE_URL}/api/assignments/${assignmentId}/publish`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // reset
      setTitle("");
      setDescription("");
      setDueDate("");
      setFile(null);

      onCreated();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <h4>Create Assignment</h4>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select value={type} onChange={(e) => setType(e.target.value as any)}>
        <option value="GRADED">Graded</option>
        <option value="MATERIAL">Material</option>
      </select>

      {type === "GRADED" && (
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      )}

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button onClick={handleCreate} disabled={loading}>
        {loading ? "Creating..." : "Create & Publish"}
      </button>
    </div>
  );
};

export default CreateAssignmentForm;