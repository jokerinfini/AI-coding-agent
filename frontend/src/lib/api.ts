import axios from 'axios';
import type { StreamChunk, SandboxResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const gemini = localStorage.getItem('geminiApiKey') || '';
  const e2b = localStorage.getItem('e2bApiKey') || '';
  if (!config.headers) config.headers = {} as any;
  if (gemini) (config.headers as any)['x-gemini-api-key'] = gemini;
  if (e2b) (config.headers as any)['x-e2b-api-key'] = e2b;
  return config;
});

export interface ChatRequest {
  message: string;
  session_id: string;
  conversation_history?: any[];
}

export interface SandboxRequest {
  code: string;
  language: string;
  session_id: string;
}

export const streamChat = async (
  request: ChatRequest,
  onChunk: (chunk: StreamChunk) => void,
  onError?: (error: Error) => void
): Promise<void> => {
  try {
    const gemini = localStorage.getItem('geminiApiKey') || '';
    const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(gemini ? { 'x-gemini-api-key': gemini } : {}),
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            onChunk(data);
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Streaming error:', error);
    onError?.(error as Error);
  }
};

export const executeCode = async (request: SandboxRequest): Promise<SandboxResponse> => {
  try {
    const response = await apiClient.post<SandboxResponse>('/api/chat/sandbox/execute', request);
    return response.data;
  } catch (error) {
    console.error('Sandbox execution error:', error);
    throw error;
  }
};

export const sendMessage = async (request: ChatRequest) => {
  try {
    const response = await apiClient.post('/api/chat/message', request);
    return response.data;
  } catch (error) {
    console.error('Chat message error:', error);
    throw error;
  }
};

export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
};
