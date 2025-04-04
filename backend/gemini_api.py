import os
from google import genai

def call_gemini_api(contents):
    api_key = os.getenv("GEMINI_KEY")
    if not api_key:
        raise ValueError("API key not found in environment variables")

    client = genai.Client(api_key=api_key)

    response = client.models.generate_content(
        model="gemini-2.0-flash", contents=contents
    )
    return response.text

if __name__ == "__main__":
    result = call_gemini_api("Explain how AI works in a few words")
    print(result)
