import React from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ArtifactSidebar } from './ArtifactSidebar';
import { useChatStore } from '../store/chatStore';

export const ChatLayout: React.FC = () => {
  const { getThemeColors, layoutMode } = useChatStore();
  const colors = getThemeColors();
  
  

  return (
    <div className="min-h-screen p-2 lg:p-4" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto">
        
        <div className={`flex gap-4 ${layoutMode === 'mobile' ? 'flex-row' : 'flex-col lg:flex-row'}`}>
          {/* Mobile Layout: Sidebar on Left */}
          {layoutMode === 'mobile' && <ArtifactSidebar />}
          
          {/* Main Chat Area */}
          <div className={`flex-1 terminal-window rounded-none shadow-terminal ${layoutMode === 'desktop' ? 'lg:flex-none lg:w-[60%]' : ''}`} style={{ backgroundColor: colors.windowBg, borderColor: colors.border }}>
            <ChatHeader />
            <div className="flex flex-col h-[calc(100vh-6rem)] lg:h-[calc(100vh-8rem)]">
              <ChatMessages />
              <ChatInput />
            </div>
          </div>
          
          {/* Desktop Layout: Sidebar on Right */}
          {layoutMode === 'desktop' && <ArtifactSidebar />}
        </div>
      </div>
    </div>
  );
};
