import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ChatWindow from "./ChatWindow";
import { CustomLogo } from "./CustomLogo";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ── Floating Button ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#075E54] text-white flex items-center justify-center shadow-2xl shadow-black/30"
          >
            <CustomLogo size={26} className="text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat Popup ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`
                fixed z-50
                /* Mobile — full screen */
                inset-0
                /* Desktop — bottom right popup */
                md:inset-auto md:bottom-6 md:right-6
                md:w-[400px] md:h-[600px]
                md:rounded-2xl md:shadow-2xl md:shadow-black/20
                overflow-hidden
                flex flex-col
              `}
            >
              {/* Close button overlay */}
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Inject ChatWindow */}
              <ChatWindow />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
