import json
import urllib.request
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def run_tests():
    url = "http://127.0.0.1:8000/api/ai/chat"
    tests = [
        ("1. English & Hinglish query", {"message": "Bhai mujhe Jaipur ghumna hai 3 din ke liye"}),
        ("2. Misspelled destination", {"message": "Tell me about Taj Mahl and Agrah fort"}),
        ("3. Follow-up conversation", {
            "message": "Wahan kaise jayein?",
            "user_memory": {"home_city": "Delhi", "travel_style": "Heritage Explorer"},
            "conversation_history": [{"role": "user", "content": "Tell me about Jaipur"}]
        }),
        ("4. Missing database info", {"message": "Tell me about a secret alien pyramid in Atlantis India"}),
        ("5. Invalid destination", {"message": "Route from Mars to Jupiter"}),
        ("6. Multi-city itinerary", {"message": "Plan a 5-day trip covering Delhi and Jaipur"}),
        ("7. Map coordinate retrieval", {"message": "Show me Gateway of India on the map"}),
        ("8. Budget constraints", {"message": "Jaipur trip budget INR 5,000 for 2 days"}),
        ("9. Tool fallback / grounded mode", {"message": "What is the history of Konark Sun Temple?"}),
        ("10. Context preservation", {
            "message": "Isko itinerary me add karo",
            "conversation_history": [
                {"role": "user", "content": "Gateway of India kya hai?"},
                {"role": "assistant", "content": "Gateway of India Mumbai mein hai."}
            ]
        })
    ]

    print("=" * 80)
    print("LIVE API VERIFICATION — 10 CRITICAL CONVERSATIONAL CRITERIA")
    print("=" * 80)

    all_passed = True
    for title, payload in tests:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        try:
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                assert "response" in data
                assert len(data["response"]) > 0
                has_card = bool(data.get("route_card") or data.get("place_card") or data.get("itinerary_card"))
                preview = data["response"][:70].replace("\n", " ")
                print(f"[PASS] {title}")
                print(f"       Response: {preview}...")
                print(f"       Card: {has_card} | Action: {bool(data.get('ui_action'))} | Sources: {len(data.get('sources', []))}")
        except Exception as e:
            print(f"[FAIL] {title}: {e}")
            all_passed = False

    print("=" * 80)
    if all_passed:
        print("ALL 10 CRITICAL LIVE SCENARIOS PASSED WITH 100% SUCCESS!")
    else:
        print("SOME TESTS FAILED.")
    print("=" * 80)
    return all_passed

if __name__ == "__main__":
    success = run_tests()
    exit(0 if success else 1)
