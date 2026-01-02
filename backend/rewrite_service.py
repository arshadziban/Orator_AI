import requests
import os
from dotenv import load_dotenv

load_dotenv()

PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")
if PERPLEXITY_API_KEY:
    PERPLEXITY_API_KEY = PERPLEXITY_API_KEY.strip()
URL = "https://api.perplexity.ai/chat/completions"

def generate_chatbot_response(user_message):
    """
    Generate an AI chatbot response to user input using Perplexity AI.
    
    Args:
        user_message: The user's transcribed or typed message
        
    Returns:
        The AI chatbot's response
    """
    if not PERPLEXITY_API_KEY:
        print("Warning: PERPLEXITY_API_KEY not found. Returning default response.")
        return "I'm sorry, but I'm not configured to respond right now. Please set up the PERPLEXITY_API_KEY."
    
    print(f"[ChatBot] Processing user message: {user_message}")
    
    payload = {
        "model": "sonar-pro",
        "messages": [
            {
                "role": "system",
                "content": "You are OratorAI, a helpful and engaging conversational chatbot. Provide thoughtful, concise responses to user messages."
            },
            {
                "role": "user",
                "content": user_message
            }
        ]
    }

    headers = {
        "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(URL, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        result = response.json()["choices"][0]["message"]["content"]
        print(f"[ChatBot] Response generated: {result[:100] if len(result) > 100 else result}")
        return result
    except Exception as e:
        print(f"Error calling Perplexity API: {str(e)}")
        return f"I encountered an error while processing your message: {str(e)}"


# Keep backward compatibility with old function name
def rewrite_formal(text):
    """
    Deprecated: Use generate_chatbot_response instead.
    This function is kept for backward compatibility.
    """
    return generate_chatbot_response(text)
