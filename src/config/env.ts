// Environment validation and configuration
function getRequiredEnvVar(name: string, defaultValue?: string): string {
  const value = import.meta.env[name];
  
  if (!value) {
    if (import.meta.env.PROD && !defaultValue) {
      throw new Error(`Missing required environment variable: ${name}`);
    }
    return defaultValue || '';
  }
  
  return value;
}

function validateUrl(url: string): string {
  try {
    new URL(url);
    return url;
  } catch {
    throw new Error(`Invalid URL format: ${url}`);
  }
}

export const env = {
  ADK_API_URL: validateUrl(getRequiredEnvVar('VITE_ADK_API_URL', import.meta.env.DEV ? 'http://localhost:8000' : undefined)),
  ADK_APP_NAME: getRequiredEnvVar('VITE_ADK_APP_NAME', import.meta.env.DEV ? 'my_sample_agent' : undefined),
  ADK_USER_ID: getRequiredEnvVar('VITE_ADK_USER_ID', import.meta.env.DEV ? 'user_123' : undefined),
  ADK_SESSION_ID: getRequiredEnvVar('VITE_ADK_SESSION_ID', import.meta.env.DEV ? 'session_123' : undefined),
  CHAT_TITLE: getRequiredEnvVar('VITE_CHAT_TITLE', 'ADK Assistant'),
  CHAT_DEFAULT_MODE: getRequiredEnvVar('VITE_CHAT_DEFAULT_MODE', 'fullscreen') as 'fullscreen' | 'widget',
  NODE_ENV: import.meta.env.MODE,
} as const;

export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;