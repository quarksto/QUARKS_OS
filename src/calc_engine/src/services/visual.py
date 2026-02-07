import os
import uuid
import base64
from google import genai
from google.genai import types

# Initialize Google GenAI Client
client = None
if "GOOGLE_API_KEY" in os.environ:
    try:
        client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])
    except Exception as e:
        print(f"[VisualService] Failed to init client: {e}")

# Directory for outputs (shared with Frontend Public)
# Adjust path relative to src/calc_engine/src/services
OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../frontend/public/generated"))
os.makedirs(OUTPUT_DIR, exist_ok=True)

class VisualService:
    @staticmethod
    def _generate_mock_image(prompt: str):
        print(f"[VisualService] Serving Mock Image for: {prompt}")
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

    @staticmethod
    def _generate_mock_video(prompt: str):
        print(f"[VisualService] Serving Mock Video for: {prompt}")
        filename = f"vid-{uuid.uuid4()}.mp4"
        filepath = os.path.join(OUTPUT_DIR, filename)
        with open(filepath, "w") as f:
            f.write("mock_video_content")
        return {
            "success": True,
            "url": f"/generated/{filename}",
            "prompt": prompt + " (MOCK)"
        }

    @staticmethod
    async def generate_image(prompt: str, aspect_ratio: str = "16:9"):
        if not client:
            return VisualService._generate_mock_image(prompt)
            
        try:
            print(f"[VisualService] Generating Image: {prompt}")
            response = client.models.generate_images(
                model='imagen-3.0-generate-001',
                prompt=prompt,
                config=types.GenerateImagesConfig(
                    number_of_images=1,
                    aspect_ratio=aspect_ratio
                )
            )
            
            if not response.generated_images:
                 raise Exception("No images returned from API")
    
            image_bytes = response.generated_images[0].image.image_bytes
            filename = f"img-{uuid.uuid4()}.png"
            filepath = os.path.join(OUTPUT_DIR, filename)
            
            with open(filepath, "wb") as f:
                f.write(image_bytes)
                
            return {
                "success": True,
                "url": f"/generated/{filename}",
                "prompt": prompt
            }
        except Exception as e:
            print(f"[VisualService] Error: {e}")
            return VisualService._generate_mock_image(prompt)

    @staticmethod
    async def generate_video(prompt: str):
        if not client:
            return VisualService._generate_mock_video(prompt)

        try:
            print(f"[VisualService] Generating Video: {prompt}")
            response = client.models.generate_videos(
                model='veo-2.0-generate-preview-001',
                prompt=prompt,
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
                "prompt": prompt
            }
        except Exception as e:
            print(f"[VisualService] Error: {e}")
            return VisualService._generate_mock_video(prompt)
