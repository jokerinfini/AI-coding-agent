import React, { useState } from 'react';
import type { ChatMessage as ChatMessageType } from '@/types';
import ReactMarkdown from 'react-markdown';
import { User, Bot, Edit3, RotateCcw } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { useChat } from '@/hooks/useChat';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { getThemeColors } = useChatStore();
  const { sendMessage } = useChat();
  const colors = getThemeColors();
  const isUser = message.role === 'user';
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(message.content);
  };

  const handleSave = async () => {
    if (editContent.trim() && editContent !== message.content) {
      await sendMessage(editContent);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent(message.content);
  };

  const handleResend = async () => {
    await sendMessage(message.content);
  };

  return (
    <div className="w-full">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div 
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center border-2 rounded-none"
          style={{ 
            backgroundColor: isUser ? colors.accent : colors.dark,
            borderColor: colors.border,
            color: colors.text
          }}
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>

        {/* Message Content */}
        <div className="flex-1">
          <div 
            className="px-4 py-3 border-2 rounded-none"
            style={{
              backgroundColor: isUser ? colors.accent : colors.background,
              borderColor: colors.border,
              color: colors.text
            }}
          >
            {isUser && isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 border-2 rounded-none focus:outline-none resize-none min-h-[60px]"
                  style={{ 
                    fontFamily: 'VT323, monospace',
                    color: colors.text,
                    backgroundColor: colors.background,
                    borderColor: colors.border
                  }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="terminal-button px-3 py-1 text-sm font-bold"
                    style={{ color: colors.dark }}
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1 text-sm font-bold border-2"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.background,
                      color: colors.text
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : isUser ? (
              <p className="whitespace-pre-wrap font-mono">{message.content}</p>
            ) : (
              <ReactMarkdown
                components={{
                  // For assistant messages, hide fenced code blocks entirely and render inline code as plain text
                  code({ className, children }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !match;
                    if (!isInline) {
                      return <></>; // omit fenced code blocks from left chat
                    }
                    return <span className="font-mono" style={{ color: colors.accent }}>{children}</span>;
                  },
                  p({ children }) {
                    return <p className="font-mono leading-relaxed">{children}</p>;
                  },
                  ul({ children }) {
                    return <ul className="font-mono list-disc list-inside space-y-1">{children}</ul>;
                  },
                  li({ children }) {
                    return <li className="font-mono">{children}</li>;
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <div 
              className="text-xs font-mono"
              style={{ color: colors.accent }}
            >
              {message.timestamp.toLocaleTimeString()}
            </div>
            
            {/* Action Buttons for User Messages */}
            {isUser && (
              <div className="flex gap-2">
                {!isEditing ? (
                  <>
                    <button
                      onClick={handleEdit}
                      className="p-1 hover:opacity-70 transition-opacity"
                      style={{ color: colors.accent }}
                      title="Edit message"
                    >
                      <Edit3 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={handleResend}
                      className="p-1 hover:opacity-70 transition-opacity"
                      style={{ color: colors.accent }}
                      title="Resend message"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </button>
                  </>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
