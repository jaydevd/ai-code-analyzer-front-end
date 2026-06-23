import { useState } from "react";
import { Search, RefreshCw, Globe, Lock, Trash2, ScanLine } from "lucide-react";
import toast from "react-hot-toast";
import { useAdminRepos } from "../hooks/useAdminRepos";
import ScanStatusBadge from "../components/ScanStatusBadge";
import Button from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";

const statusFilterOptions = [
  { label: "All", value: "" },
  { label: "Scanned", value: "scanned" },
  { label: "Scanning", value: "scanning" },
  { label: "Failed", value: "failed" },
  { label: "Not Scanned", value: "not_scanned" },
];

const Repositories = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const { data, loading, error, refetch, deleteRepo, rescanRepo } = useAdminRepos();

  const filteredResults = data?.results.filter((repo) => {
    const matchesSearch =
      !search ||
      repo.name.toLowerCase().includes(search.toLowerCase()) ||
      repo.owner_email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || repo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRescan = async (id: string) => {
    setActionLoading(`rescan-${id}`);
    try {
      await rescanRepo(id);
      toast.success("Re-scan triggered");
    } catch {
      toast.error("Failed to trigger re-scan");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete repository "${name}" and all its data?`)) return;
    setActionLoading(`delete-${id}`);
    try {
      await deleteRepo(id);
      toast.success("Repository deleted");
    } catch {
      toast.error("Failed to delete repository");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Repository Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            View and manage all repositories across users
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
            placeholder="Search by repo name or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
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
                    Owner
                  </th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">
                    Visibility
                  </th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">
                    Language
                  </th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">
                    Files
                  </th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">
                    Last Scanned
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
                      No repositories found
                    </td>
                  </tr>
                ) : (
                  filteredResults?.map((repo) => (
                    <tr
                      key={repo.id}
                      className="hover:bg-white/[0.02] transition"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {repo.private ? (
                            <Lock size={14} className="text-amber-400" />
                          ) : (
                            <Globe size={14} className="text-green-400" />
                          )}
                          <span className="text-white text-sm font-medium">
                            {repo.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300">
                        {repo.owner_email}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`text-xs font-medium ${
                            repo.private ? "text-amber-400" : "text-green-400"
                          }`}
                        >
                          {repo.private ? "Private" : "Public"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">
                        {repo.language || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <ScanStatusBadge status={repo.status} />
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">
                        {repo.file_count}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">
                        {repo.last_scanned
                          ? formatDistanceToNow(new Date(repo.last_scanned), {
                              addSuffix: true,
                            })
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            loading={actionLoading === `rescan-${repo.id}`}
                            onClick={() => handleRescan(repo.id)}
                            title="Re-scan"
                          >
                            <ScanLine size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                            loading={actionLoading === `delete-${repo.id}`}
                            onClick={() => handleDelete(repo.id, repo.name)}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
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

export default Repositories;
