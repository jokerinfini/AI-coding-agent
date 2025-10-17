# Environment Setup Guide

## Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# e2b.dev API Configuration  
E2B_API_KEY=your_e2b_api_key_here

# Server Configuration
PORT=8000
HOST=0.0.0.0
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

## Frontend Environment Variables

Create a `.env` file in the `frontend/` directory with the following variables:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:8000
```

## API Key Setup

### Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key and replace `your_gemini_api_key_here` in your `.env` file

### e2b.dev API Key (Optional)
1. Visit [e2b.dev](https://e2b.dev)
2. Sign up and get your API key
3. Copy the key and replace `your_e2b_api_key_here` in your `.env` file

Note: The e2b.dev API key is optional. If not provided, the sandbox preview feature will show an error message instead of executing code.
