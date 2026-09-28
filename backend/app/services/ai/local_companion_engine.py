import re
import math
from typing import Dict, Any, List, Optional, Tuple
from app.models.schemas import (
    AIChatRequest, AIChatResponse, RouteCardData, PlaceCardData, UIAction, ItineraryRequest
)
from app.services.travel.route_planner import route_planner_service
from app.services.itinerary_service import itinerary_service
from app.repositories.cultural_repository import cultural_repository
from app.services.ai.retrieval import ai_retrieval_engine, clean_text, extract_tokens, haversine_km

# Conversational Greetings & Chit-chat dictionaries
GREETINGS_PATTERNS = [
    r'^(?:hi|hello|hey|namaste|namaskar|pranam|ram ram|khammaghani|radhe radhe|sasrikal|adaab)\b',
    r'^(?:good morning|good afternoon|good evening|shubh prabhat|shubh sandhya)\b',
    r'\b(?:kaise ho|kya haal hai|sab theek|how are you|who are you|aap kaun ho|tum kaun ho)\b',
    r'\b(?:thanks|thank you|dhanyawad|shukriya|bahut accha|great job|helpful|superb|awesome)\b',
    r'\b(?:bye|goodbye|alvida|phir milenge|see you|good night|shubh ratri)\b'
]

# Universal Website Action Triggers
ACTION_PATTERNS = {
    "NAV_MAP": [
        r'\b(?:map|cultural map|naksha)\s*(?:kholo|dikhao|open|show|dekhna)\b',
        r'\b(?:open|show|kholo|dikhao)\s+.*(?:map|naksha)\b',
        r'\b(?:cultural map)\b'
    ],
    "NAV_FESTIVALS": [
        r'\b(?:festivals?|tyohar|utsav)\s*(?:page|gallery)?\s*(?:kholo|dikhao|open|show)\b',
        r'\b(?:open|show|kholo|dikhao)\s+.*(?:festivals?|utsav|tyohar)\b',
        r'\b(?:living festivals)\b'
    ],
    "NAV_CRAFTS": [
        r'\b(?:arts?|crafts?|handicrafts?|shilp|kala)\s*(?:page|directory)?\s*(?:kholo|dikhao|open|show)\b',
        r'\b(?:open|show|kholo|dikhao)\s+.*(?:crafts?|arts?|handicrafts?|shilp)\b',
        r'\b(?:arts and crafts)\b'
    ],
    "NAV_ITINERARY": [
        r'\b(?:itinerary|trip planner|planner)\s*(?:page|synthesizer)?\s*(?:kholo|dikhao|open|show)\b',
        r'\b(?:open|show|kholo|dikhao)\s+.*(?:itinerary|planner)\b',
        r'\b(?:itinerary planner)\b'
    ],
    "NAV_EXPERIENCES": [
        r'\b(?:experiences?|heritage walks?|walks?|cultural walks?)\s*(?:page)?\s*(?:kholo|dikhao|open|show)\b',
        r'\b(?:open|show|kholo|dikhao)\s+.*(?:experiences?|walks?)\b',
        r'\b(?:cultural experiences|heritage walks)\b'
    ]
}

