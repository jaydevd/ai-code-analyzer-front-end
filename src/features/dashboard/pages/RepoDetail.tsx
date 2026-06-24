import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  GitBranch,
  GitCommit,
  Loader2,
  RefreshCw,
  X,
  XCircle,
} from "lucide-react";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { getBranches } from "../api/getBranches";
import { startScanRepo } from "../api/startScanRepo";
import Sidebar from "../components/Sidebar";
import useGetScanReport from "../hooks/useGetScanReport";
import Select from "@/components/ui/Select";
import type { BranchScanReport } from "../types/dashboard.types";

interface RootState {
  repos: {
    repos: Array<{
      id: string;
      name: string;
      url: string;
      status: string;
      branches?: number;
    }>;
  };
  auth: {
    user: {
      is_github_installation_active?: boolean;
    } | null;
  };
}

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; label: string }> = {
  not_scanned: { icon: AlertCircle, color: "text-zinc-500", label: "Not Scanned" },
  scanning: { icon: Loader2, color: "text-blue-400", label: "Scanning" },
  scanned: { icon: CheckCircle2, color: "text-emerald-400", label: "Scanned" },
  failed: { icon: XCircle, color: "text-red-400", label: "Failed" },
};

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString();
}

function BranchRow({
  branch,
  repoName,
  repoId,
  scanningBranches,
  onScan,
}: {
  branch: BranchScanReport;
  repoName: string;
  repoId: string;
  scanningBranches: Set<string>;
  onScan: (branchName: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const config = statusConfig[branch.status] || statusConfig.not_scanned;
  const StatusIcon = config.icon;
  const isScanning = scanningBranches.has(branch.branch);

  return (
    <div className="rounded-2xl border border-zinc-900 bg-white/[0.07]">
      <div className="flex items-center gap-4 px-5 py-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-4 flex-1 min-w-0 text-left"
        >
          <GitBranch size={18} className="text-zinc-400 shrink-0" />
          <span className="font-medium text-white min-w-0 flex-1 truncate">{branch.branch}</span>
          <div className="flex items-center gap-2 shrink-0">
            <StatusIcon size={16} className={`${config.color} ${branch.status === "scanning" || isScanning ? "animate-spin" : ""}`} />
            <span className={`text-sm ${config.color}`}>
              {isScanning ? "Scanning..." : config.label}
            </span>
          </div>
          {branch.last_indexed_at && !isScanning && (
            <span className="text-xs text-zinc-500 shrink-0 hidden md:inline">
              {formatDate(branch.last_indexed_at)}
            </span>
          )}
          {branch.previous_scans.length > 0 && (
            <span className="text-xs text-zinc-600 shrink-0">
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          )}
        </button>

        <button
          onClick={() => onScan(branch.branch)}
          disabled={isScanning}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-zinc-700 hover:text-white disabled:opacity-50"
        >
          <RefreshCw size={13} className={isScanning ? "animate-spin" : ""} />
          Scan again
        </button>
      </div>

      {expanded && branch.previous_scans.length > 0 && (
        <div className="border-t border-zinc-900 px-5 py-3 space-y-2">
          <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Previous Scans</p>
          {branch.previous_scans.map((scan, idx) => (
            <div
              key={scan.commit_sha + idx}
              className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-4 py-2.5 text-sm"
            >
              <GitCommit size={14} className="text-zinc-500 shrink-0" />
              <code className="text-xs text-zinc-300 font-mono shrink-0">
                {scan.commit_sha.substring(0, 7)}
              </code>
              <span className="text-xs text-zinc-500 shrink-0">
                {formatDate(scan.indexed_at)}
              </span>
              <a
                href={scan.commit_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition"
              >
                View commit <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const RepoDetail = () => {
  const { repoName } = useParams<{ repoName: string }>();
  const decodedName = repoName ? decodeURIComponent(repoName) : "";
  const navigate = useNavigate();
  const repo = useSelector((state: RootState) =>
    state.repos.repos.find((r) => r.name === decodedName)
  );
  const repoId = repo?.id || null;
  const { report, loading, error } = useGetScanReport(repoId);
  const githubConnected = useSelector(
    (state: RootState) => state.auth.user?.is_github_installation_active
  );

  const [scanningBranches, setScanningBranches] = useState<Set<string>>(new Set());
  const [branchSelectOpen, setBranchSelectOpen] = useState(false);
  const [availableBranches, setAvailableBranches] = useState<Array<{ name: string; commit: { sha: string } }>>([]);
  const [selectedScanBranch, setSelectedScanBranch] = useState("");
  const [branchesLoading, setBranchesLoading] = useState(false);

  const triggerScan = useCallback(
    async (branchName: string, commitSha: string) => {
      if (!repoId) return;
      setScanningBranches((prev) => new Set(prev).add(branchName));
      try {
        await startScanRepo({
          repo_id: repoId,
          commit_sha: commitSha,
          branch: branchName,
        });
        toast.success(`Scan started for ${branchName}`);
      } catch {
        toast.error(`Failed to start scan for ${branchName}`);
      } finally {
        setScanningBranches((prev) => {
          const next = new Set(prev);
          next.delete(branchName);
          return next;
        });
      }
    },
    [repoId]
  );

  const handleScanAgain = useCallback(
    async (branchName: string) => {
      if (!repo || !repoId) return;
      try {
        const branches = await getBranches(repo.name);
        const match = branches.find((b: { name: string }) => b.name === branchName);
        if (!match) {
          toast.error(`Branch ${branchName} not found on GitHub`);
          return;
        }
        await triggerScan(branchName, match.commit?.sha);
      } catch {
        toast.error("Failed to fetch branch info");
      }
    },
    [repo, repoId, triggerScan]
  );

  const handleOpenBranchSelect = useCallback(async () => {
    if (!repo) return;
    setBranchesLoading(true);
    setBranchSelectOpen(true);
    try {
      const result = await getBranches(repo.name);
      setAvailableBranches(result);
      if (result.length > 0) {
        setSelectedScanBranch(result[0].name);
      }
    } catch {
      toast.error("Failed to fetch branches");
      setBranchSelectOpen(false);
    } finally {
      setBranchesLoading(false);
    }
  }, [repo]);

  const handleConfirmScan = useCallback(async () => {
    if (!selectedScanBranch) return;
    const branch = availableBranches.find((b) => b.name === selectedScanBranch);
    if (!branch) return;
    setBranchSelectOpen(false);
    await triggerScan(branch.name, branch.commit?.sha);
  }, [selectedScanBranch, availableBranches, triggerScan]);

  if (!repoName) return null;

  return (
    <div className="flex h-screen bg-[#020617] text-white scrollbar-thumb-gray-900 scrollbar-thin scrollbar-gutter-auto">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="relative w-10/12 mx-auto min-h-full text-zinc-100">
          <div className="w-full mx-auto py-8">
            <div className="px-4 py-2 mb-6">
              <button
                onClick={() => navigate("/dashboard", { state: { tab: "repos" } })}
                className="mb-4 flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition"
              >
                <ChevronRight size={16} className="rotate-180" />
                Back to repositories
              </button>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-bold text-4xl text-white">
                  {repo?.name || decodedName}
                </h1>
                <button
                  onClick={handleOpenBranchSelect}
                  className="flex items-center gap-1.5 rounded-xl border-2 border-emerald-900/50 px-4 py-2 text-sm font-medium text-emerald-400 transition hover:border-emerald-700"
                >
                  <GitBranch size={15} />
                  Scan Branch
                </button>
              </div>

              {repo?.branches !== undefined && (
                <p className="mt-2 text-sm text-zinc-500">
                  {repo.branches} branch{repo.branches !== 1 ? "es" : ""}
                </p>
              )}
            </div>

            {loading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="animate-spin text-sky-400" />
              </div>
            )}

            {error && !githubConnected && (
              <div className="flex flex-col items-center justify-center py-20">
                <GitBranch className="mb-3 h-8 w-8 text-zinc-600" />
                <p className="text-zinc-500">No data found. Connect GitHub to view scan reports.</p>
              </div>
            )}

            {error && githubConnected && (
              <div className="flex flex-col items-center justify-center py-20">
                <AlertCircle className="mb-3 h-8 w-8 text-red-400" />
                <p className="text-red-300">{error}</p>
              </div>
            )}

            {!loading && !error && report.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <GitBranch className="mb-3 h-8 w-8 text-zinc-600" />
                <p className="text-zinc-500">No scan data available for this repository</p>
              </div>
            )}

            {!loading && !error && report.length > 0 && (
              <div className="px-4 space-y-3">
                {report.map((branch) => (
                  <BranchRow
                    key={branch.branch}
                    branch={branch}
                    repoName={repo?.name || ""}
                    repoId={repoId || ""}
                    scanningBranches={scanningBranches}
                    onScan={handleScanAgain}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {branchSelectOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#020617] p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Select Branch
                </h3>
                <button
                  onClick={() => setBranchSelectOpen(false)}
                  className="text-zinc-500 hover:text-zinc-300 transition"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-zinc-400 mb-4">
                Choose a branch to scan for{" "}
                <span className="font-medium text-white">{repo?.name}</span>
              </p>
              <Select
                label="Branch"
                options={availableBranches.map((b) => ({ value: b.name, label: b.name }))}
                value={selectedScanBranch}
                onChange={setSelectedScanBranch}
                placeholder="Select branch"
                loading={branchesLoading}
                disabled={branchesLoading}
              />
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setBranchSelectOpen(false)}
                  className="rounded-xl border border-zinc-800 px-4 py-2 text-sm text-zinc-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmScan}
                  disabled={!selectedScanBranch || branchesLoading}
                  className="rounded-xl border-2 border-emerald-900/50 px-4 py-2 text-sm font-medium text-emerald-400 hover:border-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Scan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepoDetail;
