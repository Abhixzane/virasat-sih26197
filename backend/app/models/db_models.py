import datetime
from sqlalchemy import (
    Column, String, Text, Float, DateTime, ForeignKey, Enum as SQLEnum, JSON, Index
)
from sqlalchemy.orm import relationship
from app.core.database import Base

class State(Base):
    __tablename__ = "states"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False, index=True)
    state_code = Column(String(16), nullable=True)
    region = Column(String(64), nullable=False, index=True)
    capital = Column(String(128), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    cities = relationship("City", back_populates="state", cascade="all, delete-orphan")
    heritage_sites = relationship("HeritageSite", back_populates="state")
    festivals = relationship("Festival", back_populates="state")
    crafts = relationship("Craft", back_populates="state")
    performing_arts = relationship("PerformingArt", back_populates="state")
    experiences = relationship("CulturalExperience", back_populates="state")


class City(Base):
    __tablename__ = "cities"

    id = Column(String(64), primary_key=True, index=True)
    state_id = Column(String(64), ForeignKey("states.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(128), nullable=False, index=True)
    district = Column(String(128), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    description = Column(Text, nullable=True)

    state = relationship("State", back_populates="cities")
    heritage_sites = relationship("HeritageSite", back_populates="city")
    festivals = relationship("Festival", back_populates="city")
    crafts = relationship("Craft", back_populates="city")
    experiences = relationship("CulturalExperience", back_populates="city")

    __table_args__ = (
        Index("idx_city_lat_lng", "latitude", "longitude"),
    )


class HeritageSite(Base):
    __tablename__ = "heritage_sites"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    city_id = Column(String(64), ForeignKey("cities.id", ondelete="SET NULL"), nullable=True, index=True)
    state_id = Column(String(64), ForeignKey("states.id", ondelete="CASCADE"), nullable=False, index=True)
    category = Column(String(64), nullable=False, index=True)
    architectural_style = Column(String(128), nullable=True)
    historical_period = Column(String(128), nullable=True)
    construction_period = Column(String(128), nullable=True)
    historical_description = Column(Text, nullable=False)
    cultural_significance = Column(Text, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    image_url = Column(Text, nullable=True)
    image_attribution = Column(String(255), nullable=True)
    verification_status = Column(String(32), default="NEEDS_REVIEW", index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    state = relationship("State", back_populates="heritage_sites")
    city = relationship("City", back_populates="heritage_sites")
    experiences = relationship("CulturalExperience", back_populates="heritage_site")

    __table_args__ = (
        Index("idx_heritage_lat_lng", "latitude", "longitude"),
    )


class Festival(Base):
    __tablename__ = "festivals"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    state_id = Column(String(64), ForeignKey("states.id", ondelete="CASCADE"), nullable=False, index=True)
    city_id = Column(String(64), ForeignKey("cities.id", ondelete="SET NULL"), nullable=True, index=True)
    category = Column(String(64), nullable=False, index=True)
    cultural_significance = Column(Text, nullable=False)
    traditional_period = Column(String(128), nullable=True)
    date_type = Column(String(32), nullable=False, default="APPROX_SEASONAL")  # FIXED, LUNAR, ANNUAL_OFFICIAL, APPROX_SEASONAL
    exact_date = Column(String(64), nullable=True)
    date_source = Column(String(255), nullable=True)
    rituals = Column(JSON, nullable=True)
    regional_context = Column(Text, nullable=True)
    image_url = Column(Text, nullable=True)
    verification_status = Column(String(32), default="NEEDS_REVIEW", index=True)

    state = relationship("State", back_populates="festivals")
    city = relationship("City", back_populates="festivals")


class Craft(Base):
    __tablename__ = "crafts"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    state_id = Column(String(64), ForeignKey("states.id", ondelete="CASCADE"), nullable=False, index=True)
    city_id = Column(String(64), ForeignKey("cities.id", ondelete="SET NULL"), nullable=True, index=True)
    craft_category = Column(String(128), nullable=False, index=True)
    materials = Column(JSON, nullable=True)
    techniques = Column(Text, nullable=False)
    historical_context = Column(Text, nullable=True)
    gi_status = Column(String(32), default="UNKNOWN", index=True)  # REGISTERED, APPLIED, NOT_REGISTERED, UNKNOWN
    gi_registration_reference = Column(String(128), nullable=True)
    image_url = Column(Text, nullable=True)
    verification_status = Column(String(32), default="NEEDS_REVIEW", index=True)

    state = relationship("State", back_populates="crafts")
    city = relationship("City", back_populates="crafts")
    artisans = relationship("Artisan", back_populates="craft", cascade="all, delete-orphan")


class Artisan(Base):
    __tablename__ = "artisans"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    craft_id = Column(String(64), ForeignKey("crafts.id", ondelete="CASCADE"), nullable=False, index=True)
    location = Column(String(255), nullable=True)
    artisan_cluster = Column(String(255), nullable=True)
    biography = Column(Text, nullable=True)
    source_reference = Column(String(255), nullable=True)
    contact_visibility = Column(String(32), default="NONE")  # PUBLIC, NONE
    verification_status = Column(String(32), default="NEEDS_REVIEW")

    craft = relationship("Craft", back_populates="artisans")


class PerformingArt(Base):
    __tablename__ = "performing_arts"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    state_id = Column(String(64), ForeignKey("states.id", ondelete="CASCADE"), nullable=False, index=True)
    origin_region = Column(String(128), nullable=True)
    category = Column(String(64), nullable=False, index=True)
    description = Column(Text, nullable=False)
    historical_context = Column(Text, nullable=True)
    instruments = Column(JSON, nullable=True)
    cultural_significance = Column(Text, nullable=True)
    image_url = Column(Text, nullable=True)
    verification_status = Column(String(32), default="NEEDS_REVIEW", index=True)

    state = relationship("State", back_populates="performing_arts")


class CulturalExperience(Base):
    __tablename__ = "cultural_experiences"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    category = Column(String(64), nullable=False, index=True)
    city_id = Column(String(64), ForeignKey("cities.id", ondelete="SET NULL"), nullable=True, index=True)
    state_id = Column(String(64), ForeignKey("states.id", ondelete="CASCADE"), nullable=False, index=True)
    description = Column(Text, nullable=False)
    associated_heritage_id = Column(String(64), ForeignKey("heritage_sites.id", ondelete="SET NULL"), nullable=True, index=True)
    associated_craft_id = Column(String(64), ForeignKey("crafts.id", ondelete="SET NULL"), nullable=True, index=True)
    associated_festival_id = Column(String(64), ForeignKey("festivals.id", ondelete="SET NULL"), nullable=True, index=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    informational_or_bookable = Column(String(32), default="INFORMATIONAL", index=True)  # INFORMATIONAL, BOOKABLE
    verification_status = Column(String(32), default="NEEDS_REVIEW", index=True)

    state = relationship("State", back_populates="experiences")
    city = relationship("City", back_populates="experiences")
    heritage_site = relationship("HeritageSite", back_populates="experiences")

    __table_args__ = (
        Index("idx_exp_lat_lng", "latitude", "longitude"),
    )


class CulturalRelationship(Base):
    __tablename__ = "cultural_relationships"

    id = Column(String(64), primary_key=True, index=True)
    source_entity_type = Column(String(64), nullable=False, index=True)
    source_entity_id = Column(String(64), nullable=False, index=True)
    target_entity_type = Column(String(64), nullable=False, index=True)
    target_entity_id = Column(String(64), nullable=False, index=True)
    relationship_type = Column(String(64), nullable=False)
    explanation = Column(Text, nullable=True)


class Source(Base):
    __tablename__ = "sources"

    id = Column(String(64), primary_key=True, index=True)
    organization = Column(String(255), nullable=False)
    source_title = Column(String(255), nullable=False)
    source_url = Column(Text, nullable=False)
    source_type = Column(String(64), nullable=True)
    publication_date = Column(String(64), nullable=True)
    accessed_at = Column(String(64), nullable=True)
    reliability_notes = Column(Text, nullable=True)

    entity_sources = relationship("EntitySource", back_populates="source", cascade="all, delete-orphan")


class EntitySource(Base):
    __tablename__ = "entity_sources"

    id = Column(String(64), primary_key=True, index=True)
    entity_type = Column(String(64), nullable=False, index=True)
    entity_id = Column(String(64), nullable=False, index=True)
    source_id = Column(String(64), ForeignKey("sources.id", ondelete="CASCADE"), nullable=False, index=True)
    supporting_claim = Column(Text, nullable=False)
    verification_status = Column(String(32), default="VERIFIED")

    source = relationship("Source", back_populates="entity_sources")


class Image(Base):
    __tablename__ = "images"

    id = Column(String(64), primary_key=True, index=True)
    entity_type = Column(String(64), nullable=False, index=True)
    entity_id = Column(String(64), nullable=False, index=True)
    image_url = Column(Text, nullable=False)
    attribution = Column(String(255), nullable=True)
    license = Column(String(64), nullable=True)
    source_url = Column(Text, nullable=True)
    verification_status = Column(String(32), default="VERIFIED")


class ItinerarySession(Base):
    __tablename__ = "itinerary_sessions"

    id = Column(String(64), primary_key=True, index=True)
    user_preferences = Column(JSON, nullable=False)
    generated_itinerary = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class SearchLog(Base):
    __tablename__ = "search_logs"

    id = Column(String(64), primary_key=True, index=True)
    query = Column(Text, nullable=False)
    detected_intent = Column(String(64), nullable=True)
    resolved_entity = Column(String(128), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
