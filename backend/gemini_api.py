import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

def call_gemini_api(system_instruction, user_prompt):
    api_key = os.getenv("GEMINI_KEY")
    if not api_key:
        raise ValueError("API key not found in environment variables")

    client = genai.Client(api_key=api_key)

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        config=types.GenerateContentConfig(system_instruction=system_instruction),
        contents=user_prompt
    )
    return response.text