class LocalCompanionEngine:
    """
    Intelligent Local Cultural Travel Companion Engine.
    Handles conversational intent detection, route planning, nearby discovery,
    itinerary synthesis & live modification, user memory, and website actions.
    Provides rich, culturally authentic responses in English, Hindi, and Hinglish.
    """
    def __init__(self, repo=cultural_repository, routes=route_planner_service, itineraries=itinerary_service):
        self.repo = repo
        self.routes = routes
        self.itineraries = itineraries

    def handle_conversation(
        self,
        req: AIChatRequest,
        retrieved_records: List[Dict[str, Any]],
        sources: List[str],
        lang: str
    ) -> AIChatResponse:
        query = req.message.strip()
        q_lower = query.lower()

        # 1. Prioritize Conversational Itinerary Modification when an active itinerary exists
        if req.active_itinerary:
            is_mod_intent = any(kw in q_lower for kw in [
                "add", "jodo", "change", "modify", "budget", "relax", "market", "temple", 
                "hata", "remove", "slow", "pace", "senior", "bache", "bachon", "family", 
                "kids", "child", "aaram", "day 1", "day 2", "day 3", "din 1", "din 2"
            ])
            if is_mod_intent:
                updated_itin, mod_msg = self.itineraries.modify_itinerary_conversationally(req.active_itinerary, query, lang=lang)
                return AIChatResponse(
                    response=mod_msg,
                    grounded_in_database=True,
                    retrieved_records=retrieved_records[:3],
                    source_references=sources,
                    suggested_follow_ups=[
                        "Day 3 mein traditional food experience add karo",
                        "Show this itinerary on the map",
                        "Budget breakdown details explain karein"
                    ],
                    language_detected=lang,
                    intent_detected="ITINERARY_MODIFY",
                    actions=[UIAction(action="OPEN_ITINERARY", path="/itinerary", params={"destination": updated_itin.get("destination")}, label="Open Itinerary Synthesizer")],
                    itinerary_card=updated_itin
                )

        # 2. Check for Direct Website Action Navigation
        direct_action = self._check_direct_action(query, lang)
        if direct_action:
            return direct_action

        # 3. Check for User Memory Settings & Commands
        mem_response = self._handle_user_memory(req, lang)
        if mem_response:
            return mem_response

        # 4. Check for Greetings & Chit-chat
        if self._is_greeting_or_chitchat(query):
            return self._build_greeting_response(query, lang, req.user_memory)

        # 5. Check for Multi-day Itinerary Generation Query
        # (Must be checked before route planning so queries like "Goa 3 days" or "Family trip to Agra and Delhi" are handled as itineraries)
        itin_day_match = re.search(r'\b(?:(\d+)[\s\-]*(?:day|days|din|दिन))|(?:itinerary|trip plan|tour plan|travel plan|circuit|family trip)\b', q_lower)
        is_itin_query = bool(itin_day_match) or any(w in q_lower for w in ["itinerary", "din ka plan", "day plan", "days plan", "family trip", "2-day", "3-day", "4-day", "5-day"])
        if is_itin_query and any(w in q_lower for w in ["plan", "itinerary", "ghoomna", "trip", "tour", "banao", "create", "suggest", "circuit", "day", "days", "2-day", "3-day", "4-day"]):
            days_count = 3
            d_found = re.search(r'(\d+)[\s\-]*(?:day|days|din|दिन)', q_lower)
            if d_found:
                days_count = max(1, min(7, int(d_found.group(1))))

            target_dest = "Varanasi"
            # Look for destination in query
            for ckey, cinfo in self.routes.cities.items():
                if ckey in q_lower:
                    target_dest = cinfo["name"]
                    break

            if target_dest == "Varanasi" and retrieved_records:
                target_dest = retrieved_records[0].get("state") or retrieved_records[0].get("city") or "Varanasi"

            # Check for major regions
            for state_token in ["rajasthan", "kerala", "tamil nadu", "odisha", "goa", "gujarat", "kashmir", "madhya pradesh", "maharashtra", "assam", "meghalaya", "bihar", "uttarakhand"]:
                if state_token in q_lower:
                    target_dest = state_token.title()
                    break

            itin = self.itineraries.generate_itinerary(ItineraryRequest(state_or_destination=target_dest, days=days_count))
            itin_dict = itin.model_dump()

            if lang == "hi":
                text = (
                    f"### 🪔 {target_dest} {days_count}-दिवसीय सांस्कृतिक यात्रा योजना\n\n"
                    f"{itin.overview}\n\n"
                )
                for day in itin.days:
                    pnames = ", ".join([p.name for p in day.heritage_places[:2]])
                    text += f"**दिवस {day.day_number}: {day.theme}**\n- प्रमुख स्थल: {pnames}\n- {day.cultural_explanation}\n\n"
                text += "\n*सुझाव: आप कह सकते हैं: 'Day 2 में एक मंदिर जोड़ें' या 'बजट ₹8,000 के भीतर रखें' और मैं इसे तुरंत अनुकूलित कर दूंगा।*'*"
            elif lang == "hinglish":
                text = (
                    f"### 🪔 {target_dest} {days_count}-Day Cultural Heritage Itinerary\n\n"
                    f"{itin.overview}\n\n"
                )
                for day in itin.days:
                    pnames = ", ".join([p.name for p in day.heritage_places[:2]])
                    text += f"**Day {day.day_number}: {day.theme}**\n- Key Monuments: {pnames}\n- {day.cultural_explanation}\n\n"
                text += "\n*Tip: Aap bol sakte hain 'Day 2 mein local market add karo' ya 'budget 8000 ke andar rakho' aur main isko modify kar dunga!*"
            else:
                text = (
                    f"### 🪔 {target_dest} {days_count}-Day Cultural Heritage Itinerary\n\n"
                    f"{itin.overview}\n\n"
                )
                for day in itin.days:
                    pnames = ", ".join([p.name for p in day.heritage_places[:2]])
                    text += f"**Day {day.day_number}: {day.theme}**\n- Highlights: {pnames}\n- {day.cultural_explanation}\n\n"
                text += "\n*Tip: You can say 'Add an artisan market to Day 2' or 'Keep total budget under ₹8,000' and I will update it live for you!*"

            places_cards = [
                PlaceCardData(
                    id=p.id,
                    name=p.name,
                    type="heritage",
                    state=p.state,
                    district=p.city,
                    category=p.category,
                    image_url=p.image_url,
                    description=p.description[:160] + "...",
                    latitude=p.latitude,
                    longitude=p.longitude
                )
                for day in itin.days for p in day.heritage_places[:1]
            ][:3]

            return AIChatResponse(
                response=text,
                grounded_in_database=True,
                retrieved_records=retrieved_records[:3],
                source_references=sources,
                suggested_follow_ups=[
                    f"Day 2 mein artisan craft market add karo",
                    f"Trip budget ₹8,000 ke andar rakho",
                    f"{target_dest} ke local cuisine recommendations"
                ],
                language_detected=lang,
                intent_detected="ITINERARY_CREATE",
                itinerary_card=itin_dict,
                places_cards=places_cards,
                actions=[
                    UIAction(action="OPEN_ITINERARY", path="/itinerary", params={"destination": target_dest, "days": days_count}, label="Open in Full Itinerary Synthesizer"),
                    UIAction(action="NAVIGATE", path="/cultural-map", params={"destination": target_dest}, label="View Monuments on Map")
                ]
            )

        # 6. Check for City-to-City Route Planning
        route_pair = self.routes.extract_route_pair(query)
        if route_pair:
            orig_key, dest_key = route_pair
            route_card = self.routes.plan_route(orig_key, dest_key)
            if route_card:
                companion_text = self.routes.format_companion_route_text(route_card, lang=lang)
                rec_places = self.repo.get_heritage_places(city=route_card.destination)[:2]
                if not rec_places:
                    dest_info = self.routes.cities.get(dest_key)
                    if dest_info:
                        dest_state = dest_info.get("state_id", "").replace("state-", "").replace("-", " ").title()
                        rec_places = self.repo.get_heritage_places(state=dest_state)[:2]
                places_cards = [
                    PlaceCardData(
                        id=p.id,
                        name=p.name,
                        type="heritage",
                        state=p.state,
                        district=p.city,
                        category=p.category,
                        image_url=p.image_url,
                        description=p.description[:180] + "...",
                        latitude=p.latitude,
                        longitude=p.longitude
                    )
                    for p in rec_places
                ]
                return AIChatResponse(
                    response=companion_text,
                    grounded_in_database=True,
                    retrieved_records=retrieved_records[:3],
                    source_references=sources,
                    suggested_follow_ups=[
                        f"{route_card.destination} mein 2 din ka cultural itinerary banayein",
                        f"{route_card.destination} ke famous crafts aur souvenirs kya hain?",
                        f"{route_card.destination} ke authentic local food spots batao"
                    ],
                    language_detected=lang,
                    intent_detected="ROUTE_PLANNING",
                    route_card=route_card,
                    places_cards=places_cards,
                    actions=[
                        UIAction(action="NAVIGATE", path="/cultural-map", params={"destination": route_card.destination}, label=f"Explore {route_card.destination} on Map"),
                        UIAction(action="OPEN_ITINERARY", path="/itinerary", params={"destination": route_card.destination, "days": 3}, label=f"Plan {route_card.destination} Itinerary")
                    ]
                )

        # 7. Check for Nearby Discovery Query
        nearby_match = any(w in q_lower for w in ["nearby", "near", "paas mein", "paas", "ke paas", "aaspas", "around"])
        if nearby_match or req.user_coordinates:
            target_lat, target_lon = None, None
            location_name = "your current location"

            if req.user_coordinates:
                target_lat, target_lon = req.user_coordinates.lat, req.user_coordinates.lng
                location_name = "your GPS location"
            elif retrieved_records:
                for r in retrieved_records:
                    if r.get("latitude") and r.get("longitude"):
                        target_lat, target_lon = r["latitude"], r["longitude"]
                        location_name = r.get("name") or r.get("city") or "this site"
                        break
            
            if not target_lat:
                for ckey, cinfo in self.routes.cities.items():
                    if ckey in q_lower:
                        target_lat, target_lon = cinfo["lat"], cinfo["lon"]
                        location_name = cinfo["name"]
                        break

            if target_lat and target_lon:
                nearby_list = ai_retrieval_engine.find_nearby_entities(target_lat, target_lon, radius_km=80.0)
                if nearby_list:
                    return self._build_nearby_response(location_name, nearby_list, lang, sources)

        # 8. Grounded Cultural Heritage Narrative (Monuments, Crafts, Festivals, Arts)
        return self._build_grounded_cultural_response(query, retrieved_records, sources, lang)

    def _is_greeting_or_chitchat(self, q: str) -> bool:
        clean = q.lower().strip()
        for pat in GREETINGS_PATTERNS:
            if re.search(pat, clean):
                return True
        return clean in {"hi", "hello", "hey", "namaste", "namaskar", "pranam", "thanks", "dhanyawad", "shukriya", "bye", "alvida", "ok", "theek hai"}

    def _build_greeting_response(self, q: str, lang: str, user_memory: Optional[Dict[str, Any]]) -> AIChatResponse:
        q_clean = q.lower().strip()
        is_thanks = any(w in q_clean for w in ["thanks", "thank you", "dhanyawad", "shukriya", "bahut accha"])
        is_bye = any(w in q_clean for w in ["bye", "goodbye", "alvida", "good night", "phir milenge"])

        home_city = user_memory.get("home_city") if user_memory else None

        if is_thanks:
            if lang == "hi":
                resp = "आपका बहुत स्वागत है! भारतीय कला, संस्कृति और प्राचीन धरोहरों के संरक्षण में आपकी रुचि देखकर बहुत प्रसन्नता हुई। क्या आप किसी अन्य शहर, मंदिर या पारंपरिक शिल्प के बारे में जानना चाहते हैं?"
            elif lang == "hinglish":
                resp = "Most welcome! Aapke saath Indian heritage explore karke bahut accha laga. Bataiye, aage kahan ghoomne ka plan hai ya kisi specific craft ke baare mein jaanna chahte hain?"
            else:
                resp = "You are most welcome! It is a joy to share India’s timeless cultural heritage with you. Where would you like to explore next—perhaps a historic fort, a temple circuit, or local artisan traditions?"
        elif is_bye:
            if lang == "hi":
                resp = "नमस्ते और शुभ यात्रा! जब भी आपको भारत के किसी भी राज्य, उत्सव या ऐतिहासिक स्मारक की जानकारी चाहिए हो, विरासत साथी सदैव उपलब्ध रहेगा।"
            elif lang == "hinglish":
                resp = "Namaste aur Happy Travels! Jab bhi kisi monument, festival, ya road route ke baare me sawaal ho, VIRASAT AI companion hamesha taiyar hai. Alvida!"
            else:
                resp = "Namaste and safe journeys! Whenever you seek authentic historical insights, route logistics, or master craft discoveries across India, I am here for you."
        else:
            if lang == "hi":
                resp = (
                    "नमस्ते! मैं आपका **विरासत एआई सांस्कृतिक यात्रा साथी (VIRASAT AI Companion)** हूँ।\n\n"
                    "मैं भारत के सभी २८ राज्यों और ८ केंद्र शासित प्रदेशों के प्राचीन स्मारकों, यूनेस्को विश्व धरोहर स्थलों, "
                    "पारंपरिक हस्तशिल्प (GI टैग), लोक कलाओं और उत्सवों के बारे में भारतीय पुरातत्व सर्वेक्षण (ASI) के "
                    "प्रमाणित रिकॉर्ड्स के आधार पर मार्गदर्शन करता हूँ।\n\n"
                    + (f"*आपका होम सिटी: **{home_city}** सेट है।*\n\n" if home_city else "") +
                    "आप मुझसे किसी भी शहर की यात्रा, मार्गों (सड़क/ट्रेन), नजदीकी आकर्षणों या यात्रा कार्यक्रम (Itinerary) के बारे में पूछ सकते हैं!"
                )
            elif lang == "hinglish":
                resp = (
                    "Namaste! Main hoon aapka **VIRASAT AI Cultural Travel Companion**.\n\n"
                    "Main India ke ancient temples, Mughal & Rajput forts, GI-tagged crafts (jaise Madhubani, Pashmina, Chikan), "
                    "festivals, aur road/rail travel routes ke baare me verified insights deta hoon.\n\n"
                    + (f"*Aapka home city **{home_city}** saved hai.*\n\n" if home_city else "") +
                    "Aap mujhse puch sakte hain: 'Delhi to Jaipur route batao', 'Kashi Vishwanath ki history', '3-day Hampi itinerary', ya 'Near me kya crafts hain'!"
                )
            else:
                resp = (
                    "Namaste! I am your **VIRASAT AI Cultural Travel Companion**.\n\n"
                    "I provide authoritative, culturally rich insights into India's timeless monuments, sacred living traditions, "
                    "GI-tagged handicrafts, and folk arts—strictly grounded in archival and archaeological records.\n\n"
                    + (f"*Personalized for your home city: **{home_city}**.*\n\n" if home_city else "") +
                    "Feel free to ask about any destination, route logistics (rail/highway), nearby sacred sites, or request a customized multi-day itinerary!"
                )

        return AIChatResponse(
            response=resp,
            grounded_in_database=True,
            retrieved_records=[],
            source_references=["https://asi.nic.in"],
            suggested_follow_ups=[
                "Delhi se Jaipur route aur travel time batao",
                "Kashi Vishwanath aur Varanasi ghats ka mahatva kya hai?",
                "Hampi ke musical pillars ki history explain karein"
            ],
            language_detected=lang,
            intent_detected="GREETING_OR_CHITCHAT",
            actions=[
                UIAction(action="NAVIGATE", path="/cultural-map", params={}, label="Open Cultural Map"),
                UIAction(action="NAVIGATE", path="/festivals", params={}, label="Explore Living Festivals")
            ]
        )

    def _handle_user_memory(self, req: AIChatRequest, lang: str) -> Optional[AIChatResponse]:
        q_lower = req.message.lower().strip()

        # Route planning or distance queries must never be intercepted as memory
        if self.routes.extract_route_pair(req.message) is not None:
            return None

        # Multi-destination or trip planning inquiries must never be intercepted as memory
        if re.search(r'\b(?:trip to|tour to|tour of|plan a|days?\s+trip|days?\s+tour|circuit)\b', q_lower):
            return None

        # 1. Clear Memory command
        if any(w in q_lower for w in ["clear memory", "forget me", "forget my preferences", "mera data bhool jao", "delete memory", "clear preferences"]):
            msg = (
                "आपकी सभी व्यक्तिगत प्राथमिकताओं को सफलतापूर्वक हटा दिया गया है।" if lang == "hi"
                else "Aapki saari saved memory (home city, budget, travel style) successfully clear kar di gayi hai!" if lang == "hinglish"
                else "All remembered preferences (home city, budget tier, travel style) have been permanently cleared."
            )
            return AIChatResponse(
                response=msg,
                grounded_in_database=True,
                language_detected=lang,
                intent_detected="USER_MEMORY_CLEAR",
                memory_updates={"_action": "CLEAR"}
            )

        # 2. Show Memory command
        if any(w in q_lower for w in ["what do you know about me", "show my preferences", "show memory", "meri preferences kya hain", "saved profile"]):
            mem = req.user_memory or {}
            hc = mem.get("home_city", "Not set")
            bg = mem.get("budget_tier", "Moderate")
            st = mem.get("travel_style", "Cultural Explorer")
            dp = mem.get("dietary_pref", "Flexible")

            msg = (
                f"### 📋 आपकी सहेजी गई प्राथमिकताएं:\n- गृह नगर: {hc}\n- बजट: {bg}\n- शैली: {st}\n- भोजन: {dp}" if lang == "hi"
                else f"### 📋 Aapki Saved Preferences:\n- Home City: {hc}\n- Budget: {bg}\n- Style: {st}\n- Food: {dp}" if lang == "hinglish"
                else f"### 📋 Your Remembered Profile:\n- Home City: {hc}\n- Budget: {bg}\n- Style: {st}\n- Food: {dp}"
            )
            return AIChatResponse(
                response=msg,
                grounded_in_database=True,
                language_detected=lang,
                intent_detected="USER_MEMORY_INSPECT"
            )

        # 3. Set Home City
        hc_match = re.search(r'(?:mera|my)\s+home\s*city\s+(?:is|hai|set\s+kardo|kardo)?\s*([a-zA-Z\u0900-\u097F]+)', q_lower)
        if not hc_match:
            hc_match = re.search(r'i\s+(?:live|stay)\s+in\s+([a-zA-Z\u0900-\u097F]+)', q_lower)
        if not hc_match:
            hc_match = re.search(r'main\s+([a-zA-Z\u0900-\u097F]+)\s+(?:se|mein\s+rehta)\s+hoon', q_lower)

        if hc_match:
            raw_city = hc_match.group(1).strip()
            resolved = self.routes.resolve_city_name(raw_city)
            city_name = resolved.title() if resolved else raw_city.title()
            msg = (
                f"बहुत बढ़िया! मैंने आपका गृह नगर **{city_name}** के रूप में सुरक्षित कर लिया है।" if lang == "hi"
                else f"Bahut badiya! Maine aapka home city **{city_name}** save kar liya hai." if lang == "hinglish"
                else f"Excellent! I have recorded **{city_name}** as your home departure city."
            )
            return AIChatResponse(
                response=msg,
                grounded_in_database=True,
                language_detected=lang,
                intent_detected="USER_MEMORY_UPDATE",
                memory_updates={"home_city": city_name}
            )

        # 4. Set Budget
        if any(w in q_lower for w in ["budget", "खर्चा", "kharcha", "luxury heritage"]) and any(w in q_lower for w in ["mera", "my", "rakho", "hai", "under", "trip", "preference"]):
            tier = "Moderate"
            if any(w in q_lower for w in ["under", "kam", "sasta", "low", "10k", "5k", "friendly"]):
                tier = "Budget Friendly"
            elif any(w in q_lower for w in ["luxury", "heritage hotel", "5 star", "premium", "palaces"]):
                tier = "Luxury & Heritage Stays"

            msg = (
                f"समझ गया! मैंने आपकी यात्रा बजट प्राथमिकता को **{tier}** के रूप में सहेज लिया है।" if lang == "hi"
                else f"Got it! Maine aapka travel budget preference **{tier}** save kar diya hai." if lang == "hinglish"
                else f"Understood! I have saved your travel budget preference as **{tier}**."
            )
            return AIChatResponse(
                response=msg,
                grounded_in_database=True,
                language_detected=lang,
                intent_detected="USER_MEMORY_UPDATE",
                memory_updates={"budget_tier": tier}
            )

        # 5. Set Travel Style (Family, Solo, Couple)
        is_style_intent = any(w in q_lower for w in ["hum family", "family ke sath", "travel style", "solo explorer", "traveling solo", "traveling as", "traveling with", "with family"]) or (
            any(w in q_lower for w in ["family", "solo", "couple", "senior", "parivar", "akele"]) and
            any(w in q_lower for w in ["preference", "profile", "style", "hum", "we are", "i am", "traveling"])
        )
        if is_style_intent:
            style = "Solo Explorer" if any(w in q_lower for w in ["solo", "alone", "akele"]) else "Family with Kids"
            msg = (
                f"सहेज लिया गया! आपकी यात्रा शैली को **{style}** के रूप में प्राथमिकता दी जाएगी।" if lang == "hi"
                else f"Saved! Aapka travel style **{style}** set kar diya gaya hai." if lang == "hinglish"
                else f"Recorded your travel style preference as **{style}**."
            )
            return AIChatResponse(
                response=msg,
                grounded_in_database=True,
                language_detected=lang,
                intent_detected="USER_MEMORY_UPDATE",
                memory_updates={"travel_style": style}
            )

        # 6. Set Dietary Preference (Vegetarian, Jain, Vegan)
        if re.search(r'\b(?:vegetarian|pure\s+veg|shakahari|jain|vegan|non-veg)\b', q_lower):
            diet = "Pure Vegetarian" if re.search(r'\b(?:pure\s+veg|vegetarian|shakahari)\b', q_lower) else "Jain" if re.search(r'\bjain\b', q_lower) else "Flexible"
            msg = (
                f"सहेज लिया गया! आपकी आहार प्राथमिकता को **{diet}** के रूप में दर्ज कर लिया गया है।" if lang == "hi"
                else f"Saved! Aapka dietary preference **{diet}** record kar diya gaya hai." if lang == "hinglish"
                else f"Saved your dietary preference as **{diet}**."
            )
            return AIChatResponse(
                response=msg,
                grounded_in_database=True,
                language_detected=lang,
                intent_detected="USER_MEMORY_UPDATE",
                memory_updates={"dietary_pref": diet}
            )

        return None

    def _check_direct_action(self, q: str, lang: str) -> Optional[AIChatResponse]:
        clean = q.lower().strip()

        for action_name, pats in ACTION_PATTERNS.items():
            for pat in pats:
                if re.search(pat, clean):
                    if action_name == "NAV_MAP":
                        msg = "Opening the interactive VIRASAT Cultural Map across India's monuments and craft clusters." if lang == "en" else "विरासत सांस्कृतिक मानचित्र खोला जा रहा है।" if lang == "hi" else "VIRASAT Cultural Map open kar raha hoon."
                        return AIChatResponse(
                            response=msg,
                            grounded_in_database=True,
                            language_detected=lang,
                            intent_detected="DIRECT_ACTION",
                            actions=[UIAction(action="NAVIGATE", path="/cultural-map", params={}, label="Open Cultural Map")]
                        )
                    elif action_name == "NAV_FESTIVALS":
                        msg = "Navigating to the VIRASAT Living Festivals gallery." if lang == "en" else "विरासत सजीव उत्सव पृष्ठ खोला जा रहा है।" if lang == "hi" else "VIRASAT Festivals page open kar raha hoon."
                        return AIChatResponse(
                            response=msg,
                            grounded_in_database=True,
                            language_detected=lang,
                            intent_detected="DIRECT_ACTION",
                            actions=[UIAction(action="NAVIGATE", path="/festivals", params={}, label="Open Festivals Gallery")]
                        )
                    elif action_name == "NAV_CRAFTS":
                        msg = "Navigating to the Traditional Arts, Crafts & GI-Tag Master Artisans directory." if lang == "en" else "पारंपरिक कला, हस्तशिल्प और जीआई कारीगर संग्रह खोला जा रहा है।" if lang == "hi" else "Arts & Crafts directory open kar raha hoon."
                        return AIChatResponse(
                            response=msg,
                            grounded_in_database=True,
                            language_detected=lang,
                            intent_detected="DIRECT_ACTION",
                            actions=[UIAction(action="NAVIGATE", path="/arts-crafts", params={}, label="Explore Arts & Crafts")]
                        )
                    elif action_name == "NAV_ITINERARY":
                        msg = "Opening the Cultural Itinerary Synthesizer." if lang == "en" else "सांस्कृतिक यात्रा योजनाकार खोला जा रहा है।" if lang == "hi" else "Itinerary Synthesizer open kar raha hoon."
                        return AIChatResponse(
                            response=msg,
                            grounded_in_database=True,
                            language_detected=lang,
                            intent_detected="DIRECT_ACTION",
                            actions=[UIAction(action="NAVIGATE", path="/itinerary", params={}, label="Open Itinerary Synthesizer")]
                        )
                    elif action_name == "NAV_EXPERIENCES":
                        msg = "Opening Curated Cultural Walks and Heritage Experiences." if lang == "en" else "सांस्कृतिक हेरिटेज वॉक पृष्ठ खोला जा रहा है।" if lang == "hi" else "Cultural Experiences and Heritage Walks open kar raha hoon."
                        return AIChatResponse(
                            response=msg,
                            grounded_in_database=True,
                            language_detected=lang,
                            intent_detected="DIRECT_ACTION",
                            actions=[UIAction(action="NAVIGATE", path="/experiences", params={}, label="Explore Heritage Walks")]
                        )
        return None

    def _build_nearby_response(
        self,
        location_name: str,
        nearby_list: List[Dict[str, Any]],
        lang: str,
        sources: List[str]
    ) -> AIChatResponse:
        places_cards: List[PlaceCardData] = []
        for item in nearby_list[:4]:
            places_cards.append(PlaceCardData(
                id=item.get("id", ""),
                name=item.get("name", "Site"),
                type=item.get("_entity_type", "heritage"),
                state=item.get("state", "India"),
                district=item.get("city") or item.get("district"),
                category=item.get("category"),
                image_url=item.get("image_url"),
                description=item.get("description", "")[:180] + "...",
                latitude=item.get("latitude"),
                longitude=item.get("longitude"),
                action_label="Explore Site"
            ))

        primary_state = nearby_list[0].get("state", "India")
        crafts_nearby = self.repo.get_arts_crafts(state=primary_state)[:2]

        if lang == "hi":
            lines = [
                f"### 📍 {location_name} के निकटतम ऐतिहासिक व सांस्कृतिक धरोहर\n",
                f"भौगोलिक दूरी (Haversine प्रोक्सिमिटी) के आधार पर आपके निकट प्रमुख सत्यापित स्थल:\n"
            ]
            for it in nearby_list[:4]:
                dist_km = it.get("_distance_km", "")
                dist_txt = f" (दूरी: लगभग {dist_km} किमी)" if dist_km else ""
                lines.append(f"- **{it.get('name')}** [{it.get('_entity_type', '').title()}]{dist_txt}: {it.get('description', '')[:140]}...")

            if crafts_nearby:
                lines.append(f"\n**संबंधित क्षेत्रीय हस्तशिल्प (GI Crafts of {primary_state}):**")
                for c in crafts_nearby:
                    lines.append(f"- **{c.name}** ({'GI प्रमाणित' if c.gi_status else 'पारंपरिक'}): {c.description[:110]}...")

            lines.append("\n*सुझाव: आप किसी भी स्मारक को सांस्कृतिक मानचित्र पर देखने के लिए नीचे दिए गए कार्ड्स का उपयोग कर सकते हैं।*")

        elif lang == "hinglish":
            lines = [
                f"### 📍 {location_name} ke paas top Cultural & Heritage Spots\n",
                f"Geographic proximity calculation ke mutabiq aapke aas-paas ke verified sites:\n"
            ]
            for it in nearby_list[:4]:
                dist_km = it.get("_distance_km", "")
                dist_txt = f" (~{dist_km} km away)" if dist_km else ""
                lines.append(f"- **{it.get('name')}** [{it.get('_entity_type', '').title()}]{dist_txt}: {it.get('description', '')[:140]}...")

            if crafts_nearby:
                lines.append(f"\n**Connected Regional Crafts & Souvenirs ({primary_state}):**")
                for c in crafts_nearby:
                    lines.append(f"- **{c.name}** ({'GI Certified' if c.gi_status else 'Traditional'}): {c.description[:110]}...")

            lines.append("\n*Tip: Aap niche diye gaye cards se in jagahon ko directly Map par view kar sakte hain!*")

        else:
            lines = [
                f"### 📍 Heritage Discoveries Near {location_name}\n",
                f"Based on geospatial proximity calculations, the following verified heritage landmarks are located in this circuit:\n"
            ]
            for it in nearby_list[:4]:
                dist_km = it.get("_distance_km", "")
                dist_txt = f" (~{dist_km} km away)" if dist_km else ""
                lines.append(f"- **{it.get('name')}** [{it.get('_entity_type', '').title()}]{dist_txt}: {it.get('description', '')[:140]}...")

            if crafts_nearby:
                lines.append(f"\n**Indigenous Artisan Crafts ({primary_state}):**")
                for c in crafts_nearby:
                    lines.append(f"- **{c.name}** ({'GI Tagged' if c.gi_status else 'Traditional'}): {c.description[:110]}...")

            lines.append("\n*Note: All sites are verified against the Archaeological Survey of India inventory.*")

        return AIChatResponse(
            response="\n".join(lines),
            grounded_in_database=True,
            retrieved_records=nearby_list[:4],
            source_references=sources or ["https://asi.nic.in"],
            suggested_follow_ups=[
                f"{nearby_list[0].get('name')} ka historical significance kya hai?",
                f"{primary_state} ke festivals aur living traditions",
                f"Show these sites on the cultural map"
            ],
            language_detected=lang,
            intent_detected="NEARBY_DISCOVERY",
            places_cards=places_cards,
            actions=[
                UIAction(action="NAVIGATE", path="/cultural-map", params={"state": primary_state}, label=f"Explore {primary_state} on Map")
            ]
        )

    def _build_grounded_cultural_response(
        self,
        query: str,
        records: List[Dict[str, Any]],
        sources: List[str],
        lang: str
    ) -> AIChatResponse:
        if not records:
            if lang == "hi":
                resp = (
                    "I could not find a verified record for this in the VIRASAT database. "
                    "क्षमा करें, विरासत डेटाबेस में इस खोज के लिए वर्तमान में कोई सत्यापित रिकॉर्ड उपलब्ध नहीं है। "
                    "ऐतिहासिक प्रामाणिकता बनाए रखने के लिए, मैं अप्रमाणित जानकारी नहीं देता।"
                )
            elif lang == "hinglish":
                resp = (
                    "I could not find a verified record for this in the VIRASAT database. "
                    "Historical authenticity maintain karne ke liye, bina verified sources ke assumptions nahi banaye ja sakte."
                )
            else:
                resp = (
                    "I could not find a verified record for this in the VIRASAT database. "
                    "To maintain strict historical and archaeological integrity, unverified assertions are not generated."
                )
            return AIChatResponse(
                response=resp,
                grounded_in_database=False,
                retrieved_records=[],
                source_references=[],
                suggested_follow_ups=[
                    "Tell me about the Shore Temple at Mamallapuram",
                    "Explain the Vedic significance of Chhath Puja",
                    "How is Jaipur Blue Pottery crafted without clay?"
                ],
                language_detected=lang,
                intent_detected="UNKNOWN_QUERY"
            )

        primary = records[0]
        rname = primary.get("name") or primary.get("title", "Cultural Landmark")
        rtype = primary.get("_entity_type", "heritage").replace("_", " ").title()
        state = primary.get("state", "India")
        desc = primary.get("description") or primary.get("narrative", "")
        significance = primary.get("cultural_significance") or primary.get("historical_significance", "")
        period = primary.get("historical_period") or primary.get("origin") or primary.get("month_or_season", "")
        arch_style = primary.get("architectural_style", "")
        best_time = primary.get("best_time_to_visit", "")

        q_lower = query.lower()
        is_arch = any(w in q_lower for w in ["architectural", "architecture", "style", "design", "shilp", "kala"])

        places_cards: List[PlaceCardData] = []
        for r in records[:3]:
            places_cards.append(PlaceCardData(
                id=r.get("id", ""),
                name=r.get("name") or r.get("title", ""),
                type=r.get("_entity_type", "heritage"),
                state=r.get("state", "India"),
                district=r.get("city") or r.get("district") or r.get("origin"),
                category=r.get("category") or r.get("craft_category"),
                image_url=r.get("image_url"),
                description=(r.get("description") or r.get("narrative", ""))[:180] + "...",
                latitude=r.get("latitude"),
                longitude=r.get("longitude"),
                action_label="Explore Record"
            ))

        lines = []
        if lang == "hi":
            lines.append(f"### 🏛️ {rname} ({rtype} — {state})\n")
            if is_arch and arch_style:
                lines.append(f"**वास्तुशिल्प शैली (Architectural Style):**\n{arch_style}\n")
            lines.append(f"**ऐतिहासिक अवलोकन:** {desc}\n")
            if significance:
                lines.append(f"**सांस्कृतिक व आध्यात्मिक महत्व:** {significance}\n")
            if period:
                lines.append(f"**काल एवं उत्पत्ति:** {period}\n")
            if arch_style and not is_arch:
                lines.append(f"**वास्तुशिल्प:** {arch_style}\n")
            if best_time:
                lines.append(f"**भ्रमण हेतु सर्वोत्तम समय:** {best_time}\n")

            lines.append("\n**यात्री सुझाव (Traveler Etiquette):**")
            lines.append("- पवित्र मंदिरों में प्रवेश से पूर्व पादुका (जूते/चप्पल) उतारने का नियम पालन करें।")
            lines.append("- सूर्योदय व संध्या के समय प्रकाश फोटोग्राफी एवं शांतिपूर्ण दर्शन के लिए सबसे उत्तम रहता है।")

            if len(records) > 1:
                lines.append("\n**संबंधित सांस्कृतिक विरासत (Connected Heritage in Circuit):**")
                for r in records[1:4]:
                    rn = r.get("name") or r.get("title", "")
                    rt = r.get("_entity_type", "").title()
                    lines.append(f"- **{rn}** ({rt}, {r.get('state', '')})")

        elif lang == "hinglish":
            lines.append(f"### 🏛️ {rname} ({rtype} — {state})\n")
            if is_arch and arch_style:
                lines.append(f"**Architectural Style & Design:**\n{arch_style}\n")
            lines.append(f"**Historical Overview:** {desc}\n")
            if significance:
                lines.append(f"**Cultural Significance:** {significance}\n")
            if period:
                lines.append(f"**Historical Period / Timeline:** {period}\n")
            if arch_style and not is_arch:
                lines.append(f"**Architecture:** {arch_style}\n")
            if best_time:
                lines.append(f"**Best Time to Visit:** {best_time}\n")

            lines.append("\n**Traveler Tips & Etiquette:**")
            lines.append("- Sacred premises me footwear removal compulsory hota hai; modest clothing recommend ki jaati hai.")
            lines.append("- Early morning sunrise darshan sabse peaceful hota hai aur photography lighting bhi perfect milti hai.")

            if len(records) > 1:
                lines.append("\n**Connected Cultural Heritage in this Region:**")
                for r in records[1:4]:
                    rn = r.get("name") or r.get("title", "")
                    rt = r.get("_entity_type", "").title()
                    lines.append(f"- **{rn}** ({rt}, {r.get('state', '')})")

        else:
            if is_arch and arch_style:
                lines.append(f"### 🏛️ {rname} — Architectural & Cultural Analysis\n")
                lines.append(f"**Architectural Style:**\n{arch_style}\n")
                lines.append(f"**Historical Background:**\n{desc}\n")
                if significance:
                    lines.append(f"**Cultural & Archaeological Significance:**\n{significance}\n")
            else:
                lines.append(f"### 🏛️ {rname} ({rtype} — {state})\n")
                lines.append(f"**Historical Context & Overview:**\n{desc}\n")
                if significance:
                    lines.append(f"**Cultural & Spiritual Significance:**\n{significance}\n")
                if period:
                    lines.append(f"**Period / Timeline:** {period}\n")
                if arch_style:
                    lines.append(f"**Architectural Lineage:** {arch_style}\n")
                if best_time:
                    lines.append(f"**Recommended Time of Day:** {best_time}\n")

            lines.append("\n**Visitor Etiquette & Practical Notes:**")
            lines.append("- Modest attire and removal of footwear before sanctum sanctorum are standard protocol across Indian shrines.")
            lines.append("- Photography permissions for tripods/commercial rigs require prior clearance at protected monuments.")

            if len(records) > 1:
                lines.append("\n**Connected Cultural Heritage in this Region:**")
                for r in records[1:4]:
                    rn = r.get("name") or r.get("title", "")
                    rt = r.get("_entity_type", "").title()
                    lines.append(f"- **{rn}** ({rt}, {r.get('state', '')}): {r.get('description', '')[:100]}...")

        lines.append("\n*Note: Information strictly grounded in verified database records from ASI and State Tourism Archives.*")

        actions = []
        if primary.get("latitude") and primary.get("longitude"):
            actions.append(UIAction(
                action="SHOW_ON_MAP",
                path="/cultural-map",
                params={"lat": primary["latitude"], "lng": primary["longitude"], "id": primary.get("id")},
                label=f"Locate {rname.split(',')[0]} on Map"
            ))
        actions.append(UIAction(
            action="OPEN_ITINERARY",
            path="/itinerary",
            params={"destination": state, "days": 3},
            label=f"Plan {state} Heritage Circuit"
        ))

        return AIChatResponse(
            response="\n".join(lines),
            grounded_in_database=True,
            retrieved_records=[
                {
                    "id": r.get("id"),
                    "name": r.get("name") or r.get("title"),
                    "type": r.get("_entity_type"),
                    "state": r.get("state")
                }
                for r in records
            ],
            source_references=sources or ["https://asi.nic.in"],
            suggested_follow_ups=[
                f"{rname.split(',')[0]} ka historical architecture kaisa hai?",
                f"{state} ke famous GI crafts aur handicrafts kya hain?",
                f"{rname.split(',')[0]} ke paas 1-day itinerary plan karein"
            ],
            language_detected=lang,
            intent_detected="CULTURAL_ENTITY_QUERY",
            places_cards=places_cards,
            actions=actions
        )

local_companion_engine = LocalCompanionEngine()
