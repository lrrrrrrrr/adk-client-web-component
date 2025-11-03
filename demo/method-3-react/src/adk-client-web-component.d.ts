declare module 'adk-client-web-component' {
  import { ComponentType } from 'react';

  export interface ChatWindowProps {
    apiUrl?: string;
    appName?: string;
    userId?: string;
    sessionId?: string;
    mode?: 'widget' | 'fullscreen';
    responseMode?: 'standard' | 'stream';
  }

  export const ChatWindow: ComponentType<ChatWindowProps>;
}
