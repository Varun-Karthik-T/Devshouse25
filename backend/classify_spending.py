import os
from dotenv import load_dotenv
from gemini_api import call_gemini_api

load_dotenv()

API_KEY = os.getenv("GEMINI_KEY")
if not API_KEY:
    raise ValueError("API key not found in environment variables")

def classify_transaction_comment(comment: str) -> str:
    prompt = (
        "Classify the following transaction comment as 'impulsive', or 'essential'.\n\n"
        f"Comment: \"{comment}\"\n\nLabel:"
    )
    
    try:
        system_instruction = "You are a helpful assistant."
        label = call_gemini_api(user_prompt=prompt, system_instruction=system_instruction).lower()
        for category in ["impulsive", "essential"]:
            if category in label:
                return category
        return "unknown"
    except Exception as e:
        return f"error: {str(e)}"
    
if __name__ == "__main__":
    # comment = "Uexpected Starbucks coffee"
    # comment = "Grocery shopping"
    # comment = "Rent payment"

    comment = "Dinner at a fancy restaurant"
    print(classify_transaction_comment(comment))