import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useChatStore } from '../store/chatStore';

export function FloatingButton() {
  const { setIsOpen } = useChatStore();

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="group relative text-white rounded-full transition-all duration-300 overflow-hidden"
        style={{
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #7e22ce 100%)',
          boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
          border: 'none',
          cursor: 'pointer',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ 
          scale: 1.1,
          boxShadow: '0 12px 32px rgba(37, 99, 235, 0.5)',
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        title="Open Chat"
        aria-label="Open chat window"
      >
      
      {/* Pulsing ring animation */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '9999px',
          border: '2px solid rgba(255, 255, 255, 0.4)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.6, 0, 0.6],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Icon */}
      <div style={{ 
        position: 'relative', 
        zIndex: 10, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%' 
      }}>
        <MessageCircle size={26} strokeWidth={2} />
      </div>
    </motion.button>
    </div>
  );
}
