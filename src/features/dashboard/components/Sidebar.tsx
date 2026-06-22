import {
  FolderGit2,
  LayoutDashboard,
  MessageSquare
} from "lucide-react";
import { useSelector } from "react-redux";

import { Skeleton } from "@/components/ui/LoadingSpinner";
import { useLocation, useNavigate } from 'react-router-dom';

let navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    url: "/dashboard",
    tab: 'home',
    isActive: false
  },
  {
    icon: FolderGit2,
    label: "Repositories",
    url: "/dashboard/repos",
    tab: 'repos',
    isActive: false
  },
  {
    icon: MessageSquare,
    label: "AI Chat",
    url: "/dashboard/chat",
    tab: 'chat',
    isActive: false
  }
];

function capitalizeFirstLetter(str:string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const Sidebar = () => {
  const navigate = useNavigate();
  const state = useSelector((state:any) => state.auth);
  const user = state.user;
  const location = useLocation();
  const activeTab = state ? location?.state?.tab : 'home';
  
  navItems = navItems.map((item) => {
    item.tab === activeTab ? item.isActive = true : item.isActive = false
    return item;
  });
 
  return (
    <aside className="hidden md:flex w-72 flex-col border-r border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-white text-2xl font-bold">
          Origin
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            onClick={() => navigate(`/dashboard`, {
              state: {
                tab: item.tab
              }
            })}
            key={item.label}
            className={`${item.isActive ? 'bg-gray-900' : ''} w-full flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white transition`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        {user ? (
          <button onClick={() => navigate("/user/profile")} className="pl-5 py-3 w-full flex gap-1 flex-col items-start rounded-xl bg-white/[0.03] hover:bg-white/[0.1]">
            <span className="text-white text-sm tracking-wide">
              {capitalizeFirstLetter(user.first_name) + " " + capitalizeFirstLetter(user.last_name)}
            </span>
            <span className="text-slate-400 text-xs tracking-widest">
              {user.email.toLowerCase()}
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
}

export default Sidebar