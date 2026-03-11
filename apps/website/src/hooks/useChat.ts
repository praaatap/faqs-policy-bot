import { useState, useCallback } from "react";
import type { Message, ChatResponse } from "../types/chat";
import { useQueryParams } from "./useQueryParams";

const API_URL = "http://localhost:8000/api";
const SESSION_ID = crypto.randomUUID();

export function useChat() {
  const { id, subs } = useQueryParams();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: `👋 Hi! I'm the ${subs} assistant for ${id}. Ask me anything!`,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (question: string) => {
    if (!question.trim()) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          session_id: SESSION_ID,
          company_id: id,       // ← send to backend
          subject: subs,        // ← send to backend
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");
      const data: ChatResponse = await res.json();

      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(),
        role: "ai",
        content: data.answer,
        sources: data.sources,
        timestamp: new Date(),
      }]);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [id, subs]);

  const clearChat = useCallback(async () => {
    await fetch(`${API_URL}/clear/${SESSION_ID}`, { method: "DELETE" });
    setMessages([{
      id: "welcome",
      role: "ai",
      content: `👋 Chat cleared! Ask me anything about ${subs}.`,
      timestamp: new Date(),
    }]);
  }, [subs]);

  return { messages, isLoading, error, sendMessage, clearChat, id, subs };
}
