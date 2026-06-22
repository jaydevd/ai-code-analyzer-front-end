import {
  Archive,
  Loader2,
  MessageSquare,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { KeyboardEvent, useState } from "react";
import type { ChatHistoryItem } from "../types/dashboard.types";

interface ChatHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  chats: ChatHistoryItem[];
  onSelectChat: (chatId: string) => void;
  onRename: (chatId: string, title: string) => Promise<void>;
  onArchive: (chatId: string) => Promise<void>;
  onDelete: (chatId: string) => Promise<void>;
  loading?: boolean;
  activeChatId?: string | null;
}

const ChatHistoryPanel = ({
  isOpen,
  onClose,
  chats,
  onSelectChat,
  onRename,
  onArchive,
  onDelete,
  loading = false,
  activeChatId,
}: ChatHistoryPanelProps) => {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const formatTime = (unix: number) => {
    return formatDistanceToNow(new Date(unix * 1000), { addSuffix: true });
  };

  const startRename = (chat: ChatHistoryItem) => {
    setRenamingId(chat.id);
    setEditTitle(chat.title);
  };

  const commitRename = async () => {
    if (!renamingId || !editTitle.trim()) {
      setRenamingId(null);
      return;
    }
    setActionLoading(renamingId);
    try {
      await onRename(renamingId, editTitle.trim());
    } finally {
      setRenamingId(null);
      setActionLoading(null);
    }
  };

  const cancelRename = () => {
    setRenamingId(null);
    setEditTitle("");
  };

  const handleRenameKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commitRename();
    if (e.key === "Escape") cancelRename();
  };

  const handleArchive = async (chatId: string) => {
    setActionLoading(chatId);
    try {
      await onArchive(chatId);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (chatId: string) => {
    if (!window.confirm("Delete this chat session?")) return;
    setActionLoading(chatId);
    try {
      await onDelete(chatId);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
          fixed md:absolute top-0 left-0 z-50 h-full
          bg-[#020617] border-r border-white/10
          transition-transform duration-300 ease-in-out
          w-80
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 className="text-sm font-semibold tracking-wider text-zinc-400 uppercase">
            Chat History
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 p-1.5 text-slate-400 hover:text-white transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-65px)]">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={20} className="animate-spin text-sky-400" />
            </div>
          ) : chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <MessageSquare size={32} className="text-zinc-600 mb-3" />
              <p className="text-sm text-zinc-500">No chat history yet</p>
            </div>
          ) : (
            <div className="p-3 space-y-1">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`
                    group rounded-xl px-4 py-3 transition cursor-pointer
                    ${
                      activeChatId === chat.id
                        ? "bg-sky-500/10 border border-sky-500/20"
                        : "hover:bg-white/5 border border-transparent"
                    }
                  `}
                  onClick={() => {
                    if (renamingId !== chat.id) {
                      onSelectChat(chat.id);
                      onClose();
                    }
                  }}
                >
                  {renamingId === chat.id ? (
                    <input
                      autoFocus
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={commitRename}
                      onKeyDown={handleRenameKeyDown}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full rounded-md border border-sky-500/50 bg-transparent px-2 py-1 text-sm text-white outline-none"
                    />
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">
                          {chat.title}
                        </p>

                        {chat.repository && (
                          <p className="mt-1 text-xs text-zinc-500 truncate">
                            {chat.repository}{chat.branch ? ` / ${chat.branch}` : ""}
                          </p>
                        )}

                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] text-zinc-600">
                            {formatTime(chat.created_at)}
                          </span>
                          {chat.is_archived && (
                            <>
                              <span className="text-[10px] text-zinc-600">·</span>
                              <span className="text-[10px] text-amber-500">Archived</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 pt-0.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startRename(chat);
                          }}
                          disabled={actionLoading === chat.id}
                          className="rounded-lg p-1.5 text-zinc-500 hover:text-white hover:bg-white/10 transition disabled:opacity-50"
                          title="Rename"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArchive(chat.id);
                          }}
                          disabled={actionLoading === chat.id || chat.is_archived}
                          className="rounded-lg p-1.5 text-zinc-500 hover:text-amber-400 hover:bg-white/10 transition disabled:opacity-50"
                          title={chat.is_archived ? "Already archived" : "Archive"}
                        >
                          <Archive size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(chat.id);
                          }}
                          disabled={actionLoading === chat.id}
                          className="rounded-lg p-1.5 text-zinc-500 hover:text-red-400 hover:bg-white/10 transition disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatHistoryPanel;