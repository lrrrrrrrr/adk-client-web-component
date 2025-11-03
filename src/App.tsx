import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ChatWindow } from './components/ChatWindow';
import { FloatingButton } from './components/FloatingButton';
import { useChatStore } from './store/chatStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const mode = useChatStore((state) => state.mode);
  const isOpen = useChatStore((state) => state.isOpen);

  console.log('🔍 App rendering - isOpen:', isOpen, 'mode:', mode);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          {isOpen ? (
            <>
              {console.log('🔍 Rendering ChatWindow (isOpen=true)')}
              {mode === 'fullscreen' ? (
                <ChatWindow />
              ) : (
                <div className="fixed bottom-4 right-4 z-50">
                  <ChatWindow />
                </div>
              )}
            </>
          ) : (
            <>
              {console.log('🔍 Rendering FloatingButton (isOpen=false)')}
              <div className="fixed bottom-6 right-6 z-50">
                <FloatingButton />
              </div>
            </>
          )}
        </div>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
