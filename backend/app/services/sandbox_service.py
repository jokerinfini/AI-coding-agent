import os
import asyncio
import aiohttp
from typing import Dict, Any, Optional
from app.models.chat import SandboxRequest, SandboxResponse


class SandboxService:
    """Service for integrating with e2b.dev sandbox for code execution"""
    
    def __init__(self):
        self.api_key = os.getenv("E2B_API_KEY")
        self.base_url = "https://api.e2b.dev"
        
        if not self.api_key:
            print("Warning: E2B_API_KEY not found. Sandbox features will be disabled.")
    
    async def execute_code(self, request: SandboxRequest) -> SandboxResponse:
        """Execute code in e2b.dev sandbox"""
        
        if not self.api_key:
            return SandboxResponse(
                output="Sandbox service not available. Please configure E2B_API_KEY.",
                error="E2B_API_KEY not configured",
                success=False
            )
        
        try:
            # Map language to e2b template
            template = self._get_template_for_language(request.language)
            
            if not template:
                return SandboxResponse(
                    output="",
                    error=f"Unsupported language: {request.language}",
                    success=False
                )
            
            # Execute code
            result = await self._run_in_sandbox(request.code, template)
            
            return SandboxResponse(
                output=result.get("output", ""),
                error=result.get("error"),
                execution_time=result.get("execution_time"),
                success=result.get("success", False)
            )
            
        except Exception as e:
            return SandboxResponse(
                output="",
                error=f"Sandbox execution failed: {str(e)}",
                success=False
            )
    
    def _get_template_for_language(self, language: str) -> Optional[str]:
        """Get e2b template for the given language"""
        template_map = {
            "python": "python",
            "javascript": "nodejs",
            "js": "nodejs",
            "typescript": "nodejs",
            "ts": "nodejs",
            "html": "static",
            "css": "static",
            "react": "nodejs",
            "vue": "nodejs"
        }
        
        return template_map.get(language.lower())
    
    async def _run_in_sandbox(self, code: str, template: str) -> Dict[str, Any]:
        """Run code in e2b sandbox"""
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # For HTML/CSS/JS, we need to create a complete HTML file
        if template == "static":
            html_content = self._create_html_file(code)
            payload = {
                "template": template,
                "files": [
                    {
                        "path": "index.html",
                        "content": html_content
                    }
                ]
            }
        else:
            # For other languages, create appropriate files
            file_path = self._get_file_path_for_language(template)
            payload = {
                "template": template,
                "files": [
                    {
                        "path": file_path,
                        "content": code
                    }
                ]
            }
        
        async with aiohttp.ClientSession() as session:
            try:
                # Create sandbox
                async with session.post(
                    f"{self.base_url}/sandboxes",
                    headers=headers,
                    json=payload
                ) as response:
                    if response.status != 200:
                        return {
                            "output": "",
                            "error": f"Failed to create sandbox: {await response.text()}",
                            "success": False
                        }
                    
                    sandbox_data = await response.json()
                    sandbox_id = sandbox_data["id"]
                
                # Wait a bit for sandbox to be ready
                await asyncio.sleep(2)
                
                # Get sandbox output
                async with session.get(
                    f"{self.base_url}/sandboxes/{sandbox_id}/stdout",
                    headers=headers
                ) as response:
                    if response.status == 200:
                        output_data = await response.json()
                        output = output_data.get("stdout", "")
                    else:
                        output = "No output available"
                
                # Get any errors
                async with session.get(
                    f"{self.base_url}/sandboxes/{sandbox_id}/stderr",
                    headers=headers
                ) as response:
                    if response.status == 200:
                        error_data = await response.json()
                        error = error_data.get("stderr", "")
                    else:
                        error = None
                
                # For static content, get the preview URL
                if template == "static":
                    preview_url = f"https://{sandbox_id}.e2b.dev"
                    output = f"Preview available at: {preview_url}\n\n{output}"
                
                # Terminate sandbox
                await session.delete(
                    f"{self.base_url}/sandboxes/{sandbox_id}",
                    headers=headers
                )
                
                return {
                    "output": output,
                    "error": error,
                    "success": True,
                    "preview_url": preview_url if template == "static" else None
                }
                
            except Exception as e:
                return {
                    "output": "",
                    "error": f"Sandbox execution error: {str(e)}",
                    "success": False
                }
    
    def _create_html_file(self, code: str) -> str:
        """Create a complete HTML file from code"""
        # If the code already contains HTML structure, use it as is
        if "<html>" in code.lower() or "<!doctype" in code.lower():
            return code
        
        # Otherwise, wrap in basic HTML structure
        html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Preview</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }}
        .container {{
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
    </style>
</head>
<body>
    <div class="container">
        {code}
    </div>
</body>
</html>"""
        
        return html_template
    
    def _get_file_path_for_language(self, template: str) -> str:
        """Get appropriate file path for the language"""
        path_map = {
            "python": "main.py",
            "nodejs": "index.js",
            "static": "index.html"
        }
        
        return path_map.get(template, "main.py")


# Global instance
sandbox_service = SandboxService()

