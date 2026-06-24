import { useState, useEffect, useCallback } from "react";
import { getAdminScans, getAdminScanDetail, retryScan, type GetScansParams } from "../api/scans";
import type { ScanJob, PaginatedResponse } from "../types/admin.types";

export function useAdminScans(initialParams?: GetScansParams) {
  const [data, setData] = useState<PaginatedResponse<ScanJob> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<GetScansParams | undefined>(initialParams);

  const fetch = useCallback(async (p?: GetScansParams) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAdminScans(p || params);
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Failed to load scans");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetch(); }, [fetch]);

  const refetch = useCallback((newParams?: GetScansParams) => {
    if (newParams) setParams(newParams);
    fetch(newParams || params);
  }, [fetch, params]);

  return { data, loading, error, refetch, params, setParams };
}

export function useAdminScanDetail(id: string | undefined) {
  const [scan, setScan] = useState<ScanJob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getAdminScanDetail(id);
      setScan(result);
    } catch (err: any) {
      setError(err?.message || "Failed to load scan detail");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleRetry = useCallback(async () => {
    if (!id) return;
    try {
      await retryScan(id);
      fetch();
    } catch (err: any) {
      setError(err?.message || "Failed to retry scan");
    }
  }, [id, fetch]);

  return { scan, loading, error, refetch: fetch, retry: handleRetry };
}
