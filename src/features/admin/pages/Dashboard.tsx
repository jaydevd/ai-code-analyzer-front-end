import {
  Users,
  FolderGit2,
  MessageSquare,
  Activity,
  AlertCircle,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { useAdminStats } from "../hooks/useAdminStats";
import StatsCard from "../components/StatsCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const AdminDashboard = () => {
  const { stats, scansOverTime, loading, error } = useAdminStats();

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-6 text-rose-400">
        <p className="font-medium">Failed to load dashboard data</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">
          System overview and analytics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={Users}
          label="Total Users"
          value={stats?.total_users ?? null}
          loading={loading}
          accent="sky"
        />
        <StatsCard
          icon={Activity}
          label="Active Users"
          value={stats?.active_users ?? null}
          loading={loading}
          accent="green"
        />
        <StatsCard
          icon={FolderGit2}
          label="Total Repos"
          value={stats?.total_repos ?? null}
          loading={loading}
          accent="purple"
        />
        <StatsCard
          icon={FolderGit2}
          label="Scanned Repos"
          value={stats?.scanned_repos ?? null}
          loading={loading}
          accent="blue"
        />
        <StatsCard
          icon={MessageSquare}
          label="Total Chats"
          value={stats?.total_chats ?? null}
          loading={loading}
          accent="sky"
        />
        <StatsCard
          icon={AlertCircle}
          label="Failed Scans"
          value={stats?.failed_scans ?? null}
          loading={loading}
          accent="rose"
        />
        <StatsCard
          icon={Activity}
          label="Scans Today"
          value={stats?.scans_today ?? null}
          loading={loading}
          accent="amber"
        />
        <StatsCard
          icon={Clock}
          label="Avg Scan Duration"
          value={
            stats?.avg_scan_duration_seconds
              ? `${stats.avg_scan_duration_seconds}s`
              : null
          }
          loading={loading}
          accent="sky"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
          <h2 className="text-white font-semibold mb-4">Scans Over Time</h2>
          {scansOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scansOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "#0a1628",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                  name="Completed"
                />
                <Line
                  type="monotone"
                  dataKey="failed"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  dot={false}
                  name="Failed"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-400 text-sm">No scan data available</p>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
          <h2 className="text-white font-semibold mb-4">
            Scan Status Distribution
          </h2>
          {scansOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={scansOverTime.slice(-7)}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "#0a1628",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Bar dataKey="completed" fill="#22c55e" radius={[4, 4, 0, 0]} name="Completed" />
                <Bar dataKey="failed" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Failed" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-400 text-sm">No scan data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
