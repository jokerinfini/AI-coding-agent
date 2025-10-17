# AI Coding Agent

A Claude-style AI coding assistant with real-time code generation, syntax highlighting, and sandbox execution capabilities.

## Features

- 🤖 **AI-Powered Code Generation**: Uses Gemini 2.5 Flash API for intelligent code suggestions
- 💻 **Real-time Streaming**: Live streaming responses with Server-Sent Events (SSE)
- 🎨 **Syntax Highlighting**: Monaco Editor with support for multiple programming languages
- 🚀 **Code Execution**: e2b.dev sandbox integration for running code safely
- 📱 **Responsive Design**: Mobile-friendly interface with layout mode switching
- 🎯 **Multiple Themes**: Sleek dark, vibrant tech, clean light, and more
- 💾 **Session Memory**: Maintains conversation context across sessions
- 📋 **Copy & Download**: Easy code copying and file downloading

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** + **ShadCN UI** for styling
- **Zustand** for state management
- **React Query** for server state
- **Monaco Editor** for code editing
- **React Markdown** for message rendering

### Backend
- **FastAPI** with Python
- **Gemini 2.5 Flash API** for AI responses
- **e2b.dev SDK** for code execution
- **Server-Sent Events (SSE)** for streaming
- **Pydantic** for data validation

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Gemini API key (free from [Google AI Studio](https://aistudio.google.com/app/apikey))
- e2b.dev API key (optional, for code execution)

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:jokerinfini/AI-coding-agent.git
   cd AI-coding-agent
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

4. **Configure API Keys**
   - Open the app and go to Settings
   - Add your Gemini API key
   - Optionally add your e2b.dev API key for code execution

## Usage

1. **Start a conversation** by typing your coding question
2. **View generated code** in the right sidebar (desktop) or left sidebar (mobile)
3. **Switch between Code and Preview** tabs to see syntax highlighting or run code
4. **Copy or download** generated code files
5. **Change themes** using the theme selector in the header
6. **Switch layout modes** between desktop (sidebar right) and mobile (sidebar left)

## Architecture

### Frontend Structure
```
frontend/src/
├── components/          # React components
│   ├── ChatLayout.tsx   # Main layout
│   ├── ChatHeader.tsx   # Header with controls
│   ├── ChatMessages.tsx # Message display
│   ├── ChatInput.tsx    # Input form
│   ├── ArtifactSidebar.tsx # Code sidebar
│   └── ...
├── store/               # Zustand store
├── hooks/               # Custom React hooks
├── lib/                 # API client and utilities
└── types/               # TypeScript definitions
```

### Backend Structure
```
backend/app/
├── main.py              # FastAPI app
├── models/              # Pydantic models
├── services/            # Business logic
│   ├── gemini_service.py    # Gemini API integration
│   ├── sandbox_service.py   # e2b.dev integration
│   └── memory_service.py    # Conversation memory
└── api/                 # API endpoints
```

## API Endpoints

- `POST /api/chat/stream` - Stream chat responses
- `POST /api/sandbox/execute` - Execute code in sandbox
- `GET /api/health` - Health check

## Environment Variables

### Backend (.env)
```
GEMINI_API_KEY=your_gemini_api_key
E2B_API_KEY=your_e2b_api_key
```

### Frontend
API keys are stored in browser localStorage and sent via headers.

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy!

### Backend (Render/Railway)
1. Connect your GitHub repository
2. Set Python runtime
3. Add environment variables
4. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions, please open an issue on GitHub.