# VIRASAT — Verified Cultural Data Sources & Provenance

## 1. Primary Source Hierarchy & Authority

VIRASAT enforces a strict evidence-based data ingestion policy. No entity, date, or claim is introduced without backing from authorized cultural bodies:

1. **Monuments & Archaeological Sites:**
   - Archaeological Survey of India (ASI): `asi.nic.in`
   - UNESCO World Heritage Centre: `whc.unesco.org`
   - Ministry of Culture, Government of India: `indiaculture.gov.in`
   - National Mission on Monuments and Antiquities (NMMA)

2. **Festivals & Intangible Cultural Heritage:**
   - Sangeet Natak Akademi: `sangeetnatak.gov.in`
   - Sahitya Akademi: `sahitya-akademi.gov.in`
   - UNESCO Representative List of the Intangible Cultural Heritage of Humanity

3. **Traditional Crafts, Textiles & Artisans:**
   - Office of the Development Commissioner (Handicrafts), Ministry of Textiles: `handicrafts.nic.in`
   - Geographical Indications Registry of India, Intellectual Property India: `ipindia.gov.in`
   - National Handicrafts and Handlooms Museum (National Crafts Museum), New Delhi

4. **Folk & Classical Performing Arts:**
   - Indira Gandhi National Centre for the Arts (IGNCA): `ignca.gov.in`
   - Sangeet Natak Akademi Archives

5. **Geography & Spatial Coordinates:**
   - Survey of India
   - OpenStreetMap & Geospatial Open Data

---

## 2. Verification Status Definitions

Every content record in VIRASAT carries an explicit `verification_status`:
- `VERIFIED`: Multiple independent, primary institutional sources (e.g. ASI + UNESCO) corroborating coordinates, historical timeline, and cultural significance.
- `PARTIALLY_VERIFIED`: Corroborated by a single credible state or national tourism archive; minor details undergoing archival review.
- `NEEDS_REVIEW`: Newly submitted or ingested record awaiting primary source confirmation (default import state).
- `UNVERIFIED`: General public submission or historical oral tradition without formal institutional archaeological documentation.

---

## 3. Image Provenance & Licensing Standards

To comply with intellectual property and copyright laws:
- Images are sourced exclusively from Wikimedia Commons under Creative Commons licenses (`CC BY-SA 4.0`, `CC BY 2.0`, `Public Domain`), official State Tourism free-press portals, or direct open-access cultural registries.
- Each image stored tracks:
  - `attribution`: Exact photographer, author, or institutional attribution.
  - `license`: Explicit license identifier.
  - `source_url`: Verifiable upstream URL.
- If a verified photograph is unavailable, VIRASAT presents an elegant, neutral architectural line-art illustration rather than substituting an unrelated or deceptive stock photo.
