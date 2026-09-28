# VIRASAT Indian Festivals Master Knowledge Database

## Executive Summary
The **VIRASAT Indian Festivals Master Knowledge Database** is India's most comprehensive, source-verified cultural repository powering both the VIRASAT web platform and the conversational AI Concierge. Containing **363 authentic festival records** spanning all **28 Indian States and 8 Union Territories** plus Pan-Indian multi-state faith observances, the database provides deep, actionable intelligence for cultural researchers, domestic travelers, and international tourists.

---

## 1. Scope & Geographic Coverage

| Region | States & Union Territories Covered | Verified Records |
| :--- | :--- | :--- |
| **Northern India** | Jammu & Kashmir, Ladakh, Himachal Pradesh, Punjab, Chandigarh, Haryana, Delhi, Uttarakhand, Uttar Pradesh | 82 records |
| **Western India** | Rajasthan, Gujarat, Goa, Dadra & Nagar Haveli and Daman & Diu, Maharashtra | 56 records |
| **Central India** | Madhya Pradesh, Chhattisgarh | 22 records |
| **Eastern India** | Bihar, Jharkhand, Odisha, West Bengal | 46 records |
| **Southern India** | Karnataka, Kerala, Tamil Nadu, Andhra Pradesh, Telangana, Puducherry, Lakshadweep | 70 records |
| **Northeastern India** | Assam, Arunachal Pradesh, Nagaland, Manipur, Meghalaya, Mizoram, Sikkim, Tripura | 68 records |
| **Islands & Pan-India** | Andaman and Nicobar Islands, Pan-India Multi-Faith Observances | 19 records |
| **Total** | **36 States & UTs (100% National Coverage)** | **363 Authentic Records** |

---

## 2. Core Classification Dimensions

### 2.1 Festival Categories
Every festival is indexed into one of five primary cultural categories:
1. **HARVEST_SEASONAL**: Agrarian cycles, seed sowing, crop reaping, equinoxes, solstices, and changing seasons (e.g., Makar Sankranti, Bohag Bihu, Onam, Pongal, Baisakhi, Chapchar Kut).
2. **RELIGIOUS_TEMPLE**: Sacred temple car festivals, Rath Yatras, Brahmotsavams, Utsavams, and divine venerations (e.g., Puri Rath Yatra, Kumbh Mela, Thrissur Pooram, Tirupati Brahmotsavam, Mahamaham).
3. **MUSIC_DANCE_ARTS**: Performing arts festivals, classical music and dance recitals, rock concerts, and artisan heritage fairs (e.g., Khajuraho Dance Festival, Hornbill Festival, Tansen Samaroh, Ziro Festival of Music, Konark Dance Festival).
4. **FOLK_COMMUNITY**: Grassroots indigenous celebrations, tribal bonding, historical barter fairs, and family reunions (e.g., Jonbeel Mela, Tarpa Festival, Wangala, Ningol Chakouba, Dree Festival).
5. **CULTURAL_NATIONAL**: National commemorations, patriotic tributes, and inter-state cultural integration events (e.g., Island Tourism Festival, Subhash Mela, Taj Mahotsav).

### 2.2 Date Calculation & Calendar Typology
Festivals in India follow diverse astronomical and calendar traditions. The database categorizes dates into 7 strict deterministic types:
- **FIXED**: Strict fixed solar dates on the Gregorian calendar (e.g., Republic Day, Me-Dam-Me-Phi, Chalo Loku, Christmas).
- **SOLAR**: Determined by solar transits (Sankranti) in regional solar calendars (e.g., Bohag Bihu, Tamil Puthandu, Vishu, Makar Sankranti).
- **LUNAR**: Governed by pure lunar months (e.g., Islamic Hijri calendar for Eid-ul-Fitr, Eid-ul-Adha, Muharram).
- **LUNISOLAR**: Determined by the alignment of lunar Tithis and solar months (e.g., Diwali, Holi, Krishna Janmashtami, Ganesh Chaturthi, Maha Shivratri).
- **SEASONAL**: Timed by monsoon rains, agricultural ripening, or animal migrations (e.g., Ambubachi Mela, Hemis Festival).
- **ORGANIZER_ANNOUNCED**: Proclaimed by state tourism boards and administrative committees (e.g., Ziro Festival, Rann Utsav, Hornbill Festival).
- **COMMUNITY_SPECIFIC**: Governed by indigenous clan councils and traditional shamanic divination (e.g., Nongkrem Dance, Ali-Ai-Ligang).

---

## 3. Master Dataset Structure
Each record adheres to the 42-attribute standard defined in [`FESTIVAL_DATABASE_SCHEMA.md`](./FESTIVAL_DATABASE_SCHEMA.md).

Key dataset files:
- `/data/festivals/india_festivals_master.json`: Complete 363-record array with full cultural narratives, visiting logistics, foods, and dates.
- `/data/festivals/festival_categories.json`: Category definitions, festival distribution, and category metadata.
- `/data/festivals/festival_locations.json`: Spatial indexing across all 36 States and UTs with major venues.
- `/data/festivals/festival_dates.json`: Chronological month-by-month index and multi-calendar mapping.
- `/data/festivals/festival_sources.json`: Official institutional provenance and verification audit trails.

---

## 4. Integration with VIRASAT Engine

1. **AI Concierge Grounding**:
   - The AI Assistant (`backend/app/services/database_retriever.py` and `cultural_repository.py`) utilizes this database for zero-hallucination responses regarding rituals, authentic cuisines, visiting hours, and etiquette.
2. **Interactive Map & Route Studio**:
   - Every festival record provides geographic anchoring (`famous_venues`, `major_cities`, `major_states`) for display on the interactive Map Studio with automatic routing and distance calculations.
3. **Trip & Itinerary Planner**:
   - Recommends optimal travel duration (`recommended_duration_days`), peak visiting hours (`best_time_to_visit`), transport connections, and seasonal accommodations.
