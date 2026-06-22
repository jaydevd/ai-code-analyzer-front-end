import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "../types/dashboard.types";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";
  const time = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true });

  return (
    <div
      className={`
        flex gap-3 ${isUser ? "justify-end ml-auto max-w-[85%] md:max-w-[75%]" : "mr-auto max-w-4xl"}
      `}
    >
      {!isUser && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center mt-1">
          <svg
            className="w-4 h-4 text-sky-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.734-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
      )}

      <div className="flex flex-col">
        <div
          className={`
            px-4 py-3 rounded-2xl ${
              isUser
                ? "bg-sky-500/20 text-white rounded-br-none"
                : "border border-white/10 bg-white/[0.04] text-white rounded-bl-none"
            }
          `}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/40 prose-code:text-sky-300">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        <p className="mt-1.5 text-xs text-zinc-500">{time}</p>
      </div>
    </div>
  );
};

export default ChatMessage;