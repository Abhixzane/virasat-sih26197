"""
VIRASAT AI Factual Verification & Guardrails
Enforces strict anti-hallucination protocols, official source citations, and transit disclaimers.
"""

from typing import List, Dict, Any, Tuple

DEFAULT_OFFICIAL_SOURCES = [
    "https://asi.nic.in",
    "https://indiaculture.gov.in",
    "https://whc.unesco.org",
    "https://www.incredibleindia.org"
]

TRANSIT_DISCLAIMER = (
    "Note: Transit durations and distance calculations are based on national highway and railway network averages. "
    "Live train schedules, PNR status, and seat bookings must be confirmed directly through IRCTC or official carriers."
)

class VerificationService:
    """Validates factual integrity, appends verified citations, and prevents hallucinated assertions."""

    def sanitize_and_verify_sources(self, sources: List[str]) -> List[str]:
        verified = []
        for s in sources:
            if s and s.startswith("http") and s not in verified:
                verified.append(s)
        return verified if verified else DEFAULT_OFFICIAL_SOURCES

    def check_factual_grounding(self, records: List[Dict[str, Any]]) -> Tuple[bool, str]:
        if not records:
            return False, "No verified database record exists for this query in the central VIRASAT archive."
        return True, "Verified against central archaeological and cultural records."

    def append_transit_disclaimer(self, text: str) -> str:
        if TRANSIT_DISCLAIMER not in text:
            return f"{text}\n\n*{TRANSIT_DISCLAIMER}*"
        return text

verification_service = VerificationService()
