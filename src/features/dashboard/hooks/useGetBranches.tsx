import { useEffect, useState } from "react";
import { getBranches } from "../api/getBranches";
import type { Branch } from "../types/dashboard.types";

const useGetBranches = (repoName: string | null) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!repoName) {
      setBranches([]);
      return;
    }

    const fetchBranches = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBranches(repoName);
        setBranches(data);
      } catch (err) {
        setError("Failed to fetch branches");
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, [repoName]);

  return { branches, loading, error };
};

export default useGetBranches;