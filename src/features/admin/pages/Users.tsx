import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, RefreshCw, Shield, User } from "lucide-react";
import { useAdminUsers } from "../hooks/useAdminUsers";
import UserStatusBadge from "../components/UserStatusBadge";
import Button from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";

const roleFilterOptions = [
  { label: "All Roles", value: "" },
  { label: "Admin", value: "admin" },
  { label: "User", value: "user" },
];

const Users = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const { data, loading, error, refetch } = useAdminUsers();

  const filteredResults = data?.results.filter((u) => {
    const nameMatch =
      `${u.first_name} ${u.last_name}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const emailMatch = u.email.toLowerCase().includes(search.toLowerCase());
    const matchesSearch = !search || nameMatch || emailMatch;
    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-slate-400 text-sm mt-1">
            View and manage all registered users
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
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
          />
        </div>
        <div className="flex gap-2">
          {roleFilterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRoleFilter(opt.value)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                roleFilter === opt.value
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
                    User
                  </th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">
                    Email
                  </th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">
                    Role
                  </th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">
                    GitHub
                  </th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">
                    Repos
                  </th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">
                    Chats
                  </th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">
                    Last Login
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
                      colSpan={9}
                      className="px-4 py-12 text-center text-slate-500"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredResults?.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-white/[0.02] transition cursor-pointer"
                      onClick={() => navigate(`/admin/users/${u.id}`)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-white/5 p-2">
                            <User size={14} className="text-slate-400" />
                          </div>
                          <span className="text-white text-sm font-medium">
                            {u.first_name} {u.last_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300">
                        {u.email}
                      </td>
                      <td className="px-4 py-3">
                        {u.role === "admin" ? (
                          <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
                            <Shield size={12} />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-slate-400">
                            User
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <UserStatusBadge
                          isActive={u.is_active}
                          isSuspended={u.is_suspended}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">
                        {u.github_username || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-white">
                        {u.repo_count}
                      </td>
                      <td className="px-4 py-3 text-sm text-white">
                        {u.chat_count}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">
                        {u.last_login
                          ? formatDistanceToNow(new Date(u.last_login), {
                              addSuffix: true,
                            })
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/users/${u.id}`);
                          }}
                        >
                          View
                        </Button>
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

export default Users;
