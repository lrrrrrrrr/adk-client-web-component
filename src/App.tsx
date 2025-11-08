import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ChatWindow } from './components/ChatWindow';
import { FloatingButton } from './components/FloatingButton';
import { useChatStore } from './store/chatStore';
import './index.css';

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
  const { updateConfig, setMode, setIsOpen, isOpen } = useChatStore();
  const [testCase, setTestCase] = React.useState<string>('default');

  const testCases = {
    default: {
      title: 'ADK Assistant',
      emoji: '🤖',
      showSettings: true,
      description: 'Default configuration with all features visible',
    },
    custom: {
      title: 'Support Bot',
      emoji: '💬',
      showSettings: true,
      description: 'Custom title and emoji with settings visible',
    },
    secure: {
      title: 'Secure Assistant',
      emoji: '🔒',
      showSettings: false,
      description: 'Custom branding with settings HIDDEN',
    },
    minimal: {
      title: 'AI Assistant',
      emoji: '🚀',
      showSettings: false,
      description: 'Minimal interface with no settings access',
    },
  };

  const applyTestCase = (caseKey: string) => {
    const testConfig = testCases[caseKey as keyof typeof testCases];
    setTestCase(caseKey);
    updateConfig({
      title: testConfig.title,
      emoji: testConfig.emoji,
      showSettings: testConfig.showSettings,
    });
    setIsOpen(true);
  };

  React.useEffect(() => {
    // Apply default config on mount
    applyTestCase('default');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          {/* Control Panel */}
          <div className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-8 py-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">ADK Client - Customization Test</h1>
              <p className="text-gray-600 mb-4">Select a test case to see different customization options:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(testCases).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => applyTestCase(key)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      testCase === key
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{config.emoji}</span>
                      <span className="font-semibold text-gray-900">{config.title}</span>
                    </div>
                    <p className="text-xs text-gray-600">{config.description}</p>
                    <div className="mt-2 text-xs">
                      <span className={`px-2 py-1 rounded ${
                        config.showSettings 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        Settings: {config.showSettings ? 'Visible ⚙️' : 'Hidden ❌'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Window Preview */}
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Preview:</h2>
              {isOpen ? (
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                  <ChatWindow />
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center relative" style={{ minHeight: '300px' }}>
                  <p className="text-gray-500 text-lg mb-2">Chat window is closed</p>
                  <p className="text-gray-400 text-sm mb-4">Click the floating button below to reopen</p>
                  {/* Show FloatingButton in bottom-right of this container */}
                  <div className="absolute bottom-6 right-6">
                    <FloatingButton />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
