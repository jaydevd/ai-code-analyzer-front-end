import { useCallback, useEffect, useState } from "react";
import { getScanReport } from "../api/getScanReport";
import type { BranchScanReport } from "../types/dashboard.types";

const useGetScanReport = (repoId: string | null) => {
  const [report, setReport] = useState<BranchScanReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    if (!repoId) {
      setReport([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await getScanReport(repoId);
      setReport(data.data);
    } catch (err) {
      setError("Failed to fetch scan report");
    } finally {
      setLoading(false);
    }
  }, [repoId]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return { report, loading, error, refetch: fetchReport };
};

export default useGetScanReport;
