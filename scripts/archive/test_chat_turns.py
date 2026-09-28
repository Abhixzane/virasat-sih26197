import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app.services.ai.chat_service import AIChatService
from app.models.schemas import AIChatRequest, ChatMessage

s = AIChatService()

# Turn 1: Entity in database
req1 = AIChatRequest(message="Tell me about Humayun's Tomb")
res1 = s.process_chat(req1)
print("=== TURN 1 ===")
print("Query:", req1.message)
print("Grounded:", res1.grounded_in_database)
print("Sources:", res1.source_references)
print("Response:\n", res1.response[:200])

# Turn 2: Unseeded / not in database
req2 = AIChatRequest(message="Tell me about the Atlantis Sun Citadel in Patna")
res2 = s.process_chat(req2)
print("\n=== TURN 2 (Unseeded) ===")
print("Query:", req2.message)
print("Grounded:", res2.grounded_in_database)
print("Response:\n", res2.response)

# Turn 3: Follow-up referencing "it"
history = [
    ChatMessage(role="user", content=req1.message),
    ChatMessage(role="assistant", content=res1.response)
]
req3 = AIChatRequest(message="What is its architectural style?", conversation_history=history)
res3 = s.process_chat(req3)
print("\n=== TURN 3 (Follow-up with 'it') ===")
print("Query:", req3.message)
print("Grounded:", res3.grounded_in_database)
print("Response:\n", res3.response)
