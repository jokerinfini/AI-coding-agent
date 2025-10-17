import React from 'react';
import { Editor } from '@monaco-editor/react';
import type { CodeArtifact } from '@/types';
import { Button } from '@/components/ui/button';
import { Copy, Download } from 'lucide-react';

interface CodeViewProps {
  artifact: CodeArtifact;
}

export const CodeView: React.FC<CodeViewProps> = ({ artifact }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(artifact.code);
      // You could add a toast notification here
      console.log('Code copied to clipboard');
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    const extension = getFileExtension(artifact.language);
    const filename = `${artifact.title.replace(/\s+/g, '_')}.${extension}`;
    
    const blob = new Blob([artifact.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFileExtension = (language: string): string => {
    const extensionMap: { [key: string]: string } = {
      'javascript': 'js',
      'typescript': 'ts',
      'python': 'py',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'markdown': 'md',
      'sql': 'sql',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'rust': 'rs',
      'go': 'go',
      'php': 'php',
      'ruby': 'rb',
    };
    
    return extensionMap[language.toLowerCase()] || 'txt';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {artifact.language}
          </span>
          <span className="text-xs text-gray-500">
            {artifact.code.split('\n').length} lines
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex items-center space-x-1"
          >
            <Copy className="h-3 w-3" />
            <span>Copy</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="flex items-center space-x-1"
          >
            <Download className="h-3 w-3" />
            <span>Download</span>
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={artifact.language}
          value={artifact.code}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            fontSize: 14,
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            wordWrap: 'on',
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};
