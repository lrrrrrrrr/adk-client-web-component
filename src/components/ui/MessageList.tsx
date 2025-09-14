import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';
import { useChatStore } from '../../store/chatStore';

export function MessageList() {
  const messages = useChatStore((state) => state.messages);
  const isStreaming = useChatStore((state) => state.isStreaming);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
      {messages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center h-full text-center px-8 py-12"
        >
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <span className="text-3xl">🤖</span>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl blur opacity-20"></div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
            Welcome to ADK Chat
          </h3>
          <p className="text-gray-600 max-w-sm leading-relaxed">
            Start a conversation with your AI agent. Ask questions, get help, or just chat!
          </p>
        </motion.div>
      ) : (
        <div className="py-6 space-y-6">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          {isStreaming && <TypingIndicator />}
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
