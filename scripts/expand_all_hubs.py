"""
Expands scripts/itinerary_data.json with full, rich, verified dossiers for all key Indian cities.
"""

import json

def expand_all():
    with open("scripts/itinerary_data.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    # -------------------------------------------------------------
    # 5. DELHI (Imperial Capitals & Mughal/Colonial Heritage)
    # -------------------------------------------------------------
    data["delhi"] = {
        "title": "Seven Historic Capitals of Delhi & Mughal Marvels",
        "subtitle": "Qutub Minar, Red Fort, Humayun's Garden Tomb & Chandni Chowk",
        "region": "Northern India",
        "recommended_season": "October – March (Crisp winter sunshine, ideal walking weather)",
        "circuit_distance": "40 km urban heritage circuit",
        "total_travel_time": "Low travel fatigue / Delhi Metro Yellow/Violet lines & private cab",
        "transit_mode": "Delhi Metro (Heritage Line) & battery e-rickshaws in Old Delhi",
        "curator_field_protocol": [
            "Dress respectfully with covered shoulders and knees at Jama Masjid and Nizamuddin Dargah.",
            "Old Delhi (Chandni Chowk) is pedestrian-only between 09:00 AM and 09:00 PM; use cycle rickshaws.",
            "Humayun's Tomb and Qutub Minar offer the best photography in late afternoon golden hour.",
            "Book ASI monument tickets online via QR code at monument entry to skip ticket lines."
        ],
        "days": [
            {
                "day_number": 1,
                "city": "Old Delhi (Shahjahanabad)",
                "route_title": "Red Fort → Jama Masjid → Chandni Chowk Food & Spice Trail",
                "dist_time": "6 km • Heritage walking and cycle rickshaw trail",
                "theme": "Mughal Imperial Splendour & Living Heritage Bazaars",
                "monuments": [
                    {
                        "name": "Red Fort (Lal Qila - UNESCO)",
                        "city": "Delhi",
                        "state": "Delhi",
                        "category": "UNESCO World Heritage Mughal Citadel",
                        "period": "1638–1648 CE (Emperor Shah Jahan)",
                        "description": "The formidable red sandstone seat of the Mughal Empire spanning 254 acres, containing the Diwan-i-Aam, Diwan-i-Khas, and the legendary Stream of Paradise (Nahr-i-Bihisht).",
                        "timings": "09:30 AM – 04:30 PM (Closed Mondays)",
                        "entry_fee": "₹50 (Indians) | ₹550 (Foreigners)",
                        "visit_duration": "2.5 Hours",
                        "image_url": "https://images.unsplash.com/photo-1598555230054-726487e6717a?w=1000&auto=format&fit=crop&q=80",
                        "lat": 28.6562, "lng": 77.2410
                    },
                    {
                        "name": "Jama Masjid (Masjid-i-Jahan-Numa)",
                        "city": "Delhi",
                        "state": "Delhi",
                        "category": "Grand Imperial Mughal Mosque",
                        "period": "1650–1656 CE (Emperor Shah Jahan)",
                        "description": "One of India's largest historical mosques built of red sandstone and white marble, capable of holding 25,000 worshippers in its central courtyard.",
                        "timings": "07:00 AM – 12:00 PM, 01:30 PM – 06:30 PM Daily",
                        "entry_fee": "Free Entry | ₹300 Camera Permit | ₹100 Minaret Climb",
                        "visit_duration": "1.5 Hours",
                        "image_url": "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=1000&auto=format&fit=crop&q=80",
                        "lat": 28.6507, "lng": 77.2334
                    }
                ],
                "experiences": [
                    {
                        "name": "Khari Baoli Asia's Largest Spice Market Walk",
                        "category": "Living Sensory Heritage",
                        "desc": "Walk through 17th-century vaulted spice arcades brimming with sacks of Kashmiri saffron, cardamom pods, and dried red chillies."
                    }
                ],
                "festivals": ["Independence Day (August 15)", "Phool Walon Ki Sair (October)", "Qutub Festival"],
                "morning": "08:30 AM: Explore the monumental Red Fort Diwan-i-Khas and museums before midday crowds.",
                "midday": "11:30 AM: Climb the southern minaret of Jama Masjid for panoramic views over Old Delhi's dense rooftops.",
                "lunch": "01:30 PM: Authentic Mughlai feast at Karim's (Gali Kababian) or Pandit Gaya Prasad Shiv Charan Paranthe Wale.",
                "twilight": "05:00 PM: Stroll through the aromatic spice corridors of Khari Baoli and Dariba Kalan silver jewelry market.",
                "curator_note": "Red Fort is closed on Mondays. Fridays are crowded around Jama Masjid during afternoon prayers (12:00–02:00 PM).",
                "hotels": [
                    {
                        "name": "Haveli Dharampura - UNESCO Awarded Heritage Stay",
                        "hotel_type": "Restored 19th-Century Mughal-Lakhori Brick Haveli",
                        "price_tier": "₹11,000 - ₹18,000 / night",
                        "rating": 4.8,
                        "distance": "In the heart of Chandni Chowk",
                        "highlights": ["UNESCO Asia-Pacific Award for Cultural Heritage Conservation", "Classical Kathak dance & rooftop kite flying", "Fine dining restaurant 'Lakhori'"],
                        "booking_advice": "A masterpiece of restoration in the heart of Old Delhi; book well in advance."
                    },
                    {
                        "name": "The Imperial, New Delhi - Janpath",
                        "hotel_type": "Colonial Art Deco Luxury Hotel",
                        "price_tier": "₹16,000 - ₹28,000 / night",
                        "rating": 4.9,
                        "distance": "Janpath, Connaught Place (15 mins by Metro to Old Delhi)",
                        "highlights": ["Largest private art collection of British India", "Historic 1930s colonial grandeur", "World-class wellness spa"],
                        "booking_advice": "One of Asia's most historic grand hotels, blending colonial art with modern luxury."
                    }
                ],
                "restaurants": [
                    {
                        "name": "Karim's (Gali Kababian, Jama Masjid)",
                        "cuisine": "Royal Mughal Dastarkhwan",
                        "must_try": ["Mutton Burra Kebab (Charcoal grilled)", "Mutton Korma with Sheermal", "Chicken Jahangiri"],
                        "price_for_two": "₹700 - ₹1,200",
                        "timing": "09:00 AM – 11:30 PM",
                        "dietary": "Non-Veg Specialty with Vegetarian Breads & Dal",
                        "curator_note": "Founded in 1913 by Haji Karimuddin, royal chef to the last Mughal Emperor Bahadur Shah Zafar."
                    },
                    {
                        "name": "Pt. Gaya Prasad Shiv Charan (Paranthe Wali Gali)",
                        "cuisine": "Heritage Fried Stuffed Paranthas",
                        "must_try": ["Kaju-Pista Parantha", "Rabdi Parantha", "Served with sweet pumpkin sabzi & mint chutney"],
                        "price_for_two": "₹250 - ₹400",
                        "timing": "09:00 AM – 10:30 PM",
                        "dietary": "Pure Vegetarian",
                        "curator_note": "Deep-fried in pure desi ghee since 1872; iconic taste of Old Delhi's historic food lanes."
                    }
                ],
                "markets": [
                    {
                        "name": "Dariba Kalan & Kinari Bazaar",
                        "market_type": "Historic Silver Jewelry & Trousseau Market",
                        "famous_for": ["Handmade 92.5 pure silver jewelry and antique coins", "Zardozi ribbons, borders, and bridal laces", "Traditional non-alcoholic flower attars (Gulab, Ruh Motia, Khus)"],
                        "best_time": "11:00 AM – 07:30 PM (Closed Sundays)",
                        "location_area": "Off Chandni Chowk main avenue",
                        "bargaining_and_visiting_tips": "Visit Gulab Singh Johrimal (operating since 1816) for authentic steam-distilled floral perfumes in antique glass phials."
                    }
                ]
            },
            {
                "day_number": 2,
                "city": "South Delhi (Monuments & Gardens)",
                "route_title": "Humayun's Tomb → Qutub Minar (UNESCO) → Sunder Nursery",
                "dist_time": "16 km • Urban heritage transit",
                "theme": "Sultanate Minarets, Garden Tombs & Medieval Stepwells",
                "monuments": [
                    {
                        "name": "Qutub Minar Complex (UNESCO World Heritage)",
                        "city": "Delhi",
                        "state": "Delhi",
                        "category": "UNESCO World Heritage Sultanate Landmark",
                        "period": "1192 CE (Qutb-ud-din Aibak) & 1220 CE (Iltutmish)",
                        "description": "A 72.5-meter tapering victory tower of red sandstone and marble, holding the famous 4th-century CE rust-resistant Iron Pillar of Chandragupta II and Quwwat-ul-Islam Mosque.",
                        "timings": "07:00 AM – 09:00 PM (Illuminated in evenings)",
                        "entry_fee": "₹50 (Indians) | ₹600 (Foreigners)",
                        "visit_duration": "2 Hours",
                        "image_url": "/hero/monument-4.jpg",
                        "lat": 28.5245, "lng": 77.1855
                    },
                    {
                        "name": "Humayun's Tomb (UNESCO World Heritage)",
                        "city": "Delhi",
                        "state": "Delhi",
                        "category": "UNESCO World Heritage Garden Tomb",
                        "period": "1565–1572 CE (Empress Bega Begum)",
                        "description": "The first mature example of Mughal garden-tomb architecture in India, built of red sandstone and white marble set within geometric four-part paradise gardens (Charbagh).",
                        "timings": "06:00 AM – 06:00 PM Daily",
                        "entry_fee": "₹50 (Indians) | ₹600 (Foreigners)",
                        "visit_duration": "2 Hours (Best in Late Afternoon)",
                        "image_url": "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=1000&auto=format&fit=crop&q=80",
                        "lat": 28.5933, "lng": 77.2507
                    }
                ],
                "experiences": [
                    {
                        "name": "Sunder Nursery Heritage Biodiversity Park Walk",
                        "category": "Mughal Garden & Ecology Walk",
                        "desc": "Stroll amidst 16th-century restored Mughal tombs, marble lotus fountains, and over 300 tree species in Delhi's premier heritage garden."
                    }
                ],
                "festivals": ["Jahan-e-Khusrau Sufi Music Festival", "Dilli Haat Crafts Mela"],
                "morning": "08:30 AM: Visit Qutub Minar early to photograph the calligraphic fluting and ancient rustless iron pillar.",
                "midday": "11:30 AM: Explore Mehrauli Archaeological Park, Jamali Kamali Mosque, and Rajon ki Baoli stepwell.",
                "lunch": "01:30 PM: Contemporary South Indian feast at Carnatic Cafe (Greater Kailash) or Fabcafe by the lake.",
                "twilight": "04:00 PM: Sunset walk through Humayun's Tomb gardens and Sunder Nursery.",
                "curator_note": "A night ticket is available at Qutub Minar for viewing the illuminated tower until 09:00 PM.",
                "hotels": [
                    {
                        "name": "The Lodhi, New Delhi",
                        "hotel_type": "Urban Luxury Resort with Private Plunge Pools",
                        "price_tier": "₹22,000 - ₹40,000 / night",
                        "rating": 4.9,
                        "distance": "Lodhi Road, 1.2 km from Humayun's Tomb",
                        "highlights": ["Private balcony plunge pools", "Overlooks Delhi Golf Club and tombs", "Acclaimed Indian Accent dining"],
                        "booking_advice": "One of Delhi's most luxurious contemporary sanctuaries with views of Mughal heritage."
                    }
                ],
                "restaurants": [
                    {
                        "name": "Carnatic Cafe (Greater Kailash 2 / Lodhi Colony)",
                        "cuisine": "Authentic Karnataka Tiffin & Dosas",
                        "must_try": ["Malleshwaram 18th Cross Dosa (Thick, crisp, coated with spicy gunpowder & white butter)", "Rava Idli", "Mysore Pak"],
                        "price_for_two": "₹450 - ₹700",
                        "timing": "09:00 AM – 10:30 PM",
                        "dietary": "Pure Vegetarian",
                        "curator_note": "Regarded as the finest boutique dosa haven in Delhi; the ghee podi crust is unmatched."
                    }
                ],
                "markets": [
                    {
                        "name": "Dilli Haat (INA Market)",
                        "market_type": "National Crafts Emporium & Food Court",
                        "famous_for": ["Rotating artisan stalls from all 28 Indian States", "Pashmina shawls, Madhubani paintings, tribal brass art", "Authentic regional food stalls (Momos, Wazwan, Litti Chokha)"],
                        "best_time": "11:00 AM – 09:00 PM",
                        "location_area": "Opposite INA Market, Sri Aurobindo Marg",
                        "bargaining_and_visiting_tips": "Artisans rotate every 15 days; prices are regulated and artists sell directly without middlemen."
                    }
                ]
            }
        ]
    }

    # -------------------------------------------------------------
    # 6. VARANASI (Kashi)
    # -------------------------------------------------------------
    data["varanasi"] = {
        "title": "Sacred Kashi & Sarnath Heritage Itinerary",
        "subtitle": "Living Ganga Ghats, Vedic Chants, Buddhist Roots & Royal Weavers",
        "region": "Northern India",
        "recommended_season": "October – March (Crisp mornings, gentle winter sunlight)",
        "circuit_distance": "60 km local pilgrimage & cultural circuit",
        "total_travel_time": "Low travel fatigue / Heritage e-rickshaws & wooden rowboats",
        "transit_mode": "Silent wooden morning rowboats & licensed electric heritage rickshaws",
        "curator_field_protocol": [
            "Respect cremation rites at Manikarnika and Harishchandra Ghats; photography is strictly forbidden near burning pyres.",
            "Wear comfortable slip-on sandals; Old Kashi alleyways (galis) are pedestrian-only.",
            "Early morning dawn boat ride (05:30 AM) is essential to witness spiritual rituals at Assi and Dashashwamedh Ghats.",
            "Purchase pure silk directly from master weaver societies in Madanpura and Peeli Kothi."
        ],
        "days": [
            {
                "day_number": 1,
                "city": "Varanasi (Old Kashi)",
                "route_title": "Assi Ghat → Kashi Vishwanath Corridor → Dashashwamedh Ghat",
                "dist_time": "8 km • Boat and Walking Heritage Trail",
                "theme": "Sacred Riverfronts, Ganga Aarti & Jyotirlinga Sanctum",
                "monuments": [
                    {
                        "name": "Kashi Vishwanath Temple & Vishwanath Corridor",
                        "city": "Varanasi",
                        "state": "Uttar Pradesh",
                        "category": "Sacred Jyotirlinga & Grand River Corridor",
                        "period": "Ancient Vedic foundation; rebuilt 1780 CE (Ahilyabai Holkar); Corridor 2021",
                        "description": "The spiritual core of India dedicated to Lord Shiva as Vishveshwara, crowned by two gold-plated spires donated by Maharaja Ranjit Singh.",
                        "timings": "03:00 AM – 11:00 PM Daily (Multiple Aartis)",
                        "entry_fee": "Free General Darshan | ₹300 Sugam Darshan Pass",
                        "visit_duration": "2 Hours",
                        "image_url": "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000&auto=format&fit=crop&q=80",
                        "lat": 25.3109, "lng": 83.0107
                    },
                    {
                        "name": "Dashashwamedh & Manikarnika Ghats",
                        "city": "Varanasi",
                        "state": "Uttar Pradesh",
                        "category": "Ancient Living Riverfront Ghats",
                        "period": "Timeless Vedic Era; stone steps rebuilt by Marathas in 1740 CE",
                        "description": "Varanasi's most famous ghats where dawn rituals and evening Maha Ganga Aarti take place against centuries-old stone riverfront palaces.",
                        "timings": "Open 24 Hours; Ganga Aarti at 06:45 PM Daily",
                        "entry_fee": "Free Entry",
                        "visit_duration": "2.5 Hours",
                        "image_url": "/hero/monument-8.jpg",
                        "lat": 25.3075, "lng": 83.0103
                    }
                ],
                "experiences": [
                    {
                        "name": "Dawn Wooden Rowboat Ride on the Sacred Ganga",
                        "category": "Living Spiritual Immersion",
                        "desc": "Gliding from Assi to Manikarnika Ghat as sunrise bathes the terracotta stone palaces in golden illumination while temple bells resound."
                    }
                ],
                "festivals": ["Dev Deepawali (Kartik Purnima)", "Maha Shivaratri", "Ganga Mahotsav"],
                "morning": "05:30 AM: Dawn private wooden rowboat from Assi Ghat to Manikarnika Ghat witnessing Subah-e-Banaras rituals.",
                "midday": "11:00 AM: Sugam Darshan at Kashi Vishwanath Temple and walking through the newly restored riverfront corridor.",
                "lunch": "01:30 PM: Authentic Kachori Sabzi and warm Jalebis at historic Ram Bhandar in Thatheri Bazaar.",
                "twilight": "06:15 PM: Secured wooden boat seat to witness the grand synchronized 7-priest Maha Ganga Aarti at Dashashwamedh Ghat.",
                "curator_note": "Mobile phones and leather items are prohibited inside Kashi Vishwanath; leave them at your hotel or official locker booths.",
                "hotels": [
                    {
                        "name": "BrijRama Palace Varanasi - Heritage Grand",
                        "hotel_type": "18th-Century Maratha Palace on the Ghats",
                        "price_tier": "₹16,000 - ₹28,000 / night",
                        "rating": 4.9,
                        "distance": "Directly on Darbhanga Ghat (Water access)",
                        "highlights": ["Private bajra boat transfers", "Classical sitar morning performances", "Authentic pure veg palace cuisine"],
                        "booking_advice": "One of India's finest riverfront palace stays with private boat check-in."
                    }
                ],
                "restaurants": [
                    {
                        "name": "Kashi Chat Bhandar (Godowlia Chowk)",
                        "cuisine": "Iconic Banarasi Street Chaat",
                        "must_try": ["Tamatar Chaat (Warm spiced tomato mash with crisp namakpare)", "Palak Patta Chaat", "Gulab Jamun"],
                        "price_for_two": "₹150 - ₹250",
                        "timing": "03:00 PM – 10:30 PM",
                        "dietary": "Pure Vegetarian",
                        "curator_note": "The original inventor of Banarasi Tamatar Chaat; always crowded, always sensational."
                    }
                ],
                "markets": [
                    {
                        "name": "Thatheri Bazaar & Vishwanath Gali",
                        "market_type": "Historic Metal Craft & Banarasi Silk Alley",
                        "famous_for": ["Hand-beaten brass and copper utensils", "Varanasi wooden lacquer toys", "Banarasi silk dupattas and stoles"],
                        "best_time": "11:00 AM – 08:00 PM",
                        "location_area": "Between Godowlia and Vishwanath Temple",
                        "bargaining_and_visiting_tips": "Explore narrow alleys with a local guide; verify pure silk purity with the Silk Mark hologram."
                    }
                ]
            }
        ]
    }

    # -------------------------------------------------------------
    # 7. JAIPUR (Rajasthan)
    # -------------------------------------------------------------
    data["jaipur"] = {
        "title": "Royal Rajputana Citadels & Pink City Heritage",
        "subtitle": "Colossal Hill Fortresses, Sheesh Mahal Miracles & Royal Bazaars",
        "region": "Western India",
        "recommended_season": "October – March (Pleasant sunny days, crisp desert evenings)",
        "circuit_distance": "45 km heritage precinct circuit",
        "total_travel_time": "Low travel fatigue / Dedicated heritage cab or auto",
        "transit_mode": "Private chauffeur air-conditioned cab & heritage e-rickshaws in Old City",
        "curator_field_protocol": [
            "Amber Fort is expansive with cobble inclines; wear sturdy walking shoes with rubber grip.",
            "Hire government-certified Department of Tourism guides carrying official photo IDs.",
            "Johari and Bapu Bazaars are pedestrian-dense; bargaining by 25-30% is customary in unpriced handicraft stalls.",
            "Buy Jaipur Blue Pottery and Sanganer block prints directly from verified artisan cooperatives."
        ],
        "days": [
            {
                "day_number": 1,
                "city": "Jaipur (Amer & Fortresses)",
                "route_title": "Pink City Gates → Amber Citadel → Jaigarh Fort",
                "dist_time": "14 km • 35 mins via Amer Road",
                "theme": "Rajput Imperial Citadels & Mirror Palace Splendor",
                "monuments": [
                    {
                        "name": "Amber Fort & Palace (UNESCO Hill Fort)",
                        "city": "Jaipur",
                        "state": "Rajasthan",
                        "category": "UNESCO World Heritage Hill Fort",
                        "period": "1592 CE (Raja Man Singh I)",
                        "description": "Perched dramatically above Maota Lake, this yellow-sandstone fortress contains the Sheesh Mahal (Mirror Palace) where thousands of convex mirrors reflect candlelight into starry constellations.",
                        "timings": "08:00 AM – 05:30 PM & Night Tourism (06:30 – 09:15 PM)",
                        "entry_fee": "₹100 (Indians) | ₹500 (Foreigners)",
                        "visit_duration": "3 Hours",
                        "image_url": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000&auto=format&fit=crop&q=80",
                        "lat": 26.9855, "lng": 75.8513
                    }
                ],
                "experiences": [
                    {
                        "name": "Evening Sunset from Nahargarh Fort Ramparts",
                        "category": "Panoramic Heritage Sunset",
                        "desc": "Witness the entire Pink City glowing in dusk twilight from the high battlements of Nahargarh Fort with cool Aravalli mountain breezes."
                    }
                ],
                "festivals": ["Jaipur Literature Festival (January)", "Teej Festival (July-August)", "Gangaur Festival"],
                "morning": "08:00 AM: Early morning climb to Amber Fort before tour groups arrive, exploring Diwan-e-Aam and Sheesh Mahal.",
                "midday": "11:30 AM: Marvel at the geometric stair patterns of Panna Meena ka Kund and visit Anokhi Museum of Hand Printing.",
                "lunch": "01:30 PM: Authentic Dal Baati Churma with garlic chutney at 1135 AD inside Amber Fort.",
                "twilight": "05:00 PM: Sunset tea overlooking the panoramic city skyline from the ramparts of Nahargarh Fort.",
                "curator_note": "Amber Fort has evening sound and light shows in Hindi and English echoing across Maota Lake at 07:30 PM.",
                "hotels": [
                    {
                        "name": "Samode Haveli, Jaipur",
                        "hotel_type": "Restored 175-Year-Old Noble Haveli",
                        "price_tier": "₹12,000 - ₹22,000 / night",
                        "rating": 4.8,
                        "distance": "Old City, Gangapole (Near Hawa Mahal)",
                        "highlights": ["Hand-painted fresco suites", "Historic courtyard swimming pool", "Royal Rajput dining"],
                        "booking_advice": "A jewel of authentic Marwar haveli architecture tucked inside the Old City ramparts."
                    }
                ],
                "restaurants": [
                    {
                        "name": "Laxmi Mishthan Bhandar (LMB, Johari Bazaar)",
                        "cuisine": "Royal Rajasthani Vegetarian & Sweets",
                        "must_try": ["Rajasthani Royal Thali (Dal Baati Churma, Gatte ki Sabzi, Ker Sangri)", "Panner Ghevar", "Crispy Pyaaz Kachori"],
                        "price_for_two": "₹700 - ₹1,200",
                        "timing": "08:00 AM – 10:30 PM",
                        "dietary": "Pure Vegetarian",
                        "curator_note": "A heritage culinary pillar operating since 1727 in the heart of the Pink City bazaar."
                    }
                ],
                "markets": [
                    {
                        "name": "Johari Bazaar & Tripolia Bazaar",
                        "market_type": "Historic Royal Gem & Lac Jewelry Market",
                        "famous_for": ["Kundan and Meenakari enamel jewelry", "Jaipuri quilts (Razai)", "Handmade lac bangles"],
                        "best_time": "11:00 AM – 08:00 PM",
                        "location_area": "Pink City Walled Enclave",
                        "bargaining_and_visiting_tips": "Walk down Maniharon ka Rasta to watch craftsmen heat and shape raw lac resin over coals into vivid bangles."
                    }
                ]
            }
        ]
    }

    # -------------------------------------------------------------
    # 8. MYSORE (Karnataka)
    # -------------------------------------------------------------
    data["mysore"] = {
        "title": "Royal Heritage of the Wadiyars & Sandalwood City",
        "subtitle": "Mysore Palace Illumination, Chamundi Hill & Devaraja Market",
        "region": "Southern India",
        "recommended_season": "September – March (Mild pleasant plateau weather; spectacular during Dasara)",
        "circuit_distance": "35 km city heritage circuit",
        "total_travel_time": "Low travel fatigue / Clean wide avenues",
        "transit_mode": "Auto-rickshaws, city heritage cabs, or hop-on electric buggies",
        "curator_field_protocol": [
            "Mysore Palace illumination occurs on Sundays and public holidays from 07:00 PM to 07:45 PM.",
            "Footwear must be removed before entering the palace interior galleries; free counters provided.",
            "Visit Devaraja Market in the late afternoon when fresh flower garlands and traditional incense mounds are arranged.",
            "Purchase Mysore Silk directly from Karnataka Silk Industries Corporation (KSIC) showrooms with pure gold zari guarantee."
        ],
        "days": [
            {
                "day_number": 1,
                "city": "Mysore (Amba Vilas & Markets)",
                "route_title": "Mysore Palace → Chamundi Hill → Devaraja Heritage Market",
                "dist_time": "18 km • Heritage urban drive",
                "theme": "Wadiyar Royal Splendour & Fragrant Sandalwood Bazaars",
                "monuments": [
                    {
                        "name": "Mysore Palace (Amba Vilas Palace)",
                        "city": "Mysore",
                        "state": "Karnataka",
                        "category": "Indo-Saracenic Royal Palace",
                        "period": "1897–1912 CE (Lord Henry Irwin / Wadiyar Dynasty)",
                        "description": "One of India's most visited royal palaces featuring stained-glass ceilings, carved rosewood doorways, the Golden Royal Throne (Chinnada Simhasana), and illumination by 97,000 electric bulbs.",
                        "timings": "10:00 AM – 05:30 PM Daily; Sound & Light Show 07:00 PM",
                        "entry_fee": "₹100 (Indians) | ₹300 (Foreigners)",
                        "visit_duration": "2.5 Hours",
                        "image_url": "/hero/monument-5.jpg",
                        "lat": 12.3052, "lng": 76.6552
                    },
                    {
                        "name": "Chamundeshwari Temple & Monolithic Nandi",
                        "city": "Mysore",
                        "state": "Karnataka",
                        "category": "Sacred Hilltop Shrine",
                        "period": "12th Century CE (Hoysalas) & 17th Century (Wadiyars)",
                        "description": "Perched atop the 1,000-meter Chamundi Hill, dedicated to Goddess Durga slaying the demon Mahishasura, featuring a colossal 5-meter monolithic Nandi bull carved in 1659 CE.",
                        "timings": "07:30 AM – 02:00 PM, 03:30 PM – 06:00 PM, 07:30 PM – 09:00 PM",
                        "entry_fee": "Free Entry | ₹100 Special Darshan",
                        "visit_duration": "1.5 Hours",
                        "image_url": "/hero/monument-5.jpg",
                        "lat": 12.2725, "lng": 76.6710
                    }
                ],
                "experiences": [
                    {
                        "name": "Devaraja Market Scent & Flower Heritage Walk",
                        "category": "Living Sensory Heritage",
                        "desc": "Walk through 130-year-old wooden rafters filled with mounds of fragrant red vermilion (Kumkum), jasmine strings, and pure Mysore sandalwood oil."
                    }
                ],
                "festivals": ["Mysore Dasara (10-Day Grand Festival in October)", "Chamundi Hill Rathotsava"],
                "morning": "08:00 AM: Drive up Chamundi Hill for morning darshan and panoramic views over Mysore city.",
                "midday": "11:00 AM: Guided tour through the stained-glass Kalyana Mandapa and durbar halls of Mysore Palace.",
                "lunch": "01:30 PM: Authentic Mysore Pak and crispy butter Mysore Masala Dosa at Hotel Mylari.",
                "twilight": "05:00 PM: Immersion into Devaraja Market; Sunday evening palace illumination at 07:00 PM.",
                "curator_note": "Try to visit on a Sunday evening to witness all 97,000 golden bulbs illuminating Mysore Palace simultaneously against the night sky.",
                "hotels": [
                    {
                        "name": "Lalitha Mahal Palace Hotel, Mysore",
                        "hotel_type": "1921 CE Royal Italian Renaissance Palace",
                        "price_tier": "₹7,500 - ₹14,000 / night",
                        "rating": 4.6,
                        "distance": "At the foot of Chamundi Hills",
                        "highlights": ["Designed by E.W. Fritchley modeled on St. Paul's Cathedral", "Spherical Italian marble staircase", "Royal ballroom dining"],
                        "booking_advice": "Built originally to host the Viceroy of India; spacious royal suites with panoramic hill views."
                    }
                ],
                "restaurants": [
                    {
                        "name": "Original Vinayaka Mylari (Nazarbad)",
                        "cuisine": "Legendary Heritage Mysore Dosa",
                        "must_try": ["Mylari Special Butter Dosa (Cloud-soft with sagu stuffing & freshly churned white butter)", "Filter Coffee"],
                        "price_for_two": "₹150 - ₹250",
                        "timing": "06:30 AM – 01:30 PM, 03:00 PM – 08:30 PM",
                        "dietary": "Pure Vegetarian",
                        "curator_note": "A tiny, unpretentious hole-in-the-wall operating for over 80 years; the texture of the dosa is legendary."
                    }
                ],
                "markets": [
                    {
                        "name": "Devaraja Market & Sayyaji Rao Road",
                        "market_type": "130-Year-Old Historic Municipal Market",
                        "famous_for": ["GI-Tagged Mysore Silk Sarees (KSIC Showroom)", "Pure Mysore Sandalwood carvings & incense", "Traditional wooden lacquer toys from Channapatna"],
                        "best_time": "04:00 PM – 08:30 PM",
                        "location_area": "Sayyaji Rao Road, Central Mysore",
                        "bargaining_and_visiting_tips": "Only buy Mysore Sandalwood and Silk from government KSIC outlets to guarantee genuine quality."
                    }
                ]
            }
        ]
    }

    # Save to JSON
    with open("scripts/itinerary_data.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Successfully expanded scripts/itinerary_data.json to {len(data)} master destination hubs!")

if __name__ == "__main__":
    expand_all()
