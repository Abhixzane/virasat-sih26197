import re
from typing import Optional, List, Dict
from app.repositories.cultural_repository import cultural_repository
from app.models.schemas import SearchResponse, SearchResultItem

class SearchService:
    """
    Universal Cultural Search Engine.
    Searches across all 7 cultural collections with partial matching,
    case-insensitivity, category filters, state filters, scoring, and grouped results.
    """
    def __init__(self, repo=cultural_repository):
        self.repo = repo

    def search(
        self,
        query: str,
        category: Optional[str] = None,
        state: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> SearchResponse:
        clean_q = query.strip().lower() if query else ""
        tokens = [t for t in re.split(r'\s+', clean_q) if t] if clean_q else []

        matches: List[SearchResultItem] = []

        def calculate_score(name: str, desc: str, cat: str, st: str) -> float:
            score = 0.0
            name_low = name.lower()
            desc_low = desc.lower()
            cat_low = cat.lower()
            st_low = st.lower()

            if clean_q:
                # Exact match
                if clean_q == name_low:
                    score += 10.0
                elif name_low.startswith(clean_q):
                    score += 7.0
                elif clean_q in name_low:
                    score += 5.0
                elif clean_q in cat_low or clean_q in st_low:
                    score += 3.0
                elif clean_q in desc_low:
                    score += 2.0

                # Token match
                for token in tokens:
                    if token in name_low:
                        score += 3.0
                    elif token in cat_low or token in st_low:
                        score += 2.0
                    elif token in desc_low:
                        score += 1.0
            else:
                score = 1.0  # Default score when browsing without query

            return score

        # 1. Search Heritage Places
        for p in self.repo.heritage_places:
            if state and p.state.lower() != state.strip().lower():
                continue
            if category and category.lower() not in p.category.lower() and category.lower() != "heritage":
                continue
            sc = calculate_score(p.name, p.description, p.category, p.state)
            if not clean_q or sc > 0:
                matches.append(SearchResultItem(
                    id=p.id,
                    name=p.name,
                    type="heritage",
                    state=p.state,
                    category=p.category,
                    description=p.description[:220] + ("..." if len(p.description) > 220 else ""),
                    image_url=p.image_url,
                    score=sc,
                    verification_status=p.verification_status
                ))

        # 2. Search Festivals & Traditions
        for f in self.repo.festivals:
            if state and f.state.lower() != state.strip().lower():
                continue
            if category and category.lower() not in f.category.lower() and category.lower() != "festival":
                continue
            sc = calculate_score(f.name, f.description + " " + f.cultural_significance, f.category, f.state)
            if not clean_q or sc > 0:
                matches.append(SearchResultItem(
                    id=f.id,
                    name=f.name,
                    type="festival",
                    state=f.state,
                    category=f.category,
                    description=f.description[:220] + ("..." if len(f.description) > 220 else ""),
                    image_url=f.image_url,
                    score=sc,
                    verification_status=f.verification_status
                ))

        # 3. Search Arts & Crafts
        for a in self.repo.arts_crafts:
            if state and a.state.lower() != state.strip().lower():
                continue
            if category and category.lower() not in a.craft_category.lower() and category.lower() != "art_craft":
                continue
            sc = calculate_score(a.name, a.description + " " + a.materials_used, a.craft_category, a.state)
            if not clean_q or sc > 0:
                matches.append(SearchResultItem(
                    id=a.id,
                    name=a.name,
                    type="art_craft",
                    state=a.state,
                    category=a.craft_category,
                    description=a.description[:220] + ("..." if len(a.description) > 220 else ""),
                    image_url=a.image_url,
                    score=sc,
                    verification_status=a.verification_status
                ))

        # 4. Search Folk and Performing Arts
        for pa in self.repo.performing_arts:
            if state and pa.state.lower() != state.strip().lower():
                continue
            if category and category.lower() not in pa.category.lower() and category.lower() != "performing_art":
                continue
            sc = calculate_score(pa.name, pa.description + " " + " ".join(pa.instruments), pa.category, pa.state)
            if not clean_q or sc > 0:
                matches.append(SearchResultItem(
                    id=pa.id,
                    name=pa.name,
                    type="performing_art",
                    state=pa.state,
                    category=pa.category,
                    description=pa.description[:220] + ("..." if len(pa.description) > 220 else ""),
                    image_url=pa.image_url,
                    score=sc,
                    verification_status=pa.verification_status
                ))

        # 5. Search Cultural Experiences
        for exp in self.repo.experiences:
            if state and exp.state.lower() != state.strip().lower():
                continue
            if category and category.lower() not in exp.category.lower() and category.lower() != "experience":
                continue
            sc = calculate_score(exp.name, exp.description, exp.category, exp.state)
            if not clean_q or sc > 0:
                matches.append(SearchResultItem(
                    id=exp.id,
                    name=exp.name,
                    type="experience",
                    state=exp.state,
                    category=exp.category,
                    description=exp.description[:220] + ("..." if len(exp.description) > 220 else ""),
                    image_url=exp.image_url,
                    score=sc,
                    verification_status=exp.verification_status
                ))

        # 6. Search Cultural Stories
        for s in self.repo.stories:
            if state and s.state.lower() != state.strip().lower():
                continue
            if category and category.lower() not in s.story_category.lower() and category.lower() != "story":
                continue
            sc = calculate_score(s.title, s.narrative, s.story_category, s.state)
            if not clean_q or sc > 0:
                matches.append(SearchResultItem(
                    id=s.id,
                    name=s.title,
                    type="story",
                    state=s.state,
                    category=s.story_category,
                    description=s.narrative[:220] + ("..." if len(s.narrative) > 220 else ""),
                    image_url="https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80",
                    score=sc,
                    verification_status=s.verification_status
                ))

        # 7. Search States and Cities
        for sc_item in self.repo.states_and_cities:
            if state and sc_item.state.lower() != state.strip().lower():
                continue
            sc = calculate_score(sc_item.name, sc_item.description, sc_item.region, sc_item.state)
            if not clean_q or sc > 0:
                item_type = getattr(sc_item, "type", "city")
                matches.append(SearchResultItem(
                    id=sc_item.id,
                    name=sc_item.name,
                    type="state" if item_type == "state" else "city",
                    state=sc_item.state,
                    category=sc_item.region,
                    description=sc_item.description[:220] + ("..." if len(sc_item.description) > 220 else ""),
                    image_url=sc_item.image_url,
                    score=sc,
                    verification_status="VERIFIED"
                ))

        # Sort by score descending
        matches.sort(key=lambda x: x.score, reverse=True)

        # Pagination
        paginated = matches[offset: offset + limit]

        # Result Grouping
        grouped: Dict[str, List[SearchResultItem]] = {
            "heritage": [],
            "festival": [],
            "art_craft": [],
            "performing_art": [],
            "experience": [],
            "story": [],
            "state_city": []
        }

        for item in paginated:
            if item.type in grouped:
                grouped[item.type].append(item)
            elif item.type in ["state", "city"]:
                grouped["state_city"].append(item)
            else:
                grouped.setdefault(item.type, []).append(item)

        return SearchResponse(
            query=query,
            total_matches=len(matches),
            grouped_results=grouped,
            flat_results=paginated
        )

search_service = SearchService()
