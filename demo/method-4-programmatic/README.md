# Method 4: Programmatic Web Component Demo

This demo demonstrates how to register and use the ADK Client Web Component programmatically using JavaScript, giving you full control over component creation, configuration, and lifecycle management.

## Setup Instructions

1. **Simply open the HTML file** in your browser:
   ```bash
   # From the demo/method-4-programmatic directory
   open index.html
   # or serve it with any web server
   npx serve
   ```

2. **No installation required** - everything is loaded from CDN

## What This Demo Shows

- **Component Registration**: Programmatic registration of custom elements
- **Dynamic Creation**: Creating components at runtime
- **Configuration Management**: Setting component attributes programmatically
- **Lifecycle Control**: Adding and removing components dynamically
- **Event Monitoring**: Live logging of component events
- **Custom Component Names**: Registering components with custom tag names
- **Widget Management**: Creating and managing floating widgets

## Key Features Demonstrated

- Custom element registration with `customElements.define()`
- Dynamic component creation with `document.createElement()`
- Attribute configuration via JavaScript
- DOM manipulation and lifecycle management
- Event handling and monitoring
- Runtime configuration changes
- Component cleanup and removal

## Basic Programmatic Usage

```javascript
// Import the component class
import { AdkClientWebComponent } from 'adk-client-web-component';

// Register the component with a custom name
customElements.define('my-adk-client', AdkClientWebComponent);

// Create and configure the element
const adkClient = document.createElement('my-adk-client');
adkClient.setAttribute('api-url', 'http://localhost:8000');
adkClient.setAttribute('app-name', 'my_sample_agent');
adkClient.setAttribute('mode', 'fullscreen');

// Add to DOM
document.body.appendChild(adkClient);
```

## Advanced Programmatic Usage

```javascript
class AdvancedChatManager {
  constructor() {
    this.components = new Map();
  }

  createComponent(config, container) {
    const component = document.createElement('my-adk-client');
    Object.entries(config).forEach(([key, value]) => {
      component.setAttribute(key, value);
    });

    component.addEventListener('message', (event) => {
      console.log('New message:', event.detail);
    });

    container.appendChild(component);
    this.components.set(config.id, component);
    return component;
  }

  destroyComponent(id) {
    const component = this.components.get(id);
    if (component) {
      component.remove();
      this.components.delete(id);
    }
  }
}
```

## Component Management Patterns

### 1. Factory Pattern
```javascript
class ChatComponentFactory {
  static create(config) {
    const component = document.createElement('adk-client');
    Object.entries(config).forEach(([key, value]) => {
      component.setAttribute(key, value);
    });
    return component;
  }
}
```

### 2. Manager Pattern
```javascript
class ChatManager {
  constructor() {
    this.instances = new Map();
  }

  create(id, config, container) {
    const component = ChatComponentFactory.create(config);
    container.appendChild(component);
    this.instances.set(id, component);
    return component;
  }

  get(id) {
    return this.instances.get(id);
  }

  destroy(id) {
    const component = this.instances.get(id);
    if (component) {
      component.remove();
      this.instances.delete(id);
    }
  }
}
```

### 3. Reactive Pattern
```javascript
class ReactiveChat {
  constructor(config) {
    this.config = config;
    this.component = null;
    this.observers = [];
  }

  observe(callback) {
    this.observers.push(callback);
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.notifyObservers();
    this.applyConfig();
  }

  notifyObservers() {
    this.observers.forEach(callback => callback(this.config));
  }

  applyConfig() {
    if (this.component) {
      Object.entries(this.config).forEach(([key, value]) => {
        this.component.setAttribute(key, value);
      });
    }
  }
}
```

## Event Handling

```javascript
const component = document.createElement('adk-client');

// Listen to component events
component.addEventListener('message', (event) => {
  console.log('New message:', event.detail);
});

component.addEventListener('config-change', (event) => {
  console.log('Configuration changed:', event.detail);
});

component.addEventListener('ready', (event) => {
  console.log('Component is ready:', event.detail);
});
```

## Configuration Management

```javascript
// Configuration object
const config = {
  apiUrl: 'http://localhost:8000',
  appName: 'my_sample_agent',
  userId: 'user_123',
  sessionId: 'session_123',
  mode: 'fullscreen',
  responseMode: 'stream'
};

// Apply configuration
function applyConfig(component, config) {
  Object.entries(config).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      component.setAttribute(key, value);
    }
  });
}

// Update configuration dynamically
function updateConfig(component, updates) {
  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      component.setAttribute(key, value);
    } else {
      component.removeAttribute(key);
    }
  });
}
```

## Integration with Frameworks

### Vanilla JavaScript
```javascript
class VanillaChatApp {
  constructor() {
    this.chatManager = new ChatManager();
    this.init();
  }

  init() {
    this.createChatInterface();
    this.setupEventListeners();
  }

  createChatInterface() {
    const config = {
      apiUrl: 'http://localhost:8000',
      appName: 'my_agent',
      mode: 'fullscreen'
    };

    const container = document.getElementById('chat-container');
    this.chatManager.create('main-chat', config, container);
  }
}
```

### Vue.js Integration
```javascript
export default {
  mounted() {
    this.createChatComponent();
  },

  methods: {
    createChatComponent() {
      const component = document.createElement('adk-client');
      component.setAttribute('api-url', this.apiUrl);
      component.setAttribute('app-name', this.appName);
      this.$refs.chatContainer.appendChild(component);
    }
  }
};
```

## Advantages of Programmatic Approach

- **Full Control**: Complete control over component lifecycle
- **Dynamic Configuration**: Change configuration at runtime
- **Framework Integration**: Easy integration with any JavaScript framework
- **Event Management**: Comprehensive event handling
- **Memory Management**: Proper cleanup and garbage collection
- **Testing**: Easier unit testing and mocking
- **Conditional Rendering**: Create components based on application state

## Use Cases

1. **Single Page Applications**: Dynamic component creation based on routing
2. **Multi-tenant Systems**: Different configurations per tenant
3. **A/B Testing**: Create different component variants
4. **Plugin Systems**: Components loaded dynamically
5. **Real-time Configuration**: Update settings based on user actions
6. **Micro-frontends**: Independent component management

## Troubleshooting

- **Component not registered**: Ensure the component script is loaded before registration
- **Attributes not applying**: Check attribute names and values
- **Events not firing**: Verify event listeners are attached before component creation
- **Memory leaks**: Properly remove components and event listeners
- **Styling issues**: Ensure CSS is loaded before component creation
