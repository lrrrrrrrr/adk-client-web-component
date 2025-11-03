import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Minimize2, Maximize2, AlertCircle, X } from 'lucide-react';
import { MessageList } from './ui/MessageList';
import { ChatInput } from './ui/ChatInput';
import { ConfigPanel } from './ui/ConfigPanel';
import { useChatStore } from '../store/chatStore';
import { useChat } from '../hooks/useChat';
import { clsx } from 'clsx';

interface ChatWindowProps {
  className?: string;
}

export function ChatWindow({ className }: ChatWindowProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const { mode, error, setMode, setError, setIsOpen } = useChatStore();
  const { sendMessage, isConnected, isSessionLoading } = useChat();

  const isFullscreen = mode === 'fullscreen';

  const toggleMode = () => {
    setMode(isFullscreen ? 'widget' : 'fullscreen');
  };

  const handleClose = () => {
    // If in fullscreen, switch to widget mode first
    if (isFullscreen) {
      setMode('widget');
    }
    setIsOpen(false);
  };

  const handleSendMessage = (message: string) => {
    if (error) setError(null);
    sendMessage(message);
  };

  return (
    <motion.div
      layout
      role="region"
      aria-label="Chat window"
      aria-live="polite"
      className={clsx(
        'bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100',
        isFullscreen
          ? 'fixed inset-4 z-30'
          : 'w-96 h-[600px]',
        className
      )}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Header */}
      <div
        className="adk-gradient-header bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white p-6 relative overflow-hidden"
        style={{ backgroundImage: 'linear-gradient(90deg, #2563eb, #1d4ed8, #7e22ce)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">ADK Assistant</h2>
              <div className="flex items-center gap-2 text-sm text-blue-100">
                <div className={clsx(
                  'w-2 h-2 rounded-full shadow-sm',
                  isConnected ? 'bg-green-400 shadow-green-400/50' : 'bg-red-400 shadow-red-400/50'
                )} />
                <span className="font-medium">
                  {isSessionLoading ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 relative z-10">
            <button
              onClick={() => setIsConfigOpen(true)}
              className="p-3 hover:bg-white/10 rounded-xl transition-all duration-200 backdrop-blur-sm"
              title="Settings"
              type="button"
            >
              <Settings size={20} />
            </button>
            
            <button
              onClick={toggleMode}
              className="p-3 hover:bg-white/10 rounded-xl transition-all duration-200 backdrop-blur-sm"
              title={isFullscreen ? 'Minimize' : 'Maximize'}
              type="button"
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            
            <button
              onClick={handleClose}
              className="p-3 hover:bg-white/10 rounded-xl transition-all duration-200 backdrop-blur-sm"
              title="Close"
              type="button"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200 px-6 py-4"
        >
          <div className="flex items-center gap-3 text-red-800">
            <div className="p-1 bg-red-200 rounded-full">
              <AlertCircle size={16} />
            </div>
            <span className="text-sm font-semibold">Connection Error</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto p-1 hover:bg-red-200 rounded-full transition-colors text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
          <p className="text-xs text-red-700 mt-2 ml-8">{error}</p>
        </motion.div>
      )}

      {/* Messages */}
      <MessageList />

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} />

      {/* Configuration Panel */}
      <ConfigPanel isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} />
    </motion.div>
  );
}
