import { FolderGit2, Loader2, Search, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import useSearchRepos from "../hooks/useSearchRepos";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchDialog = ({ isOpen, onClose }: SearchDialogProps) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { results, loading, debouncedSearch, clear } = useSearchRepos();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelect = (repo: { id: string; name: string }) => {
    clear();
    onClose();
    navigate(`/repositories/${encodeURIComponent(repo.name)}`);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm pt-[15vh]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-[#020617] shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 border-b border-zinc-800 px-5 py-4">
          <Search size={18} className="text-zinc-500 shrink-0" />
          <input
            ref={inputRef}
            onChange={(e) => debouncedSearch(e.target.value)}
            placeholder="Search repositories..."
            className="flex-1 bg-transparent text-white outline-none placeholder:text-zinc-500"
          />
          {loading && <Loader2 size={16} className="animate-spin text-zinc-500 shrink-0" />}
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition shrink-0">
            <X size={18} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {results.length === 0 && !loading && (
            <p className="px-5 py-8 text-center text-sm text-zinc-500">
              Type to search repositories
            </p>
          )}

          {results.map((repo) => (
            <button
              key={repo.id}
              onClick={() => handleSelect(repo)}
              className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-white/[0.04]"
            >
              <FolderGit2 size={16} className="text-zinc-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">{repo.name}</p>
                <p className="text-xs text-zinc-500 truncate">{repo.url}</p>
              </div>
              <span className="shrink-0 text-xs text-zinc-600">View report</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchDialog;
