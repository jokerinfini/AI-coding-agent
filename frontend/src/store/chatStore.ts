import { create } from 'zustand';
import type { AppState, ChatMessage } from '@/types';

export type Theme = 'dark' | 'clean-light' | 'sleek-dark' | 'vibrant-tech';

export interface ThemeColors {
  background: string;
  windowBg: string;
  dark: string;
  accent: string;
  text: string;
  border: string;
}

export const useChatStore = create<AppState & { 
  selectedLanguage: string | null; 
  setSelectedLanguage: (lang: string | null) => void;
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  getThemeColors: () => ThemeColors;
  layoutMode: 'desktop' | 'mobile';
  setLayoutMode: (mode: 'desktop' | 'mobile') => void;
}>((set, get) => ({
  // Initial state
  messages: [],
  isLoading: false,
  isStreaming: false,
  currentSessionId: '',
  isOpen: false,
  currentArtifact: null,
  artifacts: [], // Store all artifacts
  activeTab: 'code',
  selectedLanguage: null,
  currentTheme: (() => {
    // Initialize from localStorage or default to sleek-dark
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('selectedTheme') as Theme) || 'sleek-dark';
    }
    return 'sleek-dark';
  })(),
  layoutMode: (() => {
    // Initialize from localStorage or default to desktop
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('layoutMode') as 'desktop' | 'mobile') || 'desktop';
    }
    return 'desktop';
  })(),

  // Actions
  addMessage: (message) => {
    const newMessage: ChatMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  updateMessage: (id, content) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, content } : msg
      ),
    }));
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setStreaming: (streaming) => {
    set({ isStreaming: streaming });
  },

  toggleSidebar: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  setCurrentArtifact: (artifact) => {
    set({ currentArtifact: artifact });
    if (artifact) {
      set({ isOpen: true });
    }
  },

  addArtifact: (artifact) => {
    console.log('Adding artifact:', artifact.title, 'Total artifacts:', get().artifacts.length + 1);
    set((state) => ({
      artifacts: [...state.artifacts, artifact],
      currentArtifact: artifact, // Set as current when added
      isOpen: true, // Automatically open sidebar for new artifacts
    }));
  },

  getArtifactById: (id) => {
    const state = get();
    return state.artifacts.find(artifact => artifact.id === id) || null;
  },

  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },

  clearMessages: () => {
    set({ 
      messages: [],
      currentArtifact: null,
      artifacts: [], // Clear all artifacts
      isOpen: false,
      activeTab: 'code'
    });
  },

  setSessionId: (sessionId) => {
    set({ currentSessionId: sessionId });
  },

      setSelectedLanguage: (lang) => {
        set({ selectedLanguage: lang });
      },

      setTheme: (theme) => {
        set({ currentTheme: theme });
        localStorage.setItem('selectedTheme', theme);
        // Apply theme to document
        const colors = get().getThemeColors();
        if (typeof document !== 'undefined') {
          document.documentElement.style.setProperty('--background', colors.background);
          document.documentElement.style.setProperty('--foreground', colors.text);
          document.documentElement.style.setProperty('--border', colors.border);
          document.documentElement.style.setProperty('--accent', colors.accent);
          document.documentElement.style.setProperty('--window-bg', colors.windowBg);
        }
      },

      setLayoutMode: (mode) => {
        set({ layoutMode: mode });
        localStorage.setItem('layoutMode', mode);
      },

      getThemeColors: () => {
        const theme = get().currentTheme;
        const themes: Record<Theme, ThemeColors> = {
          dark: {
            background: '#0a0a0a',
            windowBg: '#1a1a1a',
            dark: '#000000',
            accent: '#404040',
            text: '#ffffff',
            border: '#333333'
          },
          'clean-light': {
            background: '#f8f9fa',
            windowBg: '#EFEFEF',
            dark: '#e9ecef',
            accent: '#4A90E2',
            text: '#212529',
            border: '#dee2e6'
          },
          'sleek-dark': {
            background: '#1A1A1D',
            windowBg: '#2A3A4D',
            dark: '#0F0F12',
            accent: '#5D9CDE',
            text: '#E0E6EB',
            border: '#4A4A50'
          },
          'vibrant-tech': {
            background: '#1E1624',
            windowBg: '#2C2134',
            dark: '#0F0A14',
            accent: '#D14FE0',
            text: '#F0F0F0',
            border: '#4A3A5C'
          }
        };
        return themes[theme];
      },
    }));
