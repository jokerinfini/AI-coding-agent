import React, { useMemo } from 'react';
import { useChatStore } from '@/store/chatStore';
import { Code2, Eye } from 'lucide-react';

type Artifact = import('@/types').CodeArtifact;

interface ArtifactButtonProps {
  artifact: Artifact;
}

export const ArtifactButton: React.FC<ArtifactButtonProps> = ({ artifact }) => {
  const { isOpen, currentArtifact, setCurrentArtifact, toggleSidebar, getThemeColors } = useChatStore();
  const colors = getThemeColors();

  const isActive = useMemo(() => {
    return isOpen && currentArtifact && currentArtifact.id === artifact.id;
  }, [isOpen, currentArtifact, artifact.id]);

  const handleToggle = () => {
    // If not open or different artifact, set artifact (auto-opens)
    if (!isOpen || !currentArtifact || currentArtifact.id !== artifact.id) {
      setCurrentArtifact(artifact);
      return;
    }
    // If already showing this artifact, toggle close
    toggleSidebar();
  };

  return (
    <button
      onClick={handleToggle}
      aria-pressed={isActive ? 'true' : 'false'}
      className="terminal-button group inline-flex items-center gap-3 px-4 py-2 font-bold hover:scale-105 transition-all duration-200"
      style={{ color: colors.dark }}
      aria-label="Toggle generated artifact sidebar"
    >
      <div className="flex items-center gap-2">
        <Code2 className="w-4 h-4" />
        <span className="text-sm font-mono">VIEW GENERATED ARTIFACT</span>
      </div>
      
      {/* Enhanced slider toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono" style={{ color: colors.dark }}>
          {isActive ? 'ON' : 'OFF'}
        </span>
        <div 
          className="relative h-6 w-12 border-2 overflow-hidden transition-all duration-200"
          style={{ 
            borderColor: colors.border,
            backgroundColor: isActive ? colors.accent : colors.background
          }}
        >
          <div
            className="absolute top-0 h-full w-1/2 border-r-2 transition-transform duration-200 flex items-center justify-center"
            style={{
              borderColor: colors.border,
              backgroundColor: isActive ? colors.dark : colors.accent,
              transform: isActive ? 'translateX(100%)' : 'translateX(0)'
            }}
          >
            {isActive ? (
              <Eye className="w-3 h-3" style={{ color: colors.text }} />
            ) : (
              <Code2 className="w-3 h-3" style={{ color: colors.text }} />
            )}
          </div>
        </div>
      </div>
    </button>
  );
};
