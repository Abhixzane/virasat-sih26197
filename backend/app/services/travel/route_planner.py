import math
import re
import json
from pathlib import Path
from typing import Optional, Dict, Any, List, Tuple
from app.models.schemas import RouteCardData, TravelModeEstimate

# Known city synonyms & historical / colloquial names
CITY_ALIASES = {
    "kashi": "Varanasi",
    "banaras": "Varanasi",
    "benares": "Varanasi",
    "dilli": "Delhi",
    "new delhi": "Delhi",
    "ncr": "Delhi",
    "bombay": "Mumbai",
    "calcutta": "Kolkata",
    "madras": "Chennai",
    "prayag": "Prayagraj",
    "allahabad": "Prayagraj",
    "bangalore": "Bengaluru",
    "bengaluru": "Bengaluru",
    "baroda": "Vadodara",
    "cochin": "Kochi",
    "trivandrum": "Thiruvananthapuram",
    "poona": "Pune",
    "pondy": "Puducherry",
    "pondicherry": "Puducherry",
    "mamallapuram": "Mamallapuram",
    "mahabalipuram": "Mamallapuram",
    "calicut": "Kozhikode",
    "tanjore": "Thanjavur",
    "ooty": "Udhagamandalam",
    "udhagamandalam": "Udhagamandalam",
    "simla": "Shimla",
    "gauhati": "Guwahati",
    "vizag": "Visakhapatnam",
    "waltair": "Visakhapatnam",
    "mysore": "Mysuru",
    "mangalore": "Mangaluru",
    "belgaum": "Belagavi",
    "hubli": "Hubballi",
    "bellary": "Ballari",
    "gurgaon": "Gurugram",
    "aurangabad": "Chhatrapati Sambhajinagar",
    "chhatrapati sambhajinagar": "Chhatrapati Sambhajinagar",
    "bodh gaya": "Gaya",
    "bodhgaya": "Gaya"
}

# Major known airport hubs in India
AIRPORT_CITIES = {
    "delhi", "mumbai", "bengaluru", "chennai", "kolkata", "hyderabad", 
    "ahmedabad", "jaipur", "varanasi", "kochi", "goa", "amritsar", 
    "srinagar", "lucknow", "patna", "guwahati", "bhubaneswar", "chandigarh", 
    "indore", "pune", "coimbatore", "visakhapatnam", "nagpur", "bagdogra", 
    "dehradun", "madurai", "tiruchirappalli", "udaipur", "jodhpur", "ayodhya",
    "thiruvananthapuram", "surat", "vadodara", "raipur", "ranchi", "shillong"
}

