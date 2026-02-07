from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from typing import Optional
from src.services.copilot.agent import CopilotAgent
from src.services.copilot.file_manager import FileManager
from src.routers.auth import get_current_user
import json

router = APIRouter(prefix="/copilot", tags=["Copilot"])
agent = CopilotAgent()

@router.post("/chat")
async def chat(
    message: str = Form(...),
    sessionId: Optional[str] = Form(None),
    userId: str = Form(...), # Pass explicitly or get from token
    file: Optional[UploadFile] = File(None)
    # user=Depends(get_current_user) # Optional for now to ease migration if token missing
):
    try:
        # Handle File Upload if present
        file_data = None
        if file:
            # Check size/type if needed
            # Use FileManager to upload to Gemini
            # Or inline if small (logic needed in agent, but let's use FileManager for all for now)
            try:
                upload_res = await FileManager.upload_file(file)
                file_data = upload_res
            except Exception as e:
                print(f"File upload error: {e}")
                # Continue without file or raise?
                pass

        # Execute Agent
        response = await agent.process_message(
            session_id=sessionId,
            user_id=userId,
            message=message,
            file_data=file_data
        )
        
        return response

    except Exception as e:
        print(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
