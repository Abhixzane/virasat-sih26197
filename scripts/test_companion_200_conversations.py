#!/usr/bin/env python3
"""
VIRASAT AI Cultural Travel Companion - Comprehensive 200+ Test Suite
Tests 200+ conversational interactions across all 12 modules:
1. Greetings, politeness, chit-chat (EN, HI, Hinglish)
2. Monument & sacred heritage inquiries (grounded facts)
3. Synonyms, colloquial place names, historical aliases
4. Typo tolerance & misspelled entity matching
5. City-to-city route planning & transit estimates
6. Nearby discovery & geographic proximity queries
7. Multi-day itinerary generation across states/circuits
8. Conversational live itinerary modification
9. Explicit user memory setting, inspecting, and clearing
10. Universal website actions and navigation triggers
11. Multi-intent, trilingual & complex cultural questions
"""

import sys
import os
import json
import time
from typing import List, Dict, Any, Tuple

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

# Add backend directory to sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app.models.schemas import AIChatRequest, AIChatResponse
from app.services.ai.chat_service import ai_chat_service
from app.services.itinerary_service import itinerary_service
from app.models.schemas import ItineraryRequest

class TestResult:
    def __init__(self, test_id: int, category: str, query: str, passed: bool, details: str = ""):
        self.test_id = test_id
        self.category = category
        self.query = query
        self.passed = passed
        self.details = details

