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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
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
    <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 focus-within:border-blue-400 focus-within:bg-white rounded-2xl p-2 transition-all">
      <textarea
        ref={textareaRef}
        rows={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about policies, leave, benefits..."
        disabled={disabled}
        className="flex-1 resize-none bg-transparent px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none disabled:opacity-50 max-h-[120px] leading-relaxed"
      />
      <button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className="h-9 w-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
      >
        <Send size={15} />
      </button>
    </div>
  );
}
