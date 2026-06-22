import { useEffect, useState } from "react";
import { getRepos } from "../api/getRepos";

interface Repository {
  id: string;
  name: string;
  url: string;
  languages: string[];
  progress?: number;
  files?: number;
  branches?: number;
  chunks?: number;
}

const useGetRepos = () =>{
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const data = await getRepos();
        setRepos(data);
      } catch (err) {
        setError("Failed to fetch repositories");
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  return { repos, loading, error };
}

export default useGetRepos;