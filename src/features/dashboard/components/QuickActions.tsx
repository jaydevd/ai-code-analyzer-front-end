import {
  ChevronRight,
  ExternalLink,
  FolderGit2,
  Loader2,
  MessageSquare
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useInstallGithubApp from "../hooks/useInstallGithubApp";

const QuickActions = () => {
  const navigate = useNavigate();
  const installGithub = useInstallGithubApp();
  const [githubLoading, setGithubLoading] = useState(false);

  const user = useSelector((state: any) => state.auth.user);
  const githubConnected = user?.is_github_repo_connected ?? user?.is_github_installation_active;
  const githubUsername =
    user?.github_installation_account_login ||
    user?.github_username;

  const handleGithubClick = async () => {
    if (githubConnected) {
      window.open(
        "https://github.com/settings/installations",
        "_blank"
      );
      return;
    }

    setGithubLoading(true);
    try {
      await installGithub();
    } finally {
      setGithubLoading(false);
    }
  };

  const handleRepositoriesClick = () => {
    navigate("/dashboard", {
       state: {
        tab: 'repos'
       }
    });
  };

  const handleChatClick = () => {
    navigate("/dashboard", {
      state: {
        tab: 'chat'
      }
    });
  };

  const actions = [
    {
      id: "github",
      icon: FaGithub,
      title: githubConnected
        ? "GitHub Connected"
        : "Connect GitHub",
      description: githubConnected
        ? `Connected as @${githubUsername}`
        : "Connect your repositories to Origin.",
      cta: githubConnected
        ? "Manage on GitHub"
        : "Connect GitHub",
      onClick: handleGithubClick,
    },
    {
      id: "repositories",
      icon: FolderGit2,
      title: "Scan Repositories",
      description:
        "Index and analyze repositories for AI search.",
      cta: "Open Repositories",
      onClick: handleRepositoriesClick,
    },
    {
      id: "chat",
      icon: MessageSquare,
      title: "Start AI Chat",
      description:
        "Ask questions about your indexed codebases.",
      cta: "Open Chat",
      onClick: handleChatClick,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {actions.map((action) => (
        <div
          key={action.id}
          className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-sky-500/30"
        >
          <action.icon
            size={28}
            className="text-sky-400"
          />

          <h3 className="mt-4 text-lg font-semibold text-white">
            {action.title}
          </h3>

          <p className="mt-2 mb-8 text-sm text-zinc-400">
            {action.description}
          </p>

          <button
            onClick={action.onClick}
            disabled={githubLoading && action.id === "github"}
            className="w-fit mt-auto inline-flex items-center gap-3 rounded-xl bg-gray-200 px-4 py-2 text-sm font-medium text-sky-900 transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {githubLoading && action.id === "github" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                {action.cta}
                {action.id === "github" ? (
                  githubConnected ? (
                    <ExternalLink className="size-4" />
                  ) : (
                    <FaGithub className="size-4" />
                  )
                ) : (
                  <ChevronRight className="size-4" />
                )}
              </>
            )}
          </button>
        </div>
      ))}
    </div>
  );
};

export default QuickActions;
