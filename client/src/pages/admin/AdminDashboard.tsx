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
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      {/* USERS */}
      <Section title="Users">
        <MetricCard title="Total Users" value={data.users.total} />
        <MetricCard title="New (24h)" value={data.users.last24h} />
        <MetricCard title="New (7d)" value={data.users.last7d} />
        <MetricCard title="Students" value={data.users.students} />
        <MetricCard title="Teachers" value={data.users.teachers} />
      </Section>

      {/* CLASSROOMS */}
      <Section title="Classrooms">
        <MetricCard title="Total" value={data.classrooms.total} />
        <MetricCard title="Created (7d)" value={data.classrooms.last7d} />
      </Section>

      {/* ENROLLMENTS */}
      <Section title="Enrollments">
        <MetricCard title="Total" value={data.enrollments.total} />
        <MetricCard title="New (7d)" value={data.enrollments.last7d} />
      </Section>

      {/* ASSIGNMENTS */}
      <Section title="Assignments">
        <MetricCard title="Total" value={data.assignments.total} />
        <MetricCard title="Created (7d)" value={data.assignments.last7d} />
      </Section>

      {/* SUBMISSIONS */}
      <Section title="Submissions">
        <MetricCard title="Total" value={data.submissions.total} />
        <MetricCard title="Last 24h" value={data.submissions.last24h} />
        <MetricCard title="Last 7d" value={data.submissions.last7d} />
        <MetricCard title="Draft" value={data.submissions.draft} />
        <MetricCard title="Submitted" value={data.submissions.submitted} />
        <MetricCard title="Locked" value={data.submissions.locked} />
      </Section>

      {/* GRADES */}
      <Section title="Grades">
        <MetricCard title="Total Grades" value={data.grades.total} />
        <MetricCard title="Published" value={data.grades.published} />
        <MetricCard
          title="Published (7d)"
          value={data.grades.publishedLast7d}
        />
      </Section>

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

      {/* HEALTH RATIOS */}
      <section>
        <h2 className="font-medium mb-2">System Health</h2>
        <div className="grid grid-cols-3 gap-4">
          <MetricCard
            title="Submission Completion Rate"
            value={`${Math.round(
              data.health.submissionCompletionRate * 100
            )}%`}
          />
          <MetricCard
            title="Deadline Miss Rate"
            value={`${Math.round(
              data.health.deadlineMissRate * 100
            )}%`}
          />
          <MetricCard
            title="Grading Completion Rate"
            value={`${Math.round(
              data.health.gradingCompletionRate * 100
            )}%`}
          />
        </div>
      </section>

      {/* ALERTS */}
      <section>
        <h2 className="font-medium mb-2">System Alerts</h2>

        {data.alerts.length === 0 ? (
          <p className="text-sm text-green-600">
            ✅ No critical system alerts
          </p>
        ) : (
          <ul className="list-disc pl-6 text-sm text-red-600">
            {data.alerts.map((alert: string, index: number) => (
              <li key={index}>{alert}</li>
            ))}
          </ul>
        )}
      </section>

      {/* FUTURE */}
      <section className="opacity-60">
        <h2 className="font-medium mb-2">Future Scope</h2>
        <p className="text-sm">
          📈 System growth over time (time-series analytics)
        </p>
      </section>
    </div>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section>
    <h2 className="font-medium mb-3">{title}</h2>
    <div className="grid grid-cols-3 gap-4">{children}</div>
  </section>
);

const MetricCard = ({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) => (
  <div className="bg-white p-4 rounded shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-xl font-semibold">{value}</p>
  </div>
);

export default AdminDashboard;