# Highway & Expressway names for iconic corridors
FAMOUS_CORRIDORS = {
    ("delhi", "agra"): ("Yamuna Expressway / Taj Express Highway & NH-19", "Direct high-speed expressway, smooth 6-lane tollway."),
    ("agra", "delhi"): ("Yamuna Expressway / Taj Express Highway & NH-19", "Direct high-speed expressway, smooth 6-lane tollway."),
    ("delhi", "jaipur"): ("Delhi-Mumbai Expressway (NE-4) & NH-48", "Modern access-controlled expressway cutting journey time significantly."),
    ("jaipur", "delhi"): ("Delhi-Mumbai Expressway (NE-4) & NH-48", "Modern access-controlled expressway cutting journey time significantly."),
    ("mumbai", "pune"): ("Mumbai-Pune Expressway (Yashwantrao Chavan Expressway)", "India's premier 6-lane concrete access-controlled expressway."),
    ("pune", "mumbai"): ("Mumbai-Pune Expressway (Yashwantrao Chavan Expressway)", "India's premier 6-lane concrete access-controlled expressway."),
    ("bengaluru", "mysuru"): ("Bengaluru-Mysuru Expressway (NH-275)", "Access-controlled 10-lane corridor passing Bidadi & Ramanagara."),
    ("mysuru", "bengaluru"): ("Bengaluru-Mysuru Expressway (NH-275)", "Access-controlled 10-lane corridor passing Bidadi & Ramanagara."),
    ("varanasi", "ayodhya"): ("NH-330 & Purvanchal Expressway Link", "Paved multi-lane highway through Jaunpur and Sultanpur."),
    ("ayodhya", "varanasi"): ("NH-330 & Purvanchal Expressway Link", "Paved multi-lane highway through Jaunpur and Sultanpur."),
    ("varanasi", "prayagraj"): ("NH-19 (Grand Trunk Road 6-lane corridor)", "Smooth 6-lane National Highway running parallel to the Ganga river."),
    ("prayagraj", "varanasi"): ("NH-19 (Grand Trunk Road 6-lane corridor)", "Smooth 6-lane National Highway running parallel to the Ganga river."),
    ("jaipur", "jodhpur"): ("NH-21 & NH-58", "Scenic highway through heart of Rajasthan, passing Ajmer/Pushkar bypass."),
    ("chennai", "mamallapuram"): ("East Coast Road (ECR / SH-49)", "Scenic coastal highway with Bay of Bengal views and sea breezes."),
    ("mamallapuram", "chennai"): ("East Coast Road (ECR / SH-49)", "Scenic coastal highway with Bay of Bengal views and sea breezes."),
    ("chennai", "puducherry"): ("East Coast Road (ECR / Scenic Coastal Highway)", "Iconic coastal drive passing Mahabalipuram and salt pans."),
    ("puducherry", "chennai"): ("East Coast Road (ECR / Scenic Coastal Highway)", "Iconic coastal drive passing Mahabalipuram and salt pans."),
    ("ahmedabad", "vadodara"): ("National Expressway 1 (NE-1 / Mahatma Gandhi Expressway)", "Four-lane dual carriageway expressway."),
    ("delhi", "amritsar"): ("NH-44 (Grand Trunk Road corridor)", "Historical Grand Trunk route via Murthal, Kurukshetra, and Jalandhar."),
    ("amritsar", "delhi"): ("NH-44 (Grand Trunk Road corridor)", "Historical Grand Trunk route via Murthal, Kurukshetra, and Jalandhar.")
}

