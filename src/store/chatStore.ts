import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatState, Message, ChatConfig } from '../types';
import { env } from '../config/env';

interface ChatStore extends ChatState {
  // Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  setLoading: (loading: boolean) => void;
  setStreaming: (streaming: boolean) => void;
  setError: (error: string | null) => void;
  setMode: (mode: ChatState['mode']) => void;
  setConnected: (connected: boolean) => void;
  updateConfig: (config: Partial<ChatConfig>) => void;
  clearMessages: () => void;
  reset: () => void;
}

const defaultConfig: ChatConfig = {
  appName: env.ADK_APP_NAME,
  userId: env.ADK_USER_ID,
  sessionId: env.ADK_SESSION_ID,
  apiBaseUrl: env.ADK_API_URL,
  responseMode: 'stream',
};

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  isStreaming: false,
  error: null,
  mode: 'fullscreen',
  isConnected: false,
  config: defaultConfig,
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      ...initialState,

      addMessage: (message) => {
        const newMessage: Message = {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        };
        
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      },

      updateMessage: (id, updates) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, ...updates } : msg
          ),
        }));
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setStreaming: (streaming) => set({ isStreaming: streaming }),
      setError: (error) => set({ error }),
      setMode: (mode) => set({ mode }),
      setConnected: (connected) => set({ isConnected: connected }),

      updateConfig: (configUpdates) => {
        set((state) => ({
          config: { ...state.config, ...configUpdates },
        }));
      },

      clearMessages: () => set({ messages: [] }),

      reset: () => set(initialState),
    }),
    {
      name: 'adk-client-web-component-store',
      partialize: (state) => ({
        config: state.config,
        mode: state.mode,
      }),
    }
  )
);
