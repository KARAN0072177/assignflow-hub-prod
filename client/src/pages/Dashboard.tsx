import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedRole = localStorage.getItem("userRole");

    // Basic auth check
    if (!token || !storedRole) {
      navigate("/login");
      return;
    }

    setRole(storedRole);
  }, [navigate]);

  if (!role) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h1>Dashboard</h1>

      <p>
        Hello 👋 <br />
        You are logged in as:{" "}
        <strong>{role}</strong>
      </p>

      {/* Temporary links for testing */}
      <div style={{ marginTop: 20 }}>
        {role === "TEACHER" && (
          <>
            <p>Teacher actions:</p>
            <ul>
              <li onClick={() => navigate("/classrooms/create")}>
                Create Classroom
              </li>
              <li onClick={() => navigate("/classrooms/my")}>
                My Classrooms
              </li>
            </ul>
          </>
        )}

        {role === "STUDENT" && (
          <>
            <p>Student actions:</p>
            <ul>
              <li onClick={() => navigate("/classrooms/join")}>
                Join Classroom
              </li>
              <li onClick={() => navigate("/classrooms/my")}>
                My Classrooms
              </li>
              <li onClick={() => navigate("/grades")}>
                My Grades
              </li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;