import google.generativeai as genai
import os
import re
import uuid
from typing import AsyncGenerator, Dict, Any, List, Optional
from app.models.chat import ChatMessage, CodeArtifact, StreamChunk


class GeminiService:
    """Service for integrating with Gemini 2.5 Flash API"""
    
    def __init__(self):
        self.model_name = "gemini-2.5-flash"
        self.generation_config = {
            "temperature": 0.2,
            "top_p": 0.8,
            "top_k": 40,
            "max_output_tokens": 4096,
        }
        
        # Aggressive system prompt with LANGUAGE REQUIREMENT and bullet-only explanation
        self.system_prompt = (
            "You are a helpful and precise AI coding assistant. Your primary goal is to fulfill the user's exact coding task.\n"
            "Follow these instructions strictly:\n\n"
            "## LANGUAGE REQUIREMENT (HIGHEST PRIORITY)\n"
            "- You MUST generate code in the exact programming language specified in the user's prompt.\n"
            "- If the user asks for 'JavaScript', you MUST provide JavaScript. If they ask for 'Java', you MUST provide Java.\n"
            "- **DO NOT default to another language. This is a strict, non-negotiable rule.**\n\n"
            "## CHAT EXPLANATION FORMAT (NO CODE HERE)\n"
            "- Provide a concise, bulleted explanation (max 4 bullets) describing the approach.\n"
            "- Include two bullets explicitly labeled: 'Time Complexity: O(...)' and 'Space Complexity: O(...)'.\n"
            "- **Do not include any code or fenced code blocks in this natural-language explanation.**\n\n"
            "## CODE OUTPUT (SEPARATE)\n"
            "- Include all code within a single fenced code block with the correct language, e.g., ```javascript ... ```.\n"
            "- Also wrap the exact same code inside an <artifact> tag: <artifact type=\"code\" language=\"LANG\" title=\"TITLE\">...</artifact>.\n"
            "- Keep outputs runnable and on-topic."
        )

    def _get_model(self, api_key: Optional[str], extra_instruction: Optional[str] = None):
        key = api_key or os.getenv("GEMINI_API_KEY")
        if not key:
            raise ValueError("Gemini API key not provided. Supply x-gemini-api-key header or set GEMINI_API_KEY env var.")
        genai.configure(api_key=key)
        system_instruction = self.system_prompt + (extra_instruction or "")
        return genai.GenerativeModel(
            model_name=self.model_name,
            generation_config=self.generation_config,
            system_instruction=system_instruction,
        )

    @staticmethod
    def _detect_language_from_latest(messages: List[Dict[str, Any]]) -> Optional[str]:
        for msg in reversed(messages):
            if msg.get("role") == "user":
                text = (msg.get("content") or "").lower()
                synonyms = {
                    "js": "javascript",
                    "node": "javascript",
                    "node.js": "javascript",
                    "nodejs": "javascript",
                    "ts": "typescript",
                }
                for syn, canon in synonyms.items():
                    if syn in text:
                        return canon
                for lang in ["javascript", "typescript", "java", "python", "c#", "c++", "go", "rust", "php", "ruby", "kotlin", "swift"]:
                    if lang in text:
                        return "csharp" if lang == "c#" else ("cpp" if lang == "c++" else lang)
                return None
        return None

    def _build_guardrail(self, messages: List[Dict[str, Any]]) -> str:
        target_lang = self._detect_language_from_latest(messages)
        if target_lang:
            return (
                f"\n\nInstruction: The target language is '{target_lang}'. "
                f"Answer only in {target_lang} with one fenced code block labeled {target_lang}."
            )
        return ""

    def _format_history(self, messages: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        formatted: List[Dict[str, Any]] = []
        for msg in messages:
            role = "user" if msg.get("role") == "user" else "model"
            content = msg.get("content", "")
            formatted.append({"role": role, "parts": [{"text": content}]})
        return formatted

    async def generate_response_stream(
        self, 
        messages: List[Dict[str, Any]],
        api_key: Optional[str] = None,
    ) -> AsyncGenerator[StreamChunk, None]:
        try:
            guardrail = self._build_guardrail(messages)
            model = self._get_model(api_key, extra_instruction=guardrail)
            contents = self._format_history(messages)
            response = model.generate_content(contents, stream=True)
            
            full_response = ""
            artifacts: List[CodeArtifact] = []
            artifact_buffer = ""
            in_artifact = False
            
            for chunk in response:
                if chunk.text:
                    full_response += chunk.text
                    artifact_buffer += chunk.text
                    if "<artifact" in artifact_buffer and not in_artifact:
                        start_match = re.search(r'<artifact[^>]*>', artifact_buffer)
                        if start_match:
                            in_artifact = True
                            artifact_start = artifact_buffer.find(start_match.group())
                            artifact_buffer = artifact_buffer[artifact_start:]
                    if in_artifact and "</artifact>" in artifact_buffer:
                        end_pos = artifact_buffer.find("</artifact>") + len("</artifact>")
                        artifact_xml = artifact_buffer[:end_pos]
                        artifact_buffer = artifact_buffer[end_pos:]
                        artifact_data = self._parse_artifact(artifact_xml)
                        if artifact_data:
                            artifacts.append(artifact_data)
                            yield StreamChunk(delta="", done=False, artifact_detected=True, artifact_data=artifact_data)
                        in_artifact = False
                    yield StreamChunk(delta=chunk.text, done=False, artifact_detected=False)
            yield StreamChunk(delta="", done=True, metadata={"full_response": full_response, "artifacts": artifacts})
        except Exception as e:
            yield StreamChunk(delta=f"Error: {str(e)}", done=True, metadata={"error": str(e)})

    def _parse_artifact(self, artifact_xml: str) -> Optional[CodeArtifact]:
        try:
            attr_match = re.search(r'<artifact[^>]*type=\"([^\"]*)\"[^>]*language=\"([^\"]*)\"[^>]*title=\"([^\"]*)\"[^>]*>', artifact_xml)
            if not attr_match:
                return None
            language = attr_match.group(2)
            title = attr_match.group(3)
            content_match = re.search(r'<artifact[^>]*>(.*?)</artifact>', artifact_xml, re.DOTALL)
            if not content_match:
                return None
            code_content = content_match.group(1).strip()
            return CodeArtifact(id=str(uuid.uuid4()), language=language, title=title, code=code_content)
        except Exception:
            return None

    async def generate_response(self, messages: List[Dict[str, Any]], api_key: Optional[str] = None) -> Dict[str, Any]:
        try:
            guardrail = self._build_guardrail(messages)
            model = self._get_model(api_key, extra_instruction=guardrail)
            contents = self._format_history(messages)
            response = model.generate_content(contents)
            artifacts = self._extract_artifacts(response.text)
            return {"content": response.text, "artifacts": artifacts, "success": True}
        except Exception as e:
            return {"content": f"Error: {str(e)}", "artifacts": [], "success": False, "error": str(e)}

    def _extract_artifacts(self, content: str) -> List[CodeArtifact]:
        artifacts: List[CodeArtifact] = []
        artifact_pattern = r'<artifact[^>]*type=\"([^\"]*)\"[^>]*language=\"([^\"]*)\"[^>]*title=\"([^\"]*)\"[^>]*>(.*?)</artifact>'
        matches = re.findall(artifact_pattern, content, re.DOTALL)
        for match in matches:
            artifact_type, language, title, code_content = match
            if artifact_type == "code":
                artifacts.append(CodeArtifact(id=str(uuid.uuid4()), language=language, title=title, code=code_content.strip()))
        return artifacts


# Global instance
gemini_service = GeminiService()
