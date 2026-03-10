import { motion } from "framer-motion";

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 h-3">
      {[0, 0.15, 0.3].map((delay, i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.6, repeat: Infinity, delay, ease: "easeInOut" }}
          className="w-2 h-2 bg-violet-400 rounded-full"
        />
      ))}
    </div>
  );
}
