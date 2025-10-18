from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from dotenv import load_dotenv
import os
from app.api.chat import router as chat_router

# Load environment variables
load_dotenv()

app = FastAPI(
    title="AI Coding Agent API",
    description="Backend API for Claude-style AI Coding Agent",
    version="1.0.0"
)

# Configure CORS
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,https://*.vercel.app,https://*.railway.app").split(",")
print(f"CORS Origins: {cors_origins}")  # Debug log

# For development, allow all origins temporarily
if os.getenv("ENVIRONMENT") == "development":
    cors_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["content-type", "x-gemini-api-key", "x-e2b-api-key", "authorization"],
    expose_headers=["*"],
)

# Add manual CORS handler for preflight requests
@app.options("/api/chat/stream")
async def options_handler():
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "content-type, x-gemini-api-key, x-e2b-api-key",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Max-Age": "600",
        }
    )

@app.options("/api/sandbox/execute")
async def options_sandbox_handler():
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "content-type, x-gemini-api-key, x-e2b-api-key",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Max-Age": "600",
        }
    )

# Mount routers
app.include_router(chat_router)

@app.get("/")
async def root():
    return {"message": "AI Coding Agent API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
