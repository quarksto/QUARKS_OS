import os
from dotenv import load_dotenv

# Load env from parent or current dir
load_dotenv()

import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from google import genai
from google.genai import types
import base64
import uuid

# Initialize FastAPI
app = FastAPI(title="Quarks Visual Engine", version="1.0.0")

# Models for Request Bodies
class GenImageRequest(BaseModel):
    prompt: str
    aspect_ratio: str = "16:9"

class GenVideoRequest(BaseModel):
    prompt: str
    duration_seconds: int = 5

# Initialize Google GenAI Client
# NOTE: We expect GOOGLE_API_KEY to be in os.environ
client = None
try:
    if "GOOGLE_API_KEY" in os.environ:
        client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])
    else:
        print("WARNING: GOOGLE_API_KEY not found in env. Visual Engine will fail.")
except Exception as e:
    print(f"Failed to init GenAI client: {e}")

# Directory for outputs (shared with Frontend Public)
OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend/public/generated"))
os.makedirs(OUTPUT_DIR, exist_ok=True)

@app.get("/")
def health_check():
    return {"status": "online", "service": "visual-engine"}

# Mock Helpers
def generate_mock_image(prompt: str):
    print(f"[VisualEngine] Serving Mock Image for: {prompt}")
    # Simple red dot PNG
    mock_png_b64 = b"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
    filename = f"img-{uuid.uuid4()}.png"
    filepath = os.path.join(OUTPUT_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(base64.b64decode(mock_png_b64))
    return {
        "success": True,
        "url": f"/generated/{filename}",
        "prompt": prompt + " (MOCK)"
    }

def generate_mock_video(prompt: str):
    print(f"[VisualEngine] Serving Mock Video for: {prompt}")
    # Dummy content
    filename = f"vid-{uuid.uuid4()}.mp4"
    filepath = os.path.join(OUTPUT_DIR, filename)
    with open(filepath, "w") as f:
        f.write("mock_video_content")
    return {
        "success": True,
        "url": f"/generated/{filename}",
        "prompt": prompt + " (MOCK)"
    }

@app.post("/generate-image")
def generate_image(req: GenImageRequest):
    print(f"[VisualEngine] Generating Image: {req.prompt}")
    
    # Force Mock if Key missing
    if not client:
        return generate_mock_image(req.prompt)
    
    try:
        # call Imagen 3
        response = client.models.generate_images(
            model='imagen-3.0-generate-001',
            prompt=req.prompt,
            config=types.GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio=req.aspect_ratio
            )
        )
        
        if not response.generated_images:
             raise Exception("No images returned from API")

        # Save to disk
        image_bytes = response.generated_images[0].image.image_bytes
        filename = f"img-{uuid.uuid4()}.png"
        filepath = os.path.join(OUTPUT_DIR, filename)
        
        with open(filepath, "wb") as f:
            f.write(image_bytes)
            
        return {
            "success": True,
            "url": f"/generated/{filename}",
            "prompt": req.prompt
        }

    except Exception as e:
        print(f"Image Gen Error: {e}")
        # FALLBACK TO MOCK
        print("[VisualEngine] Switching to Mock Generation due to error.")
        return generate_mock_image(req.prompt)

@app.post("/generate-video")
def generate_video(req: GenVideoRequest):
    print(f"[VisualEngine] Generating Video: {req.prompt}")
    if not client:
        return generate_mock_video(req.prompt)

    try:
        # call Veo 2
        response = client.models.generate_videos(
            model='veo-2.0-generate-preview-001',
            prompt=req.prompt,
            config=types.GenerateVideosConfig(
                file_format="MP4"
            )
        )
        
        if not response.generated_videos:
             raise Exception("No videos returned from API")
             
        video_bytes = response.generated_videos[0].video.video_bytes
        filename = f"vid-{uuid.uuid4()}.mp4"
        filepath = os.path.join(OUTPUT_DIR, filename)

        with open(filepath, "wb") as f:
            f.write(video_bytes)

        return {
            "success": True,
            "url": f"/generated/{filename}",
            "prompt": req.prompt
        }

    except Exception as e:
        print(f"Video Gen Error: {e}")
        # FALLBACK TO MOCK
        print("[VisualEngine] Switching to Mock Generation due to error.")
        return generate_mock_video(req.prompt)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
