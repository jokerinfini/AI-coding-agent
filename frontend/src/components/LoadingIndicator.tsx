import React from 'react';
import { useChatStore } from '@/store/chatStore';

export const LoadingIndicator: React.FC = () => {
  const { getThemeColors } = useChatStore();
  const colors = getThemeColors();

  return (
    <div className="flex space-x-1">
      <div 
        className="w-2 h-2 rounded-none animate-bounce" 
        style={{ 
          backgroundColor: colors.accent,
          animationDelay: '0ms' 
        }}
      ></div>
      <div 
        className="w-2 h-2 rounded-none animate-bounce" 
        style={{ 
          backgroundColor: colors.accent,
          animationDelay: '150ms' 
        }}
      ></div>
      <div 
        className="w-2 h-2 rounded-none animate-bounce" 
        style={{ 
          backgroundColor: colors.accent,
          animationDelay: '300ms' 
        }}
      ></div>
    </div>
  );
};
