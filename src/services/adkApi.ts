import type { ChatConfig, ADKRunRequest, Session, ADKEvent } from '../types';

// Improved API service with proper error handling, timeouts, and security
export class ADKApiService {
  private baseUrl: string;
  private timeout: number;
  private maxRetries: number;
  private abortControllers: Map<string, AbortController>;

  constructor(
    baseUrl: string = 'http://localhost:8000',
    timeout: number = 30000,
    maxRetries: number = 3
  ) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
    this.maxRetries = maxRetries;
    this.abortControllers = new Map();
  }

  // Helper method for exponential backoff
  private async delay(attempt: number): Promise<void> {
    const delayMs = Math.min(1000 * Math.pow(2, attempt), 10000);
    return new Promise(resolve => setTimeout(resolve, delayMs));
  }

  // Enhanced fetch with timeout, retry, and abort support
  private async fetchWithRetry(
    url: string,
    options: RequestInit = {},
    retries: number = this.maxRetries
  ): Promise<Response> {
    const controller = new AbortController();
    const requestId = crypto.randomUUID();
    this.abortControllers.set(requestId, controller);

    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const enhancedOptions: RequestInit = {
        ...options,
        signal: controller.signal,
        // Remove credentials: 'include' to avoid CORS issues with wildcard origins
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': requestId,
          ...options.headers,
        },
      };

      const response = await fetch(url, enhancedOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        // Handle specific HTTP errors
        if (response.status === 429) {
          // Rate limited - wait and retry
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
          await this.delay(waitTime);
          
          if (retries > 0) {
            return this.fetchWithRetry(url, options, retries - 1);
          }
        }

        if (response.status >= 500 && retries > 0) {
          // Server error - retry with backoff
          await this.delay(this.maxRetries - retries);
          return this.fetchWithRetry(url, options, retries - 1);
        }

        // Parse error response
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // Ignore JSON parse errors
        }

        throw new Error(errorMessage);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        
        // Network error - retry if possible
        if (retries > 0 && !error.message.includes('HTTP')) {
          await this.delay(this.maxRetries - retries);
          return this.fetchWithRetry(url, options, retries - 1);
        }
      }
      
      throw error;
    } finally {
      this.abortControllers.delete(requestId);
    }
  }

  // Cancel all pending requests
  public cancelAllRequests(): void {
    this.abortControllers.forEach(controller => controller.abort());
    this.abortControllers.clear();
  }

  async createSession(
    config: ChatConfig,
    initialState?: Record<string, unknown>
  ): Promise<Session> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/apps/${encodeURIComponent(config.appName)}/users/${encodeURIComponent(config.userId)}/sessions/${encodeURIComponent(config.sessionId)}`,
      {
        method: 'POST',
        body: JSON.stringify({
          state: initialState || {},
        }),
      }
    );

    return response.json();
  }

  async getSession(config: ChatConfig): Promise<Session> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/apps/${encodeURIComponent(config.appName)}/users/${encodeURIComponent(config.userId)}/sessions/${encodeURIComponent(config.sessionId)}`
    );

    return response.json();
  }

  async sendMessage(config: ChatConfig, message: string): Promise<ADKEvent[]> {
    // Validate and sanitize input
    if (!message || typeof message !== 'string') {
      throw new Error('Invalid message');
    }

    const sanitizedMessage = message.trim().slice(0, 10000); // Limit message length

    const request: ADKRunRequest = {
      app_name: config.appName,
      user_id: config.userId,
      session_id: config.sessionId,
      new_message: {
        role: 'user',
        parts: [{ text: sanitizedMessage }],
      },
    };

    const response = await this.fetchWithRetry(`${this.baseUrl}/run`, {
      method: 'POST',
      body: JSON.stringify(request),
    });

    const data = await response.json();
    
    // Validate response structure
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format');
    }

    return data;
  }

  async sendMessageStreaming(
    config: ChatConfig,
    message: string,
    onEvent: (event: ADKEvent) => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    // Validate and sanitize input
    if (!message || typeof message !== 'string') {
      throw new Error('Invalid message');
    }

    const sanitizedMessage = message.trim().slice(0, 10000);

    const request: ADKRunRequest = {
      app_name: config.appName,
      user_id: config.userId,
      session_id: config.sessionId,
      new_message: {
        role: 'user',
        parts: [{ text: sanitizedMessage }],
      },
      streaming: true,
    };

    const controller = new AbortController();
    const requestId = crypto.randomUUID();
    this.abortControllers.set(requestId, controller);

    try {
      const response = await fetch(`${this.baseUrl}/run_sse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
          'X-Request-ID': requestId,
        },
        body: JSON.stringify(request),
        signal: controller.signal,
        // Remove credentials: 'include' to avoid CORS issues
      });

      if (!response.ok) {
        throw new Error(`Failed to send streaming message: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                return;
              }
              
              try {
                const event = JSON.parse(data);
                // Validate event structure before passing to callback
                if (event && typeof event === 'object') {
                  onEvent(event);
                }
              } catch (e) {
                console.warn('Failed to parse SSE event:', data);
                if (onError) {
                  onError(new Error('Invalid event data received'));
                }
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } finally {
      this.abortControllers.delete(requestId);
    }
  }

  async listApps(): Promise<string[]> {
    const response = await this.fetchWithRetry(`${this.baseUrl}/list-apps`);
    const data = await response.json();
    
    // Validate response
    if (!Array.isArray(data)) {
      throw new Error('Invalid apps list response');
    }
    
    return data.filter(app => typeof app === 'string');
  }

  // Health check endpoint
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.fetchWithRetry(
        `${this.baseUrl}/health`,
        { method: 'GET' },
        1 // Only retry once for health checks
      );
      return response.ok;
    } catch {
      return false;
    }
  }
}
