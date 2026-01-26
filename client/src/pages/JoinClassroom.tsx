import { useState } from "react";
import { joinClassroom } from "../services/classroom.api";

const JoinClassroom = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState<{
    name: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setJoined(null);

    try {
      setLoading(true);
      const result = await joinClassroom(code.trim().toUpperCase());
      setJoined({ name: result.classroom.name });
      setCode("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to join classroom");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Join Classroom</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Classroom Code</label>
          <input
            type="text"
            value={code}
            required
            placeholder="ABC-1234"
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Joining..." : "Join Classroom"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {joined && (
        <div style={{ marginTop: 20 }}>
          <h3>Joined Successfully 🎉</h3>
          <p>
            You have joined: <strong>{joined.name}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default JoinClassroom;