import { useState, useEffect, useCallback } from "react";
import { getAdminStats, getScanStatsOverTime } from "../api/stats";
import type { AdminStats, ScanStatsOverTime } from "../types/admin.types";

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [scansOverTime, setScansOverTime] = useState<ScanStatsOverTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, scansData] = await Promise.all([
        getAdminStats(),
        getScanStatsOverTime(),
      ]);
      setStats(statsData);
      setScansOverTime(scansData);
    } catch (err: any) {
      setError(err?.message || "Failed to load admin stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { stats, scansOverTime, loading, error, refetch: fetch };
}
