import Button from "@/components/ui/Button";
import { SendHorizontal } from "lucide-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput = ({
  onSend,
  disabled = false,
  placeholder = "Ask a question about your codebase...",
}: ChatInputProps) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 rounded-4xl border border-white/10 bg-white/[0.04] px-2 py-2 transition focus-within:border-sky-500/50">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="relative flex-1 bg-transparent resize-none overflow-y-auto max-h-72 px-4 py-2 text-white outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-60"
      />

      <Button
        variant="primary"
        size="md"
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className="h-10 w-10 rounded-full! p-3! flex text-white"
      >
        <SendHorizontal className="text-white" />
      </Button>
    </div>
  );
};

export default ChatInput;