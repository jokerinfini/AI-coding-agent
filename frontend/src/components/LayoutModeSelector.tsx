import React, { useState } from 'react';
import { useChatStore } from '@/store/chatStore';
import { Monitor, Smartphone } from 'lucide-react';

export const LayoutModeSelector: React.FC = () => {
  const { layoutMode, setLayoutMode, getThemeColors } = useChatStore();
  const [isOpen, setIsOpen] = useState(false);

  const colors = getThemeColors();

  const handleModeChange = (mode: 'desktop' | 'mobile') => {
    setLayoutMode(mode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="terminal-button px-4 py-2 font-bold hover:scale-105 transition-transform flex items-center gap-2"
        style={{ color: colors.dark }}
        aria-label="Select layout mode"
      >
        {layoutMode === 'desktop' ? (
          <Smartphone className="w-4 h-4" />
        ) : (
          <Monitor className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">
          {layoutMode === 'desktop' ? 'MOBILE' : 'DESKTOP'}
        </span>
        <span className="sm:hidden">LAYOUT</span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 border-2 rounded-none shadow-lg z-10"
          style={{ borderColor: colors.border, backgroundColor: colors.windowBg }}
        >
          <div className="p-2">
            <button
              onClick={() => handleModeChange('desktop')}
              className={`w-full text-left px-3 py-2 rounded-none text-sm font-mono flex items-center gap-2 transition-colors duration-150 ${
                layoutMode === 'desktop' ? 'font-bold' : ''
              }`}
              style={{
                backgroundColor: layoutMode === 'desktop' ? colors.accent : 'transparent',
                color: layoutMode === 'desktop' ? colors.dark : colors.text,
              }}
            >
              <Smartphone className="w-4 h-4" />
              Mobile Layout
            </button>
            <button
              onClick={() => handleModeChange('mobile')}
              className={`w-full text-left px-3 py-2 rounded-none text-sm font-mono flex items-center gap-2 transition-colors duration-150 ${
                layoutMode === 'mobile' ? 'font-bold' : ''
              }`}
              style={{
                backgroundColor: layoutMode === 'mobile' ? colors.accent : 'transparent',
                color: layoutMode === 'mobile' ? colors.dark : colors.text,
              }}
            >
              <Monitor className="w-4 h-4" />
              Desktop Layout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
