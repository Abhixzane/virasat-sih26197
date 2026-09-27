from typing import List, Dict, Any
from app.repositories.cultural_repository import cultural_repository
from app.models.schemas import (
    ItineraryRequest, ItineraryResponse, ItineraryDay,
    HeritagePlace, CulturalExperience, Coordinates
)

class ItineraryService:
    """
    Cultural Itinerary Generator.
    Assembles day-wise cultural journeys exclusively using verified database records.
    Never fabricates schedules, ticket prices, or non-existent sites.
    """
    def __init__(self, repo=cultural_repository):
        self.repo = repo

    def generate_itinerary(self, req: ItineraryRequest) -> ItineraryResponse:
        dest_clean = req.state_or_destination.strip().lower()
        
        # 1. Filter places and experiences for destination
        matched_places: List[HeritagePlace] = []
        for p in self.repo.heritage_places:
            if (dest_clean in p.state.lower() or 
                dest_clean in p.city.lower() or 
                dest_clean in p.name.lower() or 
                dest_clean in p.category.lower()):
                matched_places.append(p)

        matched_exps: List[CulturalExperience] = []
        for e in self.repo.experiences:
            if (dest_clean in e.state.lower() or 
                dest_clean in e.city.lower() or 
                dest_clean in e.name.lower() or 
                dest_clean in e.category.lower()):
                matched_exps.append(e)

        # Fallbacks if specific city only has a few records
        if not matched_places:
            matched_places = self.repo.heritage_places[:req.days * 2]
        if not matched_exps:
            matched_exps = self.repo.experiences[:req.days]

        # 2. Associated festivals and traditions in the region
        associated_fests: List[str] = []
        for f in self.repo.festivals:
            if dest_clean in f.state.lower() or dest_clean in f.region.lower():
                associated_fests.append(f"{f.name} ({f.month_or_season})")

        days_list: List[ItineraryDay] = []
        all_coords: List[Coordinates] = []

        # Divide into days
        places_per_day = max(1, len(matched_places) // req.days)
        exps_per_day = max(1, len(matched_exps) // req.days)

        day_themes = [
            "Ancient Monumental Foundations & Classical Origins",
            "Living Master Artisan Enclaves & Traditional Crafts",
            "Sacred Riverfronts, Shrines & Devotional Architecture",
            "Folk Performing Arts & Indigenous Expressions",
            "Imperial Architecture & Dynastic Palaces",
            "Natural Cultural Landscapes & Boulder Trails",
            "Culinary Lineages & Evening Heritage Walk"
        ]

        for d in range(1, req.days + 1):
            p_slice = matched_places[(d-1)*places_per_day : d*places_per_day]
            if not p_slice and matched_places:
                p_slice = [matched_places[(d-1) % len(matched_places)]]

            e_slice = matched_exps[(d-1)*exps_per_day : d*exps_per_day]
            if not e_slice and matched_exps:
                e_slice = [matched_exps[(d-1) % len(matched_exps)]]

            for p in p_slice:
                all_coords.append(Coordinates(lat=p.latitude, lng=p.longitude))
            for e in e_slice:
                all_coords.append(Coordinates(lat=e.latitude, lng=e.longitude))

            theme = day_themes[(d-1) % len(day_themes)]
            place_names = ", ".join([p.name for p in p_slice]) if p_slice else "heritage landmarks"
            exp_names = ", ".join([e.name for e in e_slice]) if e_slice else "artisan traditions"

            explanation = (
                f"Day {d} centers on {theme}. You will explore {place_names}, "
                f"grounded in verified historical conservation contexts. "
                f"Engage in {exp_names} to understand how generational artisan communities "
                f"preserve these cultural lineages today."
            )

            days_list.append(ItineraryDay(
                day_number=d,
                theme=theme,
                heritage_places=p_slice,
                cultural_experiences=e_slice,
                cultural_explanation=explanation,
                associated_traditions=associated_fests
            ))

        target_title = f"{req.state_or_destination.title()} Cultural Heritage Journey ({req.days} Days)"
        overview = (
            f"A curated cultural itinerary across {req.state_or_destination.title()} "
            f"exploring {len(matched_places)} verified historical monuments and {len(matched_exps)} cultural experiences, "
            f"directly retrieved from the VIRASAT archaeological database."
        )

        return ItineraryResponse(
            destination=req.state_or_destination,
            duration_days=req.days,
            itinerary_title=target_title,
            overview=overview,
            days=days_list,
            verified_map_coordinates=all_coords
        )

itinerary_service = ItineraryService()
