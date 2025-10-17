from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime


class ChatMessage(BaseModel):
    """Individual chat message model"""
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime = datetime.now()


class ChatRequest(BaseModel):
    """Request model for chat endpoint"""
    message: str
    session_id: str
    conversation_history: Optional[List[ChatMessage]] = []


class CodeArtifact(BaseModel):
    """Code artifact extracted from AI response"""
    id: str
    language: str
    title: str
    code: str
    created_at: datetime = datetime.now()


class ChatResponse(BaseModel):
    """Response model for chat endpoint"""
    content: str
    is_code_artifact: bool = False
    language: Optional[str] = None
    artifact_id: Optional[str] = None
    artifacts: Optional[List[CodeArtifact]] = []
    session_id: str
    timestamp: datetime = datetime.now()


class StreamChunk(BaseModel):
    """Model for streaming response chunks"""
    delta: str
    done: bool = False
    metadata: Optional[Dict[str, Any]] = None
    artifact_detected: bool = False
    artifact_data: Optional[CodeArtifact] = None


class SandboxRequest(BaseModel):
    """Request model for sandbox execution"""
    code: str
    language: str
    session_id: str


class SandboxResponse(BaseModel):
    """Response model for sandbox execution"""
    output: str
    error: Optional[str] = None
    execution_time: Optional[float] = None
    success: bool = True
