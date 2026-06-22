import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  FolderGit2,
  Loader2,
} from "lucide-react";

import { fetchRepos, Repository } from "@/app/slices/repositorySlice";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface RootState {
  repos: {
    repos: Repository[];
    loading: boolean;
    error: string | null;
    hasFetched: boolean;
  };
}

const Repos = () => {
  const dispatch = useDispatch();
  const { repos, loading, error, hasFetched } = useSelector(
    (state: RootState) => state.repos
  );

  useEffect(() => {
    if (!hasFetched && repos.length === 0) {
      dispatch(fetchRepos() as any);
    }
  }, [dispatch, hasFetched, repos.length]);

  if (loading && repos.length === 0) return <LoadingSpinner fullPage />;

  if (error && repos.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617]">
        <div className="rounded-3xl border border-red-500/20 bg-red-500/[0.03] px-8 py-6 text-center backdrop-blur-xl">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-400" />
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-10/12 mx-auto min-h-screen text-zinc-100">
      <div className="w-full mx-auto py-8">

        {/* Search */}
        <div className="w-full pb-8 mb-10 flex items-center justify-center border-b border-white/10">
          <input
            placeholder="Search repositories..."
            className="w-xl h-11 rounded-lg border border-zinc-800 bg-white/[0.04] px-4 text-sm outline-none transition focus:border-zinc-700"
          />
        </div>

        {/* Repository Grid */}
        <div className="px-4 py-2 mb-5">
          <h1 className="font-bold text-4xl text-white">Repositories</h1>
        </div>

        <div className="px-4 grid gap-6 lg:grid-cols-2 xl:grid-cols-4 auto-rows-fr">
          {repos.map((repo) => (
            <div
              key={repo.id}
              className="flex h-full flex-col rounded-2xl border border-zinc-900 bg-white/[0.07] p-5 transition hover:border-zinc-800"
            >
              {/* Top */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <FolderGit2 size={18} />
                    <h2 className="font-medium">
                      {repo.name}
                    </h2>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">
                    {repo.url}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="mt-6">
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Status
                </p>
                <div className="mt-2">
                  {repo.status === "not_scanned" && (
                    <span className="text-sm text-zinc-400">
                      Not Scanned
                    </span>
                  )}

                  {repo.status === "scanning" && (
                    <div className="flex items-center gap-2 text-blue-400">
                      <Loader2 size={16} className="animate-spin" />
                      <span>Scanning</span>
                    </div>
                  )}

                  {repo.status === "scanned" && (
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 size={16} />
                      <span>Scanned</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress */}
              {repo.status === "scanning" && (
                <div className="mt-5">
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${repo.progress || 0}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">
                    {repo.progress || 0}% completed
                  </p>
                </div>
              )}

              {/* Metrics */}
              {repo.status === "scanned" && (
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <Metric label="Files" value={repo.files ?? 0} />
                  <Metric label="Branches" value={repo.branches ?? 0} />
                  <Metric label="Chunks" value={repo.chunks ?? 0} />
                </div>
              )}

              {/* Action */}
              <div className="mt-auto pt-6">
                {repo.status === "scanning" && (
                  <button
                    disabled
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 px-4 py-2 text-sm text-zinc-400"
                  >
                    <Loader2 size={16} className="animate-spin" />
                    Scanning...
                  </button>
                )}

                {repo.status === "scanned" && (
                  <button className="w-full rounded-xl border-2 border-sky-900 px-4 py-2 text-sm font-medium transition hover:border-zinc-700">
                    Open Repository
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <button className="absolute bottom-4 px-5 py-3 bg-gray-700 rounded-lg w-fit flex gap-2 items-center text-sm font-medium transition text-white cursor-pointer">
        Manage Repos on Github <ExternalLink className="size-4"/>
      </button>
    </div>
  );
}

export default Repos;

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-medium">{value.toLocaleString()}</p>
    </div>
  );
}
