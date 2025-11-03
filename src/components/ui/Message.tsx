import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Message as MessageType } from '../../types';
import { User, Bot } from 'lucide-react';
import { clsx } from 'clsx';
import { format } from 'date-fns';

interface MessageProps {
  message: MessageType;
}

// Simple HTML sanitization function (for production, use DOMPurify)
function sanitizeHtml(html: string): string {
  // Basic sanitization - remove script tags and dangerous attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/\n/g, '<br>');
}

// Memoized component to prevent unnecessary re-renders
export const Message = memo(function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';
  const isStreaming = message.isStreaming;
  
  // Sanitize content to prevent XSS attacks
  const sanitizedContent = useMemo(() => {
    return sanitizeHtml(message.content);
  }, [message.content]);

  // Format timestamp with memoization
  const formattedTime = useMemo(() => {
    try {
      return format(message.timestamp, 'HH:mm');
    } catch {
      return 'Invalid time';
    }
  }, [message.timestamp]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        gap: '12px',
        paddingLeft: '24px',
        paddingRight: '24px',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
      }}
      role="article"
      aria-label={`${isUser ? 'User' : 'Assistant'} message at ${formattedTime}`}
    >
      {!isUser && (
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #7e22ce 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '4px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
          role="img"
          aria-label="Assistant avatar"
        >
          <Bot size={18} style={{ color: 'white' }} aria-hidden="true" />
        </div>
      )}
      
      <div style={{
        maxWidth: '70%',
        borderRadius: '18px',
        padding: '14px 18px',
        fontSize: '14px',
        lineHeight: '1.6',
        boxShadow: isUser ? '0 2px 8px rgba(37, 99, 235, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
        background: isUser ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : '#ffffff',
        color: isUser ? '#ffffff' : '#1f2937',
        border: isUser ? 'none' : '1px solid #e5e7eb',
      }}>
        <div
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
          aria-live={isStreaming ? 'polite' : 'off'}
          aria-busy={isStreaming}
        >
          {isStreaming ? (
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <span dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '20px',
                  marginLeft: '4px',
                  backgroundColor: 'currentColor',
                  borderRadius: '2px',
                  animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
                aria-label="Loading"
                role="status"
              />
            </motion.div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
          )}
        </div>
        
        <time
          style={{
            fontSize: '11px',
            marginTop: '8px',
            fontWeight: 500,
            display: 'block',
            color: isUser ? 'rgba(255, 255, 255, 0.7)' : '#9ca3af',
          }}
          dateTime={message.timestamp.toISOString()}
        >
          {formattedTime}
        </time>
      </div>
      
      {isUser && (
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #4b5563 0%, #374151 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '4px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
          role="img"
          aria-label="User avatar"
        >
          <User size={16} style={{ color: 'white' }} aria-hidden="true" />
        </div>
      )}
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memo optimization
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.isStreaming === nextProps.message.isStreaming
  );
});

Message.displayName = 'Message';
