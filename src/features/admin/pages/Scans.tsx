import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { useAdminScans } from "../hooks/useAdminScans";
import { retryScan } from "../api/scans";
import ScanStatusBadge from "../components/ScanStatusBadge";
import Button from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";

const statusFilterOptions = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Running", value: "running" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
];

const Scans = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [retrying, setRetrying] = useState<string | null>(null);

  const { data, loading, error, refetch } = useAdminScans();

  const handleRetry = async (id: string) => {
    setRetrying(id);
    try {
      await retryScan(id);
      toast.success("Scan retry triggered");
      refetch();
    } catch {
      toast.error("Failed to retry scan");
    } finally {
      setRetrying(null);
    }
  };

  const filteredResults = data?.results.filter((scan) => {
    const matchesSearch =
      !search ||
      scan.repository_name.toLowerCase().includes(search.toLowerCase()) ||
      scan.user_email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || scan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Scan Monitoring</h1>
          <p className="text-slate-400 text-sm mt-1">
            Monitor and manage repository scans
          </p>
        </div>
        <Button variant="secondary" onClick={() => refetch()}>
          <RefreshCw size={16} className="mr-2" />
          Refresh
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by repo or user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
          />
        </div>
        <div className="flex gap-2">
          {statusFilterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                statusFilter === opt.value
                  ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                  : "text-slate-400 border border-white/10 hover:bg-white/5"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-6 text-rose-400">
          <p>{error}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">
                    Repository
                  </th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">
                    User
                  </th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">
                    Branch
                  </th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">
                    Progress
                  </th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">
                    Started
                  </th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">
                    Duration
                  </th>
                  <th className="text-right text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredResults?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-12 text-center text-slate-500"
                    >
                      No scans found
                    </td>
                  </tr>
                ) : (
                  filteredResults?.map((scan) => (
                    <tr
                      key={scan.id}
                      className="hover:bg-white/[0.02] transition cursor-pointer"
                      onClick={() => navigate(`/admin/scans/${scan.id}`)}
                    >
                      <td className="px-4 py-3">
                        <span className="text-white text-sm font-medium">
                          {scan.repository_name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300">
                        {scan.user_email}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">
                        {scan.branch}
                      </td>
                      <td className="px-4 py-3">
                        <ScanStatusBadge status={scan.status} />
                      </td>
                      <td className="px-4 py-3">
                        {scan.status === "running" ? (
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 flex-1 rounded-full bg-white/10 max-w-[80px]">
                              <div
                                className="h-full rounded-full bg-sky-400 transition-all"
                                style={{ width: `${scan.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-400">
                              {scan.progress}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-500">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">
                        {scan.started_at
                          ? formatDistanceToNow(new Date(scan.started_at), {
                              addSuffix: true,
                            })
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">
                        {scan.duration_seconds
                          ? `${scan.duration_seconds}s`
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {scan.status === "failed" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            loading={retrying === scan.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRetry(scan.id);
                            }}
                          >
                            Retry
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scans;
