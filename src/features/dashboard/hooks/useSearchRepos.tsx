import { useCallback, useRef, useState } from "react";
import { searchRepos } from "../api/searchRepos";

interface SearchResult {
  id: string;
  name: string;
  url: string;
  status?: string;
}

const useSearchRepos = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const search = useCallback(async (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const data = await searchRepos(q);
      setResults(data ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    (q: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => search(q), 300);
    },
    [search]
  );

  const clear = useCallback(() => {
    setResults([]);
    setQuery("");
  }, []);

  return { results, loading, query, debouncedSearch, clear };
};

export default useSearchRepos;
