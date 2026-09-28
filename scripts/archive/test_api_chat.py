import os
import sys
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

print("=== LIVE API TEST: POST /api/ai/chat ===")

# TURN 1
t1_payload = {
    "message": "Tell me about Humayun's Tomb",
    "conversation_history": [],
    "preferred_language": "en"
}
res1 = client.post("/api/ai/chat", json=t1_payload)
assert res1.status_code == 200, f"Error {res1.status_code}: {res1.text}"
d1 = res1.json()

print("\n--- TURN 1 ---")
print("REQUEST:", json.dumps(t1_payload, indent=2))
print("RESPONSE STATUS:", res1.status_code)
print("RESPONSE BODY:", json.dumps(d1, indent=2))

# TURN 2: Unseeded entity
t2_payload = {
    "message": "Tell me about the Atlantis Sun Citadel in Patna",
    "conversation_history": [
        {"role": "user", "content": t1_payload["message"]},
        {"role": "assistant", "content": d1["response"]}
    ],
    "preferred_language": "en"
}
res2 = client.post("/api/ai/chat", json=t2_payload)
assert res2.status_code == 200, f"Error {res2.status_code}: {res2.text}"
d2 = res2.json()

print("\n--- TURN 2 ---")
print("REQUEST:", json.dumps(t2_payload, indent=2))
print("RESPONSE STATUS:", res2.status_code)
print("RESPONSE BODY:", json.dumps(d2, indent=2))

# TURN 3: Follow-up referencing "it"
t3_payload = {
    "message": "What is its architectural style?",
    "conversation_history": [
        {"role": "user", "content": t1_payload["message"]},
        {"role": "assistant", "content": d1["response"]},
        {"role": "user", "content": t2_payload["message"]},
        {"role": "assistant", "content": d2["response"]}
    ],
    "preferred_language": "en"
}
res3 = client.post("/api/ai/chat", json=t3_payload)
assert res3.status_code == 200, f"Error {res3.status_code}: {res3.text}"
d3 = res3.json()

print("\n--- TURN 3 ---")
print("REQUEST:", json.dumps(t3_payload, indent=2))
print("RESPONSE STATUS:", res3.status_code)
print("RESPONSE BODY:", json.dumps(d3, indent=2))