def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance between two coordinate pairs in kilometers."""
    R = 6371.0  # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

class RoutePlannerService:
    """
    Intelligent City-to-City Route Planner and Transport Estimator for India.
    Calculates realistic distances, highway routes, and transit modes (Vande Bharat/Express rail,
    domestic flights, RTC/Volvo buses, expressway driving) with transparent disclaimers.
    """
    def __init__(self):
        self.cities: Dict[str, Dict[str, Any]] = {}
        self._load_city_database()

    def _load_city_database(self):
        try:
            seeds_dir = Path(__file__).resolve().parent.parent.parent / "data" / "seeds"
            cities_file = seeds_dir / "cities.json"
            if cities_file.exists():
                with open(cities_file, "r", encoding="utf-8") as f:
                    city_list = json.load(f)
                    for c in city_list:
                        name_key = c.get("name", "").strip().lower()
                        self.cities[name_key] = {
                            "name": c.get("name"),
                            "district": c.get("district"),
                            "state_id": c.get("state_id"),
                            "lat": float(c.get("latitude", 0.0)),
                            "lon": float(c.get("longitude", 0.0)),
                            "description": c.get("description", "")
                        }
            
            # Add or ensure key heritage towns not in standard seeds
            custom_locations = {
                "hampi": {"name": "Hampi", "lat": 15.3350, "lon": 76.4600, "district": "Vijayanagara", "state_id": "Karnataka"},
                "khajuraho": {"name": "Khajuraho", "lat": 24.8318, "lon": 79.9199, "district": "Chhatarpur", "state_id": "Madhya Pradesh"},
                "mamallapuram": {"name": "Mamallapuram", "lat": 12.6269, "lon": 80.1927, "district": "Chengalpattu", "state_id": "Tamil Nadu"},
                "fatehpur sikri": {"name": "Fatehpur Sikri", "lat": 27.0945, "lon": 77.6679, "district": "Agra", "state_id": "Uttar Pradesh"},
                "konark": {"name": "Konark", "lat": 19.8876, "lon": 86.0945, "district": "Puri", "state_id": "Odisha"},
                "puri": {"name": "Puri", "lat": 19.8135, "lon": 85.8312, "district": "Puri", "state_id": "Odisha"},
                "ajanta": {"name": "Ajanta", "lat": 20.5519, "lon": 75.7033, "district": "Chhatrapati Sambhajinagar", "state_id": "Maharashtra"},
                "ellora": {"name": "Ellora", "lat": 20.0268, "lon": 75.1792, "district": "Chhatrapati Sambhajinagar", "state_id": "Maharashtra"},
                "darjeeling": {"name": "Darjeeling", "lat": 27.0410, "lon": 88.2663, "district": "Darjeeling", "state_id": "West Bengal"},
                "rishikesh": {"name": "Rishikesh", "lat": 30.0869, "lon": 78.2676, "district": "Dehradun", "state_id": "Uttarakhand"},
                "haridwar": {"name": "Haridwar", "lat": 29.9457, "lon": 78.1642, "district": "Haridwar", "state_id": "Uttarakhand"},
                "aurangabad": {"name": "Chhatrapati Sambhajinagar", "lat": 19.8762, "lon": 75.3433, "district": "Chhatrapati Sambhajinagar", "state_id": "Maharashtra"},
                "chhatrapati sambhajinagar": {"name": "Chhatrapati Sambhajinagar", "lat": 19.8762, "lon": 75.3433, "district": "Chhatrapati Sambhajinagar", "state_id": "Maharashtra"}
            }
            for k, val in custom_locations.items():
                if k not in self.cities:
                    self.cities[k] = val
        except Exception as e:
            # Fallback hardcoded essentials
            pass

    def resolve_city_name(self, query_token: str) -> Optional[str]:
        """Resolves colloquial, historic, or transliterated city names to canonical city keys."""
        norm = query_token.strip().lower()
        if not norm or len(norm) < 3:
            return None

        # 1. Alias lookup
        if norm in CITY_ALIASES:
            norm = CITY_ALIASES[norm].lower()

        # 2. Exact match in known cities
        if norm in self.cities:
            return norm

        # 3. Stop words that must never resolve as a city via partial matching
        if norm in {
            "hai", "hain", "hoon", "hona", "jaana", "jana", "jaunga", "jaungi", "karo", "karna", "karein",
            "travel", "route", "trip", "tour", "plan", "the", "and", "mein", "aur", "se", "to", "ke", "ka", "ki",
            "mujhe", "humko", "apna", "batao", "banao", "options", "distance", "chahiye", "gayi", "din",
            "visit", "want", "explore", "from", "around", "near", "nearby", "here", "there", "what", "where",
            "how", "when", "city", "place", "places", "mandir", "temple", "fort", "museum", "about", "show"
        }:
            return None
        
        # Match where a known multi-word city contains the token or vice-versa
        for ckey in self.cities:
            if ckey == norm:
                return ckey
            if len(ckey) >= 4 and ckey in norm:
                return ckey

        # Prefix match for minor spelling variations (e.g. 'bengalur' -> 'bengaluru')
        for ckey in self.cities:
            if len(norm) >= 5 and ckey.startswith(norm):
                return ckey

        return None

    def extract_route_pair(self, text: str) -> Optional[Tuple[str, str]]:
        """
        Extracts origin and destination from English, Hindi, or Hinglish query.
        Examples:
        - 'Delhi to Jaipur'
        - 'Varanasi se Ayodhya kaise jayein'
        - 'Route from Mumbai to Pune'
        - 'Bangalore se Hampi jana hai'
        - 'Kashi to Prayagraj travel plan'
        """
        norm_text = text.lower().strip()
        
        # Patterns for English and Hinglish
        patterns = [
            r'(?:from\s+)?([a-zA-Z\u0900-\u097F\s]+?)\s+(?:to|se|->)\s+([a-zA-Z\u0900-\u097F\s]+?)(?:\s+(?:kaise|route|travel|distance|options|jana|jayein|trip|car|train|flight|bus|by|cost|kharcha)|$|\?|\.)',
            r'([a-zA-Z\u0900-\u097F\s]+?)\s+(?:se)\s+([a-zA-Z\u0900-\u097F\s]+?)\s+(?:tak|kaise|jana|jayein|ka\s+route|travel)',
            r'(?:between)\s+([a-zA-Z\u0900-\u097F\s]+?)\s+and\s+([a-zA-Z\u0900-\u097F\s]+)'
        ]

        for pat in patterns:
            m = re.search(pat, norm_text)
            if m:
                raw_origin = m.group(1).strip()
                raw_dest = m.group(2).strip()
                
                # Clean up extraneous words
                for strip_word in ["route", "trip", "travel", "plan", "from", "se", "to", "ke", "ka", "dono", "ghoomna", "hai"]:
                    raw_origin = re.sub(rf'\b{strip_word}\b', '', raw_origin).strip()
                    raw_dest = re.sub(rf'\b{strip_word}\b', '', raw_dest).strip()

                orig_key = self.resolve_city_name(raw_origin)
                dest_key = self.resolve_city_name(raw_dest)

                if orig_key and dest_key and orig_key != dest_key:
                    return (orig_key, dest_key)

        # Fallback: scan text for any two recognized city mentions in order
        found_cities = []
        words = re.findall(r'\b[a-zA-Z]{3,}\b', norm_text)
        for w in words:
            resolved = self.resolve_city_name(w)
            if resolved and resolved not in found_cities:
                found_cities.append(resolved)
        
        if len(found_cities) >= 2:
            return (found_cities[0], found_cities[1])

        return None

    def plan_route(self, origin_key: str, dest_key: str) -> Optional[RouteCardData]:
        """Generates realistic route estimates between two Indian cities."""
        orig_info = self.cities.get(origin_key.lower())
        dest_info = self.cities.get(dest_key.lower())

        if not orig_info or not dest_info:
            return None

        orig_name = orig_info["name"]
        dest_name = dest_info["name"]

        lat1, lon1 = orig_info["lat"], orig_info["lon"]
        lat2, lon2 = dest_info["lat"], dest_info["lon"]

        aerial_km = haversine_km(lat1, lon1, lat2, lon2)
        # Indian highway network factor (1.25x - 1.35x aerial distance)
        road_distance_km = max(15, int(aerial_km * 1.25))

        # Check for known famous corridor
        pair_key = (origin_key.lower(), dest_key.lower())
        corridor_info = FAMOUS_CORRIDORS.get(pair_key)
        highway_route = corridor_info[0] if corridor_info else f"National Highway Corridor (approx. {road_distance_km} km)"

        # 1. Driving estimation (avg 60-70 km/h with brief stops)
        driving_hours = round(road_distance_km / 65.0, 1)
        if driving_hours < 1.0:
            driving_time_str = f"{int(driving_hours * 60)} mins"
        else:
            h = int(driving_hours)
            m = int((driving_hours - h) * 60)
            driving_time_str = f"{h}h {m}m" if m > 0 else f"{h} hours"

        modes: List[TravelModeEstimate] = []

        # 2. Train Mode
        if road_distance_km < 550:
            train_speed = 80.0
            train_hours = round(road_distance_km / train_speed, 1)
            train_fare = "₹650 – ₹1,450 (Chair Car / 3AC)"
            train_details = "Vande Bharat Express / Shatabdi / Superfast Express available. Daytime high-speed connectivity."
            rec_train = True
        else:
            train_speed = 72.0
            train_hours = round(road_distance_km / train_speed, 1)
            train_fare = "₹1,200 – ₹2,800 (3AC / 2AC / 1AC) | ₹400 – ₹600 (Sleeper)"
            train_details = "Rajdhani Express / Superfast Overnight Express with sleeper berths. Recommended to book in advance on IRCTC."
            rec_train = (road_distance_km <= 900)

        modes.append(TravelModeEstimate(
            mode="train",
            title="Indian Railways (Vande Bharat / Express)",
            duration_hours=train_hours,
            duration_formatted=f"{int(train_hours)}h {int((train_hours % 1) * 60)}m" if int((train_hours % 1) * 60) > 0 else f"{int(train_hours)} hours",
            estimated_fare_inr=train_fare,
            operational_details=train_details,
            is_recommended=rec_train
        ))

        # 3. Flight Mode (if distance >= 300km and both in airport cities)
        has_orig_airport = origin_key.lower() in AIRPORT_CITIES
        has_dest_airport = dest_key.lower() in AIRPORT_CITIES
        if road_distance_km >= 320 and (has_orig_airport and has_dest_airport):
            flight_air_time = round(max(1.0, aerial_km / 600.0), 1)
            flight_total_transit = round(flight_air_time + 3.0, 1) # airport arrival + security + boarding
            modes.append(TravelModeEstimate(
                mode="flight",
                title="Domestic Flight (Direct / Connecting)",
                duration_hours=flight_air_time,
                duration_formatted=f"{int(flight_air_time)}h {int((flight_air_time % 1) * 60)}m (Air time)",
                estimated_fare_inr="₹3,200 – ₹7,500 (Economy)",
                operational_details=f"Direct flights between {orig_name} and {dest_name} airports. Book 2-3 weeks in advance for best fares.",
                is_recommended=(road_distance_km > 700)
            ))
        elif road_distance_km < 320:
            modes.append(TravelModeEstimate(
                mode="flight",
                title="Flight Not Recommended",
                duration_hours=0.0,
                duration_formatted="N/A",
                estimated_fare_inr="N/A",
                operational_details=f"Short distance ({road_distance_km} km); high-speed rail or highway expressway is much faster door-to-door than airport security.",
                is_recommended=False
            ))

        # 4. Bus / RTC Mode
        bus_speed = 50.0
        bus_hours = round(road_distance_km / bus_speed, 1)
        bus_fare = "₹450 – ₹1,250 (State RTC / AC Volvo Sleeper)"
        modes.append(TravelModeEstimate(
            mode="bus",
            title="State RTC & AC Volvo Sleeper",
            duration_hours=bus_hours,
            duration_formatted=f"{int(bus_hours)}h {int((bus_hours % 1) * 60)}m",
            estimated_fare_inr=bus_fare,
            operational_details="Regular daily services operated by State Roadways (e.g. UPSRTC/RSRTC/KSRTC) and private multi-axle Volvos.",
            is_recommended=(road_distance_km < 350 and not rec_train)
        ))

        # 5. Drive / Cab Mode
        cab_cost = f"₹{int(road_distance_km * 14 + 400):,} – ₹{int(road_distance_km * 18 + 800):,} (One-way / Outstation Cab)"
        modes.append(TravelModeEstimate(
            mode="drive",
            title="Self-Drive or Outstation Cab",
            duration_hours=driving_hours,
            duration_formatted=driving_time_str,
            estimated_fare_inr=cab_cost,
            operational_details=f"Via {highway_route}. FASTag mandatory at highway toll plazas. Early morning departure recommended to beat urban traffic.",
            is_recommended=(road_distance_km <= 300)
        ))

        # Travel tips
        tips = [
            f"Recommended Route: {highway_route}.",
            "Best Departure Time: Early morning (5:30 AM – 6:30 AM) to avoid city bottlenecks.",
            "Verify real-time train timings and seat availability on the official IRCTC portal (irctc.co.in).",
            "Carry FASTag on windshield for automated cashless toll deductions across National Expressways."
        ]

        return RouteCardData(
            origin=orig_name,
            destination=dest_name,
            distance_km=road_distance_km,
            driving_time_formatted=driving_time_str,
            modes=modes,
            highway_route=highway_route,
            travel_tips=tips,
            disclaimer="Estimates based on national highway and rail network averages. Live bookings, schedules, and exact fares should be verified directly via IRCTC or official carriers."
        )

    def format_companion_route_text(self, card: RouteCardData, lang: str = "en") -> str:
        """Formats an engaging, culturally warm travel summary in EN, HI, or Hinglish."""
        rec_mode = next((m for m in card.modes if m.is_recommended), card.modes[0])

        if lang == "hi":
            lines = [
                f"### 🚗 {card.origin} से {card.destination} यात्रा गाइड",
                f"**दूरी:** लगभग **{card.distance_km} किमी** | **सड़क मार्ग समय:** लगभग **{card.driving_time_formatted}**",
                f"**प्रमुख मार्ग / हाईवे:** {card.highway_route}\n",
                f"**सर्वश्रेष्ठ यात्रा विकल्प (Recommended):**",
                f"- **{rec_mode.title}:** लगभग {rec_mode.duration_formatted} (अनुमानित किराया: {rec_mode.estimated_fare_inr})",
                f"  *{rec_mode.operational_details}*\n",
                "**अन्य उपलब्ध विकल्प:**"
            ]
            for m in card.modes:
                if m != rec_mode and m.duration_hours > 0:
                    lines.append(f"- **{m.title}:** समय {m.duration_formatted} | किराया {m.estimated_fare_inr}")

            lines.append("\n**सुझाव:**")
            for t in card.travel_tips[:2]:
                lines.append(f"- {t}")
            lines.append(f"\n*{card.disclaimer}*")
            return "\n".join(lines)

        elif lang == "hinglish":
            lines = [
                f"### 🚗 {card.origin} se {card.destination} Travel Guide",
                f"**Approx Distance:** **{card.distance_km} km** | **Drive Time:** around **{card.driving_time_formatted}**",
                f"**Highway Route:** {card.highway_route}\n",
                f"**Best Option:**",
                f"- **{rec_mode.title}:** ~{rec_mode.duration_formatted} (Estimated fare: {rec_mode.estimated_fare_inr})",
                f"  *{rec_mode.operational_details}*\n",
                "**Other Travel Options:**"
            ]
            for m in card.modes:
                if m != rec_mode and m.duration_hours > 0:
                    lines.append(f"- **{m.title}:** Duration {m.duration_formatted} | Estimated cost {m.estimated_fare_inr}")

            lines.append("\n**Helpful Tips:**")
            for t in card.travel_tips[:2]:
                lines.append(f"- {t}")
            lines.append(f"\n*{card.disclaimer}*")
            return "\n".join(lines)

        else:
            lines = [
                f"### 🚗 Travel Guide: {card.origin} to {card.destination}",
                f"**Distance:** Approximately **{card.distance_km} km** | **Estimated Drive Time:** **{card.driving_time_formatted}**",
                f"**Primary Route:** {card.highway_route}\n",
                f"**Recommended Transit Mode:**",
                f"- **{rec_mode.title}:** ~{rec_mode.duration_formatted} (Estimated fare: {rec_mode.estimated_fare_inr})",
                f"  *{rec_mode.operational_details}*\n",
                "**Available Transport Modes:**"
            ]
            for m in card.modes:
                if m != rec_mode and m.duration_hours > 0:
                    lines.append(f"- **{m.title}:** {m.duration_formatted} | {m.estimated_fare_inr}")

            lines.append("\n**Traveler Tips:**")
            for t in card.travel_tips[:2]:
                lines.append(f"- {t}")
            lines.append(f"\n*{card.disclaimer}*")
            return "\n".join(lines)

route_planner_service = RoutePlannerService()
