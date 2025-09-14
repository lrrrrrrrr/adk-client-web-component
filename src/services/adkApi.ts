import type { ChatConfig, ADKRunRequest, Session } from '../types';

export class ADKApiService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  async createSession(config: ChatConfig, initialState?: Record<string, any>): Promise<Session> {
    const response = await fetch(
      `${this.baseUrl}/apps/${config.appName}/users/${config.userId}/sessions/${config.sessionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state: initialState || {},
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create session: ${response.statusText}`);
    }

    return response.json();
  }

  async getSession(config: ChatConfig): Promise<Session> {
    const response = await fetch(
      `${this.baseUrl}/apps/${config.appName}/users/${config.userId}/sessions/${config.sessionId}`
    );

    if (!response.ok) {
      throw new Error(`Failed to get session: ${response.statusText}`);
    }

    return response.json();
  }

  async sendMessage(config: ChatConfig, message: string): Promise<any[]> {
    const request: ADKRunRequest = {
      app_name: config.appName,
      user_id: config.userId,
      session_id: config.sessionId,
      new_message: {
        role: 'user',
        parts: [{ text: message }],
      },
    };

    const response = await fetch(`${this.baseUrl}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    return response.json();
  }

  async sendMessageStreaming(
    config: ChatConfig,
    message: string,
    onEvent: (event: any) => void
  ): Promise<void> {
    const request: ADKRunRequest = {
      app_name: config.appName,
      user_id: config.userId,
      session_id: config.sessionId,
      new_message: {
        role: 'user',
        parts: [{ text: message }],
      },
      streaming: true,
    };

    const response = await fetch(`${this.baseUrl}/run_sse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify(request),
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
              onEvent(event);
            } catch (e) {
              console.warn('Failed to parse SSE event:', data);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  async listApps(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/list-apps`);
    
    if (!response.ok) {
      throw new Error(`Failed to list apps: ${response.statusText}`);
    }

    return response.json();
  }
}
