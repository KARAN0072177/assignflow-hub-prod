import { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckCircle,
  AlertTriangle,
  Info,
  Database,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const AdminSystem = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSystem = async () => {
      const token = localStorage.getItem("authToken");

      const res = await axios.get(
        `${API_BASE_URL}/api/admin/system`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data);
      setLoading(false);
    };

    fetchSystem();
  }, []);

  if (loading) {
    return <p>Loading system status...</p>;
  }

  return (
    <div className="space-y-10 max-w-5xl">
      <h1 className="text-2xl font-semibold">
        System Health & Reliability
      </h1>

      {/* =====================
          SYSTEM METADATA
      ===================== */}
      <section className="bg-white rounded shadow p-6">
        <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-gray-500" />
          System Metadata
        </h2>

        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <MetadataRow label="Environment" value={data.metadata.environment} />
          <MetadataRow label="App Version" value={data.metadata.appVersion} />
          <MetadataRow label="API Version" value={data.metadata.apiVersion} />
          <MetadataRow
            label="Server Time"
            value={new Date(data.metadata.serverTime).toLocaleString()}
          />
          <MetadataRow label="Server Timezone" value={data.metadata.serverTimezone} />
          <MetadataRow label="Uptime (seconds)" value={data.metadata.uptimeSeconds} />
          <MetadataRow label="Process ID" value={data.metadata.processId} />
          <MetadataRow label="Node Version" value={data.metadata.nodeVersion} />
        </div>
      </section>

      {/* =====================
          DATA INTEGRITY
      ===================== */}
      <section className="bg-white rounded shadow p-6">
        <h2 className="text-lg font-medium mb-4">
          Data Integrity Checks
        </h2>

        <IntegrityItem
          label="Orphaned submissions"
          value={data.dataIntegrity.orphanedSubmissions}
          healthy={data.dataIntegrity.orphanedSubmissions === 0}
          description="Submissions without a valid assignment"
        />

        <IntegrityItem
          label="Ungraded submissions"
          value={data.dataIntegrity.ungradedSubmissions}
          healthy={data.dataIntegrity.ungradedSubmissions === 0}
          description="Submitted assignments not yet graded"
        />

        <IntegrityItem
          label="Unpublished grades"
          value={data.dataIntegrity.unpublishedGrades}
          healthy={data.dataIntegrity.unpublishedGrades === 0}
          description="Grades created but not released to students"
        />

        <IntegrityItem
          label="Locked submissions"
          value={data.dataIntegrity.lockedSubmissions}
          healthy={true}
          description="Deadline-enforced submissions (expected behavior)"
        />

        <IntegrityItem
          label="Background job failures"
          value={data.dataIntegrity.backgroundJobFailures}
          healthy={data.dataIntegrity.backgroundJobFailures === "Not enabled"}
          description="Tracking not enabled yet"
          infoOnly
        />
      </section>

      {/* =====================
          STORAGE & FILE HEALTH
      ===================== */}
      <section className="bg-white rounded shadow p-6">
        <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-gray-500" />
          Storage & File Health
        </h2>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <StorageCard
            title="Total Files"
            value={data.storage.totalFiles}
          />
          <StorageCard
            title="Total Storage Used"
            value={formatBytes(data.storage.totalSizeBytes)}
          />
          <StorageCard
            title="Average File Size"
            value={formatBytes(data.storage.avgFileSizeBytes)}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <StorageBreakdown
            title="Assignment Uploads"
            files={data.storage.assignments.files}
            totalSize={data.storage.assignments.totalSizeBytes}
            avgSize={data.storage.assignments.avgSizeBytes}
          />

          <StorageBreakdown
            title="Submission Uploads"
            files={data.storage.submissions.files}
            totalSize={data.storage.submissions.totalSizeBytes}
            avgSize={data.storage.submissions.avgSizeBytes}
          />
        </div>

        <p className="text-xs text-gray-500 mt-4">
          ℹ️ Storage metrics are derived from recorded file metadata.
          Older records may not include file size information.
        </p>
      </section>
    </div>
  );
};

/* =====================
   Helper Components
===================== */

const MetadataRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex justify-between border-b pb-1">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const IntegrityItem = ({
  label,
  value,
  healthy,
  description,
  infoOnly = false,
}: {
  label: string;
  value: number | string;
  healthy: boolean;
  description: string;
  infoOnly?: boolean;
}) => (
  <div className="flex items-start gap-4 py-3 border-b last:border-b-0">
    {infoOnly ? (
      <Info className="w-5 h-5 text-gray-400 mt-1" />
    ) : healthy ? (
      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
    ) : (
      <AlertTriangle className="w-5 h-5 text-red-600 mt-1" />
    )}

    <div className="flex-1">
      <p className="font-medium">
        {label}{" "}
        <span className="text-sm text-gray-500">({value})</span>
      </p>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

const StorageCard = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => (
  <div className="border rounded p-4">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

const StorageBreakdown = ({
  title,
  files,
  totalSize,
  avgSize,
}: {
  title: string;
  files: number;
  totalSize: number;
  avgSize: number;
}) => (
  <div className="border rounded p-4">
    <h3 className="font-medium mb-2">{title}</h3>
    <ul className="text-sm space-y-1 text-gray-700">
      <li>Total files: {files}</li>
      <li>Total size: {formatBytes(totalSize)}</li>
      <li>Average size: {formatBytes(avgSize)}</li>
    </ul>
  </div>
);

/* =====================
   Utils
===================== */

const formatBytes = (bytes: number) => {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

export default AdminSystem;