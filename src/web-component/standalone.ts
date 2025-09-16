// Standalone web component with bundled React
import { AdkClientWebComponent } from './AdkClientWebComponent';

// Auto-register the web component
if (typeof window !== 'undefined' && !customElements.get('adk-client')) {
  customElements.define('adk-client', AdkClientWebComponent);
}

// Export for manual registration if needed
export { AdkClientWebComponent };
