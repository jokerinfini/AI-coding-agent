import React, { useState } from 'react';
import { useChatStore } from '@/store/chatStore';
import { Palette, ChevronDown } from 'lucide-react';

export const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, getThemeColors } = useChatStore();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { id: 'dark', name: 'Dark Theme (Default)', icon: '⚫' },
    { id: 'clean-light', name: 'Clean Light Mode', icon: '☀️' },
    { id: 'sleek-dark', name: 'Sleek Dark Mode', icon: '🌙' },
    { id: 'vibrant-tech', name: 'Vibrant Tech', icon: '⚡' }
  ] as const;

      const colors = getThemeColors();

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId as any);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="terminal-button group inline-flex items-center gap-2 px-3 py-2 font-bold hover:scale-105 transition-all duration-200"
        style={{ color: colors.dark }}
        aria-label="Select theme"
      >
        <Palette className="w-4 h-4" />
        <span className="text-sm font-mono">THEMES</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-2 w-64 border-4 shadow-lg z-50"
          style={{ 
            backgroundColor: colors.windowBg,
            borderColor: colors.border
          }}
        >
          <div className="p-3 border-b-4" style={{ borderColor: colors.border }}>
            <h3 className="text-lg font-bold font-mono" style={{ color: colors.text }}>
              Themes
            </h3>
          </div>
          
          <div className="p-2">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={`w-full text-left px-3 py-2 border-2 font-mono text-sm transition-all duration-200 hover:scale-105 ${
                  currentTheme === theme.id ? 'terminal-button' : 'border-2'
                }`}
                style={{
                  borderColor: colors.border,
                  backgroundColor: currentTheme === theme.id ? colors.accent : colors.background,
                  color: currentTheme === theme.id ? colors.dark : colors.text
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{theme.icon}</span>
                  <span>{theme.name}</span>
                  {currentTheme === theme.id && (
                    <span className="ml-auto text-xs">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
