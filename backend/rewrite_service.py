import requests
import os
from dotenv import load_dotenv

load_dotenv()

PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")
if PERPLEXITY_API_KEY:
    PERPLEXITY_API_KEY = PERPLEXITY_API_KEY.strip()
URL = "https://api.perplexity.ai/chat/completions"

def rewrite_formal(text):
    if not PERPLEXITY_API_KEY:
        print("Warning: PERPLEXITY_API_KEY not found. Returning original text.")
        return text
    
    print(f"[Rewrite] Input text: {text}")
    
    payload = {
        "model": "sonar-pro",
        "messages": [
            {
                "role": "system",
                "content": "Your name is OratorAI."
            },
            {
                "role": "user",
                "content": text
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
        print(f"[Rewrite] Output text: {result}")
        return result
    except Exception as e:
        print(f"Error calling Perplexity API: {str(e)}")
        # Return original text if API fails
        return text
