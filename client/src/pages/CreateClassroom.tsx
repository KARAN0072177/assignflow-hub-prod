import { useState } from "react";
import { createClassroom } from "../services/classroom.api";

const CreateClassroom = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{
    code: string;
    name: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCreated(null);

    try {
      setLoading(true);
      const result = await createClassroom({
        name,
        description: description || undefined,
      });

      setCreated({
        name: result.name,
        code: result.code,
      });

      setName("");
      setDescription("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create classroom");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <h2>Create Classroom</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Classroom Name</label>
          <input
            type="text"
            value={name}
            required
            minLength={2}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Classroom"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {created && (
        <div style={{ marginTop: 20 }}>
          <h3>Classroom Created 🎉</h3>
          <p>
            <strong>{created.name}</strong>
          </p>
          <p>
            Join Code: <strong>{created.code}</strong>
          </p>
          <p>
            Share this code with students to let them join.
          </p>
        </div>
      )}
    </div>
  );
};

export default CreateClassroom;