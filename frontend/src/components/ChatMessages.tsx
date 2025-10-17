import React, { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/chatStore';
import { ChatMessage } from './ChatMessage';
import { LoadingIndicator } from './LoadingIndicator';
import { ArtifactButton } from './ArtifactButton';

export const ChatMessages: React.FC = () => {
  const { messages, isLoading, artifacts, getThemeColors } = useChatStore();
  const colors = getThemeColors();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <main className="flex-grow p-4 overflow-y-auto" style={{ backgroundColor: colors.windowBg }}>
      <div className="space-y-4">
        {messages.map((message, index) => {
          // Find the artifact associated with this message
          let messageArtifact = null;
          if (message.role === 'assistant') {
            // Find the artifact that was created around the time of this message
            // We'll use a simple approach: find the artifact with the closest timestamp
            const messageTime = message.timestamp.getTime();
            
            messageArtifact = artifacts.find(artifact => {
              const artifactTime = artifact.created_at.getTime();
              // Find artifact created within 5 seconds of this message
              return Math.abs(artifactTime - messageTime) < 5000;
            });
            
            // If no artifact found with timing, try to find by message order
            if (!messageArtifact) {
              // Count how many assistant messages come before this one
              const assistantMessagesBeforeThis = messages
                .slice(0, index)
                .filter(msg => msg.role === 'assistant').length;
              
              // Use the artifact at the same index
              messageArtifact = artifacts[assistantMessagesBeforeThis] || null;
            }
            
            // Debug logging
            console.log('Message:', message.content.substring(0, 50) + '...');
            console.log('Message time:', message.timestamp.toISOString());
            console.log('Artifacts available:', artifacts.length);
            console.log('Artifacts times:', artifacts.map(a => a.created_at.toISOString()));
            console.log('Selected artifact:', messageArtifact?.title);
          }

          return (
            <div key={message.id} className="flex items-start gap-3 p-3 rounded-none border-2" style={{ borderColor: colors.border, backgroundColor: colors.background }}>
              <span className="text-lg font-bold flex-shrink-0" style={{ color: message.role === 'user' ? colors.accent : colors.text }}>
                {message.role === 'user' ? '>' : 'AGENT:'}
              </span>
              <div className="flex-1">
                <ChatMessage message={message} />
                {messageArtifact && (
                  <div className="mt-3">
                    <ArtifactButton artifact={messageArtifact} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex items-center gap-3 p-3 rounded-none border-2" style={{ borderColor: colors.border, backgroundColor: colors.background }}>
            <LoadingIndicator />
            <span className="text-sm" style={{ color: colors.text }}>AI is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </main>
  );
};
