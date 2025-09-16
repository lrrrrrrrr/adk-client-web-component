# ADK Client Web Component - NPM Usage

## Installation

```bash
npm install adk-client-web-component
```

## Usage

### Method 1: Web Component (Recommended)

The easiest way to use the ADK Client is as a web component. It automatically registers itself when imported:

```html
<!DOCTYPE html>
<html>
<head>
  <title>ADK Client Example</title>
  <!-- Include the CSS -->
  <link rel="stylesheet" href="node_modules/adk-client-web-component/dist/style.css">
</head>
<body>
  <!-- Web component with configuration attributes -->
  <adk-client 
    api-url="http://localhost:8000"
    app-name="my_sample_agent"
    user-id="user_123"
    session-id="session_123"
    mode="widget"
    response-mode="stream">
  </adk-client>

  <!-- Import the component -->
  <script type="module">
    import 'adk-client-web-component';
  </script>
</body>
</html>
```

### Method 2: React Component

You can also use it as a React component in your existing React application:

```tsx
import React from 'react';
import { ChatWindow } from 'adk-client-web-component';
import 'adk-client-web-component/dist/style.css';

function App() {
  return (
    <div className="app">
      <ChatWindow />
    </div>
  );
}

export default App;
```

### Method 3: Programmatic Web Component

Register and use the web component programmatically:

```javascript
import { AdkClientWebComponent } from 'adk-client-web-component';

// Register the component
customElements.define('my-adk-client', AdkClientWebComponent);

// Create and configure the element
const adkClient = document.createElement('my-adk-client');
adkClient.setAttribute('api-url', 'http://localhost:8000');
adkClient.setAttribute('app-name', 'my_sample_agent');
adkClient.setAttribute('mode', 'fullscreen');

// Add to DOM
document.body.appendChild(adkClient);
```

## Web Component Attributes

Configure the ADK Client using HTML attributes:

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `api-url` | string | - | ADK server base URL |
| `app-name` | string | - | Agent application name |
| `user-id` | string | - | User identifier |
| `session-id` | string | - | Session identifier |
| `mode` | `'widget'` \| `'fullscreen'` | `'widget'` | Display mode |
| `response-mode` | `'standard'` \| `'stream'` | `'stream'` | Response handling mode |

### Examples

#### Widget Mode (Bottom Right Corner)
```html
<adk-client 
  api-url="http://localhost:8000"
  app-name="my_agent"
  mode="widget">
</adk-client>
```

#### Fullscreen Mode
```html
<adk-client 
  api-url="http://localhost:8000"
  app-name="my_agent"
  mode="fullscreen">
</adk-client>
```

#### With Custom Configuration
```html
<adk-client 
  api-url="https://api.mycompany.com"
  app-name="customer_support_agent"
  user-id="user_456"
  session-id="session_789"
  response-mode="standard">
</adk-client>
```

## CDN Usage (No Build Step)

You can use the component directly from CDN without any build process:

```html
<!DOCTYPE html>
<html>
<head>
  <title>ADK Client CDN Example</title>
  <link rel="stylesheet" href="https://unpkg.com/adk-client-web-component/dist/style.css">
</head>
<body>
  <adk-client 
    api-url="http://localhost:8000"
    app-name="my_sample_agent"
    mode="widget">
  </adk-client>

  <script type="module">
    import 'https://unpkg.com/adk-client-web-component/dist/adk-client.es.js';
  </script>
</body>
</html>
```

## TypeScript Support

The package includes full TypeScript definitions:

```typescript
import type { ChatConfig, Message, ChatState } from 'adk-client-web-component';

interface MyConfig extends ChatConfig {
  customSetting: boolean;
}
```

## Styling

The component uses Tailwind CSS internally but is scoped within its shadow DOM. You can customize the appearance by:

1. **Override CSS Custom Properties** (if exposed)
2. **Wrapper styling** for positioning and sizing
3. **Custom themes** through configuration

```css
/* Position the widget */
adk-client[mode="widget"] {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

/* Custom width for widget */
adk-client[mode="widget"] {
  width: 400px;
  height: 600px;
}
```

## Backend Requirements

Your ADK server must:

1. **Enable CORS** for your frontend origin
2. **Support Server-Sent Events** for streaming responses
3. **Expose required endpoints**:
   - `POST /apps/{app}/users/{user}/sessions/{session}` - Session management
   - `POST /run` - Standard messages
   - `POST /run_sse` - Streaming responses
   - `GET /list-apps` - Available applications

## Error Handling

The component includes built-in error handling and retry logic. Errors are displayed in the UI and logged to the console.

## Browser Support

- Modern browsers with ES2022 support
- Shadow DOM support required for web component
- Server-Sent Events support for streaming

## Examples Repository

Check out complete examples at: [GitHub Examples](https://github.com/yourusername/adk-client-examples)

- Basic HTML example
- React integration
- Vue.js integration
- Angular integration
- WordPress plugin example
