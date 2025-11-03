# ADK Client Web Component

> **Disclaimer**: This project is "Vibecoded" - built with passion and good vibes! While it follows modern development practices and includes production-ready features, it's created for learning and demonstration purposes.

A modern, self-contained web component chat interface for Google's Agent Development Kit (ADK). Built with React, TypeScript, and Tailwind CSS, packaged as a framework-agnostic web component with **Shadow DOM and embedded styles**.

## ✨ Key Features

- 🎨 **Shadow DOM with Embedded Styles** - No external CSS needed, zero style conflicts
- 🚀 **Framework Agnostic** - Works with React, Vue, Angular, or vanilla JavaScript  
- 💅 **Modern Stack** - React 19, TypeScript, Vite 7, Tailwind CSS 4
- ✨ **Beautiful UI** - Clean, responsive design with smooth animations
- ⚡ **Real-time Streaming** - Support for both standard and streaming ADK responses
- 🎯 **Dual Modes** - Fullscreen and widget modes for different use cases
- ⚙️ **Built-in Configuration** - Runtime settings panel for users
- 🔒 **Type Safe** - Full TypeScript support with exported types
- ♿ **Accessible** - WCAG compliant with keyboard navigation

## 📖 Table of Contents

- [Quick Start](#-quick-start)
- [Screenshots](#screenshots)
- [Integration Methods](#-integration-methods)
- [Live Demos](#-live-demos)
- [Web Component Attributes](#web-component-attributes)
- [Important Notes](#-important-notes)
- [TypeScript Support](#typescript-support)
- [Development Setup](#%EF%B8%8F-development-setup)
- [ADK Server Requirements](#-adk-server-requirements)
- [Demo Folder](#-demo-folder)
- [Contributing](#-contributing)

## 🚀 Quick Start

### Option 1: CDN (Fastest - No Installation)

```html
<!DOCTYPE html>
<html>
<body>
  <!-- Just add the custom element -->
  <adk-client
    api-url="http://localhost:8000"
    app-name="my_sample_agent"
    mode="widget">
  </adk-client>

  <!-- Import from CDN -->
  <script type="module">
    import 'https://unpkg.com/adk-client-web-component/dist/adk-client-standalone.js';
  </script>
</body>
</html>
```

### Option 2: NPM Installation

```bash
npm install adk-client-web-component
```

```html
<!DOCTYPE html>
<html>
<body>
  <adk-client
    api-url="http://localhost:8000"
    app-name="my_sample_agent"
    mode="fullscreen">
  </adk-client>

  <script type="module" src="./node_modules/adk-client-web-component/dist/adk-client-standalone.js"></script>
</body>
</html>
```

**Important:** Serve via a web server (`npx serve`, `python -m http.server`), not as `file://`

## Screenshots

### Fullscreen Mode
![ADK Client Web Component — Fullscreen](./docs/images/full-screen.png)

### Widget Mode
![ADK Client Web Component — Widget](./docs/images/widget.png)

## 📚 Integration Methods

The component can be used in multiple ways. Check the [`demo/`](./demo) folder for complete working examples!

### Method 1: CDN Usage (Zero Installation)

Perfect for quick prototypes and static sites:

```html
<adk-client
  api-url="http://localhost:8000"
  app-name="my_agent"
  mode="widget">
</adk-client>

<script type="module">
  import 'https://unpkg.com/adk-client-web-component@1.0.2/dist/adk-client-standalone.js';
</script>
```

[View CDN Demo →](./demo/method-2-cdn)

### Method 2: Local Installation

For development with npm packages:

```bash
npm install adk-client-web-component
```

```html
<adk-client
  api-url="http://localhost:8000"
  app-name="my_agent">
</adk-client>

<script type="module" src="./node_modules/adk-client-web-component/dist/adk-client-standalone.js"></script>
```

[View Local Demo →](./demo/method-1-local)

### Method 3: React Integration

Use in React applications:

```tsx
import 'adk-client-web-component';

function App() {
  return (
    <adk-client
      api-url="http://localhost:8000"
      app-name="my_agent"
      mode="fullscreen"
    />
  );
}
```

[View React Demo →](./demo/method-3-react)

### Method 4: Programmatic Control

Create and control components dynamically:

```javascript
import 'adk-client-web-component';

const chat = document.createElement('adk-client');
chat.setAttribute('api-url', 'http://localhost:8000');
chat.setAttribute('app-name', 'my_agent');
chat.setAttribute('mode', 'fullscreen');

document.body.appendChild(chat);
```

[View Programmatic Demo →](./demo/method-4-programmatic)

## 🎮 Live Demos

The `demo/` folder contains **fully working, standalone examples** for each integration method:

```bash
# Clone and explore demos
git clone https://github.com/lrrrrrrrr/adk-client-web-component.git
cd adk-client-web-component

# Build the project first
npm install
npm run build

# Run demos
cd demo
npm run serve:method1    # Local installation demo
npm run serve:method2    # CDN demo  
npm run dev:method3      # React demo
npm run serve:method4    # Programmatic demo
```

[View Demo Documentation →](./demo/README.md)

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

## 💡 Important Notes

### Shadow DOM with Embedded Styles

✅ **No external CSS file needed!** All Tailwind CSS styles are compiled and embedded in the JavaScript bundle.

The component uses **Shadow DOM** which means:
- ✅ **Zero style conflicts** with your existing CSS
- ✅ **Self-contained** - works out of the box
- ✅ **Portable** - copy anywhere and it works

### File Serving Requirements

When using local files with relative paths (Method 1), you **must** serve through a web server:

```bash
# Option 1: serve (recommended)
npx serve

# Option 2: Python
python -m http.server 8000

# Option 3: VS Code Live Server extension
```

❌ **Don't** open HTML files directly as `file://` - ES modules won't work!

### Module Specifiers

Browsers don't resolve bare module specifiers. You must use:

1. **Relative paths**: `./node_modules/adk-client-web-component/dist/...`
2. **Full URLs**: `https://unpkg.com/adk-client-web-component/dist/...`
3. **Build tools**: Vite, Webpack, etc. (handles resolution)

### Build Outputs

- **`adk-client-standalone.js`** - Complete bundle with React and all dependencies (recommended)
- **`adk-client.es.js`** - ES module, requires external React (for advanced use cases)
- **`adk-client.umd.js`** - UMD format (legacy browsers)
- **`adk-client-web-component.css`** - Compiled CSS (optional, for reference only)

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

## Browser Support

- Modern browsers with ES2022 support
- Shadow DOM support required for web component
- Server-Sent Events support for streaming

## 🛠️ Development Setup

### Prerequisites

- **Node.js 18+** (LTS recommended)
- **npm 9+** (or pnpm/yarn equivalent)
- **Running ADK server** with CORS and SSE (Server-Sent Events) enabled

### Setup for Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/lrrrrrrrr/adk-client-web-component.git
   cd adk-client-web-component
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your ADK server details
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   
   Open http://localhost:5173 - The app will hot-reload as you edit files.

5. **Build for production:**
   ```bash
   npm run build
   ```
   
   This creates:
   - `dist/adk-client-standalone.js` - Standalone bundle with embedded styles
   - `dist/adk-client.es.js` - ES module version
   - `dist/adk-client.umd.js` - UMD version
   - Type definitions and source maps

6. **Preview production build:**
   ```bash
   npm run preview
   ```

## Available Scripts

- `npm run dev` — Start Vite dev server with hot reload.
- `npm run build` — Type-check and build production assets (`tsc -b && vite build`).
- `npm run preview` — Preview the production build locally.
- `npm run lint` — Run ESLint over the project.

## Configuration

### Environment Variables

Create a `.env` file with your ADK server configuration:

```env
# ADK API Configuration
VITE_ADK_API_URL=http://localhost:8000
VITE_ADK_APP_NAME=my_sample_agent
VITE_ADK_USER_ID=user_123
VITE_ADK_SESSION_ID=session_123

# Chat Configuration
VITE_CHAT_TITLE=ADK Assistant
VITE_CHAT_DEFAULT_MODE=fullscreen

# Development
NODE_ENV=development
```

Note: never commit `.env` files—use `.env.example` as a template in source control.

### Runtime Configuration

Users can modify settings through the in-app configuration panel:

- API Base URL
- Agent Application Name
- User ID and Session ID
- Chat display preferences

## Architecture

### Component Structure
```
src/
├── components/
│   ├── ui/                 # Reusable UI components (ChatInput, MessageList, ConfigPanel)
│   ├── ChatWindow.tsx      # Main chat interface
│   └── ErrorBoundary.tsx   # Error handling
├── hooks/
│   └── useChat.ts          # Chat logic and API integration
├── services/
│   └── adkApi.ts           # ADK API service layer (REST + SSE)
├── store/
│   └── chatStore.ts        # Zustand state management
├── types/
│   └── index.ts            # TypeScript definitions
└── config/
    └── env.ts              # Environment configuration (import.meta.env)
```

### State Management

- **Zustand** for global state management
- **React Query** for server state and caching
- **Persistent storage** for user preferences

### API Integration

Supports all ADK endpoints:
- `POST /apps/{app}/users/{user}/sessions/{session}` - Session management
- `POST /run` - Standard message sending
- `POST /run_sse` - Streaming responses via Server-Sent Events
- `GET /list-apps` - Available applications

## Usage Modes

### Fullscreen Mode
Perfect for dedicated chat applications or full-page implementations.

### Widget Mode
Ideal for embedding as a chat widget in existing applications.

```tsx
import { ChatWindow } from './components/ChatWindow';

// Fullscreen usage
<ChatWindow />

// Widget usage with custom positioning
<div className="fixed bottom-4 right-4">
  <ChatWindow />
</div>
```

## Development

### Tech Stack
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Query** for data fetching
- **Zustand** for state management
- **Lucide React** for icons

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Error boundaries for graceful error handling

## Production Deployment

### Build Optimization
```bash
npm run build
```

The build is optimized for production with:
- Code splitting
- Tree shaking
- Asset optimization
- TypeScript compilation

### Environment Setup
1. Set production environment variables
2. Configure CORS on your ADK server
3. Deploy static files to your hosting platform

### Hosting Options
- **Netlify**: Easy deployment with form handling
- **Vercel**: Optimized for React applications
- **AWS S3 + CloudFront**: Scalable static hosting
- **Traditional hosting**: Any static file server

## 🔌 ADK Server Requirements

The component requires a running ADK (Agent Development Kit) backend server.

### Required Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/apps/{app}/users/{user}/sessions/{session}` | POST | Create/get conversation session |
| `/run` | POST | Send message (standard mode) |
| `/run_sse` | POST | Send message (streaming mode, SSE) |
| `/list-apps` | GET | List available agent apps |

### CORS Configuration

Your ADK server must enable CORS for your frontend origin.

**Development:**
```bash
# Allow all origins (development only!)
adk api_server --allow_origins="*"
```

**Production:**
```bash
# Specify explicit origins
adk api_server --allow_origins="https://yourdomain.com,https://www.yourdomain.com"
```

### Streaming Support

The `/run_sse` endpoint must:
- Support Server-Sent Events (SSE)
- Flush tokens as they're generated
- Send events in the format: `data: {"token": "..."}\n\n`

### Quick Start ADK Server

```bash
# Install ADK
pip install google-adk

# Start server with permissive CORS for development
adk api_server --allow_origins="*"
```

The server will start on `http://localhost:8000` by default.

## Troubleshooting

### Common Issues

**Connection Failed**: Check that your ADK server is running on the configured URL.
**CORS Errors**: Ensure your ADK server allows requests from your domain.
**Build Errors**: Verify all environment variables are properly set.

### Debug Mode
Set `NODE_ENV=development` to enable additional error information and logging.

## 📦 Demo Folder

The `demo/` folder contains **4 complete, standalone integration examples**:

1. **Method 1: Local Installation** - Using npm with local node_modules
2. **Method 2: CDN Usage** - Zero installation, load from unpkg.com  
3. **Method 3: React Integration** - Full React + TypeScript + Vite setup
4. **Method 4: Programmatic** - Dynamic component creation with JavaScript

Each demo is self-contained and can be copied/used independently. See [demo/README.md](./demo/README.md) for detailed instructions.

### Running Demos

```bash
# Build the main project first
npm run build

# Run individual demos
cd demo
npm run serve:method1    # Local installation
npm run serve:method2    # CDN  
npm run dev:method3      # React (with hot reload)
npm run serve:method4    # Programmatic

# Or setup all at once
npm run setup:all
```

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes
4. **Test** your changes (run demos, check types)
5. **Commit** (`git commit -m 'Add amazing feature'`)
6. **Push** (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request

### Development Guidelines

- Follow existing code style
- Add TypeScript types for new features
- Test changes with all integration methods (demos)
- Update documentation as needed
- Keep Shadow DOM and embedded styles working

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

Built with:
- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [React Query](https://tanstack.com/query) - Data fetching
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Lucide](https://lucide.dev/) - Icons

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/lrrrrrrrr/adk-client-web-component/issues)
- **Discussions**: [GitHub Discussions](https://github.com/lrrrrrrrr/adk-client-web-component/discussions)
- **Email**: Check package.json for maintainer contact

---

**Made with ❤️ and good vibes**
