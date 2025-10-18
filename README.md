# AI Coding Agent

A Claude-style AI coding assistant with real-time code generation, syntax highlighting, and sandbox execution capabilities.

## 🚀 Live Demo

**Frontend**: [https://ai-coding-agent-three.vercel.app/](https://ai-coding-agent-three.vercel.app/)  
**Backend**: [https://ai-coding-agent-production.up.railway.app](https://ai-coding-agent-production.up.railway.app)

## ✨ Features

- 🤖 **AI-Powered Code Generation**: Uses Gemini 2.5 Flash API for intelligent code suggestions
- 💻 **Real-time Streaming**: Live streaming responses with Server-Sent Events (SSE)
- 🎨 **Syntax Highlighting**: Monaco Editor with support for multiple programming languages
- 🚀 **Code Execution**: e2b.dev sandbox integration for running code safely
- 📱 **Responsive Design**: Mobile-friendly interface with layout mode switching
- 🎯 **Multiple Themes**: Sleek dark, vibrant tech, clean light, and more
- 💾 **Session Memory**: Maintains conversation context across sessions
- 📋 **Copy & Download**: Easy code copying and file downloading
- 🔧 **Settings Management**: Secure API key storage in browser localStorage

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

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and npm
- **Python 3.8+**
- **Gemini API key** (free from [Google AI Studio](https://aistudio.google.com/app/apikey))
- **e2b.dev API key** (optional, for code execution)

### 🛠️ Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/jokerinfini/AI-coding-agent.git
   cd AI-coding-agent
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

3. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```
   Backend will be available at `http://localhost:8000`

4. **Configure API Keys**
   - Open the app and click the Settings button (gear icon)
   - Add your **Gemini API key** (required)
   - Optionally add your **e2b.dev API key** for code execution
   - Keys are stored securely in your browser's localStorage

## 📖 How to Use

1. **Start a conversation** by typing your coding question in the chat input
2. **View generated code** in the right sidebar (desktop) or left sidebar (mobile)
3. **Switch between Code and Preview** tabs to see syntax highlighting or run code
4. **Copy or download** generated code files using the buttons in the sidebar
5. **Change themes** using the theme selector in the header (6 themes available)
6. **Switch layout modes** between desktop (sidebar right) and mobile (sidebar left)
7. **Configure API keys** using the settings button (gear icon) in the header

### 🎯 Key Features
- **Real-time streaming**: Watch AI responses appear token by token
- **Code artifacts**: Generated code automatically appears in the sidebar
- **Sandbox execution**: Run HTML/CSS/JS and Python code safely
- **Multiple themes**: Choose from sleek dark, vibrant tech, clean light, and more
- **Responsive design**: Works perfectly on desktop and mobile devices

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

## 🚀 Deployment

### Frontend (Vercel)
1. **Connect GitHub**: Link your repository to Vercel
2. **Configure Build**:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
   - Framework: Vite
3. **Environment Variables**:
   - `VITE_API_BASE_URL`: `https://ai-coding-agent-production.up.railway.app`
4. **Deploy**: Click deploy and your frontend will be live!

### Backend (Railway)
1. **Connect GitHub**: Link your repository to Railway
2. **Configure Service**:
   - Root Directory: `backend`
   - Build Command: (auto-detected from Dockerfile)
   - Start Command: `python start.py`
3. **Environment Variables**:
   - `GEMINI_API_KEY`: Your Gemini API key
   - `E2B_API_KEY`: Your e2b.dev API key (optional)
   - `CORS_ORIGINS`: `https://*.vercel.app,https://*.railway.app`
4. **Deploy**: Railway will automatically deploy your backend!

### 🔧 Production URLs
- **Frontend**: `https://ai-coding-agent-three.vercel.app/`
- **Backend**: `https://ai-coding-agent-production.up.railway.app`
- **Health Check**: `https://ai-coding-agent-production.up.railway.app/health`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

## 🔧 Troubleshooting

### Common Issues

**CORS Errors**
- Ensure your backend CORS is configured to allow your frontend domain
- Check that `CORS_ORIGINS` includes your Vercel domain

**API Key Issues**
- Verify your Gemini API key is valid and has quota remaining
- Check that API keys are properly stored in browser localStorage
- Ensure e2b.dev API key is valid if using sandbox features

**Streaming Issues**
- Check browser console for SSE connection errors
- Verify backend is running and accessible
- Ensure CORS headers are properly set

**Build Issues**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check that all dependencies are installed correctly
- Verify TypeScript compilation: `npm run build`

### 🆘 Getting Help

- **GitHub Issues**: [Open an issue](https://github.com/jokerinfini/AI-coding-agent/issues)
- **Documentation**: Check this README for setup instructions
- **Live Demo**: Test the deployed version at [https://ai-coding-agent-three.vercel.app/](https://ai-coding-agent-three.vercel.app/)

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- **Google Gemini** for AI capabilities
- **e2b.dev** for secure code execution
- **Vercel** for frontend hosting
- **Railway** for backend hosting
- **ShadCN UI** for beautiful components