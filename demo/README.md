# ADK Client Web Component - Integration Demos

This folder contains **completely standalone** demonstrations of the different integration methods available for the ADK Client Web Component. Each demo is self-contained and can be run independently without requiring access to the parent project.

**Development Note:** The demos currently use the local project code (`file:../../`) for development and testing. When the package is published to npm, users would reference the published version instead.

**Important:** The component uses Shadow DOM with embedded Tailwind CSS. **No external CSS file is needed** - all styles are bundled in the JavaScript.

## 🚀 Quick Start

### Prerequisites

First, build the parent project to generate the distribution files:

```bash
# From the project root (adk-chat/)
npm install
npm run build
```

### Then run the demos:

Each demo is completely independent. You can run any demo directly from its folder:

```bash
# Run individual demos (each installs its own dependencies from local build)
npm run serve:method1    # Local installation demo
npm run serve:method2    # CDN usage demo (uses published version if available)
npm run dev:method3      # React component demo
npm run serve:method4    # Programmatic demo (uses CDN)

# Or setup all demos at once
npm run setup:all
```

## 📁 Standalone Demo Structure

```
demo/
├── method-1-local/          # Local npm installation (self-contained)
│   ├── package.json         # Own dependencies
│   └── node_modules/        # Local installation
├── method-2-cdn/            # CDN usage (no installation needed)
├── method-3-react/          # React component (self-contained)
│   ├── package.json         # Own dependencies including React
│   └── node_modules/        # Local installation
├── method-4-programmatic/   # Programmatic web component (CDN)
├── package.json             # Demo scripts only
└── README.md               # This file
```

## 🎯 Integration Methods

### Method 1: Local Installation
**Folder**: `method-1-local/`

**Best for**: Development environments, projects with npm/yarn, full control over dependencies

**Features**:
- **Self-contained**: Installs `adk-client-web-component` in its own `node_modules`
- Component loaded from local `node_modules`
- Relative path imports (`./node_modules/`)
- Full development tooling support
- Version control through its own `package.json`

**Setup**:
```bash
cd method-1-local
npm install    # Installs adk-client-web-component locally
npm run serve  # Start the demo
```

**Key Advantage**: Complete independence from parent project

---

### Method 2: CDN Usage  
**Folder**: `method-2-cdn/`

**Best for**: Quick prototypes, static sites, no build step required

**Features**:
- Zero installation required
- Loaded from unpkg.com CDN
- Works with any static hosting
- Instant setup
- Completely standalone

**Setup**:
```bash
cd method-2-cdn
open index.html  # or npx serve
```

**Key Advantage**: Fastest way to get started, no dependencies needed

---

### Method 3: React Component
**Folder**: `method-3-react/`

**Best for**: React applications, TypeScript projects, component-based architecture

**Features**:
- **Self-contained React project**: Own React, TypeScript, and Vite setup
- **Independent dependencies**: `adk-client-web-component` from npm
- Full React integration
- TypeScript support
- Component props and state management
- Vite build system with hot module replacement

**Setup**:
```bash
cd method-3-react
npm install    # Installs all dependencies including adk-client-web-component
npm run dev    # Start React development server
```

**Key Advantage**: Complete React development environment, standalone

---

### Method 4: Programmatic Web Component
**Folder**: `method-4-programmatic/`

**Best for**: Dynamic applications, framework integration, runtime configuration

**Features**:
- Programmatic component creation
- Dynamic configuration
- Event handling and live logging
- Lifecycle management
- Framework-agnostic
- CDN-based (no installation)

**Setup**:
```bash
cd method-4-programmatic
open index.html  # or npx serve
```

**Key Advantage**: Maximum flexibility, no dependencies required

## 🛠️ Standalone Development Scripts

```json
{
  "scripts": {
    "serve:method1": "cd method-1-local && npm install && npm run serve",
    "serve:method2": "cd method-2-cdn && npx serve", 
    "dev:method3": "cd method-3-react && npm install && npm run dev",
    "serve:method4": "cd method-4-programmatic && npx serve",
    "setup:all": "npm run setup:method1 && npm run setup:method3",
    "setup:method1": "cd method-1-local && npm install",
    "setup:method3": "cd method-3-react && npm install"
  }
}
```

## 📋 Standalone Comparison

| Method | Self-Contained | Dependencies | Build Step | TypeScript | Setup Time |
|--------|----------------|--------------|------------|------------|------------|
| Local | ✅ | npm required | Optional | ✅ | ~2 min |
| CDN | ✅ | None | ❌ | ❌ | ~10 sec |
| React | ✅ | npm required | ✅ | ✅ | ~3 min |
| Programmatic | ✅ | None | ❌ | ✅ | ~10 sec |

## 🎯 Why Standalone Demos?

Each demo is completely independent to demonstrate:

1. **Real-world usage**: Each method works without parent project dependencies
2. **Easy distribution**: Demos can be copied or shared independently  
3. **Clear separation**: No confusion about which dependencies are needed
4. **Production readiness**: Each method can be deployed as-is
5. **Learning**: Each demo shows exactly what's needed for that integration method

## 🌐 Running Demos Independently

You can copy any demo folder to a completely separate location and it will work:

