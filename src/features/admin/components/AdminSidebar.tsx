import {
  LayoutDashboard,
  Activity,
  Users,
  FolderGit2,
  FileText,
  ChevronLeft,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/LoadingSpinner";

interface RootState {
  auth: {
    user?: {
      first_name?: string;
      last_name?: string;
      email?: string;
    };
  };
}

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Activity, label: "Scans", path: "/admin/scans" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: FolderGit2, label: "Repositories", path: "/admin/repos" },
  { icon: FileText, label: "Logs", path: "/admin/logs" },
];

function capitalize(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <aside className="hidden md:flex w-72 flex-col border-r border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <h1 className="text-white text-2xl font-bold">Origin</h1>
        <span className="text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-1 rounded-md border border-amber-400/20">
          Admin
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.path === "/admin"
              ? location.pathname === "/admin"
              : location.pathname.startsWith(item.path);

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`${
                isActive
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              } w-full flex items-center gap-3 rounded-xl px-4 py-3 transition`}
            >
              <item.icon size={18} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}

        <div className="pt-4 mt-4 border-t border-white/10">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-slate-500 hover:text-white hover:bg-white/5 transition text-sm"
          >
            <ChevronLeft size={16} />
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="p-4 border-t border-white/10">
        {user ? (
          <button
            onClick={() => navigate("/user/profile")}
            className="pl-5 py-3 w-full flex gap-1 flex-col items-start rounded-xl bg-white/[0.03] hover:bg-white/[0.1]"
          >
            <span className="text-white text-sm tracking-wide">
              {capitalize(user?.first_name || "") + " " + capitalize(user?.last_name || "")}
            </span>
            <span className="text-slate-400 text-xs tracking-widest">
              {user?.email?.toLowerCase()}
            </span>
          </button>
        ) : (
          <div className="px-5 py-3 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;
