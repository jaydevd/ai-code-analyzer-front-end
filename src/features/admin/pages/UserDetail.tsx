import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Shield,
  Mail,
  Calendar,
  Save,
  AlertTriangle,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAdminUserDetail } from "../hooks/useAdminUsers";
import UserStatusBadge from "../components/UserStatusBadge";
import Button from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { format } from "date-fns";

const UserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const {
    user,
    loading,
    saving,
    error,
    refetch,
    update,
    suspend,
    activate,
    deleteUser,
  } = useAdminUserDetail(userId);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", role: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const startEditing = () => {
    if (!user) return;
    setForm({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    });
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      await update(form);
      toast.success("User updated successfully");
      setEditing(false);
    } catch {
      toast.error("Failed to update user");
    }
  };

  const handleSuspend = async () => {
    try {
      await suspend();
      toast.success("User suspended");
    } catch {
      toast.error("Failed to suspend user");
    }
  };

  const handleActivate = async () => {
    try {
      await activate();
      toast.success("User activated");
    } catch {
      toast.error("Failed to activate user");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser();
      toast.success("User deleted");
      navigate("/admin/users");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-6 text-rose-400">
        <p className="font-medium">Failed to load user</p>
        <p className="text-sm mt-1">{error || "User not found"}</p>
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => navigate("/admin/users")}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/users")}
          className="rounded-lg border border-white/10 p-2 text-slate-400 hover:text-white hover:bg-white/5 transition"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">
              {user.first_name} {user.last_name}
            </h1>
            <UserStatusBadge
              isActive={user.is_active}
              isSuspended={user.is_suspended}
            />
            {user.role === "admin" && (
              <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
                <Shield size={12} />
                Admin
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm mt-1">User details and management</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                Profile Information
              </h2>
              {!editing && (
                <Button size="sm" variant="secondary" onClick={startEditing}>
                  Edit
                </Button>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={form.first_name}
                      onChange={(e) =>
                        setForm({ ...form, first_name: e.target.value })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={form.last_name}
                      onChange={(e) =>
                        setForm({ ...form, last_name: e.target.value })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Role
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) =>
                      setForm({ ...form, role: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500/50"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button onClick={handleSave} loading={saving}>
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <dl className="space-y-4">
                <div className="flex items-center gap-3">
                  <User size={16} className="text-slate-500" />
                  <div>
                    <dt className="text-xs text-slate-500">Name</dt>
                    <dd className="text-sm text-white">
                      {user.first_name} {user.last_name}
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-slate-500" />
                  <div>
                    <dt className="text-xs text-slate-500">Email</dt>
                    <dd className="text-sm text-white">{user.email}</dd>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield size={16} className="text-slate-500" />
                  <div>
                    <dt className="text-xs text-slate-500">Role</dt>
                    <dd className="text-sm text-white capitalize">
                      {user.role}
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaGithub size={16} className="text-slate-500" />
                  <div>
                    <dt className="text-xs text-slate-500">GitHub</dt>
                    <dd className="text-sm text-white">
                      {user.github_username || "Not connected"}
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-slate-500" />
                  <div>
                    <dt className="text-xs text-slate-500">Joined</dt>
                    <dd className="text-sm text-white">
                      {format(new Date(user.created_at), "MMM d, yyyy")}
                    </dd>
                  </div>
                </div>
              </dl>
            )}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
              Activity Summary
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-white/[0.02]">
                <p className="text-2xl font-bold text-white">
                  {user.repo_count}
                </p>
                <p className="text-xs text-slate-400 mt-1">Repositories</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/[0.02]">
                <p className="text-2xl font-bold text-white">
                  {user.chat_count}
                </p>
                <p className="text-xs text-slate-400 mt-1">Chat Sessions</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/[0.02]">
                <p className="text-2xl font-bold text-white">
                  {user.is_github_installation_active ? "Yes" : "No"}
                </p>
                <p className="text-xs text-slate-400 mt-1">GitHub Active</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
              Account Actions
            </h2>
            <div className="space-y-3">
              {user.is_suspended ? (
                <Button onClick={handleActivate} className="w-full">
                  Activate Account
                </Button>
              ) : (
                <Button
                  onClick={handleSuspend}
                  variant="secondary"
                  className="w-full"
                >
                  Suspend Account
                </Button>
              )}
              <Button
                variant="ghost"
                className="w-full text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <AlertTriangle size={16} className="mr-2" />
                Delete Account
              </Button>
            </div>
          </div>

          {user.last_login && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
              <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">
                Last Login
              </h2>
              <p className="text-white text-sm">
                {format(new Date(user.last_login), "MMM d, yyyy HH:mm")}
              </p>
            </div>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="rounded-xl border border-rose-500/20 bg-[#0a1628] p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-full bg-rose-500/10 p-3">
                <AlertTriangle size={24} className="text-rose-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Delete User
                </h3>
                <p className="text-sm text-slate-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-300 mb-6">
              Are you sure you want to delete{" "}
              <span className="text-white font-medium">
                {user.first_name} {user.last_name}
              </span>
              ? All associated data including repos, chats, and scans will be
              permanently removed.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="ghost"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-rose-500 hover:bg-rose-600"
                onClick={handleDelete}
              >
                Delete User
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;
