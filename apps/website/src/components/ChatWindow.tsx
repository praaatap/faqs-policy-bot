import { useEffect, useRef } from "react";
import { Trash2, Bot } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useChat } from "../hooks/useChat";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";

const SUGGESTED = [
  "What is the leave policy?",
  "How do I claim reimbursement?",
  "What are the office hours?",
  "How do I raise an IT request?",
];

export default function ChatWindow() {
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const isFirst = messages.length === 1;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full bg-[#efeae2]">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#075E54] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center">
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Company Assistant</p>
            <p className="text-xs text-green-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block" />
              Online
            </p>
          </div>
        </div>

        {/* Clear button — give right padding so X doesn't overlap */}
        <button
          onClick={clearChat}
          className="flex items-center gap-1 text-xs text-green-200 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all mr-8"
        >
          <Trash2 size={13} />
          Clear
        </button>
      </div>


      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">

        {/* Suggested Questions — compact version */}
        <AnimatePresence>
          {isFirst && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl p-3 mb-2 shadow-sm"
            >
              {/* Top row — icon + text inline */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Hi, how can I help?</p>
                  <p className="text-xs text-gray-400">Ask about policies, benefits & more.</p>
                </div>
              </div>

              {/* Suggested pills — 2 col grid */}
              <div className="grid grid-cols-2 gap-1.5">
                {SUGGESTED.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl text-xs font-medium text-gray-600 hover:text-blue-700 transition-all text-left leading-snug"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* Messages */}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-end gap-2"
            >
              <div className="w-7 h-7 rounded-full bg-[#075E54] flex items-center justify-center flex-shrink-0">
                <Bot size={13} className="text-white" />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                <TypingIndicator />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <div className="text-center text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            ⚠️ {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div className="bg-[#f0f2f5] border-t border-gray-200 px-3 py-3 flex-shrink-0">
        <ChatInput onSend={sendMessage} disabled={isLoading} />
        <p className="text-center text-[10px] text-gray-300 mt-1.5">
          Answers based on your company documents
        </p>
      </div>

    </div>
  );
}
