# Method 3: React Component Demo

This demo demonstrates how to use the ADK Client Web Component as a React component in your existing React application. The demo is completely self-contained with its own dependencies.

**Note:** This demo currently uses the local project code (`file:../../`) for development. For production, you would use the published npm package.

**TypeScript Note:** Since the local build doesn't include type definitions, a local type declaration file (`src/adk-client-web-component.d.ts`) is provided for TypeScript support.

**Dependencies Note:** The demo includes all the library's peer dependencies (`framer-motion`, `@tanstack/react-query`, etc.) because when using a local file reference, these need to be installed explicitly.

## Setup Instructions

### Prerequisites
First, build the parent project to generate the distribution files:

```bash
# From the project root (adk-chat/)
npm install
npm run build
```

### Then setup this demo:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to `http://localhost:5173` (or whatever port Vite uses)

## What This Demo Shows

- **React Component Usage**: Import and use ChatWindow as a React component
- **TypeScript Support**: Full type definitions and IntelliSense
- **Dynamic Configuration**: Real-time configuration changes
- **Component State Management**: React state integration
- **Fullscreen Mode**: Embedded chat interface
- **Widget Mode**: Floating chat widget
- **Advanced Integration**: Event handling and props

## Key Features Demonstrated

- Component import and CSS import
- Props-based configuration
- TypeScript interfaces
- State management integration
- Event handling
- Dynamic re-rendering
- Component lifecycle management

## Code Examples

### Basic Usage
```tsx
import React from 'react';
import { ChatWindow } from 'adk-client-web-component';
import 'adk-client-web-component/dist/adk-client-web-component.css';

function App() {
  return (
    <div className="app">
      <ChatWindow />
    </div>
  );
}
```

### Advanced Usage with Configuration
```tsx
import React, { useState } from 'react';
import { ChatWindow, ChatConfig } from 'adk-client-web-component';

function App() {
  const [config, setConfig] = useState<ChatConfig>({
    apiUrl: 'http://localhost:8000',
    appName: 'my_agent',
    userId: 'user_123',
    sessionId: 'session_123',
    mode: 'fullscreen',
    responseMode: 'stream'
  });

  return (
    <ChatWindow
      {...config}
      onMessage={(message) => console.log('New message:', message)}
      className="custom-chat-styles"
    />
  );
}
```

## Component Props

```typescript
interface ChatWindowProps {
  apiUrl?: string;
  appName?: string;
  userId?: string;
  sessionId?: string;
  mode?: 'widget' | 'fullscreen';
  responseMode?: 'standard' | 'stream';
  className?: string;
  style?: React.CSSProperties;
  onMessage?: (message: Message) => void;
  onConfigChange?: (config: ChatConfig) => void;
}
```

## TypeScript Support

The package includes full TypeScript definitions:

```typescript
import type { ChatConfig, Message, ChatState } from 'adk-client-web-component';

interface MyConfig extends ChatConfig {
  customSetting: boolean;
}
```

## Advantages of React Integration

- **Full React ecosystem compatibility**
- **TypeScript support out of the box**
- **Component state management**
- **Event handling integration**
- **Custom styling through props**
- **Hot module replacement in development**
- **Build optimization with React bundlers**

## Build and Deploy

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Preview production build**:
   ```bash
   npm run preview
   ```

3. **Deploy**: The `dist` folder contains the optimized production build

## Integration Tips

1. **CSS Import**: Always import the CSS file alongside the component
2. **Environment Variables**: Use React environment variables for configuration
3. **Error Boundaries**: Wrap the component in React error boundaries
4. **Performance**: Use React.memo for optimization if needed
5. **Styling**: Override styles using CSS-in-JS or styled-components

## Troubleshooting

- **Component not rendering**: Check imports and CSS inclusion
- **TypeScript errors**: Ensure proper type imports
- **Build issues**: Verify Vite configuration and dependencies
- **Styling problems**: Check CSS import order and specificity
