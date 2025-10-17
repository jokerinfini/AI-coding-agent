export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface CodeArtifact {
  id: string;
  language: string;
  title: string;
  code: string;
  created_at: Date;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  currentSessionId: string;
}

export interface SidebarState {
  isOpen: boolean;
  currentArtifact: CodeArtifact | null;
  activeTab: 'code' | 'preview';
  artifacts: CodeArtifact[]; // Store all artifacts
}

export interface AppState extends ChatState, SidebarState {
  // Actions
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateMessage: (id: string, content: string) => void;
  setLoading: (loading: boolean) => void;
  setStreaming: (streaming: boolean) => void;
  toggleSidebar: () => void;
  setCurrentArtifact: (artifact: CodeArtifact | null) => void;
  addArtifact: (artifact: CodeArtifact) => void;
  getArtifactById: (id: string) => CodeArtifact | null;
  setActiveTab: (tab: 'code' | 'preview') => void;
  clearMessages: () => void;
  setSessionId: (sessionId: string) => void;
}

export interface StreamChunk {
  delta: string;
  done: boolean;
  artifact_detected?: boolean;
  artifact_data?: CodeArtifact;
  metadata?: any;
  error?: string;
}

export interface SandboxResponse {
  output: string;
  error?: string;
  execution_time?: number;
  success: boolean;
  preview_url?: string;
}
