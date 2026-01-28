import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const AdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const token = localStorage.getItem("authToken");

      const res = await axios.get(
        `${API_BASE_URL}/api/admin/analytics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data);
      setLoading(false);
    };

    fetchAnalytics();
  }, []);

  if (loading) return <p>Loading admin dashboard...</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      {/* USERS */}
      <section>
        <h2 className="font-medium mb-2">Users</h2>
        <div className="grid grid-cols-3 gap-4">
          <MetricCard title="Total Users" value={data.users.total} />
          <MetricCard title="Students" value={data.users.students} />
          <MetricCard title="Teachers" value={data.users.teachers} />
        </div>
      </section>

      {/* CLASSROOMS */}
      <section>
        <h2 className="font-medium mb-2">Classrooms</h2>
        <MetricCard
          title="Total Classrooms"
          value={data.classrooms.total}
        />
      </section>

      {/* ENROLLMENTS */}
      <section>
        <h2 className="font-medium mb-2">Enrollments</h2>
        <MetricCard
          title="Student-Classroom Joins"
          value={data.enrollments.total}
        />
      </section>

      {/* ASSIGNMENTS */}
      <section>
        <h2 className="font-medium mb-2">Assignments</h2>
        <MetricCard
          title="Total Assignments"
          value={data.assignments.total}
        />
      </section>

      {/* SUBMISSIONS */}
      <section>
        <h2 className="font-medium mb-2">Submissions</h2>
        <div className="grid grid-cols-4 gap-4">
          <MetricCard title="Total" value={data.submissions.total} />
          <MetricCard title="Draft" value={data.submissions.draft} />
          <MetricCard
            title="Submitted"
            value={data.submissions.submitted}
          />
          <MetricCard title="Locked" value={data.submissions.locked} />
        </div>
      </section>

      {/* GRADES */}
      <section>
        <h2 className="font-medium mb-2">Grades</h2>
        <div className="grid grid-cols-2 gap-4">
          <MetricCard title="Total Grades" value={data.grades.total} />
          <MetricCard
            title="Published Grades"
            value={data.grades.published}
          />
        </div>
      </section>

      {/* BACKGROUND JOB */}
      <section>
        <h2 className="font-medium mb-2">Background Jobs</h2>
        <p className="text-sm text-gray-600">
          Last auto-lock run:{" "}
          {data.backgroundJobs.autoLock.lastRunAt
            ? new Date(
                data.backgroundJobs.autoLock.lastRunAt
              ).toLocaleString()
            : "Never"}
        </p>
      </section>

      {/* FUTURE */}
      <section className="opacity-60">
        <h2 className="font-medium mb-2">Future Scope</h2>
        <p className="text-sm">
          📈 System growth over time (planned)
        </p>
      </section>
    </div>
  );
};

const MetricCard = ({
  title,
  value,
}: {
  title: string;
  value: number;
}) => (
  <div className="bg-white p-4 rounded shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-xl font-semibold">{value}</p>
  </div>
);

export default AdminDashboard;