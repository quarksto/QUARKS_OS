import os
from google import genai
from fastapi import UploadFile
import tempfile
import time

# Configure API (New Client)
client = None
if "GOOGLE_API_KEY" in os.environ:
    client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])

class FileManager:
    @staticmethod
    async def upload_file(file: UploadFile, display_name: str = None):
        """
        Uploads a file to Gemini File API using the new SDK.
        """
        if not client:
            raise Exception("GOOGLE_API_KEY not set")

        try:
            # Create temp file because SDK expects a path (usually)
            suffix = os.path.splitext(file.filename)[1]
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                content = await file.read()
                tmp.write(content)
                tmp_path = tmp.name

            try:
                print(f"[FileManager] Uploading {file.filename} ({len(content)} bytes)...")
                
                # New SDK Upload
                uploaded_file = client.files.upload(
                    path=tmp_path,
                    config={"display_name": display_name or file.filename, "mime_type": file.content_type}
                )
                
                print(f"[FileManager] Uploaded: {uploaded_file.uri}")
                
                # Check state for video/audio processing
                FileManager._wait_for_active(uploaded_file.name)
                
                return {
                    "fileUri": uploaded_file.uri,
                    "mimeType": uploaded_file.mime_type,
                    "name": uploaded_file.name
                }
            finally:
                # Cleanup temp
                if os.path.exists(tmp_path):
                    os.unlink(tmp_path)

        except Exception as e:
            print(f"[FileManager] Error: {e}")
            raise e

    @staticmethod
    def _wait_for_active(file_name):
        """Waits for file to be active (processed)"""
        print(f"[FileManager] Waiting for processing: {file_name}")
        max_retries = 30
        for _ in range(max_retries):
            # client.files.get(name=...)
            updated_file = client.files.get(name=file_name)
            if updated_file.state == "ACTIVE":
                print(f"[FileManager] File is ACTIVE: {file_name}")
                return
            elif updated_file.state == "FAILED":
                raise Exception("File processing failed")
            time.sleep(2)
        print("[FileManager] Warning: Timed out waiting for processing")
