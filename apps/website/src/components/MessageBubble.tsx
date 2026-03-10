import type { Message } from "../types/chat";
import { Bot, User } from "lucide-react";
import { motion } from "framer-motion";

interface Props { message: Message; }

export default function MessageBubble({ message }: Props) {
  const isAI = message.role === "ai";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex items-end gap-2 px-1 ${isAI ? "justify-start" : "justify-end"}`}
    >
      {/* AI Avatar — properly aligned */}
      {isAI && (
        <div className="w-7 h-7 rounded-full bg-[#075E54] flex items-center justify-center flex-shrink-0 mb-1 shadow-sm">
          <Bot size={13} className="text-white" />
        </div>
      )}

      <div className="flex flex-col gap-1 max-w-[75%]">
        <div className={`relative px-4 py-2.5 text-sm leading-relaxed
          ${isAI
            ? "bg-white text-gray-800 rounded-t-2xl rounded-br-2xl rounded-bl-sm shadow-sm"
            : "bg-[#25D366] text-white rounded-t-2xl rounded-bl-2xl rounded-br-sm shadow-sm"
          }`}
        >
          <p>{message.content}</p>
          <span className={`block text-right text-[10px] mt-1 select-none
            ${isAI ? "text-gray-300" : "text-green-100"}`}
          >
            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        {/* Sources */}
        {isAI && message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-1 pl-1">
            {message.sources.map((src, i) => (
              <span key={i} className="text-[11px] bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-0.5 rounded-full">
                📄 {src.split("/").pop()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {!isAI && (
        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mb-1">
          <User size={13} className="text-gray-500" />
        </div>
      )}
    </motion.div>
  );
}
