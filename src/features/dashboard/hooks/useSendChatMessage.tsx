import { useCallback, useRef, useState } from "react";
import { sendChatStream } from "../api/sendChatMessage";

interface SendChatOptions {
  repoName?: string;
  branchName?: string;
  chatId: string;
}

const useSendChatMessage = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (prompt: string, options: SendChatOptions) => {
      if (isStreaming) return;

      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      setIsStreaming(true);
      setStreamingContent("");

      try {
        const response = await sendChatStream(prompt, options, signal);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response body");
        }

        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          setStreamingContent((prev) => prev + text);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          // Ignore aborted requests
        } else {
          console.error("Streaming error:", err);
        }
      } finally {
        setIsStreaming(false);
      }
    },
    [isStreaming]
  );

  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  return { sendMessage, isStreaming, streamingContent, stopGeneration };
};

export default useSendChatMessage;