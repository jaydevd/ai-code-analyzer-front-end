import { useState, useEffect, useCallback } from "react";
import {
  getAdminUsers,
  getAdminUserDetail,
  updateAdminUser,
  deleteAdminUser,
  suspendUser,
  activateUser,
  type GetUsersParams,
  type UpdateUserPayload,
} from "../api/users";
import type { AdminUser, PaginatedResponse } from "../types/admin.types";

export function useAdminUsers(initialParams?: GetUsersParams) {
  const [data, setData] = useState<PaginatedResponse<AdminUser> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<GetUsersParams | undefined>(initialParams);

  const fetch = useCallback(async (p?: GetUsersParams) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAdminUsers(p || params);
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetch(); }, [fetch]);

  const refetch = useCallback((newParams?: GetUsersParams) => {
    if (newParams) setParams(newParams);
    fetch(newParams || params);
  }, [fetch, params]);

  return { data, loading, error, refetch, params, setParams };
}

export function useAdminUserDetail(id: string | undefined) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getAdminUserDetail(id);
      setUser(result);
    } catch (err: any) {
      setError(err?.message || "Failed to load user detail");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleUpdate = useCallback(async (data: UpdateUserPayload) => {
    if (!id) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateAdminUser(id, data);
      setUser(updated);
    } catch (err: any) {
      setError(err?.message || "Failed to update user");
      throw err;
    } finally {
      setSaving(false);
    }
  }, [id]);

  const handleSuspend = useCallback(async () => {
    if (!id) return;
    try {
      await suspendUser(id);
      fetch();
    } catch (err: any) {
      setError(err?.message || "Failed to suspend user");
    }
  }, [id, fetch]);

  const handleActivate = useCallback(async () => {
    if (!id) return;
    try {
      await activateUser(id);
      fetch();
    } catch (err: any) {
      setError(err?.message || "Failed to activate user");
    }
  }, [id, fetch]);

  const handleDelete = useCallback(async () => {
    if (!id) return;
    try {
      await deleteAdminUser(id);
    } catch (err: any) {
      setError(err?.message || "Failed to delete user");
      throw err;
    }
  }, [id]);

  return {
    user, loading, saving, error,
    refetch: fetch,
    update: handleUpdate,
    suspend: handleSuspend,
    activate: handleActivate,
    deleteUser: handleDelete,
  };
}
