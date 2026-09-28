"""
Builds scripts/itinerary_data.json containing deep, verified cultural dossiers
for top Indian heritage cities and circuits with real hotels, restaurants, and markets.
"""

import json

def build_data():
    data = {}
    
    # ---------------------------------------------------------
    # 1. TAMIL NADU (Circuit)
    # ---------------------------------------------------------
    data["tamil nadu"] = {
        "title": "Sacred Tamil Country & Chola Dynastic Trail",
        "subtitle": "Monolithic Shore Shrines, Granite Gopurams & Master Weaving Guilds",
        "region": "Southern India",
        "recommended_season": "October – March (Mild coastal breezes & pleasant winters)",
        "circuit_distance": "520 km total circuit",
        "total_travel_time": "10.5 hrs travel / Vande Bharat Express",
        "transit_mode": "Chennai-Tirunelveli Vande Bharat Express & Private AC Chauffeur Cab",
        "curator_field_protocol": [
            "Modest attire covering shoulders and knees is strictly observed inside active temple sanctums.",
            "Footwear must be kept at designated temple Chappal stands outside the gopurams.",
            "Photography is permitted in outdoor prakarams and courtyards, but prohibited inside inner sanctum sanctorums.",
            "Purchase silk handlooms directly from Co-optex or registered weaver cooperatives in Kanchipuram."
        ],
        "days": [
            {
                "day_number": 1,
                "city": "Mahabalipuram (Mamallapuram)",
                "route_title": "Chennai Coastal Drive → Mahabalipuram Ocean Monoliths",
                "dist_time": "56 km • 1.5 hrs along East Coast Road (ECR)",
                "theme": "Pallava Monolithic Sculptures & Coastal Granite Marvels",
                "monuments": [
                    {
                        "name": "Shore Temple (UNESCO World Heritage)",
                        "city": "Mahabalipuram",
                        "state": "Tamil Nadu",
                        "category": "UNESCO World Heritage Site",
                        "period": "700–728 CE (Pallava King Rajasimha)",
                        "description": "Standing sentinel over the Bay of Bengal, this twin-towered Dravidian structural stone temple was hand-carved from local granite blocks.",
                        "timings": "06:00 AM – 06:00 PM Daily",
                        "entry_fee": "₹40 (Indians) | ₹600 (Foreigners)",
                        "visit_duration": "2 Hours (Best at Sunrise)",
                        "image_url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80",
                        "lat": 12.6163, "lng": 80.1989
                    },
                    {
                        "name": "Pancha Rathas (Five Chariots) & Arjuna's Penance",
                        "city": "Mahabalipuram",
                        "state": "Tamil Nadu",
                        "category": "Monolithic Rock-Cut Architecture",
                        "period": "7th Century CE (Pallava King Narasimhavarman I)",
                        "description": "Five monolithic rock-cut shrines carved out of single granite boulders, alongside the world's largest open-air rock relief depicting Arjuna's Penance.",
                        "timings": "06:00 AM – 06:00 PM Daily",
                        "entry_fee": "Included with Shore Temple Ticket",
                        "visit_duration": "1.5 Hours",
                        "image_url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80",
                        "lat": 12.6120, "lng": 80.1930
                    }
                ],
                "experiences": [
                    {
                        "name": "Mahabalipuram Stone Sculptors Artisan Workshop",
                        "category": "Living Craft Heritage",
                        "desc": "Observe hereditary stone carvers using chisel and mallet to sculpt granite and soapstone idols following Shilpa Shastras."
                    }
                ],
                "festivals": ["Mamallapuram Indian Dance Festival (Jan-Feb)", "Pongal Harvest Festival (January)"],
                "morning": "07:30 AM: Dawn arrival at Shore Temple to witness golden ocean sunrise over Pallava granite towers.",
                "midday": "11:30 AM: Explore the monolithic Pancha Rathas and Arjuna's Penance bas-relief.",
                "lunch": "01:30 PM: Fresh coastal catch and authentic Tamil meals at Moonrakers or Seashore Restaurant.",
                "twilight": "05:30 PM: Stroll through artisan stone sculpting ateliers along Five Rathas Road and sunset by the lighthouse.",
                "curator_note": "Early morning (before 08:30 AM) is essential to avoid tour buses and capture soft coastal morning light on the stone relief.",
                "hotels": [
                    {
                        "name": "Radisson Blu Resort Temple Bay",
                        "hotel_type": "Oceanfront Heritage Luxury Resort",
                        "price_tier": "₹7,500 - ₹12,000 / night",
                        "rating": 4.7,
                        "distance": "500m from Shore Temple",
                        "highlights": ["Sea-facing chalets", "Ayurvedic wellness center", "Pool overlooking Bay of Bengal"],
                        "booking_advice": "Request sea-view chalets overlooking the Bay of Bengal."
                    },
                    {
                        "name": "Grande Bay Resort & Spa Mamallapuram",
                        "hotel_type": "Boutique Coastal Retreat",
                        "price_tier": "₹4,200 - ₹6,500 / night",
                        "rating": 4.5,
                        "distance": "1.2 km from Pancha Rathas",
                        "highlights": ["Spacious garden villas", "Traditional South Indian breakfast buffet", "Travel desk for heritage tours"],
                        "booking_advice": "Ideal for families; offers quiet courtyard gardens."
                    }
                ],
                "restaurants": [
                    {
                        "name": "Moonrakers Restaurant",
                        "cuisine": "Fresh Coastal Seafood & Chettinad Curries",
                        "must_try": ["Tiger Prawn Masala", "Vanjaram Fish Fry", "Steaming Basmati Rice with Crab Curry"],
                        "price_for_two": "₹800 - ₹1,200",
                        "timing": "11:30 AM – 10:30 PM",
                        "dietary": "Non-Veg & Vegetarian Options",
                        "curator_note": "A legendary beach-town institution popular among heritage travelers since the 1980s."
                    },
                    {
                        "name": "Geetha Cafe (Traditional Pure Veg)",
                        "cuisine": "Traditional Tamil Vegetarian Tiffin & Meals",
                        "must_try": ["Crispy Ghee Podi Dosa", "Filter Coffee in Brass Davarah", "Mini Tiffin Thali"],
                        "price_for_two": "₹250 - ₹400",
                        "timing": "07:00 AM – 09:30 PM",
                        "dietary": "Pure Vegetarian",
                        "curator_note": "Fast, spotlessly clean, and serves authentic Kumbakonam degree filter coffee."
                    }
                ],
                "markets": [
                    {
                        "name": "Five Rathas Stone Carver Colony",
                        "market_type": "Artisan Craft & Sculpture Guild",
                        "famous_for": ["Granite Ganesha and Shiva sculptures", "Soapstone miniature carvings", "Seashell handicrafts"],
                        "best_time": "04:00 PM – 07:00 PM",
                        "location_area": "Five Rathas Road & Kovalam Road",
                        "bargaining_and_visiting_tips": "Ask for the artist's certificate of origin; reputable workshops ship worldwide with wooden crating."
                    }
                ]
            },
            {
                "day_number": 2,
                "city": "Kanchipuram (The City of Thousand Temples)",
                "route_title": "Mahabalipuram → Kanchipuram Temple & Silk Capital",
                "dist_time": "68 km • 1.8 hrs via State Highway 58",
                "theme": "Sacred Dravidian Gopurams & Master Mulberry Silk Weaving",
                "monuments": [
                    {
                        "name": "Ekambareswarar Temple (Earth Stalam)",
                        "city": "Kanchipuram",
                        "state": "Tamil Nadu",
                        "category": "Pancha Bhoota Stalam (Prithvi / Earth)",
                        "period": "600 CE (Pallavas) & 1509 CE (Krishnadevaraya)",
                        "description": "One of South India's largest temple compounds covering 25 acres, featuring a soaring 59-meter Raja Gopuram built by Krishnadevaraya.",
                        "timings": "06:00 AM – 12:30 PM, 04:00 PM – 08:30 PM",
                        "entry_fee": "Free Entry | ₹20 Special Darshan",
                        "visit_duration": "2 Hours",
                        "image_url": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1000&auto=format&fit=crop&q=80",
                        "lat": 12.8475, "lng": 79.6999
                    },
                    {
                        "name": "Kailasanathar Temple",
                        "city": "Kanchipuram",
                        "state": "Tamil Nadu",
                        "category": "ASI Protected Pallava Masterpiece",
                        "period": "685–705 CE (Rajasimha Pallava)",
                        "description": "The oldest surviving structural stone temple in Kanchipuram, renowned for its 58 miniature sandstone shrines and exquisite Somaskanda carvings.",
                        "timings": "06:00 AM – 12:00 PM, 04:00 PM – 07:30 PM",
                        "entry_fee": "Free Entry (ASI Protected)",
                        "visit_duration": "1.5 Hours",
                        "image_url": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1000&auto=format&fit=crop&q=80",
                        "lat": 12.8423, "lng": 79.6896
                    }
                ],
                "experiences": [
                    {
                        "name": "Pillayar Palayam Master Silk Weavers Guild",
                        "category": "GI-Tagged Handloom Immersion",
                        "desc": "Witness master weavers intertwining pure mulberry silk with genuine gold-plated silver zari on traditional pit looms."
                    }
                ],
                "festivals": ["Kanchi Brahmotsavam (May)", "Panguni Uthiram (March-April)"],
                "morning": "07:00 AM: Sacred morning darshan at Ekambareswarar Temple beneath the ancient 3,500-year-old sacred mango tree.",
                "midday": "11:00 AM: Architectural study of Kailasanathar Temple's sandstone friezes and Pallava inscriptions.",
                "lunch": "01:30 PM: Authentic South Indian plantain leaf lunch at Sri Krishna Vilas or Saravana Bhavan.",
                "twilight": "05:00 PM: Immersion into Kanchipuram Silk Weavers' Cooperative Society workshops at Pillayar Palayam.",
                "curator_note": "Most Kanchipuram temples close their inner sanctums between 12:30 PM and 04:00 PM. Schedule weaving workshops during midday hours.",
                "hotels": [
                    {
                        "name": "Regency Kanchipuram by GRT Hotels",
                        "hotel_type": "Heritage Business & Pilgrim Hotel",
                        "price_tier": "₹3,800 - ₹5,500 / night",
                        "rating": 4.6,
                        "distance": "1.5 km from Ekambareswarar Temple",
                        "highlights": ["Multi-cuisine restaurant 'Dakshin'", "Temple transfer concierge", "Well-appointed deluxe rooms"],
                        "booking_advice": "Book the Executive Temple View rooms on upper floors."
                    }
                ],
                "restaurants": [
                    {
                        "name": "Sri Krishna Vilas (Hotel Sri Rama)",
                        "cuisine": "Authentic Kanchipuram Vegetarian Gastronomy",
                        "must_try": ["Kanchipuram Idli (steamed in dried mandharai leaves with ginger & pepper)", "Ghee Podi Roast Dosa", "Sambar Vada"],
                        "price_for_two": "₹250 - ₹450",
                        "timing": "06:30 AM – 10:00 PM",
                        "dietary": "Pure Vegetarian",
                        "curator_note": "The original birthplace of authentic Kanchipuram spice idli with dried ginger and cumin."
                    }
                ],
                "markets": [
                    {
                        "name": "Kanchipuram Murugan Silk Handloom Cooperative Society",
                        "market_type": "Government-Certified Silk Society",
                        "famous_for": ["GI-Tagged 100% Pure Mulberry Silk Sarees", "Korvai Border Technique", "Pure Gold Zari Bridal Weaves"],
                        "best_time": "10:30 AM – 01:30 PM, 04:30 PM – 07:30 PM",
                        "location_area": "Gandhi Road & Pillayar Palayam",
                        "bargaining_and_visiting_tips": "Avoid roadside touts who take commissions; buy exclusively from Co-optex or registered weavers' societies with Silk Mark."
                    }
                ]
            },
            {
                "day_number": 3,
                "city": "Thanjavur (Tanjore)",
                "route_title": "Kanchipuram → Thanjavur (Chola Imperial Capital)",
                "dist_time": "275 km • 4.8 hrs via NH36 / Vande Bharat",
                "theme": "The Great Living Chola Temples & Bronze Lost-Wax Guilds",
                "monuments": [
                    {
                        "name": "Brihadisvara Temple (Peruvudaiyar Kovil - UNESCO)",
                        "city": "Thanjavur",
                        "state": "Tamil Nadu",
                        "category": "UNESCO World Heritage Site",
                        "period": "1010 CE (Raja Raja Chola I)",
                        "description": "The crowning zenith of Chola imperial architecture, featuring a monolithic 80-tonne granite kumbam atop a 66-meter Vimana that casts no midday shadow.",
                        "timings": "06:00 AM – 12:30 PM, 04:00 PM – 08:30 PM",
                        "entry_fee": "Free Entry (ASI Protected)",
                        "visit_duration": "2.5 Hours",
                        "image_url": "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1000&auto=format&fit=crop&q=80",
                        "lat": 10.7828, "lng": 79.1318
                    }
                ],
                "experiences": [
                    {
                        "name": "Swamimalai Lost-Wax Chola Bronze Casting Enclave",
                        "category": "UNESCO Intangible Cultural Heritage",
                        "desc": "Witness sthapatis using 1,000-year-old beeswax formulations and alluvial Cauvery clay to cast exquisite panchaloha bronzes."
                    }
                ],
                "festivals": ["Chithirai Festival", "Raja Raja Chola Sathaya Vizha (October-November)"],
                "morning": "07:00 AM: Peaceful dawn circumambulation of Brihadisvara Temple courtyard admiring Chola fresco paintings.",
                "midday": "11:30 AM: Tour the Royal Palace complex, bell tower, and ancient palm-leaf scriptures at Saraswathi Mahal Library.",
                "lunch": "01:30 PM: Authentic Thanjavur banana leaf thali with Kaara Kuzhambu at Hotel Gnanam.",
                "twilight": "05:00 PM: Visit traditional Tanjore gold foil painting and Swamimalai bronze sculpting ateliers.",
                "curator_note": "Sunset illumination at the Big Temple (around 06:15 PM) turns the granite vimana into radiant molten gold.",
                "hotels": [
                    {
                        "name": "Svatma, Thanjavur - Heritage Luxury",
                        "hotel_type": "Restored Tamil Heritage Mansion",
                        "price_tier": "₹8,500 - ₹14,000 / night",
                        "rating": 4.8,
                        "distance": "2.2 km from Brihadisvara Temple",
                        "highlights": ["Classical Carnatic music soirees", "Arogya Ayurvedic Spa", "Organic heritage gastronomy"],
                        "booking_advice": "A true living museum stay celebrating Tamil music, bronze art, and architecture."
                    }
                ],
                "restaurants": [
                    {
                        "name": "Sathars Restaurant",
                        "cuisine": "Traditional Chettinad & Tamil Specialties",
                        "must_try": ["Chettinad Chicken Masala", "Mutton Sukka", "Flaky Parottas with Salna"],
                        "price_for_two": "₹500 - ₹800",
                        "timing": "11:00 AM – 10:30 PM",
                        "dietary": "Non-Veg & Veg",
                        "curator_note": "A beloved Thanjavur culinary landmark renowned for spicy South Indian gravies."
                    }
                ],
                "markets": [
                    {
                        "name": "South Rampart Art Plate & Painting Guild",
                        "market_type": "Artisan Craft Guild",
                        "famous_for": ["GI-Tagged Thanjavur Art Plates (Brass, Copper & Silver)", "Tanjore 22K Gold Foil Paintings", "Dancing Thanjavur Dolls (Thalayatti Bommai)"],
                        "best_time": "10:00 AM – 01:00 PM, 04:00 PM – 07:30 PM",
                        "location_area": "South Rampart Road & Near Palace Complex",
                        "bargaining_and_visiting_tips": "Always check for genuine 22-karat gold leaf certification on Tanjore paintings."
                    }
                ]
            },
            {
                "day_number": 4,
                "city": "Madurai",
                "route_title": "Thanjavur → Madurai Sacred Pandyan Capital",
                "dist_time": "190 km • 3.2 hrs via NH38",
                "theme": "Sacred Nayaka Architecture & Chithirai Cultural Heritage",
                "monuments": [
                    {
                        "name": "Arulmigu Meenakshi Sundareswarar Temple",
                        "city": "Madurai",
                        "state": "Tamil Nadu",
                        "category": "Ancient Living Spiritual Complex",
                        "period": "6th Century BCE foundation; 1623–1655 CE (Tirumala Nayaka)",
                        "description": "The epic spiritual heart of Tamil Nadu with 14 colossal gopurams encrusted with over 33,000 multi-hued sculptures, and the famous Hall of Thousand Pillars.",
                        "timings": "05:00 AM – 12:30 PM, 04:00 PM – 10:00 PM",
                        "entry_fee": "Free Entry | ₹50 (Hall of Thousand Pillars)",
                        "visit_duration": "3 Hours",
                        "image_url": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=1000&auto=format&fit=crop&q=80",
                        "lat": 9.9195, "lng": 78.1194
                    }
                ],
                "experiences": [
                    {
                        "name": "Night Bed-Chamber Ceremony (Palli Arai Pooja)",
                        "category": "Living Ancient Ritual",
                        "desc": "Witness the nightly 09:15 PM procession with silver chariot carrying Lord Sundareswarar to Goddess Meenakshi's sanctum."
                    }
                ],
                "festivals": ["Chithirai Celestial Wedding Festival (April-May)", "Jallikattu Heritage Celebration (January)"],
                "morning": "06:00 AM: Sacred morning darshan of Goddess Meenakshi amidst devotional nadaswaram melodies.",
                "midday": "11:30 AM: Explore the Thousand Pillar Hall and architectural museum inside the temple complex.",
                "lunch": "01:30 PM: World-famous fluffy idlis with four types of chutneys at Murugan Idli Shop.",
                "twilight": "05:00 PM: Visit Thirumalai Nayakkar Mahal, followed by evening brass bazaars at Pudhu Mandapam and a glass of famous Jigarthanda.",
                "curator_note": "Mobile phones are not permitted inside Meenakshi Temple; deposit them at the West Tower locker counter.",
                "hotels": [
                    {
                        "name": "Heritage Madurai Resort",
                        "hotel_type": "Geoffrey Bawa Architecture Heritage Resort",
                        "price_tier": "₹6,500 - ₹11,000 / night",
                        "rating": 4.7,
                        "distance": "4 km from Meenakshi Temple",
                        "highlights": ["Olympic-sized temple pool replica", "Traditional Mangalore tile villas", "Lush banyan groves"],
                        "booking_advice": "Designed by legendary architect Geoffrey Bawa with plunge-pool villas."
                    }
                ],
                "restaurants": [
                    {
                        "name": "Murugan Idli Shop (West Masi Street)",
                        "cuisine": "Legendary South Indian Tiffin",
                        "must_try": ["Melt-in-mouth Steaming Idlis", "Ghee Onion Podi Uthappam", "Four Varieties of Chutney & Milagai Podi"],
                        "price_for_two": "₹200 - ₹350",
                        "timing": "07:00 AM – 11:00 PM",
                        "dietary": "Pure Vegetarian",
                        "curator_note": "A Madurai gastronomic legend; the coriander and coconut chutneys are unmatched across India."
                    }
                ],
                "markets": [
                    {
                        "name": "Pudhu Mandapam Heritage 16th-Century Arcade",
                        "market_type": "Pillared Temple Arcade & Tailors Bazaar",
                        "famous_for": ["Instant custom tailor shops", "Brass temple lamps & puja vessels", "Madurai Sungudi hand-dyed cotton sarees"],
                        "best_time": "10:30 AM – 08:30 PM",
                        "location_area": "East Tower Gate of Meenakshi Temple",
                        "bargaining_and_visiting_tips": "Browse inside a 400-year-old stone hall; bargain politely for brass oil lamps (kuthu vilakku) and Sungudi tie-and-dye cottons."
                    }
                ]
            },
            {
                "day_number": 5,
                "city": "Rameswaram & Dhanushkodi",
                "route_title": "Madurai → Rameswaram Ocean Island & Ghost City",
                "dist_time": "175 km • 3.5 hrs via NH87 (Pamban Bridge)",
                "theme": "Sacred Ocean Pilgrimage & The Ram Setu Marine Frontier",
                "monuments": [
                    {
                        "name": "Arulmigu Ramanathaswamy Temple",
                        "city": "Rameswaram",
                        "state": "Tamil Nadu",
                        "category": "Char Dham & Jyotirlinga Sacred Sanctuary",
                        "period": "12th Century CE (Pandya & Setupati Dynasties)",
                        "description": "Houses the world's longest temple pillared corridor (1,220 meters) supported by 1,212 intricately sculpted granite pillars, and 22 sacred teertham wells.",
                        "timings": "05:00 AM – 01:00 PM, 03:00 PM – 09:00 PM",
                        "entry_fee": "Free Entry | ₹25 (22 Wells Bathing Pass)",
                        "visit_duration": "3 Hours",
                        "image_url": "https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?w=1000&auto=format&fit=crop&q=80",
                        "lat": 9.2881, "lng": 79.3174
                    }
                ],
                "experiences": [
                    {
                        "name": "Crossing the Historic Pamban Ocean Bridge",
                        "category": "Engineering & Maritime Heritage",
                        "desc": "Cross the 2-kilometer cantilever sea bridge spanning the turquoise Palk Strait connecting mainland India to Pamban Island."
                    }
                ],
                "festivals": ["Maha Shivaratri (Feb-March)", "Thirukalyanam Festival (July-August)"],
                "morning": "05:30 AM: Sacred ocean purification bath at Agni Theertham followed by darshan at Ramanathaswamy Temple's 1000-pillar corridor.",
                "midday": "11:00 AM: Bathing at the 22 sacred temple wells within the sanctum complex.",
                "lunch": "01:30 PM: Traditional South Indian vegetarian thali at Hotel Temple Tower.",
                "twilight": "03:30 PM: Drive to Dhanushkodi tip where two oceans meet, viewing the ruins of the railway station, church, and Ram Setu viewpoints.",
                "curator_note": "Carry dry clothes if planning to participate in the sacred 22 teertham wells ritual. Dhanushkodi winds are strong; carry eye protection.",
                "hotels": [
                    {
                        "name": "Daiwik Hotels Rameswaram",
                        "hotel_type": "Pilgrim Heritage Specialty Hotel",
                        "price_tier": "₹3,400 - ₹5,200 / night",
                        "rating": 4.5,
                        "distance": "3 km from Ramanathaswamy Temple",
                        "highlights": ["Dedicated pilgrim assistance desk", "Pure veg restaurant 'Ahaan'", "Ayurvedic massage center"],
                        "booking_advice": "Known for clean, comfortable pilgrim amenities and assistance with temple rituals."
                    }
                ],
                "restaurants": [
                    {
                        "name": "Ahaan Restaurant (Daiwik Hotels)",
                        "cuisine": "Pure Vegetarian Pan-Indian & South Indian",
                        "must_try": ["Temple Thali", "Chettinad Paneer Masala", "Curd Rice with Mango Pickle & Appalam"],
                        "price_for_two": "₹500 - ₹800",
                        "timing": "07:00 AM – 10:30 PM",
                        "dietary": "Pure Vegetarian",
                        "curator_note": "Hygienic, peaceful dining with pure satvik cooking guidelines."
                    }
                ],
                "markets": [
                    {
                        "name": "Temple Car Street & Agni Theertham Beach Market",
                        "market_type": "Pilgrim Craft & Marine Bazaar",
                        "famous_for": ["Natural Conch Shells (Shankha) & blown trumpets", "Palm leaf baskets and wall hangings", "Sacred Rudraksha malas and pearl ornaments"],
                        "best_time": "06:00 AM – 11:00 AM, 05:00 PM – 09:00 PM",
                        "location_area": "Car Street surrounding Ramanathaswamy Temple",
                        "bargaining_and_visiting_tips": "Conch shells can be customized with carved deity motifs on the spot; sound test before purchasing."
                    }
                ]
            }
        ]
    }
    
    # ---------------------------------------------------------
    # 2. AGRA & UTTAR PRADESH
    # ---------------------------------------------------------
    data["agra"] = {
        "title": "Imperial Mughal Marvels & Makrana Marble Heritage",
        "subtitle": "Taj Mahal Sunrise, Colossal Red Sandstone Citadels & Pietra Dura Artisans",
        "region": "Northern India",
        "recommended_season": "October – March (Crisp mornings, pleasant winter afternoons)",
        "circuit_distance": "35 km historic enclave circuit",
        "total_travel_time": "Low travel fatigue / Battery e-rickshaws & chauffeur car",
        "transit_mode": "Eco-friendly battery vehicles inside Taj Heritage Zone & private chauffeur car",
        "curator_field_protocol": [
            "Taj Mahal is strictly closed to visitors on Fridays.",
            "Enter through the East Gate at sunrise (06:00 AM) to experience the Makrana marble shifting from soft blush pink to brilliant pearl white.",
            "Only small hand purses, wallets, and mobile phones are permitted; tripods, power banks, and drones are strictly prohibited.",
            "Purchase marble pietra dura inlay crafts directly from verified cooperative artisan guilds recognized by the Ministry of Textiles."
        ],
        "days": [
            {
                "day_number": 1,
                "city": "Agra (Taj & Red Fort)",
                "route_title": "Taj East Gate Sunrise → Agra Fort Royal Citadel → Mehtab Bagh",
                "dist_time": "12 km • Short urban transit",
                "theme": "The Jewel of Indo-Islamic Architecture & Imperial Palaces",
                "monuments": [
                    {
                        "name": "Taj Mahal (Crown of the Palace - UNESCO)",
                        "city": "Agra",
                        "state": "Uttar Pradesh",
                        "category": "UNESCO World Heritage Wonder",
                        "period": "1631–1648 CE (Emperor Shah Jahan)",
                        "description": "The world's foremost architectural tribute to eternal love, sculpted from Makrana white marble with exquisite semi-precious stone Pietra Dura inlay and Persian formal gardens (Charbagh).",
                        "timings": "06:00 AM – 06:30 PM (Closed Fridays)",
                        "entry_fee": "₹50 (Indians) | ₹1,100 (Foreigners) + ₹200 Main Mausoleum",
                        "visit_duration": "3 Hours (Best at Sunrise)",
                        "image_url": "/hero/monument-1.jpg",
                        "lat": 27.1751, "lng": 78.0421
                    },
                    {
                        "name": "Agra Fort (Lal Qila - UNESCO)",
                        "city": "Agra",
                        "state": "Uttar Pradesh",
                        "category": "UNESCO World Heritage Fort Citadel",
                        "period": "1565–1573 CE (Emperor Akbar)",
                        "description": "Colossal red sandstone fortress spanning 94 acres along the Yamuna River, containing Jahangir Mahal, Khas Mahal, Diwan-i-Khas, and the octagonal Musamman Burj where Shah Jahan spent his final years.",
                        "timings": "06:00 AM – 06:00 PM Daily",
                        "entry_fee": "₹50 (Indians) | ₹650 (Foreigners)",
                        "visit_duration": "2.5 Hours",
                        "image_url": "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=1000&auto=format&fit=crop&q=80",
                        "lat": 27.1795, "lng": 78.0211
                    }
                ],
                "experiences": [
                    {
                        "name": "Mehtab Bagh (Moonlight Garden) Sunset River View",
                        "category": "Historic Sunset Viewpoint",
                        "desc": "Witness the reflection of the Taj Mahal in the calm waters of the Yamuna River at twilight from the northern pleasure gardens."
                    }
                ],
                "festivals": ["Taj Mahotsav (February at Shilpgram)", "Sharad Purnima Night Viewing"],
                "morning": "06:00 AM: Sunrise entry through the East Gate of Taj Mahal to witness morning light over the marble dome.",
                "midday": "11:00 AM: Guided walk through Agra Fort exploring Sheesh Mahal, Diwan-i-Aam, and Musamman Burj.",
                "lunch": "01:30 PM: Authentic Mughlai feast at Pinch of Spice or Dasaprakash.",
                "twilight": "05:00 PM: Sunset view of the Taj Mahal rear facade across the Yamuna from Mehtab Bagh gardens.",
                "curator_note": "Night viewing of the Taj Mahal is permitted on five nights each month (full moon and two nights before/after, except Fridays and Ramadan). Tickets must be booked 24 hours in advance at ASI Agra office.",
                "hotels": [
                    {
                        "name": "The Oberoi Amarvilas, Agra",
                        "hotel_type": "Ultra-Luxury Mughal Heritage Resort",
                        "price_tier": "₹35,000 - ₹65,000 / night",
                        "rating": 5.0,
                        "distance": "600m from Taj Mahal",
                        "highlights": ["Every room offers uninterrupted Taj Mahal views", "Private golf cart transfers to monument gate", "Palatial terraced pools and fountains"],
                        "booking_advice": "Widely acclaimed as one of the world's finest luxury hotels with direct private gate access."
                    },
                    {
                        "name": "ITC Mughal, A Luxury Collection Resort",
                        "hotel_type": "Aga Khan Award-Winning Heritage Resort",
                        "price_tier": "₹7,500 - ₹13,000 / night",
                        "rating": 4.7,
                        "distance": "3 km from Taj Mahal",
                        "highlights": ["35 acres of Mughal gardens", "Kaya Kalp Royal Spa", "Peshawri restaurant"],
                        "booking_advice": "Aga Khan Award for Architecture recipient; exquisite landscaping and traditional Mughlai dining."
                    }
                ],
                "restaurants": [
                    {
                        "name": "Peshawri at ITC Mughal",
                        "cuisine": "North-West Frontier Gastronomy",
                        "must_try": ["Dal Bukhara (simmered overnight over charcoal embers)", "Murgh Malai Kabab", "Sikandari Raan"],
                        "price_for_two": "₹2,500 - ₹4,000",
                        "timing": "12:30 PM – 02:45 PM, 07:00 PM – 11:30 PM",
                        "dietary": "Vegetarian & Non-Veg",
                        "curator_note": "Dine with traditional aprons in clay-tandoor rustic ambience; the Dal Bukhara is world-renowned."
                    },
                    {
                        "name": "Panchhi Petha Store (Sadar Bazaar)",
                        "cuisine": "Heritage Agra Sweet Speciality",
                        "must_try": ["Angoori Petha in Kesar Syrup", "Paan Petha", "Dry Kesar Petha"],
                        "price_for_two": "₹150 - ₹300",
                        "timing": "09:00 AM – 10:30 PM",
                        "dietary": "Pure Vegetarian",
                        "curator_note": "Operating since 1950; authentic ash-gourd translucent sweets crafted with pure saffron."
                    }
                ],
                "markets": [
                    {
                        "name": "Sadar Bazaar & Kinari Bazaar",
                        "market_type": "Historic Craft & Leather Bazaar",
                        "famous_for": ["Pietra Dura Marble Table Tops & Coasters", "Handmade leather mojari shoes", "Zari and Zardozi embroidery textiles"],
                        "best_time": "11:00 AM – 08:30 PM",
                        "location_area": "Agra Cantonment & Kinari Bazaar Old City",
                        "bargaining_and_visiting_tips": "Verify that white marble items use genuine Makrana marble and not soft soapstone or synthetic resin. Genuine semi-precious inlay stones (lapis lazuli, malachite, jasper) are cool to touch."
                    }
                ]
            },
            {
                "day_number": 2,
                "city": "Fatehpur Sikri & Itimad-ud-Daulah",
                "route_title": "Agra → Fatehpur Sikri Imperial Capital → Baby Taj",
                "dist_time": "38 km • 1 hr via NH21",
                "theme": "Akbar's Utopian City & The Jewel-Box Precursor to the Taj",
                "monuments": [
                    {
                        "name": "Fatehpur Sikri (UNESCO World Heritage Capital)",
                        "city": "Fatehpur Sikri",
                        "state": "Uttar Pradesh",
                        "category": "UNESCO World Heritage Imperial City",
                        "period": "1571–1585 CE (Emperor Akbar)",
                        "description": "Akbar's short-lived red sandstone capital featuring the 54-meter Buland Darwaza (Gate of Magnificence), Jama Masjid, White Marble Tomb of Sheikh Salim Chishti, and Panch Mahal.",
                        "timings": "Sunrise to Sunset Daily",
                        "entry_fee": "₹50 (Indians) | ₹610 (Foreigners)",
                        "visit_duration": "3 Hours",
                        "image_url": "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=1000&auto=format&fit=crop&q=80",
                        "lat": 27.0945, "lng": 77.6679
                    },
                    {
                        "name": "Tomb of Itimad-ud-Daulah (Baby Taj)",
                        "city": "Agra",
                        "state": "Uttar Pradesh",
                        "category": "ASI Protected Marble Masterpiece",
                        "period": "1622–1628 CE (Empress Nur Jahan)",
                        "description": "Often called the 'Jewel Box' or 'Baby Taj', this was the first Mughal structure built entirely of white marble with intricate floral pietra dura inlay, serving as the prototype for the Taj Mahal.",
                        "timings": "06:00 AM – 06:00 PM Daily",
                        "entry_fee": "₹30 (Indians) | ₹310 (Foreigners)",
                        "visit_duration": "1.5 Hours",
                        "image_url": "/hero/monument-1.jpg",
                        "lat": 27.1929, "lng": 78.0310
                    }
                ],
                "experiences": [
                    {
                        "name": "Marble Inlay Pietra Dura Master Craftsman Studio",
                        "category": "GI-Tagged Handicraft Immersion",
                        "desc": "Watch hereditary descendants of the Taj Mahal's original artisans cut, shape, and embed lapis lazuli and carnelian into Makrana marble."
                    }
                ],
                "festivals": ["Urs of Sheikh Salim Chishti", "Ganga-Jamuni Cultural Utsav"],
                "morning": "08:30 AM: Drive to Fatehpur Sikri; walk through Buland Darwaza and tie a red thread of wish-fulfillment at Salim Chishti's marble sanctum.",
                "midday": "12:00 PM: Explore the Diwan-i-Khas central carved pillar, Jodha Bai's Palace, and Anup Talao.",
                "lunch": "01:30 PM: Traditional lunch at a countryside garden restaurant near Sikri highway.",
                "twilight": "04:30 PM: Visit the serene riverside garden tomb of Itimad-ud-Daulah (Baby Taj) in golden afternoon light.",
                "curator_note": "At Fatehpur Sikri, take the official ASI green eco-bus from the outer parking lot to the monument gate (₹10 fare). Avoid unauthorized self-appointed guides outside the bus stand.",
                "hotels": [
                    {
                        "name": "Courtyard by Marriott Agra",
                        "hotel_type": "Modern Premium Hotel",
                        "price_tier": "₹5,200 - ₹8,500 / night",
                        "rating": 4.6,
                        "distance": "Taj Nagari Phase 2, Agra",
                        "highlights": ["Large outdoor pool", "Multiple dining venues", "Proximity to Fatehabad Road"],
                        "booking_advice": "Comfortable, spacious rooms with excellent buffet breakfast options."
                    }
                ],
                "restaurants": [
                    {
                        "name": "Pinch of Spice (Fatehabad Road)",
                        "cuisine": "Authentic North Indian & Awadhi Specialties",
                        "must_try": ["Murg Boti Masala", "Paneer Lababdar", "Garlic Butter Naan"],
                        "price_for_two": "₹900 - ₹1,400",
                        "timing": "12:00 PM – 11:30 PM",
                        "dietary": "Vegetarian & Non-Veg",
                        "curator_note": "Consistent quality and air-conditioned relief after outdoor monument excursions."
                    }
                ],
                "markets": [
                    {
                        "name": "Shilpgram Cultural Crafts Village",
                        "market_type": "Government Artisan Complex",
                        "famous_for": ["Pietra dura marble boxes & trays", "Fine carpet weaving", "Hand-embroidered Zari wall tapestries"],
                        "best_time": "10:30 AM – 07:30 PM",
                        "location_area": "Near East Gate of Taj Mahal",
                        "bargaining_and_visiting_tips": "Fixed price government-certified counters provide safe shipping and guaranteed authentic materials."
                    }
                ]
            }
        ]
    }
    
    # ---------------------------------------------------------
    # 3. HAMPI & KARNATAKA
    # ---------------------------------------------------------
    data["hampi"] = {
        "title": "Vijayanagara Imperial Ruins & Boulder Landscapes",
        "subtitle": "Monolithic Temples, The Stone Chariot, Royal Enclosures & Tungabhadra Ghats",
        "region": "Southern India",
        "recommended_season": "October – February (Pleasant winter weather, clear blue skies)",
        "circuit_distance": "30 km boulder & river heritage circuit",
        "total_travel_time": "Low travel fatigue / Bicycles, mopeds, or private auto-rickshaws",
        "transit_mode": "Eco-friendly battery buggies inside Vittala Complex, private auto or bicycle",
        "curator_field_protocol": [
            "Hampi is an extensive outdoor archaeological museum; carry plenty of drinking water, a wide-brim hat, and sunscreen.",
            "Wear sturdy walking shoes with non-slip rubber grip for walking on smooth granite boulders.",
            "Hire official ASI-licensed guides wearing photo identity cards at Virupaksha and Vittala complexes.",
            "The Tungabhadra river currents are treacherous; only ride official circular coracles (Dongis) with life jackets."
        ],
        "days": [
            {
                "day_number": 1,
                "city": "Hampi (Sacred & Royal Centers)",
                "route_title": "Virupaksha Temple → Hemakuta Hill → Vittala Stone Chariot",
                "dist_time": "8 km • Riverside walking and battery buggy trail",
                "theme": "Vijayanagara Golden Age Architecture & Musical Pillars",
                "monuments": [
                    {
                        "name": "Vittala Temple Complex & Stone Chariot (UNESCO)",
                        "city": "Hampi",
                        "state": "Karnataka",
                        "category": "UNESCO World Heritage Masterpiece",
                        "period": "15th Century CE (King Devaraya II) & 1513 CE (Krishnadevaraya)",
                        "description": "The pinnacle of Vijayanagara architectural art, holding the iconic monolithic Stone Chariot (Garuda Shrine) and the Ranga Mandapa with 56 musical pillars that emit musical notes when struck.",
                        "timings": "08:30 AM – 05:30 PM Daily",
                        "entry_fee": "₹40 (Indians) | ₹600 (Foreigners) [Covers Zenana Enclosure on same day]",
                        "visit_duration": "2.5 Hours",
                        "image_url": "https://images.unsplash.com/photo-1600100397608-f010f4438b9e?w=1000&auto=format&fit=crop&q=80",
                        "lat": 15.3350, "lng": 76.4795
                    },
                    {
                        "name": "Virupaksha Temple (Sacred Living Shrine)",
                        "city": "Hampi",
                        "state": "Karnataka",
                        "category": "Living Ancient Dravidian Temple",
                        "period": "7th Century CE foundation; 1510 CE (Krishnadevaraya)",
                        "description": "Continuous living worship for over 1,300 years dedicated to Lord Shiva as Virupaksha, crowned by an imposing 50-meter eastern gopuram and housing an ancient pinhole camera phenomenon.",
                        "timings": "06:00 AM – 01:00 PM, 05:00 PM – 09:00 PM",
                        "entry_fee": "₹25 Entry Pass",
                        "visit_duration": "2 Hours",
                        "image_url": "https://images.unsplash.com/photo-1600100397608-f010f4438b9e?w=1000&auto=format&fit=crop&q=80",
                        "lat": 15.3353, "lng": 76.4600
                    }
                ],
                "experiences": [
                    {
                        "name": "Sunset Boulders at Hemakuta Hill",
                        "category": "Panoramic Heritage Sunset",
                        "desc": "Witness the dramatic Vijayanagara ruins and granite monoliths bathed in fiery amber light with views of Virupaksha gopuram."
                    }
                ],
                "festivals": ["Hampi Utsav (November)", "Purandara Dasa Aradhana (Jan-Feb)"],
                "morning": "06:30 AM: Dawn arrival at Virupaksha Temple, witnessing morning pujas and the famous pinhole shadow inversion of the gopuram.",
                "midday": "11:00 AM: Explore the Monolithic Sasivekalu and Kadalekalu Ganesha statues on Hemakuta Hill.",
                "lunch": "01:30 PM: Authentic South Indian banana leaf thali at Mango Tree Restaurant.",
                "twilight": "04:00 PM: Electric buggy ride into the Vittala Temple Complex to witness sunset over the Stone Chariot.",
                "curator_note": "A single ticket purchased at Vittala Temple also grants same-day admission to the Zenana Enclosure (Lotus Mahal & Elephant Stables). Keep your digital or paper QR ticket handy.",
                "hotels": [
                    {
                        "name": "Evolve Back, Kamalapura Palace - Hampi",
                        "hotel_type": "Vijayanagara Royal Palace Luxury Resort",
                        "price_tier": "₹22,000 - ₹38,000 / night",
                        "rating": 4.9,
                        "distance": "4 km from Hampi UNESCO ruins",
                        "highlights": ["Palatial Vijayanagara stone arch architecture", "Private Jacuzzi and pool suites", "Deep historical storytelling sessions"],
                        "booking_advice": "A breathtaking palace resort recreating the splendour of 16th-century Vijayanagara kings."
                    },
                    {
                        "name": "Heritage Resort Hampi",
                        "hotel_type": "Eco-Heritage Nature Retreat",
                        "price_tier": "₹5,500 - ₹9,000 / night",
                        "rating": 4.6,
                        "distance": "6 km from Virupaksha Temple",
                        "highlights": ["Lush organic mango plantations", "Swimming pool surrounded by granite rocks", "Ayurvedic spa"],
                        "booking_advice": "Serene cottages set amidst lush organic gardens; ideal balance of comfort and proximity."
                    }
                ],
                "restaurants": [
                    {
                        "name": "Mango Tree Restaurant (Near Kamalapura)",
                        "cuisine": "South Indian Vegetarian & Healthy Traveler Food",
                        "must_try": ["Special Karnataka Thali (Jowar Roti, Yennegai Brinjal, Sambar)", "Nutty Banana Lassi", "Wood-fired Thin Crust Pizza"],
                        "price_for_two": "₹450 - ₹750",
                        "timing": "07:30 AM – 10:00 PM",
                        "dietary": "Pure Vegetarian & Vegan-Friendly",
                        "curator_note": "A legendary traveler hangout operating for decades with relaxed floor-cushion seating and scenic garden views."
                    }
                ],
                "markets": [
                    {
                        "name": "Hampi Old Bazaar Street & Kamalapura Crafts",
                        "market_type": "Heritage Handicraft Enclave",
                        "famous_for": ["Handmade Lambani Banjara mirror-work embroidery", "Stone carved miniature Nandi and Ganesha idols", "Bikaneri leather backpacks and handmade journals"],
                        "best_time": "10:00 AM – 07:00 PM",
                        "location_area": "Between Virupaksha Temple and Kamalapura Road",
                        "bargaining_and_visiting_tips": "Purchase authentic Lambani embroidery directly from the Sandur Kushala Kala Kendra cooperative to ensure fair wages to tribal women artisans."
                    }
                ]
            }
        ]
    }
    
    # ---------------------------------------------------------
    # 4. AMRITSAR (PUNJAB)
    # ---------------------------------------------------------
    data["amritsar"] = {
        "title": "Sacred Golden Sanctum & Brave Punjab Heritage",
        "subtitle": "Sri Harmandir Sahib, Living Langar, Jallianwala Bagh & Wagah Border",
        "region": "Northern India",
        "recommended_season": "October – March (Crisp winter sunshine & mustard fields in bloom)",
        "circuit_distance": "55 km heritage & border circuit",
        "total_travel_time": "Low travel fatigue / Heritage pedestrian zone & highway cab",
        "transit_mode": "Walkable heritage pedestrian street & private cab for Wagah Border",
        "curator_field_protocol": [
            "Heads must be covered at all times inside Sri Harmandir Sahib complex (scarves/rumals provided at entry).",
            "Shoes and socks must be deposited at free shoe counters (Joda Ghar), and feet washed in running water pools before entering.",
            "Photography is permitted in the outer Parikrama marble corridor, but strictly prohibited inside the Golden Sanctum and along the bridge.",
            "Wagah Border ceremony begins at 04:30 PM (winter) / 05:30 PM (summer); reach by 03:00 PM to secure seats."
        ],
        "days": [
            {
                "day_number": 1,
                "city": "Amritsar",
                "route_title": "Golden Temple Parikrama → Jallianwala Bagh → Wagah Border",
                "dist_time": "32 km • Pedestrian heritage walk & Attari border drive",
                "theme": "Spiritual Peace, Martyrdom Memory & Patriotic Beating Retreat",
                "monuments": [
                    {
                        "name": "Sri Harmandir Sahib (The Golden Temple)",
                        "city": "Amritsar",
                        "state": "Punjab",
                        "category": "Supreme Spiritual Sanctum of Sikhism",
                        "period": "1589 CE (Guru Arjan Dev Ji); gold plating 1830 CE (Maharaja Ranjit Singh)",
                        "description": "Gilded with over 500 kilograms of pure gold leaf atop an ambrosial nectar pool (Amrit Sarovar), welcoming all people regardless of faith, caste, or background through four open doors.",
                        "timings": "Open 24 Hours Daily (Palki Sahib ceremony 04:30 AM & 10:00 PM)",
                        "entry_fee": "Free Entry for All",
                        "visit_duration": "3 Hours",
                        "image_url": "/hero/monument-3.jpg",
                        "lat": 31.6200, "lng": 74.8765
                    },
                    {
                        "name": "Jallianwala Bagh National Memorial",
                        "city": "Amritsar",
                        "state": "Punjab",
                        "category": "National Freedom Struggle Memorial",
                        "period": "1919 Historic Site; Memorial dedicated 1961",
                        "description": "Sacred national memorial preserving bullet marks on brick walls and the historic Martyrs' Well from the tragic massacre of peaceful citizens on Baisakhi, 13 April 1919.",
                        "timings": "06:30 AM – 07:30 PM Daily",
                        "entry_fee": "Free Entry",
                        "visit_duration": "1 Hour",
                        "image_url": "/hero/monument-3.jpg",
                        "lat": 31.6207, "lng": 74.8801
                    }
                ],
                "experiences": [
                    {
                        "name": "Guru Ka Langar Community Kitchen Service (Sewa)",
                        "category": "Living Humanitarian Tradition",
                        "desc": "Participate in or share a meal at the world's largest community kitchen, feeding over 100,000 pilgrims every single day with love, equality, and dignity."
                    }
                ],
                "festivals": ["Baisakhi (April)", "Guru Nanak Jayanti (Gurpurab)", "Diwali / Bandi Chhor Divas"],
                "morning": "06:00 AM: Early morning Parikrama at the Golden Temple as Gurbani kirtan echoes over the tranquil Amrit Sarovar.",
                "midday": "11:00 AM: Visit Jallianwala Bagh and the interactive Partition Museum at Town Hall.",
                "lunch": "01:00 PM: Wholesome Guru Ka Langar or authentic butter-drenched Amritsari Kulchas at Kesar Da Dhaba.",
                "twilight": "03:30 PM: Drive to the Attari-Wagah Border to witness the electrifying sunset Beating Retreat ceremony.",
                "curator_note": "Bags and power banks are not permitted at the Wagah Border spectator gallery; leave them in your vehicle.",
                "hotels": [
                    {
                        "name": "Taj Swarna, Amritsar",
                        "hotel_type": "5-Star Luxury Hotel",
                        "price_tier": "₹7,200 - ₹12,500 / night",
                        "rating": 4.8,
                        "distance": "Majitha Road, 5 km from Golden Temple",
                        "highlights": ["Grand Jiva Spa", "Outdoor swimming pool", "Authentic Punjabi restaurant 'The Grand Trunk'"],
                        "booking_advice": "Finest luxury hotel in Amritsar with high-end comforts and dedicated temple transfers."
                    }
                ],
                "restaurants": [
                    {
                        "name": "Kesar Da Dhaba (Chowk Passian)",
                        "cuisine": "Legendary Heritage Punjabi Gastronomy",
                        "must_try": ["Maa Ki Dal (Slow-cooked for 12 hours with desi ghee)", "Crispy Lachha Paratha", "Gulab Jamun & Firni in earthen bowls"],
                        "price_for_two": "₹400 - ₹700",
                        "timing": "11:30 AM – 11:00 PM",
                        "dietary": "Pure Vegetarian (Cooked in pure desi ghee)",
                        "curator_note": "Operating continuously since 1916 (originally founded in Lahore); Lala Lajpat Rai and Indira Gandhi were frequent patrons."
                    },
                    {
                        "name": "Bhai Kulwant Singh Kulchian Wale (Heritage Street)",
                        "cuisine": "Iconic Crisp Amritsari Naan Kulcha",
                        "must_try": ["Amritsari Aloo Pyaaz Chur Chur Kulcha with Chole & Tamarind Onion Chutney", "Sweet Malai Lassi"],
                        "price_for_two": "₹180 - ₹300",
                        "timing": "08:00 AM – 04:00 PM",
                        "dietary": "Pure Vegetarian",
                        "curator_note": "Layered with multiple folds of dough and desi ghee, baked crisp in clay tandoors."
                    }
                ],
                "markets": [
                    {
                        "name": "Katra Jaimal Singh & Hall Bazaar",
                        "market_type": "Traditional Textile & Phulkari Guild",
                        "famous_for": ["GI-Tagged Hand-embroidered Phulkari dupattas and jackets", "Handmade Amritsari Juttis with gold tilla work", "Wadiyan and Punjabi spices (Papad-Wadian)"],
                        "best_time": "11:00 AM – 08:30 PM",
                        "location_area": "Hall Bazaar & Katra Jaimal Singh Market",
                        "bargaining_and_visiting_tips": "Look for dense hand-embroidery done on khaddar cotton (bagh style) rather than machine-printed imitations."
                    }
                ]
            }
        ]
    }

    # Save to JSON file
    with open("scripts/itinerary_data.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Generated scripts/itinerary_data.json with {len(data)} detailed dossiers!")

if __name__ == "__main__":
    build_data()
