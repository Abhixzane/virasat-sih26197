-- ============================================================================
-- VIRASAT CULTURAL PLATFORM - SUPABASE / POSTGRESQL MASTER SCHEMA
-- Master Tables for Festivals (363 authentic records) and UNESCO Sites (42 properties)
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ----------------------------------------------------------------------------
-- 1. FESTIVALS MASTER TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.festivals_master (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    alternate_names TEXT[] DEFAULT '{}',
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'HARVEST_SEASONAL', 'RELIGIOUS_TEMPLE', 'MUSIC_DANCE_ARTS',
        'FOLK_COMMUNITY', 'CULTURAL_NATIONAL', 'OTHER'
    )),
    religious_or_cultural_association VARCHAR(255),
    short_description TEXT NOT NULL,
    historical_background TEXT,
    origin_and_traditional_stories TEXT,
    why_celebrated TEXT,
    cultural_and_spiritual_significance TEXT,
    historical_significance TEXT,
    important_rituals TEXT[] DEFAULT '{}',
    how_people_celebrate TEXT,
    traditional_food_and_sweets TEXT[] DEFAULT '{}',
    traditional_clothing TEXT,
    music_dance_performances TEXT,
    important_symbols_and_decorations TEXT[] DEFAULT '{}',
    typical_duration VARCHAR(100),
    calendar_system VARCHAR(100),
    date_calculation_rule TEXT,
    usual_month VARCHAR(50),
    date_type VARCHAR(50) NOT NULL CHECK (date_type IN (
        'FIXED', 'LUNAR', 'LUNISOLAR', 'SOLAR', 'SEASONAL',
        'ORGANIZER_ANNOUNCED', 'COMMUNITY_SPECIFIC'
    )),
    date_rule TEXT,
    date_2026 VARCHAR(100) NOT NULL,
    date_2027 VARCHAR(100),
    date_source TEXT,
    date_last_verified DATE DEFAULT CURRENT_DATE,
    major_states TEXT[] NOT NULL DEFAULT '{}',
    major_cities TEXT[] DEFAULT '{}',
    famous_venues TEXT[] DEFAULT '{}',
    best_time_to_visit TEXT,
    recommended_duration_days INTEGER DEFAULT 1 CHECK (recommended_duration_days > 0),
    tourist_experience TEXT,
    local_transportation TEXT,
    accommodation_considerations TEXT,
    crowd_and_safety TEXT,
    visitor_etiquette TEXT,
    accessibility_considerations TEXT,
    official_website VARCHAR(500),
    sources TEXT[] DEFAULT '{}',
    last_verified_date DATE DEFAULT CURRENT_DATE,
    data_confidence_status VARCHAR(50) DEFAULT 'VERIFIED_OFFICIAL',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fast Indexes for Festivals
CREATE INDEX IF NOT EXISTS idx_festivals_category ON public.festivals_master (category);
CREATE INDEX IF NOT EXISTS idx_festivals_date_type ON public.festivals_master (date_type);
CREATE INDEX IF NOT EXISTS idx_festivals_usual_month ON public.festivals_master (usual_month);
CREATE INDEX IF NOT EXISTS idx_festivals_states ON public.festivals_master USING GIN (major_states);
CREATE INDEX IF NOT EXISTS idx_festivals_alts ON public.festivals_master USING GIN (alternate_names);
CREATE INDEX IF NOT EXISTS idx_festivals_name_trgm ON public.festivals_master USING GIN (name gin_trgm_ops);

-- ----------------------------------------------------------------------------
-- 2. UNESCO WORLD HERITAGE TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.unesco_world_heritage (
    id VARCHAR(100) PRIMARY KEY,
    official_unesco_name VARCHAR(255) NOT NULL,
    alternate_names TEXT[] DEFAULT '{}',
    category VARCHAR(20) NOT NULL CHECK (category IN ('Cultural', 'Natural', 'Mixed')),
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    city_or_nearest_settlement VARCHAR(100),
    inscription_year INTEGER NOT NULL,
    unesco_criteria TEXT[] NOT NULL DEFAULT '{}',
    historical_background TEXT,
    architectural_or_ecological_significance TEXT,
    cultural_importance TEXT,
    historical_events_stories TEXT,
    major_attractions TEXT[] DEFAULT '{}',
    visitor_experience TEXT,
    best_time_to_visit VARCHAR(100),
    recommended_visit_duration VARCHAR(100),
    nearest_railway_station VARCHAR(150),
    nearest_airport VARCHAR(150),
    nearby_cities TEXT[] DEFAULT '{}',
    nearby_heritage_destinations TEXT[] DEFAULT '{}',
    nearby_hotels_areas TEXT[] DEFAULT '{}',
    local_cuisine TEXT[] DEFAULT '{}',
    transportation_information TEXT,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    official_unesco_url VARCHAR(500),
    official_tourism_url VARCHAR(500),
    data_verification_status VARCHAR(50) DEFAULT 'VERIFIED_OFFICIAL',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fast Indexes for UNESCO Sites
CREATE INDEX IF NOT EXISTS idx_unesco_category ON public.unesco_world_heritage (category);
CREATE INDEX IF NOT EXISTS idx_unesco_state ON public.unesco_world_heritage (state);
CREATE INDEX IF NOT EXISTS idx_unesco_inscription_year ON public.unesco_world_heritage (inscription_year);
CREATE INDEX IF NOT EXISTS idx_unesco_coords ON public.unesco_world_heritage (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_unesco_name_trgm ON public.unesco_world_heritage USING GIN (official_unesco_name gin_trgm_ops);

-- ----------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.festivals_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unesco_world_heritage ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read-only access to all verified cultural records
CREATE POLICY "Public Read Festivals" ON public.festivals_master
    FOR SELECT USING (true);

CREATE POLICY "Public Read UNESCO Heritage" ON public.unesco_world_heritage
    FOR SELECT USING (true);

-- Allow service_role / authenticated admin write access
CREATE POLICY "Admin Write Festivals" ON public.festivals_master
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin Write UNESCO Heritage" ON public.unesco_world_heritage
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
