import math
from typing import List, Dict, Any, Optional
from app.repositories.cultural_repository import cultural_repository
from app.models.schemas import (
    ItineraryRequest, ItineraryResponse, ItineraryDay,
    HeritagePlace, CulturalExperience, Coordinates
)

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Computes the great-circle distance between two GPS coordinates in kilometers.
    Used for nearest-neighbor spatial clustering and sequencing.
    """
    R = 6371.0  # Earth's radius in kilometers
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2.0)**2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def order_places_nearest_neighbor(places: List[HeritagePlace]) -> List[HeritagePlace]:
    """
    Orders a list of heritage sites using a nearest-neighbor spatial sequence
    to minimize travel fatigue and prevent erratic back-and-forth jumps across regions.
    """
    if len(places) <= 1:
        return list(places)

    unvisited = list(places)
    # Start with the first place in the verified list
    ordered = [unvisited.pop(0)]

    while unvisited:
        curr = ordered[-1]
        next_idx = min(
            range(len(unvisited)),
            key=lambda i: haversine_distance(
                curr.latitude, curr.longitude,
                unvisited[i].latitude, unvisited[i].longitude
            )
        )
        ordered.append(unvisited.pop(next_idx))

    return ordered


class ItineraryService:
    """
    Cultural Itinerary Generator.
    Assembles day-wise cultural journeys exclusively using verified database records.
    Clusters sites spatially via nearest-neighbor routing (max 3-4 sites/day).
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
            matched_places = list(self.repo.heritage_places[:req.days * 3])
        if not matched_exps:
            matched_exps = list(self.repo.experiences[:req.days])

        # 2. Nearest-Neighbor Spatial Sequencing
        ordered_places = order_places_nearest_neighbor(matched_places)

        # 3. Associated regional festivals & living traditions
        associated_fests: List[str] = []
        for f in self.repo.festivals:
            if dest_clean in f.state.lower() or dest_clean in f.region.lower():
                associated_fests.append(f"{f.name} ({f.month_or_season})")

        days_list: List[ItineraryDay] = []
        all_coords: List[Coordinates] = []

        # 4. Partition sites across days (max 3-4 sites/day to avoid fatigue)
        total_places = len(ordered_places)
        max_sites_per_day = 4
        sites_per_day = min(max_sites_per_day, max(1, math.ceil(total_places / req.days)))

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
            start_idx = (d - 1) * sites_per_day
            end_idx = min(d * sites_per_day, total_places)
            p_slice = ordered_places[start_idx:end_idx]

            # If places were exhausted before reaching total days, cycle back smoothly
            if not p_slice and ordered_places:
                p_slice = [ordered_places[(d - 1) % total_places]]

            # Ensure ticket prices and opening hours are not fabricated
            for p in p_slice:
                p.entry_fee = None
                p.opening_hours = None
                all_coords.append(Coordinates(lat=p.latitude, lng=p.longitude))

            # Find closest cultural experience to this day's geographic center
            if p_slice:
                avg_lat = sum(p.latitude for p in p_slice) / len(p_slice)
                avg_lng = sum(p.longitude for p in p_slice) / len(p_slice)
            else:
                avg_lat, avg_lng = 20.5937, 78.9629

            # Pair nearest experience
            if matched_exps:
                closest_exp = min(
                    matched_exps,
                    key=lambda e: haversine_distance(avg_lat, avg_lng, e.latitude, e.longitude)
                )
                closest_exp.entry_fee = None
                closest_exp.opening_hours = None
                e_slice = [closest_exp]
                all_coords.append(Coordinates(lat=closest_exp.latitude, lng=closest_exp.longitude))
            else:
                e_slice = []

            theme = day_themes[(d - 1) % len(day_themes)]
            place_names = ", ".join([p.name for p in p_slice]) if p_slice else "heritage landmarks"
            exp_names = ", ".join([e.name for e in e_slice]) if e_slice else "artisan traditions"

            explanation = (
                f"Day {d} centers on {theme}. You will visit {place_names}, "
                f"sequenced via nearest-neighbor geographic progression to minimize transit fatigue. "
                f"Conclude in the afternoon/evening with {exp_names} to understand how local communities "
                f"preserve these cultural lineages today."
            )

            days_list.append(ItineraryDay(
                day_number=d,
                theme=theme,
                heritage_places=p_slice,
                cultural_experiences=e_slice,
                cultural_explanation=explanation,
                associated_traditions=associated_fests[:3]
            ))

        target_title = f"{req.state_or_destination.title()} Cultural Heritage Journey ({req.days} Days)"
        overview = (
            f"A curated cultural itinerary across {req.state_or_destination.title()} "
            f"exploring {len(ordered_places)} verified historical monuments and {len(matched_exps)} cultural experiences, "
            f"sequenced geographically using nearest-neighbor routing directly from the VIRASAT archaeological database."
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
