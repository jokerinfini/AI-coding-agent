import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { X, Settings, Key, Rocket, Save } from 'lucide-react';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onOpenChange }) => {
  const [geminiKey, setGeminiKey] = useState('');
  const [e2bKey, setE2bKey] = useState('');
  
  // Fixed colors for the dialog - don't change with theme
  const dialogColors = {
    background: '#FDFDFD',
    text: '#333333',
    border: '#DDE1E8',
    accent: '#5D9CDE',
    inputBg: '#FFFFFF',
    buttonSecondary: '#EAECEF',
    buttonSecondaryHover: '#D8DAE0',
    link: '#5D9CDE'
  };

  useEffect(() => {
    if (open) {
      setGeminiKey(localStorage.getItem('geminiApiKey') || '');
      setE2bKey(localStorage.getItem('e2bApiKey') || '');
    }
  }, [open]);

  const handleSave = () => {
    if (geminiKey) localStorage.setItem('geminiApiKey', geminiKey.trim());
    else localStorage.removeItem('geminiApiKey');

    if (e2bKey) localStorage.setItem('e2bApiKey', e2bKey.trim());
    else localStorage.removeItem('e2bApiKey');

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="rounded-xl w-[95vw] max-w-[500px] max-h-[80vh] overflow-auto border-0 shadow-2xl p-0"
        style={{ 
          backgroundColor: dialogColors.background, 
          color: dialogColors.text,
          boxShadow: `0 10px 30px rgba(0, 0, 0, 0.08)`
        }}
      >
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Configure your API keys for Gemini and e2b.dev services
        </DialogDescription>
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-5 right-5 bg-none border-none cursor-pointer p-0 opacity-60 hover:opacity-100 transition-opacity duration-200"
          style={{ color: dialogColors.text }}
          aria-label="Close settings"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 pb-4 px-8 pt-8">
          <Settings className="w-8 h-8 mx-auto mb-3" style={{ color: '#9370DB' }} />
          <h2 className="text-2xl font-semibold mb-2" style={{ color: dialogColors.text }}>
            Settings
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: dialogColors.text, opacity: 0.7 }}>
            Configure your API keys. Keys are stored securely in your browser's local storage.
          </p>
        </div>

        {/* Content */}
        <div className="px-8 mb-8">
          <div className="mb-5">
            <label className="flex items-center text-sm font-medium mb-2" style={{ color: dialogColors.text }}>
              <Key className="w-4 h-4 mr-2" style={{ color: '#777777' }} />
              Gemini API Key
            </label>
            <input
              type="password"
              placeholder="Enter your Gemini API key"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg text-base transition-all duration-200 focus:outline-none focus:ring-3"
              style={{ 
                borderColor: dialogColors.border, 
                backgroundColor: dialogColors.inputBg, 
                color: dialogColors.text
              }}
            />
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block mt-2 text-xs hover:underline transition-colors duration-200"
              style={{ color: dialogColors.link }}
            >
              Get your free API key from Google AI Studio
            </a>
          </div>

          <div className="mb-5">
            <label className="flex items-center text-sm font-medium mb-2" style={{ color: dialogColors.text }}>
              <Rocket className="w-4 h-4 mr-2" style={{ color: '#777777' }} />
              e2b.dev API Key <span className="text-xs opacity-70 ml-1">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="Enter your e2b.dev API key (e2b-...)"
              value={e2bKey}
              onChange={(e) => setE2bKey(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg text-base transition-all duration-200 focus:outline-none focus:ring-3"
              style={{ 
                borderColor: dialogColors.border, 
                backgroundColor: dialogColors.inputBg, 
                color: dialogColors.text
              }}
            />
            <a 
              href="https://e2b.dev/docs" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block mt-2 text-xs hover:underline transition-colors duration-200"
              style={{ color: dialogColors.link }}
            >
              For code execution and sandbox features. Get it from e2b.dev
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 px-8 pb-8 pt-5 border-t" style={{ borderColor: dialogColors.border }}>
          <button
            onClick={() => onOpenChange(false)}
            className="px-5 py-3 border-none rounded-lg text-base font-medium cursor-pointer inline-flex items-center justify-center gap-2 transition-all duration-200"
            style={{ 
              backgroundColor: dialogColors.buttonSecondary, 
              color: dialogColors.text 
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = dialogColors.buttonSecondaryHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = dialogColors.buttonSecondary;
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-3 border-none rounded-lg text-base font-medium cursor-pointer inline-flex items-center justify-center gap-2 transition-all duration-200"
            style={{ 
              backgroundColor: dialogColors.accent, 
              color: '#FFFFFF' 
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4A8EDC';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = dialogColors.accent;
            }}
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
