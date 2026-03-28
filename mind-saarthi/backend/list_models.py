import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
key = os.getenv('OPENROUTER_API_KEY').strip()
client = OpenAI(api_key=key)

try:
    models = client.models.list()
    for m in models:
        print(f"Model ID: {m.name}")
except Exception as e:
    print("FAILED TO LIST MODELS:", e)
