import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { Send } from "lucide-react";

interface Props {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2">

      {/* Text Input */}
      <div className="flex-1 flex items-end bg-white border border-gray-200 rounded-3xl px-4 py-2 shadow-sm focus-within:border-gray-300 transition-all">
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message..."
          disabled={disabled}
          className="flex-1 resize-none bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none disabled:opacity-50 max-h-[100px] leading-relaxed py-1"
        />
      </div>

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#22c55e] flex items-center justify-center flex-shrink-0 shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <Send size={16} className="text-white translate-x-[1px]" />
      </button>

    </div>
  );
}
