import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useChatStore } from '../store/chatStore';

export function FloatingButton() {
  const { setIsOpen, config } = useChatStore();
  const title = config.title || 'ADK Assistant';
  const emoji = config.emoji || '🤖';
  
  // Icon configuration
  const iconMode = config.floatingButtonIcon || 'default';
  const useEmoji = iconMode === 'emoji';
  const customIcon = iconMode !== 'default' && iconMode !== 'emoji' ? iconMode : null;
  
  // Color configuration - default gradient
  const defaultGradient = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #7e22ce 100%)';
  const buttonBackground = config.floatingButtonColor || defaultGradient;

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="group relative text-white rounded-full transition-all duration-300 overflow-hidden"
        style={{
          width: '60px',
          height: '60px',
          background: buttonBackground,
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
        title={`Open ${title}`}
        aria-label={`Open ${title}`}
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
        height: '100%',
        fontSize: useEmoji ? '28px' : 'inherit'
      }}>
        {customIcon ? (
          <span style={{ fontSize: '28px' }}>{customIcon}</span>
        ) : useEmoji ? (
          emoji
        ) : (
          <MessageCircle size={26} strokeWidth={2} />
        )}
      </div>
    </motion.button>
    </div>
  );
}
