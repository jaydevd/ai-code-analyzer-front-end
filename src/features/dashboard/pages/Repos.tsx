import {
  ExternalLink,
  FolderGit2,
  GitBranch,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  fetchRepos,
  Repository,
} from "@/app/slices/repositorySlice";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import SearchDialog from "../components/SearchDialog";

interface RootState {
  repos: {
    repos: Repository[];
    loading: boolean;
    error: string | null;
    hasFetched: boolean;
  };
  auth: {
    user: {
      github_username?: string;
      github_installation_account_login?: string;
      is_github_installation_active?: boolean;
      is_github_repo_connected?: boolean;
    } | null;
  };
}

const Repos = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const { repos, loading, error, hasFetched } = useSelector(
    (state: RootState) => state.repos
  );
  const githubUsername = useSelector(
    (state: RootState) =>
      state.auth.user?.github_installation_account_login ||
      state.auth.user?.github_username
  );
  const githubConnected = useSelector(
    (state: RootState) =>
      state.auth.user?.is_github_repo_connected ??
      state.auth.user?.is_github_installation_active
  );

  useEffect(() => {
    if (!hasFetched && repos.length === 0) {
      dispatch(fetchRepos() as any);
    }
  }, [dispatch, hasFetched, repos.length]);

  const handleOpenGitHub = useCallback(
    (e: React.MouseEvent, repo: Repository) => {
      e.stopPropagation();
      const baseUrl = import.meta.env.VITE_GITHUB_BASE_URL || "https://github.com";
      const repoPath = repo.url?.replace(`${baseUrl}/`, "") || `${githubUsername || ""}/${repo.name}`;
      const url = `${baseUrl}/${repoPath}`;
      window.open(url, "_blank", "noopener,noreferrer");
    },
    [githubUsername]
  );

  if (loading && repos.length === 0) return <LoadingSpinner fullPage />;

  if (!githubConnected && hasFetched) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-8 py-6 text-center backdrop-blur-xl">
          <FolderGit2 className="mx-auto mb-3 h-8 w-8 text-zinc-600" />
          <p className="text-zinc-500">No data found. Connect GitHub to view repositories.</p>
        </div>
      </div>
    );
  }

  if (error && repos.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-8 py-6 text-center backdrop-blur-xl">
          <FolderGit2 className="mx-auto mb-3 h-8 w-8 text-zinc-600" />
          <p className="text-zinc-500">No data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-10/12 mx-auto min-h-screen text-zinc-100">
      <div className="w-full mx-auto py-8">

        {/* Search */}
        <div className="w-full pb-8 mb-10 flex items-center justify-center border-b border-white/10">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex w-xl items-center gap-3 rounded-lg border border-zinc-800 bg-white/[0.04] px-4 py-2.5 text-sm transition hover:border-zinc-700"
          >
            <Search size={16} className="text-zinc-500 shrink-0" />
            <span className="text-zinc-500">Search repositories...</span>
          </button>
        </div>

        {/* Repository Grid */}
        <div className="px-4 py-2 mb-5">
          <h1 className="font-bold text-4xl text-white">Repositories</h1>
        </div>

        <div className="px-4 grid gap-6 lg:grid-cols-2 xl:grid-cols-4 auto-rows-fr">
          {repos.map((repo) => (
            <div
              key={repo.id}
              onClick={() => navigate(`/repositories/${encodeURIComponent(repo.name)}`)}
              className="flex h-full flex-col rounded-2xl border border-zinc-900 bg-white/[0.07] p-5 transition hover:border-zinc-700 cursor-pointer"
            >
              {/* Top */}
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <FolderGit2 size={18} className="shrink-0" />
                    <h2 className="font-medium truncate">
                      {repo.name}
                    </h2>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500 truncate">
                    {repo.url}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="mt-auto pt-6 flex items-center gap-4">
                {repo.branches !== undefined && (
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <GitBranch size={14} />
                    <span>{repo.branches} branch{repo.branches !== 1 ? "es" : ""}</span>
                  </div>
                )}

                <button
                  onClick={(e) => handleOpenGitHub(e, repo)}
                  className="ml-auto flex items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-zinc-700 hover:text-white"
                >
                  <ExternalLink size={12} />
                  GitHub
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

export default Repos;
