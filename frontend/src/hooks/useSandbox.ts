import { useState } from 'react';
import { executeCode, type SandboxRequest } from '@/lib/api';
import type { SandboxResponse } from '@/types';
import { useChatStore } from '@/store/chatStore';

export const useSandbox = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState<SandboxResponse | null>(null);
  const { currentSessionId } = useChatStore();

  const executeCodeInSandbox = async (code: string, language: string): Promise<SandboxResponse> => {
    setIsExecuting(true);
    
    try {
      const request: SandboxRequest = {
        code,
        language,
        session_id: currentSessionId,
      };

      const result = await executeCode(request);
      setLastResult(result);
      return result;
    } catch (error) {
      const errorResult: SandboxResponse = {
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false,
      };
      setLastResult(errorResult);
      return errorResult;
    } finally {
      setIsExecuting(false);
    }
  };

  return {
    executeCode: executeCodeInSandbox,
    isExecuting,
    lastResult,
  };
};
