import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchRepos } from "@/app/slices/repositorySlice";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface RootState {
  repos: {
    repos: Array<{
      id: string;
      name: string;
      url: string;
      status: "not_scanned" | "scanning" | "scanned";
      progress?: number;
      files?: number;
      branches?: number;
      chunks?: number;
    }>;
    loading: boolean;
    error: string | null;
    hasFetched: boolean;
  };
  auth: {
    user: {
      is_github_installation_active?: boolean;
    } | null;
  };
}

const statusDisplay = {
  not_scanned: {
    label: "Not Scanned",
    className: "bg-gray-500/20 text-gray-400",
  },
  scanning: {
    label: "Scanning",
    className: "bg-blue-500/20 text-blue-400",
  },
  scanned: {
    label: "Scanned",
    className: "bg-emerald-500/20 text-emerald-400",
  },
};

const RepositoryTable = () => {
  const dispatch = useDispatch();
  const { repos, loading, error, hasFetched } = useSelector(
    (state: RootState) => state.repos
  );
  const githubConnected = useSelector(
    (state: RootState) => state.auth.user?.is_github_installation_active
  );

  useEffect(() => {
    if (!hasFetched && repos.length === 0) {
      dispatch(fetchRepos() as any);
    }
  }, [dispatch, hasFetched, repos?.length]);

  if (loading && repos.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="text-xl font-semibold text-white mb-6">
          Recent Repositories
        </h3>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="md" />
        </div>
      </div>
    );
  }

  if (!githubConnected && hasFetched) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="text-xl font-semibold text-white mb-6">
          Recent Repositories
        </h3>
        <p className="text-center text-zinc-500 py-8 text-sm">
          No data found. Connect GitHub to view repositories.
        </p>
      </div>
    );
  }

  if (error && repos.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="text-xl font-semibold text-white mb-6">
          Recent Repositories
        </h3>
        <p className="text-center text-zinc-500 py-8 text-sm">No data found</p>
      </div>
    );
  }

  const displayedRepos = repos?.slice(0, 5);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="text-xl font-semibold text-white mb-6">
        Recent Repositories
      </h3>

      <table className="w-full">
        <thead>
          <tr className="text-slate-500 text-left text-sm">
            <th className="pb-3">Name</th>
            <th className="pb-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {displayedRepos && displayedRepos.map((repo) => (
            <tr
              key={repo.id}
              className="border-t border-white/5"
            >
              <td className="py-4">
                <div>
                  <p className="text-white text-sm font-medium">
                    {repo.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {repo.url?.replace("https://github.com/", "") || repo.url}
                  </p>
                </div>
              </td>

              <td className="py-4">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                    statusDisplay[repo?.status]?.className
                  }`}
                >
                  {repo.status === "scanning" && (
                    <Loader2 size={12} className="animate-spin" />
                  )}
                  {repo.status === "scanned" && (
                    <CheckCircle2 size={12} />
                  )}
                  {statusDisplay[repo?.status]?.label}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {repos && repos.length === 0 && !loading && (
        <p className="text-center text-slate-500 py-8 text-sm">
          No repositories found
        </p>
      )}
    </div>
  );
};

export default RepositoryTable;