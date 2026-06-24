import { useState, useEffect, useCallback } from "react";
import {
  getAdminRepos,
  deleteAdminRepo,
  rescanAdminRepo,
  type GetReposParams,
} from "../api/repos";
import type { AdminRepo, PaginatedResponse } from "../types/admin.types";

export function useAdminRepos(initialParams?: GetReposParams) {
  const [data, setData] = useState<PaginatedResponse<AdminRepo> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<GetReposParams | undefined>(initialParams);

  const fetch = useCallback(async (p?: GetReposParams) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAdminRepos(p || params);
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Failed to load repositories");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetch(); }, [fetch]);

  const refetch = useCallback((newParams?: GetReposParams) => {
    if (newParams) setParams(newParams);
    fetch(newParams || params);
  }, [fetch, params]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteAdminRepo(id);
      fetch();
    } catch (err: any) {
      throw err;
    }
  }, [fetch]);

  const handleRescan = useCallback(async (id: string) => {
    try {
      await rescanAdminRepo(id);
      fetch();
    } catch (err: any) {
      throw err;
    }
  }, [fetch]);

  return { data, loading, error, refetch, params, setParams, deleteRepo: handleDelete, rescanRepo: handleRescan };
}
