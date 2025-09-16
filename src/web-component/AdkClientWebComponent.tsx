import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ChatWindow } from '../components/ChatWindow';
import { useChatStore } from '../store/chatStore';
import type { ChatConfig } from '../types';
import '../index.css';

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
  const { updateConfig, setMode } = useChatStore();

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
          {mode === 'fullscreen' ? (
            <div className="min-h-screen bg-gray-50">
              <ChatWindow />
            </div>
          ) : (
            <ChatWindow />
          )}
        </div>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export class AdkClientWebComponent extends HTMLElement {
  private root: any;
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
    try {
      // Try to fetch the CSS file relative to the current page
      const cssPath = new URL('../adk-client-web-component.css', import.meta.url).href;
      const response = await fetch(cssPath);
      const css = await response.text();
      
      const style = document.createElement('style');
      style.textContent = css;
      this.shadowRoot!.appendChild(style);
    } catch (error) {
      // Fallback: try to find it relative to the page
      const styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.href = './adk-client-web-component.css';
      this.shadowRoot!.appendChild(styleLink);
    }
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
