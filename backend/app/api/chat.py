from fastapi import APIRouter, HTTPException, Header
from fastapi.responses import StreamingResponse
from app.models.chat import ChatRequest, ChatResponse, SandboxRequest, SandboxResponse
from app.services.gemini_service import gemini_service
from app.services.memory_service import memory_service
from app.services.sandbox_service import sandbox_service
from datetime import datetime
from pydantic import BaseModel
import json
import uuid

router = APIRouter(prefix="/api/chat", tags=["chat"])


def to_jsonable(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    if isinstance(obj, BaseModel):
        try:
            dumped = obj.model_dump()
        except Exception:
            dumped = obj.dict()
        return to_jsonable(dumped)
    if isinstance(obj, list):
        return [to_jsonable(x) for x in obj]
    if isinstance(obj, dict):
        return {k: to_jsonable(v) for k, v in obj.items()}
    return obj


@router.post("/stream")
async def stream_chat(request: ChatRequest, x_gemini_api_key: str | None = Header(default=None)):
    """Stream chat responses using Server-Sent Events"""
    
    try:
        # Add user message to memory (best-effort)
        memory_service.add_message(
            request.session_id, 
            "user", 
            request.message
        )
        
        # Get conversation history
        conversation_history = memory_service.get_conversation_history(request.session_id)
        
        # Build messages for model
        messages = []
        for msg in conversation_history:
            messages.append({
                "role": msg.get("role"),
                "content": msg.get("content"),
            })
        # Fallback: ensure at least the current user message is sent
        if not messages:
            messages = [{"role": "user", "content": request.message}]
        
        async def generate_stream():
            try:
                async for chunk in gemini_service.generate_response_stream(messages, api_key=x_gemini_api_key):
                    chunk_data = {
                        "delta": chunk.delta,
                        "done": chunk.done,
                        "artifact_detected": chunk.artifact_detected,
                        "artifact_data": to_jsonable(chunk.artifact_data) if chunk.artifact_data else None,
                        "metadata": to_jsonable(chunk.metadata) if chunk.metadata else None,
                    }
                    yield f"data: {json.dumps(chunk_data)}\n\n"
                    if chunk.done:
                        if chunk.metadata and "full_response" in chunk.metadata:
                            memory_service.add_message(
                                request.session_id,
                                "assistant",
                                chunk.metadata["full_response"]
                            )
                        if chunk.metadata and "artifacts" in chunk.metadata:
                            for artifact in chunk.metadata["artifacts"]:
                                try:
                                    memory_service.add_artifact(
                                        request.session_id,
                                        to_jsonable(artifact)
                                    )
                                except Exception:
                                    pass
                        break
            except Exception as e:
                error_data = {"delta": f"Error: {str(e)}", "done": True, "error": str(e)}
                yield f"data: {json.dumps(error_data)}\n\n"
        
        return StreamingResponse(
            generate_stream(),
            media_type="text/plain",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/message", response_model=ChatResponse)
async def send_message(request: ChatRequest, x_gemini_api_key: str | None = Header(default=None)):
    """Send a message and get a non-streaming response"""
    
    try:
        memory_service.add_message(request.session_id, "user", request.message)
        conversation_history = memory_service.get_conversation_history(request.session_id)
        
        messages = []
        for msg in conversation_history:
            messages.append({
                "role": msg.get("role"),
                "content": msg.get("content"),
            })
        if not messages:
            messages = [{"role": "user", "content": request.message}]
        
        result = await gemini_service.generate_response(messages, api_key=x_gemini_api_key)
        memory_service.add_message(request.session_id, "assistant", result["content"])
        
        response = ChatResponse(
            content=result["content"],
            is_code_artifact=len(result["artifacts"]) > 0,
            artifacts=result["artifacts"],
            session_id=request.session_id,
            timestamp=datetime.now()
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sandbox/execute", response_model=SandboxResponse)
async def execute_code(request: SandboxRequest):
    try:
        result = await sandbox_service.execute_code(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "chat"}
