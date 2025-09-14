export const env = {
  ADK_API_URL: import.meta.env.VITE_ADK_API_URL || 'http://localhost:8000',
  ADK_APP_NAME: import.meta.env.VITE_ADK_APP_NAME || 'my_sample_agent',
  ADK_USER_ID: import.meta.env.VITE_ADK_USER_ID || 'user_123',
  ADK_SESSION_ID: import.meta.env.VITE_ADK_SESSION_ID || 'session_123',
  CHAT_TITLE: import.meta.env.VITE_CHAT_TITLE || 'ADK Assistant',
  CHAT_DEFAULT_MODE: import.meta.env.VITE_CHAT_DEFAULT_MODE || 'fullscreen',
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
} as const;

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
