import { useState, useEffect, useCallback } from "react";
import { getAdminLogs, type GetLogsParams } from "../api/logs";
import type { ErrorLog, PaginatedResponse } from "../types/admin.types";

export function useAdminLogs(initialParams?: GetLogsParams) {
  const [data, setData] = useState<PaginatedResponse<ErrorLog> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<GetLogsParams | undefined>(initialParams);

  const fetch = useCallback(async (p?: GetLogsParams) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAdminLogs(p || params);
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Failed to load logs");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetch(); }, [fetch]);

  const refetch = useCallback((newParams?: GetLogsParams) => {
    if (newParams) setParams(newParams);
    fetch(newParams || params);
  }, [fetch, params]);

  return { data, loading, error, refetch, params, setParams };
}
