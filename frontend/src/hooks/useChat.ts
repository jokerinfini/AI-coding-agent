import { useCallback, useRef } from 'react';
import { useChatStore } from '@/store/chatStore';
import { streamChat } from '@/lib/api';
import type { ChatRequest } from '@/lib/api';
import type { StreamChunk } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const useChat = () => {
  const {
    messages,
    isLoading,
    isStreaming,
    currentSessionId,
    addMessage,
    setLoading,
    setStreaming,
    addArtifact,
    setSessionId,
    selectedLanguage,
  } = useChatStore();

  const generateSessionId = useCallback(() => uuidv4(), []);

  const artifactBufferRef = useRef<string>('');
  const insideArtifactRef = useRef<boolean>(false);

  const stripArtifactsStreaming = (delta: string): string => {
    if (!delta) return '';
    let text = '';
    let buf = artifactBufferRef.current + delta;
    let inside = insideArtifactRef.current;
    while (buf.length > 0) {
      if (!inside) {
        const start = buf.indexOf('<artifact');
        if (start === -1) { text += buf; buf = ''; break; }
        text += buf.slice(0, start);
        buf = buf.slice(start);
        inside = true;
      }
      const end = buf.indexOf('</artifact>');
      if (end === -1) break;
      buf = buf.slice(end + '</artifact>'.length);
      inside = false;
    }
    artifactBufferRef.current = buf;
    insideArtifactRef.current = inside;
    return text;
  };

  const sendMessageStream = useCallback(async (message: string) => {
    const sessionId = currentSessionId || generateSessionId();
    if (!currentSessionId) setSessionId(sessionId);

    // If a language is selected, prepend a short hint so backend locks to it
    const hint = selectedLanguage ? `(language: ${selectedLanguage}) ` : '';
    const messageWithHint = hint + message;

    addMessage({ role: 'user', content: messageWithHint });
    addMessage({ role: 'assistant', content: '' });

    setLoading(true);
    setStreaming(true);

    const request: ChatRequest = {
      message: messageWithHint,
      session_id: sessionId,
      conversation_history: useChatStore.getState().messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
      })),
    };

    artifactBufferRef.current = '';
    insideArtifactRef.current = false;

    try {
      await streamChat(
        request,
        (chunk: StreamChunk) => {
          if (chunk.delta) {
            const cleaned = stripArtifactsStreaming(chunk.delta);
            if (cleaned) {
              const state = useChatStore.getState();
              const last = [...state.messages].reverse().find(m => m.role === 'assistant');
              if (last) state.updateMessage(last.id, last.content + cleaned);
            }
          }
          if (chunk.artifact_detected && chunk.artifact_data) {
            console.log('Artifact detected in stream:', chunk.artifact_data.title);
            // Ensure the artifact has the current timestamp
            const artifactWithTimestamp = {
              ...chunk.artifact_data,
              created_at: new Date()
            };
            addArtifact(artifactWithTimestamp);
          }
          if (chunk.done) { setLoading(false); setStreaming(false); }
          if (chunk.error) { setLoading(false); setStreaming(false); console.error('Streaming error:', chunk.error); }
        },
        (error) => { setLoading(false); setStreaming(false); console.error('Chat error:', error); }
      );
    } catch (error) {
      setLoading(false);
      setStreaming(false);
      console.error('Chat error:', error);
    }
  }, [currentSessionId, setSessionId, addMessage, setLoading, setStreaming, addArtifact, generateSessionId, selectedLanguage]);

  const clearConversation = useCallback(() => {
    useChatStore.getState().clearMessages();
    setSessionId(generateSessionId());
  }, [setSessionId, generateSessionId]);

  return { messages, isLoading, isStreaming, currentSessionId, sendMessage: sendMessageStream, clearConversation };
};
