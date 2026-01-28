import { useEffect, useState } from "react";
import { getAuditLogs, type AuditLog } from "../services/auditLog.api";

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getAuditLogs();
        setLogs(data);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return <p>Loading audit logs...</p>;

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Audit Logs</h2>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-left">Actor</th>
              <th className="px-4 py-2 text-left">Action</th>
              <th className="px-4 py-2 text-left">Entity</th>
              <th className="px-4 py-2 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-t">
                <td className="px-4 py-2">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2">{log.actorRole}</td>
                <td className="px-4 py-2">{log.action}</td>
                <td className="px-4 py-2">
                  {log.entityType}
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {log.metadata
                    ? JSON.stringify(log.metadata)
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAuditLogs;