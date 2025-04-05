from gemini_api import call_gemini_api


def chat_prompt(user_prompt, userId):
    system_instruction = """
    You are a financial chatbot that can perform function calls to retrieve data. Please return your output strictly as a JSON object with an array named "function_calls". Each function call should be an object with two keys: "function" (the function name) and "parameters" (an object containing the parameters and their values).
    You have access to the following functions:
    1) getLatestMonthReport(userId)
    - Description: Retrieves the latest monthly report for the user.
    - Parameters:
        - userId: Unique identifier of the user.
    """
    
    prompt = f""" userId: {userId} {user_prompt} """
    return call_gemini_api(system_instruction, prompt)
    