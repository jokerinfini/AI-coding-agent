import React, { useMemo, useState } from 'react';
import { useChatStore } from '@/store/chatStore';

export const RetroCodePanel: React.FC = () => {
  const { currentArtifact } = useChatStore();
  const [tab, setTab] = useState<'code' | 'preview'>('code');

  const code = useMemo(() => currentArtifact?.code || '/* Your generated code will appear here */', [currentArtifact]);
  const language = currentArtifact?.language || '';

  return (
    <div className="flex flex-col h-[85vh] bg-terminal-window-bg border-4 border-terminal-dark shadow-lg">
      <header className="flex items-center p-2 text-lg border-b-4 border-terminal-dark">
        <button
          className={`px-4 py-1 text-lg border-2 border-terminal-dark ${tab === 'code' ? 'bg-terminal-dark' : 'bg-terminal-accent hover:bg-terminal-dark'}`}
          onClick={() => setTab('code')}
        >
          CODE
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-1 ml-2 text-lg border-2 border-terminal-dark ${tab === 'preview' ? 'bg-terminal-dark' : 'bg-terminal-accent hover:bg-terminal-dark'}`}
          onClick={() => setTab('preview')}
        >
          PREVIEW
          <div className="w-8 h-4 border-2 border-terminal-dark bg-terminal-window-bg">
            <div className={`w-3 h-3 ${tab === 'preview' ? 'ml-auto' : ''} bg-terminal-text`}></div>
          </div>
        </button>
      </header>

      <main className="flex-grow p-4 overflow-y-auto text-sm">
        {tab === 'code' ? (
          <pre className="whitespace-pre-wrap">
            <code className="block p-2">
              {code}
            </code>
          </pre>
        ) : (
          <div className="p-2">
            <p className="mb-2">Preview not wired to sandbox in this panel. Use the sidebar button to run.</p>
            {language.toLowerCase() === 'html' ? (
              <iframe title="preview" className="w-full h-64 border-2 border-terminal-dark" srcDoc={code} />
            ) : (
              <div className="border-2 border-terminal-dark p-2">Preview available for HTML. Other languages show code only.</div>
            )}
          </div>
        )}
      </main>

      <footer className="p-2 border-t-4 border-terminal-dark">
        <button className="w-full px-4 py-2 text-lg border-2 border-terminal-dark bg-terminal-accent hover:bg-terminal-dark">
          View Generated Artifact
        </button>
      </footer>
    </div>
  );
};
