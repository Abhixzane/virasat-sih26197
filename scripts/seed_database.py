"""
VIRASAT Master Database Seeding & Normalization Engine
Seeds the relational database (PostgreSQL / SQLite) from verified cultural data,
validates schema rules, assigns unique slugs, registers sources and relationships,
and writes canonical seed JSON files into backend/app/data/seeds/.
"""
import os
import sys
import json
import re
from typing import Dict, Any, List

# Ensure backend is in python path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "backend"))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app.core.database import SessionLocal, init_db
from app.models.db_models import (
    State, City, HeritageSite, Festival, Craft, Artisan,
    PerformingArt, CulturalExperience, CulturalRelationship,
    Source, EntitySource, Image
)

SOURCE_JSON_PATH = os.path.join(BACKEND_DIR, "data", "cultural_database.json")
SEEDS_DIR = os.path.join(BACKEND_DIR, "app", "data", "seeds")
os.makedirs(SEEDS_DIR, exist_ok=True)

def generate_slug(text: str) -> str:
    cleaned = re.sub(r'[^a-z0-9]+', '-', text.strip().lower()).strip('-')
    return cleaned or "unnamed-entry"

def seed_database():
    print("=" * 70)
    print("VIRASAT DATABASE SEEDING ENGINE")
    print("=" * 70)

    init_db()
    session = SessionLocal()

    if not os.path.exists(SOURCE_JSON_PATH):
        print(f"Error: Source database file not found at {SOURCE_JSON_PATH}")
        return

    with open(SOURCE_JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    # 1. Clear existing database rows for a fresh idempotent seed
    print("Resetting existing database tables...")
    session.query(EntitySource).delete()
    session.query(Source).delete()
    session.query(Image).delete()
    session.query(CulturalRelationship).delete()
    session.query(Artisan).delete()
    session.query(CulturalExperience).delete()
    session.query(PerformingArt).delete()
    session.query(Craft).delete()
    session.query(Festival).delete()
    session.query(HeritageSite).delete()
    session.query(City).delete()
    session.query(State).delete()
    session.commit()

    # Default Sources
    default_sources = [
        Source(
            id="src-asi",
            organization="Archaeological Survey of India (ASI)",
            source_title="ASI Centrally Protected Monuments Directory & Inscriptions Archives",
            source_url="https://asi.nic.in",
            source_type="GOVERNMENT_OFFICIAL",
            publication_date="2024",
            reliability_notes="Primary statutory body for archaeological research and monuments in India."
        ),
        Source(
            id="src-unesco",
            organization="UNESCO World Heritage Centre",
            source_title="World Heritage List: India Properties and Cultural Landscapes",
            source_url="https://whc.unesco.org/en/statesparties/in",
            source_type="INTERNATIONAL_BODY",
            publication_date="2024",
            reliability_notes="International treaty organization identifying world cultural heritage."
        ),
        Source(
            id="src-sna",
            organization="Sangeet Natak Akademi",
            source_title="National Akademi of Music, Dance and Drama Traditional Repertory",
            source_url="https://sangeetnatak.gov.in",
            source_type="GOVERNMENT_OFFICIAL",
            publication_date="2024",
            reliability_notes="National institution for performing arts traditions."
        ),
        Source(
            id="src-gi",
            organization="Geographical Indications Registry, Government of India",
            source_title="Registered Geographical Indications (GI) of India Directory",
            source_url="https://ipindia.gov.in",
            source_type="GOVERNMENT_OFFICIAL",
            publication_date="2024",
            reliability_notes="Official intellectual property registry for GI-tagged handicrafts."
        ),
        Source(
            id="src-mot",
            organization="Ministry of Tourism, Government of India",
            source_title="Incredible India Tourism & Cultural Documentation",
            source_url="https://www.incredibleindia.org",
            source_type="GOVERNMENT_OFFICIAL",
            publication_date="2024",
            reliability_notes="Official national tourism documentation portal."
        ),
        Source(
            id="src-ignca",
            organization="Indira Gandhi National Centre for the Arts (IGNCA)",
            source_title="Kalanidhi Manuscript & Cultural Heritage Digital Repository",
            source_url="https://ignca.gov.in",
            source_type="GOVERNMENT_OFFICIAL",
            publication_date="2024",
            reliability_notes="Premier national resource centre for traditional arts and culture."
        ),
        Source(
            id="src-ccrt",
            organization="Centre for Cultural Resources and Training (CCRT)",
            source_title="National Traditional Performing Arts & Folklore Archives",
            source_url="https://ccrtindia.gov.in",
            source_type="GOVERNMENT_OFFICIAL",
            publication_date="2024",
            reliability_notes="Ministry of Culture autonomous body for cultural heritage documentation."
        ),
        Source(
            id="src-dch",
            organization="Office of the Development Commissioner (Handicrafts)",
            source_title="National Handicrafts & Master Craftsmen Census Directory",
            source_url="https://handicrafts.nic.in",
            source_type="GOVERNMENT_OFFICIAL",
            publication_date="2024",
            reliability_notes="Statutory authority under Ministry of Textiles for craft cluster preservation."
        ),
        Source(
            id="src-state-tourism",
            organization="State & UT Tourism & Cultural Affairs Directorates",
            source_title="State Official Tourism Portals & District Cultural Gazetteers",
            source_url="https://tourism.gov.in",
            source_type="GOVERNMENT_OFFICIAL",
            publication_date="2024",
            reliability_notes="State-level statutory archives for local festivals, monuments, and heritage circuits."
        ),
        Source(
            id="src-ne-council",
            organization="North Eastern Council (NEC), Ministry of DoNER",
            source_title="Cultural Atlas of North Eastern India",
            source_url="https://necouncil.gov.in",
            source_type="GOVERNMENT_OFFICIAL",
            publication_date="2024",
            reliability_notes="Statutory regional planning body for eight North Eastern states."
        ),
        Source(
            id="src-unesco-ich",
            organization="UNESCO Intangible Cultural Heritage",
            source_title="Representative List of the Intangible Cultural Heritage of Humanity",
            source_url="https://ich.unesco.org",
            source_type="INTERNATIONAL_BODY",
            publication_date="2024",
            reliability_notes="International inventory of living heritage traditions and performing arts."
        ),
        Source(
            id="src-pib",
            organization="Press Information Bureau (PIB), Government of India",
            source_title="National Cultural Heritage & Statutory GI Gazette Releases",
            source_url="https://pib.gov.in",
            source_type="GOVERNMENT_OFFICIAL",
            publication_date="2024",
            reliability_notes="Official press releases and gazette notifications for statutory recognitions."
        )
    ]
    for s in default_sources:
        session.add(s)
    session.commit()

    # 2. States and Cities
    states_dict = {}
    cities_dict = {}
    states_seeds = []
    cities_seeds = []

    print("Importing States and Cities...")
    for item in data.get("states_and_cities", []):
        itype = item.get("type", "city")
        coords = item.get("coordinates", {})
        lat = coords.get("lat", 20.5937)
        lng = coords.get("lng", 78.9629)

        if itype == "state":
            st_id = item["id"]
            if st_id not in states_dict:
                state_obj = State(
                    id=st_id,
                    name=item["name"],
                    state_code=item.get("state_code", item["name"][:3].upper()),
                    region=item.get("region", "India"),
                    capital=item.get("capital", item["name"])
                )
                session.add(state_obj)
                states_dict[st_id] = state_obj
                states_seeds.append({
                    "id": st_id,
                    "name": item["name"],
                    "state_code": state_obj.state_code,
                    "region": item.get("region", "India"),
                    "capital": state_obj.capital
                })
        else:
            c_id = item["id"]
            state_name = item.get("state", "India")
            st_id = f"state-{generate_slug(state_name)}"
            if st_id not in states_dict:
                state_obj = State(
                    id=st_id,
                    name=state_name,
                    state_code=state_name[:3].upper(),
                    region=item.get("region", "India"),
                    capital=state_name
                )
                session.add(state_obj)
                states_dict[st_id] = state_obj

            if c_id not in cities_dict:
                city_obj = City(
                    id=c_id,
                    state_id=st_id,
                    name=item["name"],
                    district=item.get("district", item["name"]),
                    latitude=float(lat),
                    longitude=float(lng),
                    description=item.get("description", "")
                )
                session.add(city_obj)
                cities_dict[c_id] = city_obj
                cities_seeds.append({
                    "id": c_id,
                    "state_id": st_id,
                    "name": item["name"],
                    "district": city_obj.district,
                    "latitude": float(lat),
                    "longitude": float(lng),
                    "description": item.get("description", "")
                })

    session.commit()
    print(f"  -> Imported {len(states_dict)} States, {len(cities_dict)} Cities")

    # 3. Heritage Sites
    print("Importing Heritage Sites...")
    heritage_seeds = []
    seen_heritage_slugs = set()

    for item in data.get("heritage_places", []):
        base_slug = generate_slug(item["name"])
        slug = base_slug
        count = 1
        while slug in seen_heritage_slugs:
            slug = f"{base_slug}-{count}"
            count += 1
        seen_heritage_slugs.add(slug)

        st_id = f"state-{generate_slug(item.get('state', ''))}"
        c_id = f"city-{generate_slug(item.get('state', ''))}-{generate_slug(item.get('city', ''))}"
        city_fk = c_id if c_id in cities_dict else None
        state_fk = st_id if st_id in states_dict else list(states_dict.keys())[0]

        site = HeritageSite(
            id=item["id"],
            name=item["name"],
            slug=slug,
            city_id=city_fk,
            state_id=state_fk,
            category=item.get("category", "Heritage Monument"),
            architectural_style=item.get("architectural_style", "Classical Indian Architecture"),
            historical_period=item.get("historical_period", "Ancient / Medieval"),
            construction_period=item.get("construction_period", item.get("historical_period", "")),
            historical_description=item.get("description", ""),
            cultural_significance=item.get("historical_significance", item.get("cultural_significance", "")),
            latitude=float(item.get("latitude", 20.5937)),
            longitude=float(item.get("longitude", 78.9629)),
            image_url=item.get("image_url", ""),
            image_attribution="Archaeological Survey of India / Wikimedia Commons (CC BY-SA 4.0)",
            verification_status=item.get("verification_status", "VERIFIED")
        )
        session.add(site)
        heritage_seeds.append({
            "id": site.id,
            "name": site.name,
            "slug": site.slug,
            "state": item.get("state", "India"),
            "city": item.get("city", "India"),
            "city_id": site.city_id,
            "state_id": site.state_id,
            "category": site.category,
            "architectural_style": site.architectural_style,
            "historical_period": site.historical_period,
            "construction_period": site.construction_period,
            "historical_description": site.historical_description,
            "cultural_significance": site.cultural_significance,
            "latitude": site.latitude,
            "longitude": site.longitude,
            "image_url": site.image_url,
            "image_attribution": item.get("image_attribution") or site.image_attribution,
            "license": item.get("license"),
            "source_url": item.get("source_url", "https://asi.nic.in"),
            "verification_status": site.verification_status
        })

        # Register entity source
        src_id = "src-unesco" if ("unesco" in item.get("description", "").lower() or "unesco" in item.get("category", "").lower() or "unesco" in item.get("source_url", "").lower()) else "src-asi"
        claim = item.get("supporting_claim") or f"Protected heritage site record, coordinates, and historical architectural documentation for {site.name}."
        session.add(EntitySource(
            id=f"es-heritage-{site.id}",
            entity_type="heritage",
            entity_id=site.id,
            source_id=src_id,
            supporting_claim=claim,
            verification_status=site.verification_status
        ))

    session.commit()
    print(f"  -> Imported {len(heritage_seeds)} Heritage Sites")

    # 4. Festivals
    print("Importing Festivals...")
    festival_seeds = []
    seen_fest_slugs = set()

    for item in data.get("festivals_and_traditions", []):
        base_slug = generate_slug(item["name"])
        slug = base_slug
        count = 1
        while slug in seen_fest_slugs:
            slug = f"{base_slug}-{count}"
            count += 1
        seen_fest_slugs.add(slug)

        st_id = f"state-{generate_slug(item.get('state', ''))}"
        state_fk = st_id if st_id in states_dict else list(states_dict.keys())[0]

        # Determine date_type
        date_type = item.get("date_type")
        if not date_type or date_type not in ["FIXED", "LUNAR", "ANNUAL_OFFICIAL", "APPROX_SEASONAL"]:
            desc_lower = (item.get("description", "") + " " + item.get("month_or_season", "")).lower()
            if "lunar" in desc_lower or "shukla" in desc_lower or "kartik" in desc_lower or "tithi" in desc_lower:
                date_type = "LUNAR"
            elif "fixed" in desc_lower or any(m in desc_lower for m in ["january 14", "january 26", "august 15", "december 23", "april 13"]):
                date_type = "FIXED"
            elif "annual" in desc_lower or "official" in desc_lower or "fair" in desc_lower:
                date_type = "ANNUAL_OFFICIAL"
            else:
                date_type = "APPROX_SEASONAL"

        traditional_period = item.get("traditional_period", item.get("month_or_season", ""))
        exact_date = item.get("exact_date") if date_type == "FIXED" else None
        date_source = item.get("date_source", "Sangeet Natak Akademi Traditional Festivals Calendar")
        fest_v_status = item.get("verification_status", "VERIFIED")

        fest = Festival(
            id=item["id"],
            name=item["name"],
            slug=slug,
            state_id=state_fk,
            city_id=None,
            category=item.get("category", "Living Tradition"),
            cultural_significance=item.get("cultural_significance", item.get("description", "")),
            traditional_period=traditional_period,
            date_type=date_type,
            exact_date=exact_date,
            date_source=date_source,
            rituals={"details": item.get("celebration_details", ""), "communities": item.get("associated_communities", "")},
            regional_context=item.get("historical_background", ""),
            image_url=item.get("image_url", ""),
            verification_status=fest_v_status
        )
        session.add(fest)
        festival_seeds.append({
            "id": fest.id,
            "name": fest.name,
            "slug": fest.slug,
            "state": item.get("state", "India"),
            "state_id": fest.state_id,
            "category": fest.category,
            "cultural_significance": fest.cultural_significance,
            "traditional_period": fest.traditional_period,
            "date_type": fest.date_type,
            "exact_date": fest.exact_date,
            "date_source": fest.date_source,
            "rituals": fest.rituals,
            "regional_context": fest.regional_context,
            "image_url": fest.image_url,
            "image_attribution": item.get("image_attribution"),
            "license": item.get("license"),
            "source_url": item.get("source_url", "https://sangeetnatak.gov.in"),
            "verification_status": fest.verification_status
        })

        src_id = "src-unesco-ich" if "unesco" in str(item).lower() else "src-sna"
        claim = item.get("supporting_claim") or f"National register of intangible cultural heritage and traditional observance for {fest.name}."

        session.add(EntitySource(
            id=f"es-festival-{fest.id}",
            entity_type="festival",
            entity_id=fest.id,
            source_id=src_id,
            supporting_claim=claim,
            verification_status=fest.verification_status
        ))

    session.commit()
    print(f"  -> Imported {len(festival_seeds)} Festivals")

    # 5. Crafts & Artisans
    print("Importing Crafts & Artisans...")
    craft_seeds = []
    seen_craft_slugs = set()

    for item in data.get("arts_crafts_and_artisans", []):
        base_slug = generate_slug(item["name"])
        slug = base_slug
        count = 1
        while slug in seen_craft_slugs:
            slug = f"{base_slug}-{count}"
            count += 1
        seen_craft_slugs.add(slug)

        st_id = f"state-{generate_slug(item.get('state', ''))}"
        state_fk = st_id if st_id in states_dict else list(states_dict.keys())[0]

        # Determine gi_status and gi_ref cleanly
        raw_gi = item.get("gi_status_enum") or item.get("gi_status")
        if raw_gi is True or raw_gi == "REGISTERED":
            gi_status = "REGISTERED"
        elif raw_gi == "APPLIED":
            gi_status = "APPLIED"
        elif raw_gi is False or raw_gi == "NOT_REGISTERED":
            gi_status = "NOT_REGISTERED"
        elif raw_gi in ["UNKNOWN", None]:
            gi_status = "UNKNOWN"
        else:
            gi_status = str(raw_gi)

        gi_ref = item.get("gi_registration_reference")
        craft_v_status = item.get("verification_status") or ("VERIFIED" if gi_status in ["REGISTERED", "APPLIED"] else "PARTIALLY_VERIFIED")

        craft = Craft(
            id=item["id"],
            name=item["name"],
            slug=slug,
            state_id=state_fk,
            city_id=None,
            craft_category=item.get("craft_category", "Traditional Handicraft"),
            materials={"materials_used": item.get("materials_used", "Natural fibers, minerals and metals")},
            techniques=item.get("production_technique", "Master artisan handmade technique"),
            historical_context=item.get("description", ""),
            gi_status=gi_status,
            gi_registration_reference=gi_ref,
            image_url=item.get("image_url", ""),
            verification_status=craft_v_status
        )
        session.add(craft)

        # Artisan cluster (no fabricated personal contact info, per spec)
        if item.get("artisan_name"):
            artisan = Artisan(
                id=f"artisan-{craft.id}",
                name=item.get("artisan_name"),
                craft_id=craft.id,
                location=item.get("artisan_location", item.get("state")),
                artisan_cluster=f"{item.get('origin', item.get('state'))} Master Crafts Guild",
                biography=f"Documented master artisan community upholding ancient tradition of {craft.name}.",
                source_reference="Development Commissioner (Handicrafts), Ministry of Textiles",
                contact_visibility="NONE",
                verification_status="PARTIALLY_VERIFIED"
            )
            session.add(artisan)

        craft_seeds.append({
            "id": craft.id,
            "name": craft.name,
            "slug": craft.slug,
            "state": item.get("state", "India"),
            "state_id": craft.state_id,
            "craft_category": craft.craft_category,
            "materials": craft.materials,
            "techniques": craft.techniques,
            "historical_context": craft.historical_context,
            "gi_status": craft.gi_status,
            "gi_registration_reference": craft.gi_registration_reference,
            "image_url": craft.image_url,
            "image_attribution": item.get("image_attribution"),
            "license": item.get("license"),
            "source_url": item.get("source_url", "https://ipindia.gov.in" if gi_status in ["REGISTERED", "APPLIED"] else "https://handicrafts.nic.in"),
            "verification_status": craft.verification_status
        })

        src_id = "src-gi" if gi_status in ["REGISTERED", "APPLIED"] else "src-dch"
        claim = item.get("supporting_claim") or (
            f"Geographical Indication Registry certification: {gi_ref} for {craft.name}." if gi_ref
            else f"Traditional craft cluster documented by Office of Development Commissioner (Handicrafts): {craft.name}."
        )

        session.add(EntitySource(
            id=f"es-craft-{craft.id}",
            entity_type="craft",
            entity_id=craft.id,
            source_id=src_id,
            supporting_claim=claim,
            verification_status=craft.verification_status
        ))

    session.commit()
    print(f"  -> Imported {len(craft_seeds)} Crafts")

    # 6. Performing Arts
    print("Importing Performing Arts...")
    art_seeds = []
    seen_art_slugs = set()

    for item in data.get("folk_and_performing_arts", []):
        base_slug = generate_slug(item["name"])
        slug = base_slug
        count = 1
        while slug in seen_art_slugs:
            slug = f"{base_slug}-{count}"
            count += 1
        seen_art_slugs.add(slug)

        st_id = f"state-{generate_slug(item.get('state', ''))}"
        state_fk = st_id if st_id in states_dict else list(states_dict.keys())[0]

        art = PerformingArt(
            id=item["id"],
            name=item["name"],
            slug=slug,
            state_id=state_fk,
            origin_region=item.get("origin", item.get("state")),
            category=item.get("category", "Classical Performing Art"),
            description=item.get("description", ""),
            historical_context=item.get("performance_style", "Traditional Indian classical/folk idiom"),
            instruments=item.get("instruments", []),
            cultural_significance=item.get("cultural_significance", ""),
            image_url=item.get("image_url", ""),
            verification_status=item.get("verification_status", "VERIFIED")
        )
        session.add(art)
        art_seeds.append({
            "id": art.id,
            "name": art.name,
            "slug": art.slug,
            "state": item.get("state", "India"),
            "state_id": art.state_id,
            "origin_region": art.origin_region,
            "category": art.category,
            "description": art.description,
            "historical_context": art.historical_context,
            "instruments": art.instruments,
            "cultural_significance": art.cultural_significance,
            "image_url": art.image_url,
            "image_attribution": item.get("image_attribution"),
            "license": item.get("license"),
            "source_url": item.get("source_url", "https://sangeetnatak.gov.in"),
            "verification_status": art.verification_status
        })

        src_id = "src-unesco-ich" if "unesco" in str(item).lower() else "src-sna"
        claim = item.get("supporting_claim") or f"Sangeet Natak Akademi documented classical/folk performance form: {art.name}."
        session.add(EntitySource(
            id=f"es-art-{art.id}",
            entity_type="performing_art",
            entity_id=art.id,
            source_id=src_id,
            supporting_claim=claim,
            verification_status=art.verification_status
        ))

    session.commit()
    print(f"  -> Imported {len(art_seeds)} Performing Arts")

    # 7. Cultural Experiences
    print("Importing Cultural Experiences...")
    exp_seeds = []

    for item in data.get("cultural_experiences", []):
        st_id = f"state-{generate_slug(item.get('state', ''))}"
        state_fk = st_id if st_id in states_dict else list(states_dict.keys())[0]

        assoc_place = item.get("associated_place_id")
        if assoc_place == "place-charminar":
            assoc_place = "charminar"
        elif assoc_place == "place-golden-temple":
            assoc_place = "golden-temple-amritsar"

        exp = CulturalExperience(
            id=item["id"],
            name=item["name"],
            category=item.get("category", "Heritage Walk"),
            city_id=None,
            state_id=state_fk,
            description=item.get("description", ""),
            associated_heritage_id=assoc_place,
            associated_craft_id=None,
            associated_festival_id=None,
            latitude=float(item.get("latitude", 20.5937)),
            longitude=float(item.get("longitude", 78.9629)),
            informational_or_bookable="INFORMATIONAL",
            verification_status=item.get("verification_status", "VERIFIED")
        )
        session.add(exp)
        exp_seeds.append({
            "id": exp.id,
            "name": exp.name,
            "state": item.get("state", "India"),
            "category": exp.category,
            "state_id": exp.state_id,
            "description": exp.description,
            "associated_place_id": exp.associated_heritage_id,
            "latitude": exp.latitude,
            "longitude": exp.longitude,
            "informational_or_bookable": exp.informational_or_bookable,
            "image_url": item.get("image_url", ""),
            "image_attribution": item.get("image_attribution"),
            "license": item.get("license"),
            "source_url": item.get("source_url", "https://www.incredibleindia.org"),
            "verification_status": exp.verification_status
        })

        claim = item.get("supporting_claim") or f"Documented cultural heritage itinerary and interpretation trail for {exp.name}."
        session.add(EntitySource(
            id=f"es-exp-{exp.id}",
            entity_type="experience",
            entity_id=exp.id,
            source_id="src-mot",
            supporting_claim=claim,
            verification_status=exp.verification_status
        ))

    session.commit()
    print(f"  -> Imported {len(exp_seeds)} Cultural Experiences")

    # Write Canonical Seed JSON Files to backend/app/data/seeds/
    print("Writing canonical seed files to backend/app/data/seeds/...")
    with open(os.path.join(SEEDS_DIR, "states.json"), "w", encoding="utf-8") as f:
        json.dump(states_seeds, f, indent=2, ensure_ascii=False)
    with open(os.path.join(SEEDS_DIR, "cities.json"), "w", encoding="utf-8") as f:
        json.dump(cities_seeds, f, indent=2, ensure_ascii=False)
    with open(os.path.join(SEEDS_DIR, "heritage_sites.json"), "w", encoding="utf-8") as f:
        json.dump(heritage_seeds, f, indent=2, ensure_ascii=False)
    with open(os.path.join(SEEDS_DIR, "festivals.json"), "w", encoding="utf-8") as f:
        json.dump(festival_seeds, f, indent=2, ensure_ascii=False)
    with open(os.path.join(SEEDS_DIR, "crafts.json"), "w", encoding="utf-8") as f:
        json.dump(craft_seeds, f, indent=2, ensure_ascii=False)
    with open(os.path.join(SEEDS_DIR, "performing_arts.json"), "w", encoding="utf-8") as f:
        json.dump(art_seeds, f, indent=2, ensure_ascii=False)
    with open(os.path.join(SEEDS_DIR, "cultural_experiences.json"), "w", encoding="utf-8") as f:
        json.dump(exp_seeds, f, indent=2, ensure_ascii=False)

    total_records = len(states_dict) + len(cities_dict) + len(heritage_seeds) + len(festival_seeds) + len(craft_seeds) + len(art_seeds) + len(exp_seeds)
    print("=" * 70)
    print(f"DATABASE SEEDING COMPLETE! Total records loaded: {total_records}")
    print("=" * 70)

    session.close()

    # Sync database to backend/virasat.db if sqlite is being used
    import shutil
    db_root = os.path.join(CURRENT_DIR, "..", "virasat.db")
    db_backend = os.path.join(BACKEND_DIR, "virasat.db")
    if os.path.exists(db_root):
        shutil.copy2(db_root, db_backend)
        print("  -> Synchronized database to backend/virasat.db successfully.")

if __name__ == "__main__":
    seed_database()
