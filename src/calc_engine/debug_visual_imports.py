try:
    print("Importing os...")
    import os
    print("Importing dotenv...")
    from dotenv import load_dotenv
    print("Importing fastapi...")
    from fastapi import FastAPI
    print("Importing google.genai...")
    from google import genai
    print("Importing pydantic...")
    from pydantic import BaseModel
    print("✅ All imports successful")
except Exception as e:
    print(f"❌ Import failed: {e}")
