import React from 'react';
import { useChatStore } from '@/store/chatStore';

export const ToggleSlider: React.FC = () => {
  const { activeTab, setActiveTab } = useChatStore();
  const isPreview = activeTab === 'preview';

  const handleToggle = () => {
    setActiveTab(isPreview ? 'code' : 'preview');
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center gap-2 px-3 py-1 text-sm border-2 border-terminal-dark bg-terminal-accent hover:bg-terminal-dark text-terminal-dark hover:text-terminal-text focus:outline-none rounded-none"
      aria-pressed={isPreview}
      aria-label="Toggle code/preview"
    >
      <span>{isPreview ? 'PREVIEW' : 'CODE'}</span>
      <div className="flex items-center w-10 h-5 p-0.5 border-2 border-terminal-dark bg-terminal-window-bg">
        <div
          className={`w-4 h-4 transition-all duration-200 ${
            isPreview ? 'ml-auto bg-terminal-text' : 'bg-terminal-dark'
          }`}
        />
      </div>
    </button>
  );
};

export default ToggleSlider;
