import os
from typing import Optional, List, Dict, Any
from app.core.config import settings
from app.core.logging import logger

class AIProvider:
    """
    Configurable LLM Provider interface.
    Supports Google Gemini (via google-genai SDK), custom providers,
    and a robust zero-dependency factual synthesis fallback when API credentials are absent.
    """
    def __init__(self):
        self.provider = settings.AI_PROVIDER.lower()
        self.api_key = settings.AI_API_KEY
        self.model_name = settings.AI_MODEL
        self.client = None
        self._initialize_client()

    def _initialize_client(self):
        if not self.api_key:
            logger.info("No AI_API_KEY detected. AI Cultural Guide will operate in Grounded Database Synthesis Fallback mode.")
            return

        try:
            if self.provider == "gemini":
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
                logger.info(f"Initialized Google Gemini Client using model: {self.model_name}")
            else:
                logger.warning(f"Unknown AI_PROVIDER '{self.provider}'. Operating in Fallback mode.")
        except Exception as e:
            logger.error(f"Failed to initialize AI provider client: {e}. Fallback mode active.")
            self.client = None

    def generate_response(
        self,
        prompt: str,
        system_instruction: str,
        retrieved_records: List[Dict[str, Any]],
        language: str = "en"
    ) -> str:
        # 1. If LLM Client is configured and available
        if self.client and self.api_key:
            try:
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                    config={
                        "system_instruction": system_instruction,
                        "temperature": 0.2
                    }
                )
                if response and hasattr(response, "text") and response.text:
                    return response.text
            except Exception as e:
                logger.warning(f"Error calling LLM provider: {e}. Falling back to database synthesis.")

        # 2. Factual Database Synthesis Fallback
        return self._synthesize_grounded_fallback(retrieved_records, language)

    def _synthesize_grounded_fallback(self, records: List[Dict[str, Any]], language: str = "en") -> str:
        if not records:
            if language == "hi":
                return (
                    "क्षमा करें, विरासत डेटाबेस में इस खोज के लिए वर्तमान में कोई सत्यापित रिकॉर्ड उपलब्ध नहीं है। "
                    "ऐतिहासिक प्रामाणिकता बनाए रखने के लिए, मैं अप्रमाणित जानकारी नहीं देता।"
                )
            elif language == "hinglish":
                return (
                    "Sorry, VIRASAT database me currently is query ke liye koi verified records available nahi hain. "
                    "Historical authenticity maintain karne ke liye, bina verified sources ke assumptions nahi banaye ja sakte."
                )
            return (
                "The VIRASAT cultural database does not currently contain verified records for this inquiry. "
                "To maintain strict historical and archaeological integrity, unverified assertions are not generated."
            )

        primary = records[0]
        rtype = primary.get("_entity_type", "record").replace("_", " ").title()
        rname = primary.get("name") or primary.get("title", "Cultural Record")
        state = primary.get("state", "India")
        desc = primary.get("description") or primary.get("narrative", "")
        significance = primary.get("cultural_significance") or primary.get("historical_significance", "")
        period = primary.get("historical_period") or primary.get("origin") or primary.get("month_or_season", "")

        lines = []
        if language == "hi":
            lines.append(f"### {rname} ({rtype} — {state})\n")
            lines.append(f"**अवलोकन:** {desc}\n")
            if significance:
                lines.append(f"**सांस्कृतिक व ऐतिहासिक महत्व:** {significance}\n")
            if period:
                lines.append(f"**ऐतिहासिक पृष्ठभूमि / काल:** {period}\n")
            if len(records) > 1:
                lines.append("\n**संबंधित सांस्कृतिक विरासत (Connected Heritage):**")
                for r in records[1:4]:
                    rn = r.get("name") or r.get("title", "")
                    rt = r.get("_entity_type", "").title()
                    lines.append(f"- **{rn}** ({rt}, {r.get('state', '')})")
        elif language == "hinglish":
            lines.append(f"### {rname} ({rtype} — {state})\n")
            lines.append(f"**Overview:** {desc}\n")
            if significance:
                lines.append(f"**Cultural Significance:** {significance}\n")
            if period:
                lines.append(f"**Historical Timeline / Context:** {period}\n")
            if len(records) > 1:
                lines.append("\n**Connected Cultural Heritage:**")
                for r in records[1:4]:
                    rn = r.get("name") or r.get("title", "")
                    rt = r.get("_entity_type", "").title()
                    lines.append(f"- **{rn}** ({rt}, {r.get('state', '')})")
        else:
            lines.append(f"### {rname} ({rtype} — {state})\n")
            lines.append(f"**Overview & Context:**\n{desc}\n")
            if significance:
                lines.append(f"**Cultural & Historical Significance:**\n{significance}\n")
            if period:
                lines.append(f"**Period / Seasonal Context:** {period}\n")

            if len(records) > 1:
                lines.append("\n**Connected Cultural Intelligence (Related Records):**")
                for r in records[1:4]:
                    rn = r.get("name") or r.get("title", "")
                    rt = r.get("_entity_type", "").title()
                    lines.append(f"- **{rn}** ({rt}, {r.get('state', '')}): {r.get('description', '')[:120]}...")

        lines.append("\n*Note: Information strictly grounded in verified database records from ASI and State Tourism Archives.*")
        return "\n".join(lines)

ai_provider = AIProvider()
