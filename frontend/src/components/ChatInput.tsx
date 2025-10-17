import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { useChatStore } from '@/store/chatStore';
import { Send, Loader2 } from 'lucide-react';

export const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const { sendMessage, isLoading, isStreaming } = useChat();
  const { getThemeColors } = useChatStore();
  const colors = getThemeColors();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading || isStreaming) return;
    const messageToSend = message.trim();
    setMessage('');
    await sendMessage(messageToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <footer className="p-4 border-t-4" style={{ borderColor: colors.border, backgroundColor: colors.windowBg }}>
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <span className="text-2xl font-bold" style={{ color: colors.accent }}>{'>'}</span>
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder="Ask me to help you with coding..."
            className="w-full px-3 py-2 border-2 rounded-none focus:outline-none resize-none min-h-[40px] max-h-[120px] text-lg"
            style={{ 
              fontFamily: 'VT323, monospace',
              color: colors.text,
              backgroundColor: colors.background,
              borderColor: colors.border,
              fontSize: '18px'
            }}
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim() || isLoading || isStreaming}
          className="terminal-button px-4 py-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
          style={{ color: colors.dark }}
        >
          {isLoading || isStreaming ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </footer>
  );
};
