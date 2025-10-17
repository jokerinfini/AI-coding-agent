import React, { useState } from 'react';
import { useChatStore } from '@/store/chatStore';
import { Settings } from 'lucide-react';
import { SettingsDialog } from './SettingsDialog';
import { ThemeSelector } from './ThemeSelector';
import { LayoutModeSelector } from './LayoutModeSelector';

const LANGS = [
  { label: 'Auto', value: '' },
  { label: 'Java', value: 'java' },
  { label: 'Python', value: 'python' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'C++', value: 'cpp' },
  { label: 'C#', value: 'csharp' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
  { label: 'PHP', value: 'php' },
  { label: 'Ruby', value: 'ruby' },
  { label: 'Kotlin', value: 'kotlin' },
  { label: 'Swift', value: 'swift' },
];

export const ChatHeader: React.FC = () => {
  const { clearMessages, selectedLanguage, setSelectedLanguage, getThemeColors } = useChatStore();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const colors = getThemeColors();

  return (
    <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 border-b-4 gap-4" style={{ borderColor: colors.border, backgroundColor: colors.windowBg }}>
      {/* Left Side - Title */}
      <h1 className="text-2xl lg:text-3xl font-bold tracking-wider" style={{ color: colors.text }}>
        AI CODING AGENT
      </h1>
      
      {/* Right Side - All Controls */}
      <div className="flex flex-wrap items-center gap-3 lg:gap-6 w-full lg:w-auto">
        {/* Language Selector */}
        <select
          value={selectedLanguage || ''}
          onChange={(e) => setSelectedLanguage(e.target.value || null)}
          className="terminal-input px-3 py-2 rounded-none focus:outline-none min-w-[100px] text-sm lg:text-base"
          style={{ color: colors.text, backgroundColor: colors.background, borderColor: colors.border }}
          aria-label="Select language"
        >
          {LANGS.map(l => (
            <option key={l.value} value={l.value} style={{ backgroundColor: colors.windowBg, color: colors.text }}>
              {l.label}
            </option>
          ))}
        </select>

            {/* Theme Selector */}
            <ThemeSelector />

            {/* Layout Mode Selector */}
            <LayoutModeSelector />

            {/* Action Buttons */}
        <button
          className="terminal-button px-3 lg:px-4 py-2 font-bold hover:scale-105 transition-transform text-sm lg:text-base"
          style={{ color: colors.dark }}
          onClick={() => setSettingsOpen(true)}
        >
          <Settings className="w-4 h-4 inline mr-1 lg:mr-2" />
          <span className="hidden sm:inline">Settings</span>
        </button>
        
        <button
          className="terminal-button px-3 lg:px-4 py-2 font-bold hover:scale-105 transition-transform text-sm lg:text-base"
          style={{ color: colors.dark }}
          onClick={clearMessages}
        >
          <span className="hidden sm:inline">Clear Chat</span>
          <span className="sm:hidden">Clear</span>
        </button>
      </div>
      
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </header>
  );
};
