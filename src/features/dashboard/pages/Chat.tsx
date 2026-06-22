import { ChevronRight, History, Loader2, MessageSquare, Plus, StopCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { fetchRepos } from "@/app/slices/repositorySlice";
import Button from "@/components/ui/Button";
import ChatHistoryPanel from "../components/ChatHistoryPanel";
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";
import RepoBranchSelector from "../components/RepoBranchSelector";
import useCreateChatSession from "../hooks/useCreateChatSession";
import useGetBranches from "../hooks/useGetBranches";
import useGetChatHistory from "../hooks/useGetChatHistory";
import useGetChatMessages from "../hooks/useGetChatMessages";
import useSendChatMessage from "../hooks/useSendChatMessage";
import useUpdateChatSession from "../hooks/useUpdateChatSession";
import type { Message } from "../types/dashboard.types";

const Chat = () => {
  const dispatch = useDispatch();
  const { repos, loading: reposLoading, hasFetched } = useSelector(
    (state: any) => state.repos
  );

  useEffect(() => {
    if (!hasFetched && repos.length === 0) {
      dispatch(fetchRepos() as any);
    }
  }, [dispatch, hasFetched, repos.length]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [creatingSession, setCreatingSession] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const accumulatedContentRef = useRef("");
  const { branches, loading: branchesLoading } = useGetBranches(selectedRepo || null);
  const { chats, loading: chatsLoading, refetch: refetchChats } = useGetChatHistory();
  const { messages: historyMessages, loading: historyLoading } =
    useGetChatMessages(currentChatId);
  const { sendMessage, isStreaming, streamingContent, stopGeneration } =
    useSendChatMessage();
  const { createSession } = useCreateChatSession();

  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const prevChatIdRef = useRef<string | null>(null);

  useEffect(() => {
    const prev = prevChatIdRef.current;
    prevChatIdRef.current = currentChatId;

    if (currentChatId === prev) return;

    accumulatedContentRef.current = "";

    if (prev !== null) {
      setMessages([]);
    }

    if (currentChatId) {
      setIsLoadingHistory(true);
    }
  }, [currentChatId]);

  useEffect(() => {
    if (!historyLoading && isLoadingHistory) {
      setIsLoadingHistory(false);
      if (historyMessages.length > 0) {
        setMessages(historyMessages);
      }
    }
  }, [historyLoading, historyMessages, isLoadingHistory]);

  useEffect(() => {
    if (streamingContent) {
      accumulatedContentRef.current = streamingContent;
    }
  }, [streamingContent]);

  useEffect(() => {
    if (!isStreaming && accumulatedContentRef.current) {
      const content = accumulatedContentRef.current;
      accumulatedContentRef.current = "";
      if (content.trim()) {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}`,
            content,
            role: "assistant",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    }
  }, [isStreaming]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const handleNewChat = useCallback(() => {
    setCurrentChatId(null);
    setMessages([]);
    accumulatedContentRef.current = "";
  }, []);

  const handleSend = async (prompt: string) => {
    let chatId = currentChatId;

    if (!chatId) {
      setCreatingSession(true);
      try {
        const session = await createSession(
          "Untitled Chat",
          selectedRepo || undefined,
          selectedBranch || undefined
        );
        chatId = session.id;
        setCurrentChatId(chatId);
        refetchChats();
      } catch {
        toast.error("Failed to create chat session");
        setCreatingSession(false);
        return;
      } finally {
        setCreatingSession(false);
      }
    }

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      content: prompt,
      role: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);

    const selectedRepoName = repos.find((r) => r.name === selectedRepo)?.name;

    await sendMessage(prompt, {
      repoName: selectedRepoName || undefined,
      branchName: selectedBranch || undefined,
      chatId: chatId!,
    });
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    setShowHistory(false);
  };

  const { rename, archive, deleteSession } = useUpdateChatSession();

  const handleRename = async (chatId: string, title: string) => {
    await rename(chatId, title);
    refetchChats();
    toast.success("Chat renamed");
  };

  const handleArchive = async (chatId: string) => {
    await archive(chatId);
    refetchChats();
    toast.success("Chat archived");
  };

  const handleDelete = async (chatId: string) => {
    await deleteSession(chatId);
    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setMessages([]);
      accumulatedContentRef.current = "";
    }
    refetchChats();
    toast.success("Chat deleted");
  };

  const sessionStarted = messages.length > 0;
  const isEmpty =
    messages.length === 0 && !streamingContent && !isStreaming;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ChatHistoryPanel
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        chats={chats}
        onSelectChat={handleSelectChat}
        onRename={handleRename}
        onArchive={handleArchive}
        onDelete={handleDelete}
        loading={chatsLoading}
        activeChatId={currentChatId}
      />

      <header className="flex items-center justify-end gap-2 border-b border-white/10 px-4 md:px-8 py-4">
        <button
          onClick={handleNewChat}
          disabled={creatingSession}
          className="flex items-center gap-1.5 rounded-full font-semibold bg-gray-300 px-3 py-2 text-sm text-sky-900 hover:bg-gray-200 transition disabled:opacity-50"
        >
          <Plus size={18} />
          New Chat
        </button>

        <Button
          variant="icon"
          onClick={() => setShowHistory(!showHistory)}
          className={`${showHistory ? "bg-white/5 text-white" : ""} h-9 w-9 p-0! rounded-full!`}
        >
          <History size={18} />
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
            {isEmpty ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="rounded-2xl p-8 max-w-md">
                  <MessageSquare size={50} className="mx-auto text-gray-600" />
                  <h2 className="mt-4 text-4xl font-medium text-gray-300">
                    Get Started
                  </h2>
                  <p className="mt-2 text-md text-sky-700 gap-1 flex items-center justify-center">
                    Select Repo<ChevronRight size={16} />Select Branch<ChevronRight size={16} />Ask Questions
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}

                {isStreaming && streamingContent && (
                  <ChatMessage
                    message={{
                      id: "streaming",
                      content: streamingContent,
                      role: "assistant",
                      timestamp: new Date().toISOString(),
                    }}
                  />
                )}

                {isStreaming && !streamingContent && (
                  <div className="flex items-center gap-2 text-zinc-500 ml-1">
                    <Loader2 size={16} className="animate-spin text-sky-400" />
                    <span className="text-sm">Generating...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="border-t border-white/10 px-4 md:px-8 py-4">
            <div className="mx-auto max-w-4xl space-y-2">
              <RepoBranchSelector
                repos={repos}
                branches={branches}
                selectedRepo={selectedRepo}
                selectedBranch={selectedBranch}
                onRepoChange={(repoName) => {
                  setSelectedRepo(repoName);
                  setSelectedBranch("");
                }}
                onBranchChange={setSelectedBranch}
                reposLoading={reposLoading}
                branchesLoading={branchesLoading}
                disabled={sessionStarted}
              />

              {sessionStarted && (
                <p className="text-[11px] text-zinc-500 text-center">
                  Repo and branch are locked for this session.{' '}
                  <button
                    onClick={handleNewChat}
                    className="text-sky-400 hover:text-sky-300 underline"
                  >
                    Start new chat
                  </button>{' '}
                  to change context.
                </p>
              )}

              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <ChatInput
                    onSend={handleSend}
                    disabled={isStreaming || !selectedRepo || !selectedBranch || creatingSession}
                    placeholder={
                      !selectedRepo
                        ? "Select a repository first..."
                        : !selectedBranch
                          ? "Select a branch first..."
                          : "Ask a question about your codebase..."
                    }
                  />
                </div>
                {isStreaming && (
                  <button
                    onClick={stopGeneration}
                    className="flex items-center gap-1.5 rounded-xl border border-red-500/30 px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition"
                  >
                    <StopCircle size={14} />
                    Stop
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;