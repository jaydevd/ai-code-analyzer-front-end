import { useState } from "react";
import { Search, RefreshCw, ChevronDown, ChevronRight } from "lucide-react";
import { useAdminLogs } from "../hooks/useAdminLogs";
import Button from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";

const levelFilterOptions = [
  { label: "All", value: "" },
  { label: "Error", value: "error" },
  { label: "Warning", value: "warning" },
  { label: "Info", value: "info" },
];

const levelStyles: Record<string, string> = {
  error: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  warning: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  info: "text-sky-400 bg-sky-500/10 border-sky-500/20",
};

const Logs = () => {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data, loading, error, refetch } = useAdminLogs();

  const filteredResults = data?.results.filter((log) => {
    const matchesSearch =
      !search ||
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      (log.repository_name || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (log.user_email || "").toLowerCase().includes(search.toLowerCase());
    const matchesLevel = !levelFilter || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Error Logs</h1>
          <p className="text-slate-400 text-sm mt-1">
            System logs and error diagnostics
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
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
          />
        </div>
        <div className="flex gap-2">
          {levelFilterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setLevelFilter(opt.value)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                levelFilter === opt.value
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
        <div className="space-y-2">
          {filteredResults?.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-12 text-center text-slate-500">
              No logs found
            </div>
          ) : (
            filteredResults?.map((log) => (
              <div
                key={log.id}
                className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpanded(expanded === log.id ? null : log.id)
                  }
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition text-left"
                >
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium uppercase ${
                      levelStyles[log.level] || levelStyles.info
                    }`}
                  >
                    {log.level}
                  </span>
                  <span className="flex-1 text-sm text-white truncate">
                    {log.message}
                  </span>
                  {log.repository_name && (
                    <span className="text-xs text-slate-500 hidden sm:inline">
                      {log.repository_name}
                    </span>
                  )}
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {formatDistanceToNow(new Date(log.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                  {expanded === log.id ? (
                    <ChevronDown size={14} className="text-slate-400" />
                  ) : (
                    <ChevronRight size={14} className="text-slate-400" />
                  )}
                </button>
                {expanded === log.id && (
                  <div className="border-t border-white/5 px-4 py-3 space-y-2 bg-black/20">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-xs text-slate-500">Source</span>
                        <p className="text-white">{log.source}</p>
                      </div>
                      {log.user_email && (
                        <div>
                          <span className="text-xs text-slate-500">User</span>
                          <p className="text-white">{log.user_email}</p>
                        </div>
                      )}
                      {log.repository_name && (
                        <div>
                          <span className="text-xs text-slate-500">
                            Repository
                          </span>
                          <p className="text-white">{log.repository_name}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-xs text-slate-500">Time</span>
                        <p className="text-white">
                          {new Date(log.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {log.stack_trace && (
                      <div>
                        <span className="text-xs text-slate-500">
                          Stack Trace
                        </span>
                        <pre className="mt-1 text-xs text-rose-300 bg-black/30 rounded-lg p-3 overflow-x-auto font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                          {log.stack_trace}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Logs;
