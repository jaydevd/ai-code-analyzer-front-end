interface ScanStatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  running: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  failed: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const ScanStatusBadge = ({ status }: ScanStatusBadgeProps) => {
  const style = statusStyles[status] || "bg-slate-500/10 text-slate-400 border-slate-500/20";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-medium capitalize ${style}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "running"
            ? "bg-sky-400 animate-pulse"
            : status === "completed"
            ? "bg-green-400"
            : status === "failed"
            ? "bg-rose-400"
            : "bg-amber-400"
        }`}
      />
      {status}
    </span>
  );
};

export default ScanStatusBadge;
