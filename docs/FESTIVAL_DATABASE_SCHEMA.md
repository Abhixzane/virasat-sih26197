# VIRASAT Festival Master Database Schema Specification

## 1. Overview
This document specifies the exact technical schema and validation rules for the 42 attributes present in every festival entity across the VIRASAT Indian Cultural Heritage and Tourism Platform.

---

## 2. Field Specifications

| # | Attribute Name | Data Type | Nullable | Description & Validation Rules | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `id` | String | No | Unique slug identifier (kebab-case). Lowercase, alphanumeric and hyphens only. | `"bohag-bihu-assam"` |
| 2 | `name` | String | No | Primary canonical name of the festival in English/Roman script. | `"Bohag Bihu"` |
| 3 | `alternate_names` | Array[String] | No | Regional names, transliterations, or localized vernacular variants. | `["Rongali Bihu", "Assamese New Year"]` |
| 4 | `category` | Enum | No | One of: `HARVEST_SEASONAL`, `RELIGIOUS_TEMPLE`, `MUSIC_DANCE_ARTS`, `FOLK_COMMUNITY`, `CULTURAL_NATIONAL`. | `"HARVEST_SEASONAL"` |
| 5 | `religious_or_cultural_association` | String | No | Religious, spiritual, or indigenous tribal affiliation. | `"Assamese Folk Tradition / Hinduism"` |
| 6 | `short_description` | String | No | Concise summary (1–2 sentences) explaining the essence of the festival. | `"The grandest 7-day spring festival marking..."` |
| 7 | `historical_background` | String | No | Origin timeline, royal patronage, and historical evolution. | `"Celebrated since antiquity across the valley..."` |
| 8 | `origin_and_traditional_stories` | String | No | Mythological lore, folklore legends, and traditional narratives. | `"Associated with the spring equinox and pastoral..."` |
| 9 | `why_celebrated` | String | No | Core purpose, philosophical objective, and intent. | `"Welcomes the vernal new year, honors agricultural..."` |
| 10 | `cultural_and_spiritual_significance` | String | No | Theological, ethical, and community bonding impact. | `"Represents the quintessential soul of Asomiya..."` |
| 11 | `historical_significance` | String | No | Broader political, social, or civilizational relevance. | `"Historically patronized by Ahom monarchs in..."` |
| 12 | `important_rituals` | Array[String] | No | Key sacred or customary acts performed during celebration. | `["Goru Bihu", "Manuh Bihu with Gamocha"]` |
| 13 | `how_people_celebrate` | String | No | Practical description of public and domestic festivities. | `"People don Muga silk, assemble in open grounds..."` |
| 14 | `traditional_food_and_sweets` | Array[String] | No | Authentic regional gastronomy, sweets, and prasadam. | `["Til Pitha", "Ghila Pitha", "Narikol Laru"]` |
| 15 | `traditional_clothing` | String | No | Specific handloom garments, headgear, and textiles. | `"Women wear golden Muga silk Mekhela Chador..."` |
| 16 | `music_dance_performances` | String | No | Performing art forms, folk dances, and specific musical instruments. | `"Bihu geet accompanied by Dhol, Pepa, Toka..."` |
| 17 | `important_symbols_and_decorations` | Array[String] | No | Visual emblems, ritual motifs, and sacred icons. | `["Phulam Gamocha", "Kopou phool", "Japi"]` |
| 18 | `typical_duration` | String | No | Duration of observance (days/weeks/months). | `"7 Days (traditionally one month)"` |
| 19 | `calendar_system` | String | No | Native astronomical calendar governing calculation. | `"Assamese Solar Calendar (Bohag 1)"` |
| 20 | `date_calculation_rule` | String | No | Exact astrological, solar, lunar, or civic rule. | `"First day of Bohag coinciding with Mesha Sankranti."` |
| 21 | `usual_month` | String | No | Primary Gregorian month in which festival usually falls. | `"April"` |
| 22 | `date_type` | Enum | No | One of: `FIXED`, `LUNAR`, `LUNISOLAR`, `SOLAR`, `SEASONAL`, `ORGANIZER_ANNOUNCED`, `COMMUNITY_SPECIFIC`. | `"SOLAR"` |
| 23 | `date_rule` | String | No | Algorithmic date derivation formula. | `"First day of Assamese month Bohag (April 14/15)"` |
| 24 | `date_2026` | String | No | Verified date or date range in 2026 (ISO format `YYYY-MM-DD`). | `"2026-04-14 to 2026-04-20"` |
| 25 | `date_2027` | String | No | Projected/verified date or date range in 2027. | `"2027-04-14 to 2027-04-20"` |
| 26 | `date_source` | String | No | Official source verifying the calendar dates. | `"Government of Assam Official Holiday Calendar"` |
| 27 | `date_last_verified` | String | No | ISO date of latest verification audit. | `"2026-09-28"` |
| 28 | `major_states` | Array[String] | No | List of Indian states or UTs where observed. | `["Assam"]` |
| 29 | `major_cities` | Array[String] | No | Key urban or rural centers hosting major celebrations. | `["Guwahati", "Sivasagar", "Jorhat"]` |
| 30 | `famous_venues` | Array[String] | No | Famous temple complexes, public grounds, or heritage sites. | `["Latasil Field", "Rang Ghar Pavilion"]` |
| 31 | `best_time_to_visit` | String | No | Optimal time of day or key festival day for best experience. | `"Evenings between 5 PM and 10 PM at open grounds."` |
| 32 | `recommended_duration_days`| Integer | No | Recommended tourist stay length in days. | `4` |
| 33 | `tourist_experience` | String | No | Immersive qualitative description of what travelers encounter. | `"Unmatched electric energy as thousands dance..."` |
| 34 | `local_transportation` | String | No | Practical transport advice (air, rail, road, local cabs). | `"ASTC buses, app cabs in Guwahati; rental cars."` |
| 35 | `accommodation_considerations`| String| No | Hotel types, peak season warnings, booking lead times. | `"Extensive hotel range; tea bungalows in Jorhat."` |
| 36 | `crowd_and_safety` | String | No | Density assessment, security measures, and safety tips. | `"Extremely high public participation; safe atmosphere."` |
| 37 | `visitor_etiquette` | String | No | Cultural dos and don'ts, photography rules, dress code. | `"Accept Gamocha with both hands; remove shoes..."` |
| 38 | `accessibility_considerations`| String| No | Wheelchair access, terrain difficulty, facilities. | `"Partially wheelchair accessible; assistance needed."` |
| 39 | `official_website` | String | No | Official tourism or temple administration web URL. | `"https://www.incredibleindia.gov.in"` |
| 40 | `sources` | Array[String] | No | List of verified publications, government bodies, or gazettes. | `["Ministry of Tourism", "Assam Tourism"]` |
| 41 | `last_verified_date` | String | No | ISO date of record verification. | `"2026-09-28"` |
| 42 | `data_confidence_status` | Enum | No | Data fidelity score: `VERIFIED_OFFICIAL`, `ACADEMIC_CONSENSUS`. | `"VERIFIED_OFFICIAL"` |

---

## 3. Relational Mapping (PostgreSQL / Supabase)
In relational schemas (e.g., `supabase/schema.sql`), array fields (`alternate_names`, `important_rituals`, `traditional_food_and_sweets`, `important_symbols_and_decorations`, `major_states`, `major_cities`, `famous_venues`, `sources`) are modeled as `TEXT[]` or normalized into child junction tables.
Enums are validated via `CHECK` constraints to guarantee data integrity.
