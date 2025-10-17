import React from 'react';
import { useChatStore } from '@/store/chatStore';
import { CodeView } from './CodeView';
import { PreviewView } from './PreviewView';
import { X } from 'lucide-react';

export const ArtifactSidebar: React.FC = () => {
  const { 
    isOpen, 
    currentArtifact, 
    activeTab, 
    toggleSidebar, 
    setActiveTab,
    getThemeColors,
    layoutMode
  } = useChatStore();
  const colors = getThemeColors();

  if (!isOpen || !currentArtifact) return null;

  return (
    <>
      {/* Main Sidebar - Always show when artifact exists */}
      <div className="block w-full min-w-[400px] flex-1 sticky top-4 transition-all duration-300" aria-label="Artifact sidebar">
        <div className="h-[88vh] border-4 shadow-lg flex flex-col overflow-hidden" style={{ backgroundColor: colors.windowBg, borderColor: colors.border }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-4" style={{ borderColor: colors.border, backgroundColor: colors.windowBg }}>
          <h3 className="text-lg font-bold font-mono truncate" style={{ color: colors.text }}>
            {currentArtifact.title}
          </h3>
          <div className="flex items-center gap-3">
            {/* Enhanced Tab Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 border-2 font-mono text-sm transition-all duration-200 ${
                  activeTab === 'code' ? 'terminal-button' : 'border-2'
                }`}
                style={{
                  borderColor: colors.border,
                  backgroundColor: activeTab === 'code' ? colors.accent : colors.background,
                  color: activeTab === 'code' ? colors.dark : colors.text
                }}
              >
                CODE
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 border-2 font-mono text-sm transition-all duration-200 ${
                  activeTab === 'preview' ? 'terminal-button' : 'border-2'
                }`}
                style={{
                  borderColor: colors.border,
                  backgroundColor: activeTab === 'preview' ? colors.accent : colors.background,
                  color: activeTab === 'preview' ? colors.dark : colors.text
                }}
              >
                PREVIEW
              </button>
            </div>
            
            <button
              onClick={toggleSidebar}
              className="terminal-button p-2 font-bold hover:scale-105 transition-transform"
              style={{ color: colors.dark }}
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 min-h-0">
          {activeTab === 'code' ? (
            <div className="h-full">
              <CodeView artifact={currentArtifact} />
            </div>
          ) : (
            <div className="h-full overflow-auto">
              <PreviewView artifact={currentArtifact} />
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Mobile Modal - Only show in desktop layout mode */}
      <div className={`${layoutMode === 'desktop' ? 'block lg:hidden' : 'hidden'} fixed inset-0 z-50`} aria-label="Mobile artifact modal">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={toggleSidebar}
        />
        
        {/* Modal Content */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div 
            className="w-full max-w-4xl h-[90vh] border-4 shadow-lg flex flex-col overflow-hidden"
            style={{ backgroundColor: colors.windowBg, borderColor: colors.border }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b-4" style={{ borderColor: colors.border, backgroundColor: colors.windowBg }}>
              <h3 className="text-lg font-bold font-mono truncate" style={{ color: colors.text }}>
                {currentArtifact.title}
              </h3>
              <div className="flex items-center gap-3">
                {/* Enhanced Tab Toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`px-3 py-1 border-2 font-mono text-sm transition-all duration-200 ${
                      activeTab === 'code' ? 'terminal-button' : 'border-2'
                    }`}
                    style={{
                      borderColor: colors.border,
                      backgroundColor: activeTab === 'code' ? colors.accent : colors.background,
                      color: activeTab === 'code' ? colors.dark : colors.text
                    }}
                  >
                    CODE
                  </button>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1 border-2 font-mono text-sm transition-all duration-200 ${
                      activeTab === 'preview' ? 'terminal-button' : 'border-2'
                    }`}
                    style={{
                      borderColor: colors.border,
                      backgroundColor: activeTab === 'preview' ? colors.accent : colors.background,
                      color: activeTab === 'preview' ? colors.dark : colors.text
                    }}
                  >
                    PREVIEW
                  </button>
                </div>
                
                <button
                  onClick={toggleSidebar}
                  className="terminal-button p-2 font-bold hover:scale-105 transition-transform"
                  style={{ color: colors.dark }}
                  aria-label="Close sidebar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1 min-h-0">
              {activeTab === 'code' ? (
                <div className="h-full">
                  <CodeView artifact={currentArtifact} />
                </div>
              ) : (
                <div className="h-full overflow-auto">
                  <PreviewView artifact={currentArtifact} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};