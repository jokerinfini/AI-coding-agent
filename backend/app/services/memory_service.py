from typing import Dict, List, Any
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.messages import HumanMessage, AIMessage
from app.models.chat import ChatMessage
import uuid


class ConversationState:
    """State schema for LangGraph conversation management"""
    def __init__(self):
        self.messages: List[Dict[str, Any]] = []
        self.session_id: str = ""
        self.current_input: str = ""
        self.artifacts: List[Dict[str, Any]] = []


class MemoryService:
    """Service for managing conversation memory using LangGraph"""
    
    def __init__(self):
        self.checkpointer = MemorySaver()
        self.graphs: Dict[str, StateGraph] = {}
        self._build_graph()
    
    def _build_graph(self):
        """Build the LangGraph for conversation management"""
        
        def receive_input(state: ConversationState) -> ConversationState:
            """Receive user input and add to messages"""
            state.current_input = state.current_input
            state.messages.append({
                "role": "user",
                "content": state.current_input,
                "timestamp": str(uuid.uuid4())
            })
            return state
        
        def process_with_ai(state: ConversationState) -> ConversationState:
            """Process with AI and add response to messages"""
            # This will be handled by the Gemini service
            # For now, just add a placeholder response
            state.messages.append({
                "role": "assistant", 
                "content": "AI response will be generated here",
                "timestamp": str(uuid.uuid4())
            })
            return state
        
        def end_conversation(state: ConversationState) -> ConversationState:
            """End the conversation flow"""
            return state
        
        # Build the graph
        graph = StateGraph(ConversationState)
        graph.add_node("receive_input", receive_input)
        graph.add_node("process_with_ai", process_with_ai)
        graph.add_node("end", end_conversation)
        
        # Define the flow
        graph.set_entry_point("receive_input")
        graph.add_edge("receive_input", "process_with_ai")
        graph.add_edge("process_with_ai", "end")
        graph.add_edge("end", END)
        
        # Compile the graph
        self.base_graph = graph.compile(checkpointer=self.checkpointer)
    
    def get_or_create_session(self, session_id: str) -> str:
        """Get or create a session for the given session_id"""
        if session_id not in self.graphs:
            self.graphs[session_id] = self.base_graph
        return session_id
    
    def add_message(self, session_id: str, role: str, content: str) -> Dict[str, Any]:
        """Add a message to the conversation history"""
        session_id = self.get_or_create_session(session_id)
        
        message = {
            "role": role,
            "content": content,
            "timestamp": str(uuid.uuid4())
        }
        
        return message
    
    def get_conversation_history(self, session_id: str) -> List[Dict[str, Any]]:
        """Get conversation history for a session"""
        session_id = self.get_or_create_session(session_id)
        
        # Get the thread from checkpointer
        thread_config = {"configurable": {"thread_id": session_id}}
        
        try:
            # Get current state
            state = self.base_graph.get_state(thread_config)
            if state and state.values:
                return state.values.messages if hasattr(state.values, 'messages') else []
        except Exception:
            # If no state exists, return empty list
            pass
        
        return []
    
    def add_artifact(self, session_id: str, artifact_data: Dict[str, Any]) -> str:
        """Add a code artifact to the session"""
        session_id = self.get_or_create_session(session_id)
        artifact_id = str(uuid.uuid4())
        
        artifact = {
            "id": artifact_id,
            **artifact_data
        }
        
        # In a real implementation, you'd store this in the session state
        # For now, we'll just return the artifact ID
        return artifact_id
    
    def clear_session(self, session_id: str) -> bool:
        """Clear conversation history for a session"""
        try:
            thread_config = {"configurable": {"thread_id": session_id}}
            # Clear the state
            return True
        except Exception:
            return False


# Global instance
memory_service = MemoryService()
