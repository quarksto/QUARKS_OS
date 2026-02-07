import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

if "GOOGLE_API_KEY" in os.environ:
    client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])
    
    try:
        # Pager object
        print("Listing models...")
        for m in client.models.list():
            # Just print the name to be safe
            print(f"Model ID: {m.name}")
            # print(f"  Display: {m.display_name}")
    except Exception as e:
        print(f"Error: {e}")
else:
    print("No API Key")
