import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useChatStore } from '../store/chatStore';

export function FloatingButton() {
  const { setIsOpen } = useChatStore();

  return (
    <motion.button
      onClick={() => setIsOpen(true)}
      className="group relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden"
      style={{
        width: '64px',
        height: '64px',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      title="Open Chat"
      aria-label="Open chat window"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Pulsing ring animation */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-white/30"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Icon */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <MessageCircle size={28} className="drop-shadow-lg" />
      </div>

      {/* Badge for notifications (optional, can be enhanced later) */}
      <motion.div
        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        style={{ display: 'none' }} // Hidden by default, can be shown when needed
      >
        !
      </motion.div>
    </motion.button>
  );
}
