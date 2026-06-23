import { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/LoadingSpinner";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number | null;
  loading?: boolean;
  accent?: "sky" | "amber" | "green" | "rose" | "purple" | "blue";
}

const accentStyles: Record<string, { bg: string; text: string; icon: string }> = {
  sky: { bg: "bg-sky-500/10", text: "text-sky-400", icon: "text-sky-400" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", icon: "text-amber-400" },
  green: { bg: "bg-green-500/10", text: "text-green-400", icon: "text-green-400" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-400", icon: "text-rose-400" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400", icon: "text-purple-400" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", icon: "text-blue-400" },
};

const StatsCard = ({ icon: Icon, label, value, loading, accent = "sky" }: StatsCardProps) => {
  const style = accentStyles[accent];

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5">
      <div className="flex items-center gap-4">
        <div className={`rounded-lg ${style.bg} p-3`}>
          <Icon size={20} className={style.icon} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            {label}
          </span>
          {loading ? (
            <Skeleton className="h-7 w-16 mt-1" />
          ) : (
            <span className="text-2xl font-bold text-white">{value ?? "—"}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