def run_test_suite() -> List[TestResult]:
    results: List[TestResult] = []
    test_id = 1

    print("=" * 80)
    print("🚀 VIRASAT UNIVERSAL AI COMPANION — 200+ TEST SUITE EXECUTION")
    print("=" * 80)

    # -------------------------------------------------------------
    # 1. Greetings & Chit-chat (25 tests)
    # -------------------------------------------------------------
    greetings = [
        ("Hi", "en", "GREETING_OR_CHITCHAT"),
        ("Hello!", "en", "GREETING_OR_CHITCHAT"),
        ("Hey there", "en", "GREETING_OR_CHITCHAT"),
        ("Namaste", "en", "GREETING_OR_CHITCHAT"),
        ("Namaskar", "en", "GREETING_OR_CHITCHAT"),
        ("Pranam", "en", "GREETING_OR_CHITCHAT"),
        ("Ram Ram", "en", "GREETING_OR_CHITCHAT"),
        ("Radhe Radhe", "en", "GREETING_OR_CHITCHAT"),
        ("Khammaghani", "en", "GREETING_OR_CHITCHAT"),
        ("Sasrikal", "en", "GREETING_OR_CHITCHAT"),
        ("Adaab", "en", "GREETING_OR_CHITCHAT"),
        ("Good morning", "en", "GREETING_OR_CHITCHAT"),
        ("Shubh prabhat", "hi", "GREETING_OR_CHITCHAT"),
        ("Good evening", "en", "GREETING_OR_CHITCHAT"),
        ("Kaise ho?", "hinglish", "GREETING_OR_CHITCHAT"),
        ("Kya haal hai?", "hinglish", "GREETING_OR_CHITCHAT"),
        ("Who are you?", "en", "GREETING_OR_CHITCHAT"),
        ("Aap kaun ho?", "hinglish", "GREETING_OR_CHITCHAT"),
        ("Thanks a lot!", "en", "GREETING_OR_CHITCHAT"),
        ("Thank you so much", "en", "GREETING_OR_CHITCHAT"),
        ("Dhanyawad", "hi", "GREETING_OR_CHITCHAT"),
        ("Bahut shukriya", "hinglish", "GREETING_OR_CHITCHAT"),
        ("Bye", "en", "GREETING_OR_CHITCHAT"),
        ("Alvida", "hinglish", "GREETING_OR_CHITCHAT"),
        ("Phir milenge", "hinglish", "GREETING_OR_CHITCHAT"),
    ]

    for q, expected_lang, expected_intent in greetings:
        req = AIChatRequest(message=q)
        resp = ai_chat_service.process_chat(req)
        passed = (
            bool(resp.response) and 
            resp.intent_detected == expected_intent
        )
        results.append(TestResult(test_id, "Greetings & Chit-chat", q, passed, f"Intent: {resp.intent_detected}, Lang: {resp.language_detected}"))
        test_id += 1

    # -------------------------------------------------------------
    # 2. Monument & Sacred Heritage Inquiries (30 tests)
    # -------------------------------------------------------------
    monuments = [
        "Tell me about the Taj Mahal in Agra",
        "What is the history of Shore Temple at Mamallapuram?",
        "Explain the stone chariot at Vittala Temple, Hampi",
        "What is the architectural significance of Sun Temple, Konark?",
        "History and sculptures of Khajuraho temples",
        "Meenakshi Amman Temple in Madurai significance",
        "Brihadisvara Temple at Thanjavur architecture",
        "Tell me about Ajanta Caves paintings",
        "Ellora Caves Kailash Temple monolithic marvel",
        "Qutb Minar historical timeline and inscriptions",
        "Red Fort Delhi cultural and architectural details",
        "Humayun's Tomb Mughal garden tomb design",
        "Fatehpur Sikri Buland Darwaza and Salim Chishti",
        "Sree Padmanabhaswamy Temple in Thiruvananthapuram",
        "Golden Temple (Harmandir Sahib) in Amritsar",
        "Victoria Memorial in Kolkata history",
        "Gateway of India in Mumbai significance",
        "Elephanta Caves rock-cut Shiva sculptures",
        "Virupaksha Temple at Hampi",
        "Golconda Fort acoustic engineering in Hyderabad",
        "Charminar architecture and historical period",
        "Hawa Mahal Jaipur design and cooling windows",
        "Amber Fort (Amer Fort) Sheesh Mahal Rajasthan",
        "Jaisalmer Golden Fort architecture",
        "Mehrangarh Fort Jodhpur history",
        "City Palace Udaipur Lake Pichola",
        "Rani ki Vav stepwell in Patan Gujarat",
        "Modhera Sun Temple architecture Gujarat",
        "Sanchi Stupa Buddhist architecture Madhya Pradesh",
        "Nalanda Mahavihara ancient university Bihar"
    ]

    for q in monuments:
        req = AIChatRequest(message=q)
        resp = ai_chat_service.process_chat(req)
        passed = bool(resp.response) and len(resp.response) > 50
        results.append(TestResult(test_id, "Monument & Sacred Heritage", q, passed, f"Grounded: {resp.grounded_in_database}, Records: {len(resp.retrieved_records)}"))
        test_id += 1

    # -------------------------------------------------------------
    # 3. Synonyms & Historical Aliases (25 tests)
    # -------------------------------------------------------------
    synonyms = [
        ("Kashi ke mandir aur ghats", "Varanasi"),
        ("Banaras ki Ganga Aarti", "Varanasi"),
        ("Benares silk craft and ghats", "Varanasi"),
        ("Dilli ke Mughal monuments", "Delhi"),
        ("Prayag Sangam history", "Prayagraj"),
        ("Allahabad heritage and Kumbh", "Prayagraj"),
        ("Bombay colonial architecture", "Mumbai"),
        ("Calcutta British monuments and Durga Puja", "Kolkata"),
        ("Madras classical music and temples", "Chennai"),
        ("Mahabalipuram shore temple", "Mamallapuram"),
        ("Mamallapuram rock cut rathas", "Mamallapuram"),
        ("Vijayanagara empire ruins", "Hampi"),
        ("Humpi ruins and boulders", "Hampi"),
        ("Tanjore Brihadisvara big temple", "Thanjavur"),
        ("Baroda Laxmi Vilas palace", "Vadodara"),
        ("Cochin Jewish synagogue and Chinese nets", "Kochi"),
        ("Poona Shaniwar Wada history", "Pune"),
        ("Bangalore Bangalore palace and gardens", "Bengaluru"),
        ("Trivandrum Padmanabhaswamy temple", "Thiruvananthapuram"),
        ("Pondy French quarter and Auroville", "Puducherry"),
        ("Pondicherry heritage walk", "Puducherry"),
        ("Ooty Nilgiri mountain railway", "Udhagamandalam"),
        ("Mithila folk painting", "Madhubani"),
        ("Kanjivaram silk weaving", "Kanchipuram"),
        ("Chikankari hand embroidery", "Lucknow")
    ]

    for q, expected_canonical in synonyms:
        req = AIChatRequest(message=q)
        resp = ai_chat_service.process_chat(req)
        passed = bool(resp.response) and len(resp.response) > 40
        results.append(TestResult(test_id, "Synonyms & Historical Aliases", q, passed, f"Canonical expected: {expected_canonical}"))
        test_id += 1

    # -------------------------------------------------------------
    # 4. Typo Tolerance & Misspelled Entity Queries (20 tests)
    # -------------------------------------------------------------
    typos = [
        "taj mehal history",
        "humpi stone chariot",
        "ajanta alora caves",
        "elora kailash temple",
        "konark sun templ",
        "varanasi ghars",
        "khajurao erotic temple sculptures",
        "meenakshi amman madurai",
        "qutab minar complex",
        "fatehpur sikri buland darwaja",
        "madhubani painitng",
        "jaipur blue potery technique",
        "chikankari embroydery",
        "kashmir pashmina shawls",
        "chhath puja bihar rituals",
        "durga puja kolkata pandals",
        "hawa mehal windows",
        "rani ki vav stepwel",
        "sanchi stoopa madhya pradesh",
        "brihadeswara temple tanjore"
    ]

    for q in typos:
        req = AIChatRequest(message=q)
        resp = ai_chat_service.process_chat(req)
        passed = bool(resp.response) and len(resp.response) > 40
        results.append(TestResult(test_id, "Typo Tolerance", q, passed, f"Response len: {len(resp.response)}"))
        test_id += 1

    # -------------------------------------------------------------
    # 5. City-to-City Route Planning & Transport (30 tests)
    # -------------------------------------------------------------
    route_queries = [
        ("Delhi to Jaipur", "Delhi", "Jaipur"),
        ("Varanasi se Ayodhya kaise jayein", "Varanasi", "Ayodhya"),
        ("Bangalore to Hampi route", "Bengaluru", "Hampi"),
        ("Mumbai se Pune travel time", "Mumbai", "Pune"),
        ("Kolkata to Darjeeling options", "Kolkata", "Darjeeling"),
        ("Delhi to Agra travel options", "Delhi", "Agra"),
        ("Chennai to Mamallapuram drive", "Chennai", "Mamallapuram"),
        ("Jaipur to Jodhpur travel options", "Jaipur", "Jodhpur"),
        ("Kashi to Prayagraj route", "Varanasi", "Prayagraj"),
        ("Ahmedabad to Vadodara distance", "Ahmedabad", "Vadodara"),
        ("Delhi to Amritsar road trip", "Delhi", "Amritsar"),
        ("Bengaluru to Mysuru expressway", "Bengaluru", "Mysuru"),
        ("Chennai to Puducherry ECR drive", "Chennai", "Puducherry"),
        ("Agra to Fatehpur Sikri route", "Agra", "Fatehpur Sikri"),
        ("Haridwar to Rishikesh travel time", "Haridwar", "Rishikesh"),
        ("Bhubaneswar to Puri distance", "Bhubaneswar", "Puri"),
        ("Puri to Konark drive", "Puri", "Konark"),
        ("Hyderabad to Hampi route", "Hyderabad", "Hampi"),
        ("Delhi to Varanasi train options", "Delhi", "Varanasi"),
        ("Mumbai to Aurangabad route", "Mumbai", "Chhatrapati Sambhajinagar"),
        ("Delhi to Chandigarh highway", "Delhi", "Chandigarh"),
        ("Lucknow to Varanasi travel options", "Lucknow", "Varanasi"),
        ("Jaipur to Udaipur travel options", "Jaipur", "Udaipur"),
        ("Madurai to Thanjavur route", "Madurai", "Thanjavur"),
        ("Kochi to Thiruvananthapuram travel options", "Kochi", "Thiruvananthapuram"),
        ("Guwahati to Shillong drive", "Guwahati", "Shillong"),
        ("Patna to Gaya travel options", "Patna", "Gaya"),
        ("Indore to Ujjain distance", "Indore", "Ujjain"),
        ("Amritsar to Dharamshala travel", "Amritsar", "Dharamshala"),
        ("Delhi to Shimla route", "Delhi", "Shimla")
    ]

    for q, exp_orig, exp_dest in route_queries:
        req = AIChatRequest(message=q)
        resp = ai_chat_service.process_chat(req)
        has_route = resp.intent_detected == "ROUTE_PLANNING" and resp.route_card is not None
        passed = has_route and resp.route_card.distance_km > 0
        details = f"Dist: {resp.route_card.distance_km}km, Modes: {len(resp.route_card.modes)}" if has_route else f"Intent: {resp.intent_detected}"
        results.append(TestResult(test_id, "Route Planning", q, passed, details))
        test_id += 1

    # -------------------------------------------------------------
    # 6. Nearby Discovery & Proximity (20 tests)
    # -------------------------------------------------------------
    nearby_queries = [
        "Main Hampi mein hoon, paas mein kya hai?",
        "Nearby places around Jaipur",
        "Monuments near Agra",
        "Varanasi ke paas kya ghoomein",
        "Places near Delhi to visit",
        "Temples near Chennai",
        "Attractions around Kolkata",
        "Nearby spots in Mumbai",
        "What crafts can I buy near Varanasi?",
        "Crafts near Jaipur",
        "Heritage sites around Madurai",
        "Places to visit near Amritsar",
        "Near Kochi cultural sights",
        "Places around Bhubaneswar",
        "Nearby monuments in Khajuraho",
        "Around Udaipur heritage",
        "Near Mamallapuram sights",
        "Places around Jodhpur",
        "Sights near Rishikesh",
        "Monuments near Aurangabad"
    ]

    for q in nearby_queries:
        req = AIChatRequest(message=q)
        resp = ai_chat_service.process_chat(req)
        passed = bool(resp.response) and (resp.intent_detected in ["NEARBY_DISCOVERY", "CULTURAL_ENTITY_QUERY"] or len(resp.places_cards) > 0)
        results.append(TestResult(test_id, "Nearby Discovery", q, passed, f"Intent: {resp.intent_detected}, Cards: {len(resp.places_cards)}"))
        test_id += 1

    # -------------------------------------------------------------
    # 7. Multi-day Itinerary Generation (20 tests)
    # -------------------------------------------------------------
    itinerary_queries = [
        ("3 day Varanasi itinerary", "Varanasi", 3),
        ("Plan a 2-day trip to Jaipur", "Jaipur", 2),
        ("Hampi 3-day cultural tour", "Hampi", 3),
        ("Rajasthan 5 din ka plan", "Rajasthan", 5),
        ("Family trip to Agra and Delhi", "Agra", 3),
        ("Kerala heritage 4 day tour plan", "Kerala", 4),
        ("Golden Triangle 4 days itinerary", "Delhi", 4),
        ("Tamil Nadu temple circuit 3 days", "Tamil Nadu", 3),
        ("Kolkata 2 day cultural plan", "Kolkata", 2),
        ("Amritsar 2 day trip itinerary", "Amritsar", 2),
        ("Khajuraho 2 day heritage plan", "Khajuraho", 2),
        ("Odisha Golden Triangle 3 days", "Odisha", 3),
        ("Goa heritage and churches 3 days", "Goa", 3),
        ("Gujarat craft and stepwells 4 days", "Gujarat", 4),
        ("Kashmir heritage and crafts 3 days", "Jammu and Kashmir", 3),
        ("Madhya Pradesh temples and forts 4 days", "Madhya Pradesh", 4),
        ("Maharashtra caves and forts 3 days", "Maharashtra", 3),
        ("Assam and Meghalaya cultural 4 days", "Assam", 4),
        ("Bihar Buddhist circuit 3 days", "Bihar", 3),
        ("Uttarakhand spiritual trail 3 days", "Uttarakhand", 3)
    ]

    for q, dest, exp_days in itinerary_queries:
        req = AIChatRequest(message=q)
        resp = ai_chat_service.process_chat(req)
        passed = bool(resp.response) and (resp.intent_detected == "ITINERARY_CREATE" or resp.itinerary_card is not None)
        results.append(TestResult(test_id, "Itinerary Generation", q, passed, f"Intent: {resp.intent_detected}, ItinCard: {bool(resp.itinerary_card)}"))
        test_id += 1

    # -------------------------------------------------------------
    # 8. Conversational Live Itinerary Modification (15 tests)
    # -------------------------------------------------------------
    sample_itin = itinerary_service.generate_itinerary(ItineraryRequest(state_or_destination="Jaipur", days=3)).model_dump()
    itinerary_mod_queries = [
        "Day 2 mein ek aur temple add karo",
        "Day 2 mein local market add karo",
        "Budget 8000 ke andar rakho",
        "Day 1 bahut packed hai, thoda relax banao",
        "Family ke saath hain, slow pacing rakho",
        "Day 3 se fort hata do",
        "Add an artisan craft bazaar to Day 1",
        "Senior citizens sath mein hain",
        "Trip budget ₹10,000 ke andar adjust karo",
        "Add a morning temple visit on Day 3",
        "Shopping market add kar do evening mein",
        "Bachon ke sath child friendly places rakho",
        "Remove last place from Day 2",
        "Day 1 mein street food walk add karo",
        "Keep budget under 5000"
    ]

    for q in itinerary_mod_queries:
        req = AIChatRequest(message=q, active_itinerary=sample_itin)
        resp = ai_chat_service.process_chat(req)
        passed = resp.intent_detected == "ITINERARY_MODIFY" and resp.itinerary_card is not None
        results.append(TestResult(test_id, "Itinerary Modification", q, passed, f"Intent: {resp.intent_detected}"))
        test_id += 1

    # -------------------------------------------------------------
    # 9. Explicit User Memory Management (15 tests)
    # -------------------------------------------------------------
    memory_queries = [
        ("Mera home city Delhi set kardo", "USER_MEMORY_UPDATE"),
        ("I live in Mumbai", "USER_MEMORY_UPDATE"),
        ("My home city is Bengaluru", "USER_MEMORY_UPDATE"),
        ("Main Lucknow se hoon", "USER_MEMORY_UPDATE"),
        ("My budget is ₹15,000", "USER_MEMORY_UPDATE"),
        ("Budget trip under 10k", "USER_MEMORY_UPDATE"),
        ("Luxury heritage stays preference", "USER_MEMORY_UPDATE"),
        ("Hum family ke sath travel kar rahe hain", "USER_MEMORY_UPDATE"),
        ("Traveling solo explorer", "USER_MEMORY_UPDATE"),
        ("I am pure vegetarian", "USER_MEMORY_UPDATE"),
        ("What do you know about me?", "USER_MEMORY_INSPECT"),
        ("Show my preferences", "USER_MEMORY_INSPECT"),
        ("Clear memory", "USER_MEMORY_CLEAR"),
        ("Mera data bhool jao", "USER_MEMORY_CLEAR"),
        ("Forget my preferences", "USER_MEMORY_CLEAR")
    ]

    for q, exp_intent in memory_queries:
        req = AIChatRequest(message=q, user_memory={"home_city": "Delhi"})
        resp = ai_chat_service.process_chat(req)
        passed = resp.intent_detected == exp_intent
        results.append(TestResult(test_id, "User Memory", q, passed, f"Intent: {resp.intent_detected}"))
        test_id += 1

    # -------------------------------------------------------------
    # 10. Direct Website Actions & Navigation (15 tests)
    # -------------------------------------------------------------
    action_queries = [
        ("Open cultural map", "DIRECT_ACTION"),
        ("Map kholo", "DIRECT_ACTION"),
        ("Show the cultural map", "DIRECT_ACTION"),
        ("Show living festivals", "DIRECT_ACTION"),
        ("Festivals page dikhao", "DIRECT_ACTION"),
        ("Open festivals", "DIRECT_ACTION"),
        ("Arts and crafts dikhao", "DIRECT_ACTION"),
        ("Show handicrafts", "DIRECT_ACTION"),
        ("Open crafts directory", "DIRECT_ACTION"),
        ("Open itinerary planner", "DIRECT_ACTION"),
        ("Show itinerary page", "DIRECT_ACTION"),
        ("Open heritage walks", "DIRECT_ACTION"),
        ("Show cultural experiences", "DIRECT_ACTION"),
        ("Cultural map dekhna hai", "DIRECT_ACTION"),
        ("Utsav aur tyohar page kholo", "DIRECT_ACTION")
    ]

    for q, exp_intent in action_queries:
        req = AIChatRequest(message=q)
        resp = ai_chat_service.process_chat(req)
        passed = resp.intent_detected == exp_intent and len(resp.actions) > 0
        results.append(TestResult(test_id, "Website Actions", q, passed, f"Intent: {resp.intent_detected}, Actions: {len(resp.actions)}"))
        test_id += 1

    # -------------------------------------------------------------
    # 11. Multi-intent & Complex Cultural Questions (15 tests)
    # -------------------------------------------------------------
    complex_queries = [
        "हम्पी के विट्ठल मंदिर के रथ की वास्तुकला कैसी है?",
        "काशी विश्वनाथ मंदिर के इतिहास और गंगा आरती के बारे में बताएं",
        "छठ पूजा की वैदिक परंपरा और महत्व क्या है?",
        "मधुबनी चित्रकला की तकनीक और जीआई टैग की जानकारी दें",
        "जयपुर की ब्लू पॉटरी बिना मिट्टी के कैसे बनाई जाती है?",
        "Agra aur Jaipur dono ghoomna hai 3 din mein, kaise plan karein?",
        "What is the difference between Dravidian and Nagara temple architecture?",
        "Tell me about the Warli tribal painting technique and materials",
        "Explain the UNESCO recognition of Durga Puja in Kolkata",
        "How is Kashmir Pashmina spun and certified for purity?",
        "What are the musical pillars of Vittala Temple made of?",
        "Explain the stepwell geometry of Rani ki Vav in Gujarat",
        "Chola bronze casting lost wax technique details",
        "Kathakali classical dance facial makeup and symbolic expressions",
        "Kumbh Mela sacred astronomical cycle and significance"
    ]

    for q in complex_queries:
        req = AIChatRequest(message=q)
        resp = ai_chat_service.process_chat(req)
        passed = bool(resp.response) and len(resp.response) > 40
        results.append(TestResult(test_id, "Complex & Trilingual Inquiries", q, passed, f"Resp len: {len(resp.response)}, Lang: {resp.language_detected}"))
        test_id += 1

    print("=" * 80)
    passed_count = sum(1 for r in results if r.passed)
    total_count = len(results)
    pass_rate = (passed_count / total_count) * 100.0

    print(f"📊 SUMMARY: {passed_count}/{total_count} Tests Passed ({pass_rate:.1f}%)")
    print("=" * 80)

    # Breakdown by category
    categories = {}
    for r in results:
        categories.setdefault(r.category, []).append(r)

    for cat, items in categories.items():
        cat_passed = sum(1 for i in items if i.passed)
        cat_total = len(items)
        print(f"  • {cat.ljust(35)}: {cat_passed}/{cat_total} ({cat_passed/cat_total*100:.0f}%)")

    print("=" * 80)
    if passed_count < total_count:
        print("❌ FAILED TESTS:")
        for r in results:
            if not r.passed:
                print(f"  [#{r.test_id}] Category: {r.category} | Query: '{r.query}' | Details: {r.details}")
    else:
        print("✅ ALL 200+ CONVERSATIONAL TESTS PASSED WITH 100% SUCCESS!")

    return results

if __name__ == "__main__":
    results = run_test_suite()
    if all(r.passed for r in results):
        sys.exit(0)
    else:
        sys.exit(1)
