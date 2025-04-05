from gemini_api import call_gemini_api
from services import get_latest_month_report, get_report_by_month_and_year
import json

chat_history = {}

async def chat_prompt(user_prompt, userId):
    global chat_history
    system_instruction = """
    You are a financial chatbot that will help users with anything related to finances and manage money. You can also perform function calls to retrieve user data if required. If you want to use user data, Please return your output strictly as a JSON object. 
    If the user query requires function calls, include a key "need_calls" set to true and an array named "function_calls". Each function call should be an object with two keys: "function" (the function name) and "parameters" (an object containing the parameters and their values).
    If the user query does not require function calls, include a key "need_calls" set to false and a key "response" containing the direct answer to the user query.
    You have access to the following functions, use them only if they are necessary to answer the prompt:
    1) get_latest_month_report(user_id: str)
    - Description: Returns the latest report for the given user_id.
    2) get_report_by_month_and_year(user_id: str, year: int, month: int)
    - Description: Fetches a specific report for the given user_id, year, and month.
    """
    
    if userId not in chat_history:
        chat_history[userId] = []
    
    history_context = "\n".join(chat_history[userId])
    prompt = f""" userId: {userId}\n{history_context}\nUser: {user_prompt} """
    
    try:
        executing_functions = call_gemini_api(system_instruction, prompt)
        print("Raw executing_functions response:", executing_functions)
        
        stripped_response = executing_functions.strip().lstrip("```json").rstrip("```").strip()
        print("Stripped response:", stripped_response) 
        
        response_content = json.loads(stripped_response)
        print("Parsed response content:", response_content)
        
        need_calls = response_content.get("need_calls", False)
        if not need_calls:
            response = response_content.get("response", "No response provided.")
            chat_history[userId].append(f"User: {user_prompt}")
            chat_history[userId].append(f"Bot: {response}")
            return response
        
        function_calls = response_content.get("function_calls", [])
        print("Parsed function calls:", function_calls) 
    except json.JSONDecodeError as e:
        raise ValueError(f"Error parsing response: {e}")
    except Exception as e:
        print(f"Error during API call or response parsing: {e}")
        return {"error": "Server disconnected without sending a response."}
    
    data_context = ""

    for function_call in function_calls:
        function_name = function_call["function"]
        parameters = function_call["parameters"]

        if function_name == "get_latest_month_report":
            user_id = parameters.get("user_id")
            if user_id:
                result = await get_latest_month_report(user_id)
                print(f"Result for {function_name}:", result) 
                data_context += f"{function_name}: {json.dumps(result)}\n"
        elif function_name == "get_report_by_month_and_year":
            user_id = parameters.get("user_id")
            year = parameters.get("year")
            month = parameters.get("month")
            if user_id and year and month:
                result = await get_report_by_month_and_year(user_id, year, month)
                print(f"Result for {function_name}:", result)
                data_context += f"{function_name}: {json.dumps(result)}\n"

    No_function_system_instruction = """
        Now you have access to the user data in the prompt. Use it to answer the user query.
    """
    
    updated_prompt = f"{user_prompt}\n\nData Context:\n{data_context}"
    print("Updated prompt:", updated_prompt) 
    
    try:
        final_response = call_gemini_api(No_function_system_instruction, updated_prompt)
        print("Final response:", final_response) 
        chat_history[userId].append(f"User: {user_prompt}")
        chat_history[userId].append(f"Bot: {final_response}")
    except Exception as e:
        print(f"Error during final API call: {e}")
        return {"error": "Server disconnected without sending a response."}
    
    return final_response
