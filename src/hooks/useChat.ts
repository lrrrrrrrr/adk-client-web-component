import { useCallback, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useChatStore } from '../store/chatStore';
import { ADKApiService } from '../services/adkApi';

export function useChat() {
  const {
    config,
    addMessage,
    updateMessage,
    setLoading,
    setStreaming,
    setError,
    setConnected,
  } = useChatStore();

  const apiService = new ADKApiService(config.apiBaseUrl);

  // Helper to extract text from ADK events (streaming and non-streaming)
  const extractText = (ev: unknown): string => {
    // Expected schema sample:
    // { content: { parts: [{ text: '...' }], role: 'model' }, partial?: boolean, ... }
    const event = ev as Record<string, unknown>;
    const parts = (event?.content as Record<string, unknown>)?.parts;
    if (Array.isArray(parts)) {
      return parts.map((p) => (p as Record<string, unknown>)?.text ?? '').join('');
    }
    // Fallbacks for alternative shapes
    const dataContent = (event?.data as Record<string, unknown>)?.content;
    if (typeof dataContent === 'string') return dataContent;
    const content = event?.content;
    if (typeof content === 'string') return content;
    return '';
  };

  // Initialize session
  const { data: session, isLoading: isSessionLoading, error: _sessionError } = useQuery({
    queryKey: ['session', config.appName, config.userId, config.sessionId],
    queryFn: async () => {
      try {
        return await apiService.getSession(config);
      } catch {
        // If session doesn't exist, create it
        return await apiService.createSession(config);
      }
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Handle session state
  useEffect(() => {
    if (session) {
      setConnected(true);
    } else if (_sessionError) {
      console.error('Session initialization failed:', _sessionError);
      setError('Failed to connect to ADK server');
      setConnected(false);
    }
  }, [session, _sessionError, setConnected, setError]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      setError(null);
      setLoading(true);
      
      // Add user message immediately
      addMessage({
        role: 'user',
        content: message,
      });

      // Create assistant message placeholder
      const tempMessage = {
        role: 'assistant' as const,
        content: '',
        isStreaming: true,
      };
      addMessage(tempMessage);
      // Retrieve the id of the last message we just added
      const assistantMessageId = useChatStore.getState().messages.at(-1)?.id as string;
      const isStreamMode = useChatStore.getState().config.responseMode === 'stream';
      if (isStreamMode) {
        setStreaming(true);
      }
      
      try {
        let fullResponse = '';
        
        if (isStreamMode) {
          await apiService.sendMessageStreaming(config, message, (event) => {
            const chunk = extractText(event);
            if (chunk) {
              fullResponse += chunk;
              updateMessage(assistantMessageId, {
                content: fullResponse,
                isStreaming: true,
              });
            }
          });
        } else {
          // Non-streaming: send once, then update the message with the final content
          const events = await apiService.sendMessage(config, message);
          for (const ev of events) {
            const chunk = extractText(ev);
            if (chunk) fullResponse += chunk;
          }
        }

        // Finalize the message
        updateMessage(assistantMessageId, {
          content: fullResponse || 'No response received',
          isStreaming: false,
        });
        
      } catch (error) {
        console.error('Failed to send message:', error);
        updateMessage(assistantMessageId, {
          content: 'Sorry, I encountered an error processing your message.',
          isStreaming: false,
        });
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
        if (isStreamMode) setStreaming(false);
      }
    },
  });

  // List available apps
  const { data: availableApps } = useQuery({
    queryKey: ['apps', config.apiBaseUrl],
    queryFn: () => apiService.listApps(),
    enabled: !!config.apiBaseUrl,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const sendMessage = useCallback((message: string) => {
    if (message.trim() && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate(message);
    }
  }, [sendMessageMutation]);

  return {
    sendMessage,
    session,
    availableApps,
    isSessionLoading,
    isConnected: !isSessionLoading && !!session,
  };
}
