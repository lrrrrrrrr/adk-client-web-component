import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ChatWindow } from '../components/ChatWindow';
import { FloatingButton } from '../components/FloatingButton';
import { useChatStore } from '../store/chatStore';
import type { ChatConfig } from '../types';
import '../index.css';
import compiledStyles from './compiledStyles';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

interface AdkClientProps {
  apiUrl?: string;
  appName?: string;
  userId?: string;
  sessionId?: string;
  mode?: 'fullscreen' | 'widget';
  responseMode?: 'standard' | 'stream';
}

function AdkClientApp({ 
  apiUrl,
  appName, 
  userId, 
  sessionId, 
  mode = 'widget',
  responseMode = 'stream'
}: AdkClientProps) {
  const { updateConfig, setMode, isOpen } = useChatStore();

  React.useEffect(() => {
    const config: Partial<ChatConfig> = {};
    
    if (apiUrl) config.apiBaseUrl = apiUrl;
    if (appName) config.appName = appName;
    if (userId) config.userId = userId;
    if (sessionId) config.sessionId = sessionId;
    if (responseMode) config.responseMode = responseMode;

    if (Object.keys(config).length > 0) {
      updateConfig(config);
    }
    
    setMode(mode);
  }, [apiUrl, appName, userId, sessionId, mode, responseMode, updateConfig, setMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <div className="adk-client-container">
          {isOpen ? (
            mode === 'fullscreen' ? (
              <div className="min-h-screen bg-gray-50">
                <ChatWindow />
              </div>
            ) : (
              <ChatWindow />
            )
          ) : (
            <FloatingButton />
          )}
        </div>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export class AdkClientWebComponent extends HTMLElement {
  private root: ReturnType<typeof createRoot> | null = null;
  private mountPoint: HTMLDivElement;

  static get observedAttributes() {
    return [
      'api-url',
      'app-name', 
      'user-id',
      'session-id',
      'mode',
      'response-mode'
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Create mount point for React
    this.mountPoint = document.createElement('div');
    this.mountPoint.className = 'adk-client-root';
    this.shadowRoot!.appendChild(this.mountPoint);

    // Load the component CSS directly
    this.loadStyles();
  }

  private async loadStyles() {
    // First, inject the compiled Tailwind styles
    if (compiledStyles && compiledStyles.length > 0) {
      const style = document.createElement('style');
      style.textContent = compiledStyles;
      this.shadowRoot!.appendChild(style);
    }
    
    // Then add comprehensive fallback styles for critical UI elements
    const fallbackStyles = `
      /* Critical fallback styles for Shadow DOM */
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      .adk-client-root {
        font-family: system-ui, -apple-system, sans-serif;
        color: #111827;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      /* Header styles */
      .bg-gradient-to-r {
        background-image: linear-gradient(90deg, #2563eb, #1d4ed8, #7e22ce) !important;
        color: white !important;
      }
      
      .p-6 {
        padding: 1.5rem !important;
      }
      
      .text-white {
        color: white !important;
      }
      
      .text-xl {
        font-size: 1.25rem !important;
        line-height: 1.75rem !important;
      }
      
      .font-bold {
        font-weight: 700 !important;
      }
      
      .tracking-tight {
        letter-spacing: -0.025em !important;
      }
      
      /* Flexbox utilities */
      .flex {
        display: flex !important;
      }
      
      .items-center {
        align-items: center !important;
      }
      
      .justify-between {
        justify-content: space-between !important;
      }
      
      .gap-4 {
        gap: 1rem !important;
      }
      
      .gap-2 {
        gap: 0.5rem !important;
      }
      
      /* Background and borders */
      .bg-white {
        background-color: white !important;
      }
      
      .bg-gray-50 {
        background-color: #f9fafb !important;
      }
      
      .border {
        border-width: 1px !important;
        border-style: solid !important;
      }
      
      .border-gray-100 {
        border-color: #f3f4f6 !important;
      }
      
      .rounded-2xl {
        border-radius: 1rem !important;
      }
      
      .rounded-xl {
        border-radius: 0.75rem !important;
      }
      
      .shadow-2xl {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
      }
      
      .shadow-lg {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
      }
      
      /* Layout utilities */
      .relative {
        position: relative !important;
      }
      
      .overflow-hidden {
        overflow: hidden !important;
      }
      
      .w-12 {
        width: 3rem !important;
      }
      
      .h-12 {
        height: 3rem !important;
      }
      
      .w-96 {
        width: 24rem !important;
      }
      
      .h-\\[600px\\] {
        height: 600px !important;
      }
      
      .min-h-screen {
        min-height: 100vh !important;
      }
      
      .flex-1 {
        flex: 1 1 0% !important;
      }
      
      .flex-col {
        flex-direction: column !important;
      }
      
      /* Text utilities */
      .text-sm {
        font-size: 0.875rem !important;
        line-height: 1.25rem !important;
      }
      
      .text-xs {
        font-size: 0.75rem !important;
        line-height: 1rem !important;
      }
      
      .text-gray-600 {
        color: #4b5563 !important;
      }
      
      .text-blue-100 {
        color: #dbeafe !important;
      }
      
      /* Button base - keep minimal to avoid overriding utility paddings/borders */
      button {
        cursor: pointer;
        font: inherit;
        background: transparent;
      }
      
      /* Input and textarea styles */
      input[type="text"],
      input[type="email"],
      input[type="password"],
      input[type="url"],
      input[type="number"],
      textarea,
      select {
        width: 100%;
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: #111827;
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        transition: all 0.2s;
        font-family: system-ui, -apple-system, sans-serif;
        box-sizing: border-box;
      }
      
      input:focus,
      textarea:focus,
      select:focus {
        outline: none;
        border-color: #3b82f6;
        background-color: white;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
      
      input::placeholder,
      textarea::placeholder {
        color: #9ca3af;
      }
      
      /* Specific styles for the chat input */
      .bg-gray-100 {
        background-color: #f3f4f6 !important;
      }
      
      .focus\\:bg-white:focus {
        background-color: white !important;
      }
      
      .focus\\:ring-2:focus {
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2) !important;
      }
      
      .focus\\:ring-blue-500\\/20:focus {
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2) !important;
      }
      
      .placeholder-gray-500::placeholder {
        color: #6b7280 !important;
      }
      
      /* Radio button styles */
      input[type="radio"] {
        width: 1rem;
        height: 1rem;
        margin-right: 0.5rem;
        cursor: pointer;
      }
      
      /* Label styles */
      label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: #374151;
        margin-bottom: 0.25rem;
      }
      
      /* Form group spacing */
      .space-y-4 > * + * {
        margin-top: 1rem;
      }
      
      .space-y-2 > * + * {
        margin-top: 0.5rem;
      }
      
      /* Button specific styles */
      .bg-blue-600 {
        background-color: #2563eb !important;
        color: white !important;
      }
      
      .hover\\:bg-blue-700:hover {
        background-color: #1d4ed8 !important;
      }
      
      .px-4 {
        padding-left: 1rem !important;
        padding-right: 1rem !important;
      }
      
      .py-2 {
        padding-top: 0.5rem !important;
        padding-bottom: 0.5rem !important;
      }
      
      .py-2\\.5 {
        padding-top: 0.625rem !important;
        padding-bottom: 0.625rem !important;
      }
      
      .px-5 {
        padding-left: 1.25rem !important;
        padding-right: 1.25rem !important;
      }
      
      /* Settings panel and modal styles */
      .fixed {
        position: fixed !important;
      }
      
      .inset-0 {
        top: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        left: 0 !important;
      }
      
      .z-50 {
        z-index: 50 !important;
      }
      
      .bg-black\\/40 {
        background-color: rgba(0, 0, 0, 0.4) !important;
      }
      
      .backdrop-blur-sm {
        backdrop-filter: blur(4px) !important;
      }
      
      .max-w-md {
        max-width: 28rem !important;
      }
      
      .w-full {
        width: 100% !important;
      }
      
      .mx-auto {
        margin-left: auto !important;
        margin-right: auto !important;
      }
      
      .mt-16 {
        margin-top: 4rem !important;
      }
      
      .p-8 {
        padding: 2rem !important;
      }
      
      .mb-6 {
        margin-bottom: 1.5rem !important;
      }
      
      .mb-4 {
        margin-bottom: 1rem !important;
      }
      
      .mb-2 {
        margin-bottom: 0.5rem !important;
      }
      
      .text-2xl {
        font-size: 1.5rem !important;
        line-height: 2rem !important;
      }
      
      .text-gray-900 {
        color: #111827 !important;
      }
      
      .text-gray-700 {
        color: #374151 !important;
      }
      
      .grid {
        display: grid !important;
      }
      
      .grid-cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }
      
      .gap-3 {
        gap: 0.75rem !important;
      }
      
      /* Better button styles */
      button.bg-blue-600,
      .bg-gradient-to-r.from-blue-600 {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
        color: white !important;
        padding: 0.625rem 1.25rem !important;
        border-radius: 0.5rem !important;
        font-weight: 500 !important;
        font-size: 0.875rem !important;
        transition: all 0.2s !important;
        border: none !important;
        cursor: pointer !important;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1) !important;
      }
      
      button.bg-blue-600:hover,
      .bg-gradient-to-r.from-blue-600:hover {
        background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%) !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        transform: translateY(-1px) !important;
      }
      
      /* Secondary button styles */
      button.border-gray-300,
      button.bg-gray-200 {
        background-color: #f3f4f6 !important;
        color: #374151 !important;
        padding: 0.625rem 1.25rem !important;
        border-radius: 0.5rem !important;
        font-weight: 500 !important;
        font-size: 0.875rem !important;
        transition: all 0.2s !important;
        border: 1px solid #d1d5db !important;
        cursor: pointer !important;
      }
      
      button.border-gray-300:hover,
      button.bg-gray-200:hover {
        background-color: #e5e7eb !important;
        border-color: #9ca3af !important;
      }
      
      /* Icon buttons in header */
      .p-3 {
        padding: 0.75rem !important;
      }
      
      svg {
        display: block !important;
      }
      
      /* Radio button container styles */
      .border-2 {
        border-width: 2px !important;
      }
      
      .border-blue-600 {
        border-color: #2563eb !important;
      }
      
      .bg-blue-50 {
        background-color: #eff6ff !important;
      }
      
      /* Disabled state */
      button:disabled,
      input:disabled,
      textarea:disabled {
        opacity: 0.5 !important;
        cursor: not-allowed !important;
      }
      
      /* Close button (X) */
      .text-gray-400 {
        color: #9ca3af !important;
      }
      
      .hover\\:text-gray-600:hover {
        color: #4b5563 !important;
      }
      
      /* Transitions */
      .transition-all {
        transition-property: all !important;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;
        transition-duration: 200ms !important;
      }
      
      .transition-colors {
        transition-property: background-color, border-color, color, fill, stroke !important;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;
        transition-duration: 200ms !important;
      }
      
      /* Animation for modal */
      @keyframes slideIn {
        from {
          transform: translateY(-20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      .animate-slideIn {
        animation: slideIn 0.3s ease-out !important;
      }
      
      /* Icon container styles */
      .bg-white\\/10 {
        background-color: rgba(255, 255, 255, 0.1) !important;
      }
      .bg-white\\/15 {
        background-color: rgba(255, 255, 255, 0.15) !important;
      }
      
      .backdrop-blur-md {
        backdrop-filter: blur(12px) !important;
      }

      /* Overlay gradient utilities used in header */
      .from-blue-500\\/20 {
        --tw-gradient-from: rgba(59, 130, 246, 0.2) !important;
      }
      .to-purple-500\\/20 {
        --tw-gradient-to: rgba(168, 85, 247, 0.2) !important;
      }

      /* Text alignment utility */
      .text-left { text-align: left !important; }

      /* Border side utilities */
      .border-b { border-bottom-width: 1px !important; border-bottom-style: solid !important; }
      .border-l { border-left-width: 1px !important; border-left-style: solid !important; }

      
      /* Status indicator */
      .w-2 {
        width: 0.5rem !important;
      }
      
      .h-2 {
        height: 0.5rem !important;
      }
      
      .rounded-full {
        border-radius: 9999px !important;
      }
      
      .bg-green-400 {
        background-color: #4ade80 !important;
      }
      
      .bg-red-400 {
        background-color: #f87171 !important;
      }
      
      /* Ensure the gradient header always works */
      .adk-gradient-header {
        background-image: linear-gradient(90deg, #2563eb, #1d4ed8, #7e22ce) !important;
        color: white !important;
      }

      /* Additional utilities required by ConfigPanel for proper spacing and typography */
      .p-2 { padding: 0.5rem !important; }
      .p-3 { padding: 0.75rem !important; }
      .p-4 { padding: 1rem !important; }
      .p-5 { padding: 1.25rem !important; }
      .px-3\.5 { padding-left: 0.875rem !important; padding-right: 0.875rem !important; }
      .px-5 { padding-left: 1.25rem !important; padding-right: 1.25rem !important; }
      .py-4 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
      .py-2\.5 { padding-top: 0.625rem !important; padding-bottom: 0.625rem !important; }
      .mt-1 { margin-top: 0.25rem !important; }
      .mb-3 { margin-bottom: 0.75rem !important; }
      .space-y-6 > * + * { margin-top: 1.5rem !important; }
      .gap-4 { gap: 1rem !important; }
      .gap-6 { gap: 1.5rem !important; }

      .w-\[420px\] { width: 420px !important; }
      .w-9 { width: 2.25rem !important; }
      .h-9 { height: 2.25rem !important; }
      .h-5 { height: 1.25rem !important; }
      .w-5 { width: 1.25rem !important; }
      .h-full { height: 100% !important; }
      .min-h-\[18px\] { min-height: 18px !important; }
      .overflow-y-auto { overflow-y: auto !important; }

      .rounded-l-2xl { border-top-left-radius: 1rem !important; border-bottom-left-radius: 1rem !important; }

      .text-base { font-size: 1rem !important; line-height: 1.5rem !important; }
      .text-gray-500 { color: #6b7280 !important; }
      .text-gray-700 { color: #374151 !important; }
      .text-blue-700 { color: #1d4ed8 !important; }
      .text-blue-100\/90 { color: rgba(219, 234, 254, 0.9) !important; }
      .text-\[10px\] { font-size: 10px !important; line-height: 1 !important; }

      .bg-gray-50\/60 { background-color: rgba(249, 250, 251, 0.6) !important; }
      .hover\:bg-gray-50:hover { background-color: #f9fafb !important; }

      .border-l { border-left-width: 1px !important; border-left-style: solid !important; }
      .border-gray-200 { border-color: #e5e7eb !important; }
      .border-red-300 { border-color: #fca5a5 !important; }

      .placeholder-gray-400::placeholder { color: #9ca3af !important; }

      .focus\:ring-blue-200:focus { box-shadow: 0 0 0 3px rgba(191, 219, 254, 1) !important; }
      .focus\:ring-red-200:focus { box-shadow: 0 0 0 3px rgba(254, 202, 202, 1) !important; }
      .focus\:outline-none:focus { outline: none !important; }

      .shadow { box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px -1px rgba(0,0,0,.1) !important; }
      .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0,0,0,.05) !important; }
      .hover\:shadow:hover { box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px -1px rgba(0,0,0,.1) !important; }

      .z-40 { z-index: 40 !important; }
      .backdrop-blur-\[2px\] { backdrop-filter: blur(2px) !important; }

    `;
    
    const fallbackStyle = document.createElement('style');
    fallbackStyle.textContent = fallbackStyles;
    this.shadowRoot!.appendChild(fallbackStyle);
  }

  connectedCallback() {
    if (!this.root) {
      this.render();
    }
  }

  attributeChangedCallback() {
    if (this.root) {
      this.render();
    }
  }

  disconnectedCallback() {
    if (this.root) {
      this.root.unmount();
    }
  }

  private getProps(): AdkClientProps {
    return {
      apiUrl: this.getAttribute('api-url') || undefined,
      appName: this.getAttribute('app-name') || undefined,
      userId: this.getAttribute('user-id') || undefined,
      sessionId: this.getAttribute('session-id') || undefined,
      mode: (this.getAttribute('mode') as 'fullscreen' | 'widget') || 'widget',
      responseMode: (this.getAttribute('response-mode') as 'standard' | 'stream') || 'stream'
    };
  }

  private render() {
    if (this.root) {
      this.root.unmount();
    }
    
    // Clear any existing content first
    this.mountPoint.innerHTML = '';
    this.root = createRoot(this.mountPoint);
    this.root.render(React.createElement(AdkClientApp, this.getProps()));
  }
}
