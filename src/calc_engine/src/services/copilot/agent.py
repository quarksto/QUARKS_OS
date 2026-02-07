import os
from google import genai
from google.genai import types
from src.services.copilot.tools import TOOLS, execute_tool
from src.prisma import prisma
import json

client = None
if "GOOGLE_API_KEY" in os.environ:
    client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])

from prisma.enums import Role
from prisma import Json

class CopilotAgent:
    def __init__(self):
        # We handle tools via the generate_content call or config
        pass

    async def _get_history(self, session_id):
        # Fetch from Prisma
        session = await prisma.agentsession.find_unique(
            where={"id": session_id},
            include={"messages": {"order_by": {"createdAt": "asc"}}}
        )
        if not session:
            return []
            
        history = []
        for msg in session.messages:
            # Map roles: USER -> user, ASSISTANT -> model
            role = "user" if msg.role == "USER" else "model"
            history.append(types.Content(
                role=role,
                parts=[types.Part.from_text(text=msg.content)]
            ))
        return history

    async def _save_message(self, session_id, role, content):
        await prisma.agentmessage.create(
            data={
                "sessionId": session_id,
                "role": role,
                "content": content
            }
        )

    async def process_message(self, session_id, user_id, message, file_data=None):
        if not client:
             return {"sessionId": session_id, "text": "Error: API Key missing"}

        # 1. Get/Create Session
        if not session_id:
            user_exists = await prisma.user.find_unique(where={"id": user_id})
            if not user_exists:
                 await prisma.user.upsert(
                    where={"id": user_id},
                    data={
                        "create": {
                            "id": user_id, 
                            "email": f"guest-{user_id}@quarks.os", 
                            "name": "Guest", 
                            "password": "x", 
                            "role": Role.INTEGRADOR
                        }, 
                        "update": {}
                    }
                 )
            
            # Context issue: passing empty dict. 
            # If Json type, prisma-python handles dict. 
            # But let's verify if JsonNull is needed. Usually empty dict is fine.
            session = await prisma.agentsession.create(
                data={"userId": user_id, "context": Json({})} # context expects JSON
            )
            session_id = session.id
        
        # 2. Get History
        history_contents = await self._get_history(session_id)
        
        # 3. Create Chat Session
        chat = client.chats.create(
            model='gemini-2.0-flash',
            history=history_contents,
            config=types.GenerateContentConfig(
                 tools=TOOLS # Using dict based tools list, hope SDK supports or we might need to verify format
            )
        )
        
        # 4. Prepare Message Content
        # New SDK uses Content/Part types
        parts = []
        if file_data and "fileUri" in file_data:
             parts.append(types.Part.from_uri(
                 file_uri=file_data["fileUri"],
                 mime_type=file_data["mimeType"]
             ))
        
        parts.append(types.Part.from_text(text=message))
        
        # Save User Message
        await self._save_message(session_id, "USER", message + (f" [Attached: {file_data['name']}]" if file_data else ""))

        try:
            # 5. Send Message
            response = chat.send_message(message=parts)
            
            # 6. Handle Response (Text + Tools)
            # The SDK handles tool usage if configured, but depending on mode (automatic_function_calling)
            # If default, it might return function calls.
            # For this simple migration, let's assume text response or simple tool use.
            # We need to execute tool if present.
            
            text_response = response.text or ""
            
            # Check for function calls
            # New SDK usually auto-executes if configured?? Or returns parts.
            # Let's check parts.
            
            if response.candidates and response.candidates[0].content.parts:
                for part in response.candidates[0].content.parts:
                    if part.function_call:
                        # Manual Execution Logic (Since we didn't enable auto-execution yet or prefer control)
                         fc = part.function_call
                         tool_name = fc.name
                         tool_args = fc.args
                         
                         tool_result = await execute_tool(tool_name, tool_args)
                         
                         # Send result back
                         # This implies a turn loop. For POC, we just return the result string as the answer.
                         # Or we should correct continue the conversation.
                         
                         text_response = f"[Executed {tool_name}]: {json.dumps(tool_result)}"
                         
                         # Ideally, we verify this with a second call to Gemini with the tool output.
                         # But let's leave it simple for now: "Here is your proposal preview..."
            
            await self._save_message(session_id, "ASSISTANT", text_response)
            
            return {
                "sessionId": session_id,
                "content": text_response
            }

        except Exception as e:
            print(f"Agent Error: {e}")
            return {"sessionId": session_id, "text": f"Error: {str(e)}"}
