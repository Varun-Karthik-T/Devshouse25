from gemini_api import call_gemini_api
from services import get_latest_month_report
import json

async def chat_prompt(user_prompt, userId):
    system_instruction = """
    You are a financial chatbot that can perform function calls to retrieve data. Please return your output strictly as a JSON object with an array named "function_calls". Each function call should be an object with two keys: "function" (the function name) and "parameters" (an object containing the parameters and their values).
    You have access to the following functions:
    1) get_latest_month_report(user_id: str)
    - Description: Returns the latest report for the given user_id.
    """
    
    prompt = f""" userId: {userId} {user_prompt} """
    
    try:
        executing_functions = call_gemini_api(system_instruction, prompt)
        print("Raw executing_functions response:", executing_functions)
        
        stripped_response = executing_functions.strip("```json").strip("```").strip()
        print("Stripped response:", stripped_response) 
        
        response_content = json.loads(stripped_response)
        print("Parsed response content:", response_content)
        
        function_calls = response_content.get("function_calls", [])
        print("Parsed function calls:", function_calls) 
    except json.JSONDecodeError as e:
        raise ValueError(f"Error parsing function calls: {e}")
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

    No_function_system_instruction = """
        Now you have access to the user data in the prompt. use it to answer the user query
    """
    
    updated_prompt = f"{user_prompt}\n\nData Context:\n{data_context}"
    print("Updated prompt:", updated_prompt) 
    
    try:
        final_response = call_gemini_api(No_function_system_instruction, updated_prompt)
        print("Final response:", final_response) 
    except Exception as e:
        print(f"Error during final API call: {e}")
        return {"error": "Server disconnected without sending a response."}
    
    return final_response
