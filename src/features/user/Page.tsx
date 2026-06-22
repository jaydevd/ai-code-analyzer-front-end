import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaGithub } from "react-icons/fa";
import {
  Mail,
  Shield,
  User,
  Key,
  LogOut,
  Trash2,
  ArrowLeft,
  Globe,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import Button from "@/components/ui/Button";
import {
  updateProfile,
  logoutRequest,
  changePassword,
  deleteAccount,
} from "@/auth/api/updateProfile";
import { logout, updateUser } from "@/auth/slices/authSlice";
import { api } from "@/lib/axios";

interface RootState {
  auth: {
    user: {
      id: string;
      email: string;
      first_name?: string;
      last_name?: string;
      github_username?: string;
      is_github_installation_active?: boolean;
      role?: string;
    } | null;
    isAuthenticated: boolean;
  };
}

interface ProfileFormData {
  first_name: string;
  last_name: string;
}

interface PasswordFormData {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}

function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#020617] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
            <Trash2 className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Delete Account</h3>
            <p className="text-sm text-gray-400">This action is irreversible</p>
          </div>
        </div>

        <p className="mb-6 text-gray-300">
          Are you sure you want to delete your account? All your data,
          repositories, and chat history will be permanently removed.
        </p>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex-1 !bg-red-600 hover:!bg-red-500"
            onClick={onConfirm}
            loading={loading}
          >
            Delete My Account
          </Button>
        </div>
      </div>
    </div>
  );
}

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>();

  const onSubmitProfile = async (data: ProfileFormData) => {
    setProfileLoading(true);
    try {
      const res = await updateProfile(data);
      const updatedUser = res.data || res;
      dispatch(updateUser(updatedUser));
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const onSubmitPassword = async (data: PasswordFormData) => {
    if (data.new_password !== data.confirm_new_password) {
      toast.error("New passwords do not match");
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword({
        current_password: data.current_password,
        new_password: data.new_password,
        confirm_new_password: data.confirm_new_password,
      });
      toast.success("Password changed successfully");
      resetPassword();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to change password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logoutRequest();
    } catch {
    } finally {
      dispatch(logout());
      navigate("/");
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await deleteAccount();
      dispatch(logout());
      navigate("/");
      toast.success("Account deleted successfully");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to delete account"
      );
      setDeleteLoading(false);
      setDeleteModalOpen(false);
    }
  };

  const handleConnectGithub = async () => {
    setGithubLoading(true);
    try {
      const res = await api.get("api/github/install-url/");
      const url = res.data?.data?.url || res.data?.url;
      if (url) {
        window.location.href = url;
      } else {
        toast.error("Failed to get GitHub installation URL");
      }
    } catch {
      toast.error("Failed to connect to GitHub");
    } finally {
      setGithubLoading(false);
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        loading={deleteLoading}
      />

      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard", { state: { tab: "home" } })}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
            <p className="mt-1 text-gray-400">
              Manage your account and personal information
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Card 1: Read-only Info */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
              <User className="h-5 w-5 text-sky-400" />
              Account Information
            </h2>

            <div className="space-y-5">
              {/* Email */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-gray-400">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <div className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-gray-300">
                  {user?.email || "—"}
                </div>
              </div>

              {/* GitHub Username */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-gray-400">
<FaGithub className="h-4 w-4" />
                    GitHub Username
                </label>
                <div className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-gray-300">
                  {user?.github_username || (
                    <span className="text-gray-500 italic">
                      Not connected
                    </span>
                  )}
                </div>
              </div>

              {/* GitHub Status */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-gray-400">
                  <Globe className="h-4 w-4" />
                  GitHub Integration
                </label>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                  {user?.is_github_installation_active ? (
                    <span className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      Connected
                    </span>
                  ) : (
                    <>
                      <span className="flex items-center gap-2 text-gray-500">
                        <XCircle className="h-4 w-4" />
                        Not installed
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleConnectGithub}
                        loading={githubLoading}
                      >
                        Connect GitHub
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Role (admin only) */}
              {isAdmin && (
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm text-gray-400">
                    <Shield className="h-4 w-4" />
                    Role
                  </label>
                  <div className="inline-flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-sm text-sky-300">
                    <Shield className="h-4 w-4" />
                    Administrator
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Edit Profile */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
              <User className="h-5 w-5 text-sky-400" />
              Edit Profile
            </h2>

            <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
              <div className="mb-5">
                <label className="mb-2 block text-sm text-gray-300">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your first name"
                  {...registerProfile("first_name", {
                    required: "First name is required",
                  })}
                  className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:ring-2 focus:ring-sky-500/20 ${
                    profileErrors.first_name
                      ? "border-red-500"
                      : "border-white/10 focus:border-sky-500"
                  }`}
                />
                {profileErrors.first_name && (
                  <p className="mt-2 text-sm text-red-400">
                    {profileErrors.first_name.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm text-gray-300">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your last name"
                  {...registerProfile("last_name", {
                    required: "Last name is required",
                  })}
                  className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:ring-2 focus:ring-sky-500/20 ${
                    profileErrors.last_name
                      ? "border-red-500"
                      : "border-white/10 focus:border-sky-500"
                  }`}
                />
                {profileErrors.last_name && (
                  <p className="mt-2 text-sm text-red-400">
                    {profileErrors.last_name.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={profileLoading}
              >
                Save Changes
              </Button>
            </form>
          </div>

          {/* Card 3: Change Password */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
              <Key className="h-5 w-5 text-sky-400" />
              Change Password
            </h2>

            <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
              <div className="mb-5">
                <label className="mb-2 block text-sm text-gray-300">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  {...registerPassword("current_password", {
                    required: "Current password is required",
                  })}
                  className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:ring-2 focus:ring-sky-500/20 ${
                    passwordErrors.current_password
                      ? "border-red-500"
                      : "border-white/10 focus:border-sky-500"
                  }`}
                />
                {passwordErrors.current_password && (
                  <p className="mt-2 text-sm text-red-400">
                    {passwordErrors.current_password.message}
                  </p>
                )}
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-sm text-gray-300">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  {...registerPassword("new_password", {
                    required: "New password is required",
                    minLength: {
                      value: 8,
                      message:
                        "Password must be at least 8 characters",
                    },
                  })}
                  className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:ring-2 focus:ring-sky-500/20 ${
                    passwordErrors.new_password
                      ? "border-red-500"
                      : "border-white/10 focus:border-sky-500"
                  }`}
                />
                {passwordErrors.new_password && (
                  <p className="mt-2 text-sm text-red-400">
                    {passwordErrors.new_password.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm text-gray-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  {...registerPassword("confirm_new_password", {
                    required: "Please confirm your new password",
                  })}
                  className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:ring-2 focus:ring-sky-500/20 ${
                    passwordErrors.confirm_new_password
                      ? "border-red-500"
                      : "border-white/10 focus:border-sky-500"
                  }`}
                />
                {passwordErrors.confirm_new_password && (
                  <p className="mt-2 text-sm text-red-400">
                    {passwordErrors.confirm_new_password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={passwordLoading}
              >
                Update Password
              </Button>
            </form>
          </div>

          {/* Card 4: Log Out */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-500/10">
                  <LogOut className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Log Out</p>
                  <p className="text-sm text-gray-500">
                    Sign out of your account
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={handleLogout}
                loading={logoutLoading}
              >
                Log Out
              </Button>
            </div>
          </div>

          {/* Card 5: Danger Zone */}
          <div className="rounded-3xl border border-red-500/20 bg-red-500/[0.03] p-8 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-red-400">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </h2>

            <div className="space-y-4">
              {/* Delete Account */}
              <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/[0.02] px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                    <Trash2 className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-300">
                      Delete Account
                    </p>
                    <p className="text-xs text-gray-500">
                      Permanently remove your account and all data
                    </p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="!bg-red-600 hover:!bg-red-500"
                  onClick={() => setDeleteModalOpen(true)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
