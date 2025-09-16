import React, { useState, useRef, type KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { clsx } from 'clsx';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [input, setInput] = useState('');
  const isLoading = useChatStore((state) => state.isLoading);
  const isStreaming = useChatStore((state) => state.isStreaming);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDisabled = isLoading || isStreaming;

  const handleSubmit = () => {
    const message = input.trim();
    if (message && !isDisabled) {
      onSendMessage(message);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustTextareaHeight();
  };

  return (
    <div className="border-t border-gray-100 p-6 bg-gradient-to-t from-gray-50 to-white">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isDisabled}
            rows={1}
            aria-label="Message input"
            aria-describedby="input-hint"
            className={clsx(
              'w-full resize-none rounded-2xl border-0 bg-gray-100 px-6 py-4 pr-14 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:shadow-lg disabled:opacity-50 transition-all duration-200',
              'min-h-[52px] max-h-32 text-gray-900 placeholder-gray-500'
            )}
          />
          <button
            type="submit"
            disabled={!input.trim() || isDisabled}
            className={clsx(
              'absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all duration-200 shadow-sm',
              input.trim() && !isDisabled
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-md'
                : 'text-gray-400 bg-gray-200'
            )}
          >
            {isLoading || isStreaming ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </form>
      <p id="input-hint" className="text-xs text-gray-400 mt-3 text-center font-medium">
        Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600">Shift+Enter</kbd> for new line
      </p>
      <p className="sr-only">
        Press Enter to send message, Shift+Enter for new line
      </p>
    </div>
  );
}
