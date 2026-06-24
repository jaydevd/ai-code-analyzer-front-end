import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Terminal } from "lucide-react";
import toast from "react-hot-toast";
import { useAdminScanDetail } from "../hooks/useAdminScans";
import ScanStatusBadge from "../components/ScanStatusBadge";
import Button from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { format } from "date-fns";

const ScanDetail = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const { scan, loading, error, retry } = useAdminScanDetail(scanId);

  const handleRetry = async () => {
    try {
      await retry();
      toast.success("Scan retry triggered");
    } catch {
      toast.error("Failed to retry scan");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-6 text-rose-400">
        <p className="font-medium">Failed to load scan detail</p>
        <p className="text-sm mt-1">{error || "Scan not found"}</p>
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => navigate("/admin/scans")}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Scans
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/scans")}
          className="rounded-lg border border-white/10 p-2 text-slate-400 hover:text-white hover:bg-white/5 transition"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">
              {scan.repository_name}
            </h1>
            <ScanStatusBadge status={scan.status} />
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Scan details and error diagnostics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">
            Scan Information
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-slate-400">Repository</dt>
              <dd className="text-sm text-white">{scan.repository_full_name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-slate-400">Branch</dt>
              <dd className="text-sm text-white">{scan.branch}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-slate-400">Commit SHA</dt>
              <dd className="text-sm text-white font-mono">
                {scan.commit_sha?.slice(0, 7) || "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-slate-400">User</dt>
              <dd className="text-sm text-white">{scan.user_email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-slate-400">Started</dt>
              <dd className="text-sm text-white">
                {scan.started_at
                  ? format(new Date(scan.started_at), "MMM d, yyyy HH:mm:ss")
                  : "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-slate-400">Completed</dt>
              <dd className="text-sm text-white">
                {scan.completed_at
                  ? format(new Date(scan.completed_at), "MMM d, yyyy HH:mm:ss")
                  : "—"}
              </dd>
            </div>
            {scan.duration_seconds && (
              <div className="flex justify-between">
                <dt className="text-sm text-slate-400">Duration</dt>
                <dd className="text-sm text-white">
                  {scan.duration_seconds}s
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">
            Actions
          </h2>
          <div className="space-y-3">
            {scan.status === "failed" && (
              <Button onClick={handleRetry} className="w-full">
                <RefreshCw size={16} className="mr-2" />
                Retry Scan
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/scans")}
              className="w-full"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Scans
            </Button>
          </div>
        </div>
      </div>

      {(scan.error_message || scan.error_log) && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.03] backdrop-blur-xl overflow-hidden">
          <div className="flex items-center gap-2 border-b border-rose-500/20 px-5 py-3 bg-rose-500/5">
            <Terminal size={16} className="text-rose-400" />
            <h2 className="text-sm font-medium text-rose-400">
              Error Diagnostics
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {scan.error_message && (
              <div>
                <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                  Error Message
                </h3>
                <pre className="text-sm text-rose-300 bg-black/30 rounded-lg p-4 overflow-x-auto font-mono whitespace-pre-wrap">
                  {scan.error_message}
                </pre>
              </div>
            )}
            {scan.error_log && (
              <div>
                <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                  Error Log
                </h3>
                <pre className="text-sm text-rose-300 bg-black/30 rounded-lg p-4 overflow-x-auto font-mono whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {scan.error_log}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanDetail;
