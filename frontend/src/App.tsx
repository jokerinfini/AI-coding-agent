import { useEffect } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ChatLayout } from '@/components/ChatLayout';
import { useChatStore } from '@/store/chatStore';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  const { setTheme } = useChatStore();

  useEffect(() => {
    // Initialize theme from localStorage or default to sleek-dark
    const savedTheme = localStorage.getItem('selectedTheme') as any || 'sleek-dark';
    setTheme(savedTheme);
  }, [setTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen overflow-auto font-mono bg-background text-foreground border-4 border-border">
        <ChatLayout />
      </div>
    </QueryClientProvider>
  );
}

export default App;
