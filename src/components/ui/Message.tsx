import { motion } from 'framer-motion';
import type { Message as MessageType } from '../../types';
import { User } from 'lucide-react';
import { clsx } from 'clsx';
import { format } from 'date-fns';

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';
  const isStreaming = message.isStreaming;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'flex gap-4 px-6',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
          <span className="text-white text-lg">🤖</span>
        </div>
      )}
      
      <div className={clsx(
        'max-w-[75%] rounded-3xl px-6 py-4 text-sm shadow-sm',
        isUser 
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-500/10' 
          : 'bg-white text-gray-800 border border-gray-100 shadow-gray-900/5'
      )}>
        <div className="whitespace-pre-wrap break-words leading-relaxed">
          {isStreaming ? (
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              {message.content}
              <span className="inline-block w-2 h-5 ml-1 bg-current animate-pulse rounded-sm" />
            </motion.span>
          ) : (
            message.content
          )}
        </div>
        
        <div className={clsx(
          'text-xs mt-3 font-medium',
          isUser ? 'text-blue-100' : 'text-gray-400'
        )}>
          {format(message.timestamp, 'HH:mm')}
        </div>
      </div>
      
      {isUser && (
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
          <User size={18} className="text-white" />
        </div>
      )}
    </motion.div>
  );
}