```bash
# Copy method-1-local anywhere
cp -r method-1-local ~/my-project/
cd ~/my-project/method-1-local
npm install  # Gets the adk-client-web-component package
npm run serve

# Copy method-3-react anywhere  
cp -r method-3-react ~/my-react-app/
cd ~/my-react-app/method-3-react
npm install  # Gets React + adk-client-web-component
npm run dev
```

## 🔧 Individual Setup Instructions

### Method 1 (Local Installation)
```bash
cd method-1-local
npm install adk-client-web-component
npm run serve
```

### Method 2 (CDN)
```bash
cd method-2-cdn
open index.html
```

### Method 3 (React)
```bash
cd method-3-react
npm install  # Gets React, TypeScript, Vite, and adk-client-web-component
npm run dev
```

### Method 4 (Programmatic)
```bash
cd method-4-programmatic
open index.html
```

## 📦 Dependencies Overview

- **Method 1**: `adk-client-web-component` (installed locally)
- **Method 2**: None (CDN only)
- **Method 3**: `react`, `react-dom`, `adk-client-web-component` + dev tools
- **Method 4**: None (CDN only)

## 🚀 Deployment Ready

Each demo can be deployed as-is:

- **Method 1**: Deploy folder with `node_modules` or use CDN in production
- **Method 2**: Deploy HTML file directly to any static host
- **Method 3**: Run `npm run build` and deploy `dist` folder
- **Method 4**: Deploy HTML file directly to any static host

## 🎨 Features Demonstrated

### Common Features Across All Demos:
- **Widget Mode**: Floating chat widget
- **Fullscreen Mode**: Full-page chat interface
- **Configuration**: API URL, app name, user/session IDs
- **Response Modes**: Standard vs streaming responses
- **Styling**: Custom CSS and positioning

### Method-Specific Features:
- **Method 1**: Local development workflow
- **Method 2**: CDN loading and version pinning
- **Method 3**: React props, state management, TypeScript
- **Method 4**: Dynamic creation, event handling, lifecycle

## 🔧 Prerequisites

### Required for All Methods:
- Modern web browser with ES2022 support
- Access to a running ADK backend API

### Method-Specific Requirements:
- **Method 1**: Node.js, npm/yarn
- **Method 2**: None (browser only)
- **Method 3**: Node.js, npm, React knowledge
- **Method 4**: Basic JavaScript knowledge

## 🌐 ADK Backend Setup

All demos connect to an ADK backend API. For local development:

```bash
# Start ADK API server with permissive CORS
adk api_server --allow_origins="*"

# Production (use specific origins)
adk api_server --allow_origins="https://yourdomain.com"
```

**Expected Endpoints**:
- `POST /apps/{app}/users/{user}/sessions/{session}` - Session management
- `POST /run` - Standard message sending  
- `POST /run_sse` - Streaming responses
- `GET /list-apps` - Available applications

## 🚦 Configuration

Each demo can be configured through:

### HTML Attributes (Methods 1, 2, 4):
```html
<adk-client
  api-url="http://localhost:8000"
  app-name="my_sample_agent"
  user-id="user_123"
  session-id="session_123"
  mode="widget"
  response-mode="stream">
</adk-client>
```

### React Props (Method 3):
```tsx
<ChatWindow
  apiUrl="http://localhost:8000"
  appName="my_sample_agent"
  userId="user_123"
  sessionId="session_123"
  mode="fullscreen"
  responseMode="stream"
/>
```

### JavaScript (Method 4):
```javascript
const component = document.createElement('adk-client');
component.setAttribute('api-url', 'http://localhost:8000');
component.setAttribute('app-name', 'my_sample_agent');
document.body.appendChild(component);
```

## 🎯 Choosing the Right Method

### Choose **Method 1 (Local)** if:
- You're building a production application
- You need precise version control
- You have an existing npm-based workflow
- You want to use build tools and bundlers

### Choose **Method 2 (CDN)** if:
- You're creating a quick prototype
- You don't have a build process
- You're using static site hosting
- You want the simplest possible setup

### Choose **Method 3 (React)** if:
- You're building a React application
- You need TypeScript support
- You want component-based architecture
- You need React state management integration

### Choose **Method 4 (Programmatic)** if:
- You need dynamic component creation
- You're integrating with other frameworks
- You need runtime configuration
- You want maximum control over lifecycle

## 🔍 Troubleshooting

### Common Issues:
1. **CORS Errors**: Ensure your ADK server allows requests from your domain
2. **Component Not Loading**: Check browser console for module loading errors
3. **Styling Issues**: Verify CSS is properly imported
4. **Connection Failed**: Confirm ADK server is running and accessible

### Method-Specific Issues:
- **Method 1**: Check npm installation and relative paths
- **Method 2**: Verify internet connection and CDN availability
- **Method 3**: Check React and TypeScript configuration
- **Method 4**: Ensure component registration before creation

## 📚 Additional Resources

- [Main Project README](../README.md)
- [GitHub Examples](https://github.com/lrrrrrrrr/adk-client-web-component/tree/main/examples)
- [Web Components MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [React Documentation](https://react.dev/)
- [ADK Documentation](https://cloud.google.com/agent-development-kit)

## 🤝 Contributing

Found an issue or want to improve the demos? Contributions welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see main project for details.
