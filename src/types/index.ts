export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface Session {
  id: string;
  appName: string;
  userId: string;
  state: Record<string, unknown>;
  events: unknown[];
  lastUpdateTime: number;
}

export interface ChatConfig {
  appName: string;
  userId: string;
  sessionId: string;
  apiBaseUrl: string;
  responseMode: ResponseMode;
}

export type ChatMode = 'fullscreen' | 'widget';

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  mode: ChatMode;
  isConnected: boolean;
  config: ChatConfig;
}

export interface ADKRunRequest {
  app_name: string;
  user_id: string;
  session_id: string;
  new_message: {
    role: 'user';
    parts: Array<{ text: string }>;
  };
  streaming?: boolean;
}

export type ResponseMode = 'stream' | 'standard';

export interface ADKEvent {
  type: string;
  data: unknown;
  timestamp: number;
}
