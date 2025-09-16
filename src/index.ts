export { ChatWindow } from './components/ChatWindow';
export { AdkClientWebComponent } from './web-component/AdkClientWebComponent';
export type { ChatConfig, Message, ChatState } from './types';

// Auto-register the web component when imported
if (typeof window !== 'undefined' && !customElements.get('adk-client')) {
  import('./web-component/AdkClientWebComponent').then(({ AdkClientWebComponent }) => {
    if (!customElements.get('adk-client')) {
      customElements.define('adk-client', AdkClientWebComponent);
    }
  });
}
