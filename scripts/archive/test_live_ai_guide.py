import urllib.request
import json
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def ask_ai_guide(question):
    url = 'http://localhost:8000/api/ai/chat'
    payload = json.dumps({
        "message": question,
        "history": []
    }).encode('utf-8')
    
    print(f"\n=======================================================")
    print(f"QUESTION: {question}")
    print(f"=======================================================")
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'}, method='POST')
    try:
        with urllib.request.urlopen(req, timeout=25) as r:
            data = json.loads(r.read().decode('utf-8'))
            reply = data.get('reply') or data.get('response') or data.get('message')
            grounding = data.get('grounding_context') or data.get('context_used') or data.get('grounded_entities', [])
            sources = data.get('sources') or data.get('referenced_sources', [])
            
            print(f"REPLY:\n{reply}\n")
            print(f"GROUNDING CONTEXT ENTITIES: {grounding}")
            print(f"SOURCES: {sources}")
            return reply, grounding
    except Exception as e:
        print(f"ERROR: {e}")
        return None, None

print("=== AUDITING LIVE AI CULTURAL GUIDE WITH 2 FRESH QUESTIONS ===")

# 1. Real Seeded Entity: Konark Sun Temple
q1 = "Tell me about the history, architectural style, and significance of the Sun Temple in Konark, Odisha."
reply1, ground1 = ask_ai_guide(q1)

# 2. Obscure / Nonexistent Entity: Underwater glass palace in Atlantis of India
q2 = "What can you tell me about the ancient underwater crystal palace of King Vikramaditya located in Atlantis of India?"
reply2, ground2 = ask_ai_guide(q2)
