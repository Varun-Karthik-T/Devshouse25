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

if __name__ == "__main__":
    system_instruction = """
    You are a financial chatbot that can perform function calls to retrieve data. Please return your output strictly as a JSON object with an array named "function_calls". Each function call should be an object with two keys: "function" (the function name) and "parameters" (an object containing the parameters and their values).
    You have access to the following functions:

    1. getTransactionSummary(userId, category, startDate, endDate)
       - Description: Retrieves a summary of transactions (e.g., total spend) for a given category and time range.
       - Parameters:
         - userId: Unique identifier of the user.
         - category: The spending category (e.g., "dining", "entertainment").
         - startDate: The start date for the summary period (YYYY-MM-DD).
         - endDate: The end date for the summary period (YYYY-MM-DD).

    2. getGoalStatus(userId, goalId)
       - Description: Provides the current progress for a specific financial goal.
       - Parameters:
         - userId: Unique identifier of the user.
         - goalId: Unique identifier for the goal (e.g., "vacation").

    3. getWeeklyReport(userId, weekStart, weekEnd)
       - Description: Retrieves a comprehensive weekly report including overall spending, savings, and investment performance.
       - Parameters:
         - userId: Unique identifier of the user.
         - weekStart: Start date of the week (YYYY-MM-DD).
         - weekEnd: End date of the week (YYYY-MM-DD).

    """

    user_prompt = """
    "How much did I spend on dining this week, and how did that impact my progress towards my vacation goal?"

    Based on the above query, decide which function(s) to call, and return your output as a JSON object in the following format:

    {
      "function_calls": [
        {
          "function": "<function_name>",
          "parameters": {
             // parameter names and values
          }
        },
        ...
      ]
    }

    Only include the necessary function calls with their appropriate parameters. Do not include any additional text.
    """

    result = call_gemini_api(system_instruction, user_prompt)
    print(result)