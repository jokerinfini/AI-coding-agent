import React, { useState, useEffect } from 'react';
import type { CodeArtifact } from '@/types';
import { useSandbox } from '@/hooks/useSandbox';
import { Button } from '@/components/ui/button';
import { Play, Loader2, AlertCircle } from 'lucide-react';

interface PreviewViewProps {
  artifact: CodeArtifact;
}

export const PreviewView: React.FC<PreviewViewProps> = ({ artifact }) => {
  const { executeCode, isExecuting, lastResult } = useSandbox();
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Auto-execute on mount for supported languages
    if (['html', 'javascript', 'python'].includes(artifact.language.toLowerCase())) {
      handleExecute();
    }
  }, [artifact]);

  const handleExecute = async () => {
    setOutput('');
    setError('');
    
    const result = await executeCode(artifact.code, artifact.language);
    
    if (result.success) {
      setOutput(result.output || 'Code executed successfully');
    } else {
      setError(result.error || 'Execution failed');
    }
  };

  const renderPreview = () => {
    if (artifact.language.toLowerCase() === 'html' && lastResult?.preview_url) {
      return (
        <iframe
          src={lastResult.preview_url}
          className="w-full h-full border-0"
          title="Code Preview"
        />
      );
    }
    
    return (
      <div className="p-4">
        {output && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Output:
            </h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm overflow-auto">
              {output}
            </pre>
          </div>
        )}
        
        {error && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              Error:
            </h4>
            <pre className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-sm text-red-600 dark:text-red-400 overflow-auto">
              {error}
            </pre>
          </div>
        )}
        
        {!output && !error && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            Click "Run Code" to execute and preview the result
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Preview
          </span>
          <span className="text-xs text-gray-500">
            {artifact.language}
          </span>
        </div>
        
        <Button
          onClick={handleExecute}
          disabled={isExecuting}
          size="sm"
          className="flex items-center space-x-1"
        >
          {isExecuting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          <span>{isExecuting ? 'Running...' : 'Run Code'}</span>
        </Button>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto">
        {renderPreview()}
      </div>
    </div>
  );
};
