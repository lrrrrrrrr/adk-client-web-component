import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ChatWindow } from './components/ChatWindow';
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

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          {mode === 'fullscreen' ? (
            <ChatWindow />
          ) : (
            <div className="fixed bottom-4 right-4 z-50">
              <ChatWindow />
            </div>
          )}
        </div>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
