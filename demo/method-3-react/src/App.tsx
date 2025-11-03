import { useEffect, useRef } from 'react';
// Import the web component registration
import '../../../src/web-component/standalone';
import './index.css';

// Declare the custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'adk-client': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'api-url'?: string;
        'app-name'?: string;
        'user-id'?: string;
        'session-id'?: string;
        'mode'?: 'widget' | 'fullscreen';
        'response-mode'?: 'standard' | 'stream';
      };
    }
  }
}

function App() {
  const chatRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Ensure the web component is registered
    if (!customElements.get('adk-client')) {
      console.log('Web component not yet registered');
    }
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>ADK Client - React Web Component Demo</h1>
        <p style={{ color: '#666', marginBottom: '10px' }}>
          This demo shows how to use the ADK Client Web Component in a React application.
          The component uses Shadow DOM with embedded styles, so no external CSS is needed!
        </p>
        <div style={{ padding: '15px', background: '#f0f9ff', borderLeft: '4px solid #0ea5e9', borderRadius: '4px' }}>
          <strong>✓ Features:</strong> Web Component with Shadow DOM, embedded Tailwind CSS, no style conflicts, works in any framework.
        </div>
        <div style={{ marginTop: '15px', padding: '15px', background: '#fffbeb', borderLeft: '4px solid #f59e0b', borderRadius: '4px' }}>
          <strong>📝 Note:</strong> The component has a built-in configuration panel (gear icon). Click it to modify API URL, app name, and other settings.
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Live Demo - Fullscreen Mode</h2>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          Below is the web component in fullscreen mode with Shadow DOM. All styles are encapsulated!
        </p>
        <div style={{ height: '600px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
          <adk-client
            ref={chatRef}
            api-url="http://localhost:8000"
            app-name="my_sample_agent"
            user-id="react_demo_user"
            session-id="react_demo_session"
            mode="fullscreen"
            response-mode="stream"
          />
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Usage Example</h2>
        <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '20px', borderRadius: '8px', overflow: 'auto' }}>
          <code>{`// 1. Import the web component (auto-registers)
import 'adk-client-web-component';

// 2. Use it in your React JSX
function App() {
  return (
    <div>
      <adk-client
        api-url="http://localhost:8000"
        app-name="my_sample_agent"
        user-id="user_123"
        session-id="session_123"
        mode="fullscreen"
        response-mode="stream"
      />
    </div>
  );
}

// TypeScript: Declare the custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'adk-client': any;
    }
  }
}`}</code>
        </pre>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Key Features</h2>
        <ul style={{ listStyle: 'disc', paddingLeft: '25px', color: '#374151' }}>
          <li style={{ marginBottom: '10px' }}><strong>Shadow DOM:</strong> Encapsulated styles - no CSS conflicts with your app!</li>
          <li style={{ marginBottom: '10px' }}><strong>Embedded Styles:</strong> All Tailwind CSS compiled and embedded in the component</li>
          <li style={{ marginBottom: '10px' }}><strong>Framework Agnostic:</strong> Works in React, Vue, Angular, or vanilla JavaScript</li>
          <li style={{ marginBottom: '10px' }}><strong>Built-in Config Panel:</strong> Users can configure settings via the UI (gear icon)</li>
          <li style={{ marginBottom: '10px' }}><strong>Two Modes:</strong> Widget (bottom-right corner) and Fullscreen (full container)</li>
          <li style={{ marginBottom: '10px' }}><strong>Streaming Support:</strong> Real-time message streaming from the AI agent</li>
          <li style={{ marginBottom: '10px' }}><strong>TypeScript:</strong> TypeScript declarations available for type safety</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
