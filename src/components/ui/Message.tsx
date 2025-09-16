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
      className={clsx(
        'flex gap-4 px-6',
        isUser ? 'justify-end' : 'justify-start'
      )}
      role="article"
      aria-label={`${isUser ? 'User' : 'Assistant'} message at ${formattedTime}`}
    >
      {!isUser && (
        <div
          className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg"
          role="img"
          aria-label="Assistant avatar"
        >
          <Bot size={20} className="text-white" aria-hidden="true" />
        </div>
      )}
      
      <div className={clsx(
        'max-w-[75%] rounded-3xl px-6 py-4 text-sm shadow-sm',
        isUser
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-500/10'
          : 'bg-white text-gray-800 border border-gray-100 shadow-gray-900/5'
      )}>
        <div
          className="whitespace-pre-wrap break-words leading-relaxed"
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
                className="inline-block w-2 h-5 ml-1 bg-current animate-pulse rounded-sm"
                aria-label="Loading"
                role="status"
              />
            </motion.div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
          )}
        </div>
        
        <time
          className={clsx(
            'text-xs mt-3 font-medium block',
            isUser ? 'text-blue-100' : 'text-gray-400'
          )}
          dateTime={message.timestamp.toISOString()}
        >
          {formattedTime}
        </time>
      </div>
      
      {isUser && (
        <div
          className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg"
          role="img"
          aria-label="User avatar"
        >
          <User size={18} className="text-white" aria-hidden="true" />
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
