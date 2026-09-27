from typing import List, Dict, Any

class ContextBuilder:
    """
    Constructs the grounded factual context block strictly from retrieved database records.
    Prevents hallucination by isolating what is officially verified.
    """
    @staticmethod
    def build_context_block(records: List[Dict[str, Any]]) -> str:
        if not records:
            return "No verified cultural database records matched this query."

        lines = ["=== VERIFIED DATABASE RECORDS (SINGLE SOURCE OF TRUTH) ==="]
        for idx, rec in enumerate(records, 1):
            rtype = rec.get("_entity_type", "record").upper()
            rname = rec.get("name") or rec.get("title", "Unknown")
            state = rec.get("state", "India")
            lines.append(f"\n[Record {idx}: {rtype}] - {rname} (State: {state})")

            if "description" in rec:
                lines.append(f"Description: {rec['description']}")
            if "cultural_significance" in rec:
                lines.append(f"Cultural Significance: {rec['cultural_significance']}")
            if "historical_period" in rec:
                lines.append(f"Historical Period: {rec['historical_period']}")
            if "architectural_style" in rec:
                lines.append(f"Architectural Style: {rec['architectural_style']}")
            if "materials_used" in rec:
                lines.append(f"Materials Used: {rec['materials_used']}")
            if "production_technique" in rec:
                lines.append(f"Production Technique: {rec['production_technique']}")
            if "instruments" in rec:
                lines.append(f"Instruments: {', '.join(rec['instruments'])}")
            if "narrative" in rec:
                lines.append(f"Traditional Narrative: {rec['narrative']}")
            if "source_url" in rec:
                lines.append(f"Official Source URL: {rec['source_url']}")
            if "verification_status" in rec:
                lines.append(f"Verification Status: {rec['verification_status']}")

        lines.append("\n=== END OF VERIFIED RECORDS ===")
        return "\n".join(lines)
