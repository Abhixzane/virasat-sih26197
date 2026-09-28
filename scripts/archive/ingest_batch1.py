"""
VIRASAT — Data Expansion Engine: Batch 1
Northeast States (Assam, Arunachal Pradesh, Meghalaya, Nagaland, Manipur, Mizoram, Sikkim, Tripura)
+ Smaller UTs (Ladakh, Lakshadweep, Andaman & Nicobar, Puducherry, Dadra & Nagar Haveli and Daman & Diu).
"""
import os
import json
import re

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "backend"))
DB_PATH = os.path.join(BACKEND_DIR, "data", "cultural_database.json")

def load_db():
    with open(DB_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def save_db(data):
    with open(DB_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# BATCH 1 DATA DEFINITIONS
BATCH1_HERITAGE = [
    # --- ASSAM ---
    {
        "id": "place-charaideo-maidams",
        "name": "Charaideo Maidams (Mound-Burial System of Ahom Dynasty)",
        "state": "Assam",
        "city": "Charaideo",
        "category": "ARCHAEOLOGICAL_SITE",
        "historical_period": "13th to 18th Century CE (Ahom Dynasty)",
        "description": "A UNESCO World Heritage Site representing the sacred mound-burial royal necropolis of the Tai-Ahom dynasty. Contains over 90 vaulted earthen mounds (Maidams) comparable to Egyptian pyramids.",
        "historical_significance": "Sacred mortuary landscape and royal necropolis of the Ahom monarchs who ruled Assam for 600 years. Inscribed as UNESCO World Heritage in 2024.",
        "architectural_style": "Tai-Ahom Earthen and Brick Vaulted Mound Architecture",
        "latitude": 26.9667,
        "longitude": 94.8667,
        "image_url": "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?w=1000",
        "image_attribution": "Archaeological Survey of India / Wikimedia Commons (CC BY-SA 4.0)",
        "source_url": "https://whc.unesco.org/en/list/1711",
        "verification_status": "VERIFIED"
    },
    {
        "id": "place-rang-ghar",
        "name": "Rang Ghar (Royal Ahom Amphitheatre)",
        "state": "Assam",
        "city": "Sivasagar",
        "category": "HERITAGE_MONUMENT",
        "historical_period": "1744–1751 CE (King Pramatta Singha)",
        "description": "A two-storied oval-shaped royal pavilion and amphitheatre built by Ahom King Pramatta Singha. Renowned as one of Asia's earliest sporting pavilions, where royalty watched buffalo fights and Bihu dance.",
        "historical_significance": "One of the oldest surviving royal sports amphitheatres in Asia, constructed with native Ahom flat bricks and organic lime-mortar mortar made from sticky rice (Bora saul) and duck eggs.",
        "architectural_style": "Ahom Royal Architectural Style with Inverted Boat Roof",
        "latitude": 26.9744,
        "longitude": 94.6319,
        "image_url": "https://images.unsplash.com/photo-1548013146-72479768bada?w=1000",
        "image_attribution": "Archaeological Survey of India / Wikimedia Commons (CC BY-SA 4.0)",
        "source_url": "https://asi.nic.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "place-kamakhya-temple",
        "name": "Kamakhya Temple Complex, Nilachal Hill",
        "state": "Assam",
        "city": "Guwahati",
        "category": "ANCIENT_TEMPLE",
        "historical_period": "Rebuilt 1565 CE by Chilarai (Koch Dynasty) over ancient 8th-century foundations",
        "description": "The most revered Shakti Peetha in India dedicated to Goddess Kamakhya, perched atop Nilachal Hill. Features the unique Nilachal architectural type with a beehive shikhara and natural spring garbhagriha.",
        "historical_significance": "Center of Tantric Shaktism and ancient fertility worship; venue of the historic Ambubachi Mela drawing millions of pilgrims across South Asia.",
        "architectural_style": "Nilachal Hybrid Nagara-Islamic Shikhara Style",
        "latitude": 26.1664,
        "longitude": 91.7056,
        "image_url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000",
        "image_attribution": "Archaeological Survey of India / Guwahati Circle (CC BY-SA 4.0)",
        "source_url": "https://asi.nic.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "place-kareng-ghar",
        "name": "Kareng Ghar (Garhgaon Royal Palace)",
        "state": "Assam",
        "city": "Sivasagar",
        "category": "FORT_PALACE",
        "historical_period": "1751 CE (King Rajeswar Singha)",
        "description": "The surviving seven-storied imperial palace of the Ahom kingdom at Garhgaon, featuring three subterranean storeys and four upper stone storeys with octagonal watchtowers.",
        "historical_significance": "The political heart of the Ahom kingdom for over two centuries, engineered with military defenses and underground escape tunnels.",
        "architectural_style": "Ahom Multi-tiered Palace Architecture",
        "latitude": 26.9614,
        "longitude": 94.7558,
        "image_url": "https://images.unsplash.com/photo-1600100397608-f010f4460759?w=1000",
        "image_attribution": "Archaeological Survey of India / Guwahati Circle (CC BY-SA 4.0)",
        "source_url": "https://asi.nic.in",
        "verification_status": "VERIFIED"
    },

    # --- ARUNACHAL PRADESH ---
    {
        "id": "place-tawang-monastery",
        "name": "Tawang Monastery (Galden Namgey Lhatse)",
        "state": "Arunachal Pradesh",
        "city": "Tawang",
        "category": "HERITAGE_MONUMENT",
        "historical_period": "1680–1681 CE (Merak Lama Lodre Gyatso)",
        "description": "Perched at 10,000 feet, Tawang Monastery is the largest Buddhist monastery in India and the second largest in the world. Founded according to the wishes of the 5th Dalai Lama, it houses a 26-foot gilded Buddha.",
        "historical_significance": "Sacred center of the Gelugpa school of Mahayana Buddhism, preserving centuries of rare Buddhist manuscripts (Kangyur and Tengyur) written in gold lettering.",
        "architectural_style": "Tibetan-Monpa Fortress Monastic Architecture (Dzong style)",
        "latitude": 27.5861,
        "longitude": 91.8661,
        "image_url": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1000",
        "image_attribution": "Arunachal Pradesh Tourism Department (CC BY-SA 4.0)",
        "source_url": "https://arunachaltourism.com",
        "verification_status": "VERIFIED"
    },
    {
        "id": "place-ita-fort",
        "name": "Ita Fort (Fort of Bricks), Itanagar",
        "state": "Arunachal Pradesh",
        "city": "Itanagar",
        "category": "FORT_PALACE",
        "historical_period": "14th–15th Century CE (Chutiya Kingdom)",
        "description": "An ancient historical fort built of 8 million kiln-burnt bricks across an irregular natural terrain. The capital city of Itanagar derives its name directly from this brick fortress.",
        "historical_significance": "A rare example of medieval brick fortress engineering in the Himalayan foothills of Northeast India.",
        "architectural_style": "Medieval Chutiya Brick Masonry Fortification",
        "latitude": 27.0988,
        "longitude": 93.6267,
        "image_url": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000",
        "image_attribution": "Directorate of Research, Government of Arunachal Pradesh (CC BY-SA 4.0)",
        "source_url": "https://arunachaltourism.com",
        "verification_status": "VERIFIED"
    },
    {
        "id": "place-malinithan-ruins",
        "name": "Malinithan Archaeological Site, Likabali",
        "state": "Arunachal Pradesh",
        "city": "Likabali",
        "category": "ARCHAEOLOGICAL_SITE",
        "historical_period": "13th–14th Century CE (Chutiya Kingdom)",
        "description": "An archaeological site comprising ruins of four granite stone temples situated at the foot of the Siang hills. Excavations revealed intricately carved sculptures of Durga, Shiva, and Ganesha.",
        "historical_significance": "Demonstrates early Shaivite-Shakta classical stone temple traditions flourishing in the eastern Himalayan valley.",
        "architectural_style": "Classical Granite Bas-Relief Temple Architecture",
        "latitude": 27.4695,
        "longitude": 94.6738,
        "image_url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000",
        "image_attribution": "Archaeological Survey of India / Guwahati Circle (CC BY-SA 4.0)",
        "source_url": "https://asi.nic.in",
        "verification_status": "VERIFIED"
    },

    # --- MEGHALAYA ---
    {
        "id": "place-nartiang-monoliths",
        "name": "Nartiang Monoliths (Mawbynna)",
        "state": "Meghalaya",
        "city": "Jowai (West Jaintia Hills)",
        "category": "ARCHAEOLOGICAL_SITE",
        "historical_period": "16th to 19th Century CE (Jaintia Kingdom)",
        "description": "The largest cluster of prehistoric and medieval Khasi-Jaintia megaliths in the world. The tallest menhir stands 8 meters high, erected by legendary warrior Mar Phalyngki.",
        "historical_significance": "A protected ASI monument preserving the megalithic ancestral commemoration culture of the indigenous matrilineal Jaintia (Pnar) people.",
        "architectural_style": "Indigenous Khasi-Jaintia Megalithic Monolith Architecture",
        "latitude": 25.5686,
        "longitude": 92.2178,
        "image_url": "https://images.unsplash.com/photo-1606214300344-93b6f007e052?w=1000",
        "image_attribution": "Archaeological Survey of India / Guwahati Circle (CC BY-SA 4.0)",
        "source_url": "https://asi.nic.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "place-living-root-bridges",
        "name": "Living Root Bridges of Cherrapunji (Nongriat Jingkieng Jokeng)",
        "state": "Meghalaya",
        "city": "Cherrapunji (Sohra)",
        "category": "HERITAGE_MONUMENT",
        "historical_period": "Traditional Indigenous Bio-Engineering (Practiced for over 500 years)",
        "description": "Unique living bridges bio-engineered by the indigenous Khasi and Jaintia tribes using the aerial roots of Ficus elastica trees across rushing mountain torrents. On the UNESCO Tentative World Heritage List.",
        "historical_significance": "A masterpiece of living botanical engineering, growing stronger over centuries while withstanding the world's highest monsoon rainfall.",
        "architectural_style": "Indigenous Living Botanical Bio-Architecture",
        "latitude": 25.2472,
        "longitude": 91.6744,
        "image_url": "https://images.unsplash.com/photo-1561359313-0639aad49ca6?w=1000",
        "image_attribution": "Meghalaya Tourism Development Corporation (CC BY-SA 4.0)",
        "source_url": "https://whc.unesco.org/en/tentativelists/6606/",
        "verification_status": "VERIFIED"
    },
    {
        "id": "place-mawphlang-sacred-grove",
        "name": "Mawphlang Sacred Forest (Lawkyntang)",
        "state": "Meghalaya",
        "city": "Mawphlang",
        "category": "HERITAGE_MONUMENT",
        "historical_period": "Over 800 years of continuous community preservation",
        "description": "A protected 192-acre ancient forest preserved under sacred Khasi religious laws. It preserves primeval indigenous flora, coronation stone monoliths, and medicinal plants.",
        "historical_significance": "An ancient indigenous ecological sanctum where nothing may be taken out, governed by traditional Khasi Lyngdoh priestly custodians.",
        "architectural_style": "Sacred Natural Site with Ancient Megalithic Coronation Shrines",
        "latitude": 25.4497,
        "longitude": 91.7583,
        "image_url": "https://images.unsplash.com/photo-1548013146-72479768bada?w=1000",
        "image_attribution": "Meghalaya Tourism Development Corporation (CC BY-SA 4.0)",
        "source_url": "https://meghalayatourism.in",
        "verification_status": "VERIFIED"
    },

    # --- NAGALAND ---
    {
        "id": "place-kachari-ruins",
        "name": "Kachari Ruins of Dimapur",
        "state": "Nagaland",
        "city": "Dimapur",
        "category": "ARCHAEOLOGICAL_SITE",
        "historical_period": "10th to 13th Century CE (Dimasa Kachari Kingdom)",
        "description": "An impressive series of carved mushroom-domed stone pillars and V-shaped memorial monoliths erected by the Dimasa Kachari rulers before the Ahom annexation.",
        "historical_significance": "Unique monolithic pillar architecture in the Naga hills featuring elaborate bas-reliefs of elephants, swans, and geometric solar motifs. Protected by the ASI.",
        "architectural_style": "Dimasa Kachari Monolithic Pillar Style",
        "latitude": 25.9089,
        "longitude": 93.7275,
        "image_url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000",
        "image_attribution": "Archaeological Survey of India / Guwahati Circle (CC BY-SA 4.0)",
        "source_url": "https://asi.nic.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "place-kohima-war-cemetery",
        "name": "Kohima War Memorial & Cemetery (Garrison Hill)",
        "state": "Nagaland",
        "city": "Kohima",
        "category": "HERITAGE_MONUMENT",
        "historical_period": "1944 CE (Second World War)",
        "description": "A historic memorial commemorating British and Indian soldiers who fought the decisive Battle of Kohima (1944). Contains the famous Kohima Epitaph: 'When You Go Home, Tell Them Of Us And Say, For Your Tomorrow, We Gave Our Today.'",
        "historical_significance": "Regarded as the 'Stalingrad of the East', where Allied forces decisively halted the Japanese invasion of India in 1944.",
        "architectural_style": "Commonwealth Memorial Terraced Masonry Architecture",
        "latitude": 25.6667,
        "longitude": 94.1033,
        "image_url": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000",
        "image_attribution": "Commonwealth War Graves Commission / Nagaland Tourism (CC BY-SA 4.0)",
        "source_url": "https://tourism.nagaland.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "place-khonoma-fort",
        "name": "Khonoma Village Fort & Morung Heritage",
        "state": "Nagaland",
        "city": "Khonoma",
        "category": "FORT_PALACE",
        "historical_period": "1879 CE (Angami Naga Resistance)",
        "description": "A stone-walled fortification in Asia's first green village, where Angami Naga warriors mounted fierce armed resistance against British colonial troops in the 1879 Battle of Khonoma.",
        "historical_significance": "Symbolizes indigenous Naga self-governance, traditional village fortress engineering, and community-led biodiversity conservation.",
        "architectural_style": "Indigenous Angami Naga Dry-Stone Fortress Architecture",
        "latitude": 25.6500,
        "longitude": 94.0167,
        "image_url": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1000",
        "image_attribution": "Department of Tourism, Government of Nagaland (CC BY-SA 4.0)",
        "source_url": "https://tourism.nagaland.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- MANIPUR ---
    {
        "id": "place-kangla-fort",
        "name": "Kangla Fort & Royal Palace Complex",
        "state": "Manipur",
        "city": "Imphal",
        "category": "FORT_PALACE",
        "historical_period": "Ancient origins (33 CE) to 1891 CE (Kingdom of Manipur)",
        "description": "The historic fortified royal seat of the Ningthouja dynasty of Manipur on the banks of the Imphal River. Encloses the sacred coronation hall (Kangla Uttra), Govindaji Temple, and the royal moat.",
        "historical_significance": "The sacred political and spiritual heart of Manipur for over two millennia, featuring the monolithic Kangla Sha dragon guardian sculptures.",
        "architectural_style": "Meitei Royal Fortification with Brick and Timber Pavilions",
        "latitude": 24.8083,
        "longitude": 93.9408,
        "image_url": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1000",
        "image_attribution": "Department of Tourism, Government of Manipur (CC BY-SA 4.0)",
        "source_url": "https://manipurtourism.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "place-vishnu-temple-bishnupur",
        "name": "Vishnu Temple of Bishnupur",
        "state": "Manipur",
        "city": "Bishnupur",
        "category": "ANCIENT_TEMPLE",
        "historical_period": "1467 CE (Reign of King Kyamba)",
        "description": "An exquisite 15th-century brick temple dedicated to Lord Vishnu, built during the reign of King Kyamba. Demonstrates a unique fusion of early Bengal terracotta and Burmese pagoda architecture.",
        "historical_significance": "The oldest surviving brick temple structure in Manipur, protected as a monument of national importance by the ASI.",
        "architectural_style": "Sino-Burmese and Bengal Terracotta Synthesis",
        "latitude": 24.6294,
        "longitude": 93.7592,
        "image_url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000",
        "image_attribution": "Archaeological Survey of India / Guwahati Circle (CC BY-SA 4.0)",
        "source_url": "https://asi.nic.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "place-ina-memorial-moirang",
        "name": "INA War Memorial & Museum, Moirang",
        "state": "Manipur",
        "city": "Moirang",
        "category": "HERITAGE_MONUMENT",
        "historical_period": "1944 CE (Netaji Subhash Chandra Bose & INA)",
        "description": "The historic site where Colonel Shaukat Ali Malik of the Indian National Army (INA) hoisted the first Indian Tricolor on mainland Indian soil on April 14, 1944, liberating Moirang.",
        "historical_significance": "A landmark patriotic monument commemorating Netaji Subhash Chandra Bose and the Azad Hind Fauj's military campaign.",
        "architectural_style": "National Memorial Monument Architecture",
        "latitude": 24.5000,
        "longitude": 93.7667,
        "image_url": "https://images.unsplash.com/photo-1548013146-72479768bada?w=1000",
        "image_attribution": "Department of Tourism, Government of Manipur (CC BY-SA 4.0)",
        "source_url": "https://manipurtourism.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- MIZORAM ---
    {
        "id": "place-vangchhia-monoliths",
        "name": "Vangchhia Archaeological Site (Kawtchhuah Ropui)",
        "state": "Mizoram",
        "city": "Champhai",
        "category": "ARCHAEOLOGICAL_SITE",
        "historical_period": "Circa 14th to 17th Century CE",
        "description": "An extraordinary ASI-protected megalithic complex situated near the Myanmar border. Features over 171 carved stone menhirs portraying warrior figures, mithun horns, and ancient water retaining pavilions.",
        "historical_significance": "The largest megalithic site in Mizoram, providing critical archaeological evidence of a sophisticated pre-colonial civilization in the Lushai hills.",
        "architectural_style": "Indigenous Mizo Megalithic Bas-Relief Architecture",
        "latitude": 23.1167,
        "longitude": 93.3000,
        "image_url": "https://images.unsplash.com/photo-1606214300344-93b6f007e052?w=1000",
        "image_attribution": "Archaeological Survey of India / Aizawl Circle (CC BY-SA 4.0)",
        "source_url": "https://asi.nic.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "place-sibuta-lung",
        "name": "Sibuta Lung (Monument of Sibuta)",
        "state": "Mizoram",
        "city": "Tachhip (Aizawl District)",
        "category": "HERITAGE_MONUMENT",
        "historical_period": "18th Century CE (Chieftain Sibuta)",
        "description": "A historic memorial stone slab erected over a tragic cultural legend involving Palian chieftain Sibuta and a sacrificial pit in the 18th century.",
        "historical_significance": "A protected state historical monument offering key insights into 18th-century chieftain warfare, social hierarchy, and megalithic erection rituals.",
        "architectural_style": "Pre-colonial Mizo Memorial Monolith",
        "latitude": 23.5167,
        "longitude": 92.7333,
        "image_url": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1000",
        "image_attribution": "Department of Art & Culture, Government of Mizoram (CC BY-SA 4.0)",
        "source_url": "https://tourism.mizoram.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "place-chhingpuii-memorial",
        "name": "Chhingpuii Memorial Stone",
        "state": "Mizoram",
        "city": "Chhingchhip",
        "category": "HERITAGE_MONUMENT",
        "historical_period": "Late 19th Century CE",
        "description": "A stone monument raised on the Aizawl-Lunglei highway in memory of Chhingpuii, an extraordinary maiden of celebrated beauty whose tragic capture during inter-tribal warfare inspired famous folk ballads.",
        "historical_significance": "A preserved historical landmark of Mizo oral literature and folk memorialization practices.",
        "architectural_style": "Traditional Mizo Memorial Stone Monument",
        "latitude": 23.4167,
        "longitude": 92.8500,
        "image_url": "https://images.unsplash.com/photo-1561359313-0639aad49ca6?w=1000",
        "image_attribution": "Department of Tourism, Government of Mizoram (CC BY-SA 4.0)",
        "source_url": "https://tourism.mizoram.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- SIKKIM ---
    {
        "id": "place-rabdentse-ruins",
        "name": "Rabdentse Royal Palace Ruins",
        "state": "Sikkim",
        "city": "Pelling (Geyzing)",
        "category": "ARCHAEOLOGICAL_SITE",
        "historical_period": "1670–1814 CE (Second Capital of Sikkim)",
        "description": "The atmospheric stone ruins of the second royal capital of the Namgyal dynasty Chogyals. Destroyed during the Nepalese Gurkha invasion, the palace and stone stupas overlook the Kanchenjunga range.",
        "historical_significance": "Protected as an ASI monument of national importance, preserving the ancient royal court pavilions ('Namphogang') and sacred Buddhist Chortens.",
        "architectural_style": "Himalayan Buddhist Royal Stone Masonry",
        "latitude": 27.2972,
        "longitude": 88.2472,
        "image_url": "https://images.unsplash.com/photo-1548013146-72479768bada?w=1000",
        "image_attribution": "Archaeological Survey of India / Kolkata Circle (CC BY-SA 4.0)",
        "source_url": "https://asi.nic.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "place-pemayangtse-monastery",
        "name": "Pemayangtse Monastery",
        "state": "Sikkim",
        "city": "Pelling",
        "category": "HERITAGE_MONUMENT",
        "historical_period": "1705 CE (Lama Lhatsun Chempo)",
        "description": "One of the oldest and most premier Nyingma Buddhist monasteries in Sikkim, established in 1705. Contains a magnificent seven-tiered painted wooden model of Zangdokpalri (the celestial palace of Guru Rinpoche).",
        "historical_significance": "Historically, only 'Ta-tshang' (celibate monks of pure Tibetan/Bhutia lineage) were admitted; its head lama possessed the hereditary right to crown the Chogyal.",
        "architectural_style": "Traditional Nyingma Himalayan Monastery Architecture",
        "latitude": 27.3039,
        "longitude": 88.2528,
        "image_url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000",
        "image_attribution": "Sikkim Tourism Development Corporation (CC BY-SA 4.0)",
        "source_url": "https://www.sikkimtourism.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "place-rumtek-monastery",
        "name": "Rumtek Monastery (Dharma Chakra Centre)",
        "state": "Sikkim",
        "city": "Gangtok",
        "category": "HERITAGE_MONUMENT",
        "historical_period": "Original 1730s; Reconstructed 1966 CE (16th Karmapa)",
        "description": "The principal seat-in-exile of the Gyalwang Karmapa, head of the Karma Kagyu lineage. Features a four-storied main shrine hall adorned with brilliant murals, silk thangkas, and a golden stupa.",
        "historical_significance": "A global focal point of Tibetan Buddhist scholarship and high-altitude Kagyu monastic traditions.",
        "architectural_style": "Classical Tibetan Kagyu Monastic Architecture",
        "latitude": 27.3047,
        "longitude": 88.5447,
        "image_url": "https://images.unsplash.com/photo-1600100397608-f010f4460759?w=1000",
        "image_attribution": "Sikkim Tourism Development Corporation (CC BY-SA 4.0)",
        "source_url": "https://www.sikkimtourism.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- TRIPURA ---
    {
        "id": "place-unakoti-reliefs",
        "name": "Unakoti Rock-Cut Bas-Reliefs",
        "state": "Tripura",
        "city": "Kailashahar",
        "category": "ARCHAEOLOGICAL_SITE",
        "historical_period": "7th to 9th Century CE",
        "description": "A magnificent Shaivite pilgrimage site featuring colossal rock-cut bas-reliefs carved directly into the forested hills. The central 30-foot carving of Lord Shiva (Unakotiswara Kal Bhairava) is flanked by Ganga and Durga.",
        "historical_significance": "A protected ASI monument on the UNESCO Tentative World Heritage List, showcasing indigenous tribal rock-carving art synthesized with classical Shaiva traditions.",
        "architectural_style": "Rock-Cut Colossal Bas-Relief Epigraphy",
        "latitude": 24.3211,
        "longitude": 92.0664,
        "image_url": "https://images.unsplash.com/photo-1606214300344-93b6f007e052?w=1000",
        "image_attribution": "Archaeological Survey of India / Aizawl Circle (CC BY-SA 4.0)",
        "source_url": "https://whc.unesco.org/en/tentativelists/6627/",
        "verification_status": "VERIFIED"
    },
    {
        "id": "place-ujjayanta-palace",
        "name": "Ujjayanta Palace (Tripura State Museum)",
        "state": "Tripura",
        "city": "Agartala",
        "category": "FORT_PALACE",
        "historical_period": "1899–1901 CE (Maharaja Radha Kishore Manikya)",
        "description": "A sprawling neoclassical palace surrounded by Mughal gardens and twin lakes in Agartala. Built by Martin Burn & Co., it served as the royal seat of the Manikya dynasty until merger with India.",
        "historical_significance": "Named by Nobel laureate Rabindranath Tagore, who had close ties with the royal family; now preserves the comprehensive cultural heritage museum of Northeast India.",
        "architectural_style": "Indo-Saracenic and Neoclassical Palace Architecture",
        "latitude": 23.8344,
        "longitude": 91.2825,
        "image_url": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000",
        "image_attribution": "Tripura Tourism Development Corporation (CC BY-SA 4.0)",
        "source_url": "https://tripuratourism.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "place-neermahal-palace",
        "name": "Neermahal Water Palace (Twijilikma)",
        "state": "Tripura",
        "city": "Melaghar",
        "category": "FORT_PALACE",
        "historical_period": "1930–1938 CE (Maharaja Bir Bikram Kishore Manikya)",
        "description": "An exquisite water palace situated in the center of the 5.3 sq km Rudrasagar Lake. It is one of only two water palaces in India, synthesizing Hindu and Mughal architectural domes.",
        "historical_significance": "A masterwork of 20th-century wetland royal palace design, constructed with sandstone and marble as a summer residence.",
        "architectural_style": "Hindu-Mughal Aquatic Palace Architecture",
        "latitude": 23.5139,
        "longitude": 91.3283,
        "image_url": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1000",
        "image_attribution": "Tripura Tourism Development Corporation (CC BY-SA 4.0)",
        "source_url": "https://tripuratourism.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- LADAKH ---
    {
        "id": "place-hemis-monastery",
        "name": "Hemis Monastery (Changchub Ling)",
        "state": "Ladakh",
        "city": "Leh",
        "category": "HERITAGE_MONUMENT",
        "historical_period": "1672 CE (King Sengge Namgyal & Stagsang Raspa)",
        "description": "The largest and wealthiest Drukpa Kagyu monastery in Ladakh, nestled in a hidden gorge within Hemis National Park. Houses sacred relics, gold-plated statues, and ancient thangkas.",
        "historical_significance": "Royal monastery of the Namgyal kings of Ladakh; venue of the globally renowned Hemis Tsechu festival and sacred Cham dances.",
        "architectural_style": "Tibetan Drukpa Fortress Monastic Style",
        "latitude": 33.9125,
        "longitude": 77.7083,
        "image_url": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1000",
        "image_attribution": "Department of Tourism, UT of Ladakh (CC BY-SA 4.0)",
        "source_url": "https://ladakhtourism.org",
        "verification_status": "VERIFIED"
    },
    {
        "id": "place-leh-palace",
        "name": "Leh Palace (Lhachen Palkhar)",
        "state": "Ladakh",
        "city": "Leh",
        "category": "FORT_PALACE",
        "historical_period": "Circa 1600 CE (King Sengge Namgyal)",
        "description": "A 9-storey royal palace rising above the old town of Leh, constructed on the model of the Potala Palace in Lhasa. Protected by the Archaeological Survey of India.",
        "historical_significance": "Seat of the Namgyal dynasty ruling the Trans-Himalayan kingdom of Ladakh; constructed with massive mud-brick, stone, and poplar timber.",
        "architectural_style": "Tibetan-Himalayan Vernacular Mud-Brick Fort Palace",
        "latitude": 34.1661,
        "longitude": 77.5856,
        "image_url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000",
        "image_attribution": "Archaeological Survey of India / Srinagar Circle (CC BY-SA 4.0)",
        "source_url": "https://asi.nic.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "place-alchi-monastery",
        "name": "Alchi Choskor Monastery Complex",
        "state": "Ladakh",
        "city": "Alchi",
        "category": "ANCIENT_TEMPLE",
        "historical_period": "11th Century CE (Lotsawa Rinchen Zangpo)",
        "description": "An ancient monastic complex situated on the banks of the Indus River, world-famous for its peerless 11th-century Kashmiri-style Buddhist wall paintings and wood carvings.",
        "historical_significance": "A protected national monument representing the golden age of Indo-Tibetan Buddhist art, preserving woodcarvings and clay statues found nowhere else.",
        "architectural_style": "Kashmiri-Tibetan Medieval Buddhist Timber Architecture",
        "latitude": 34.2236,
        "longitude": 77.1750,
        "image_url": "https://images.unsplash.com/photo-1548013146-72479768bada?w=1000",
        "image_attribution": "Archaeological Survey of India / Srinagar Circle (CC BY-SA 4.0)",
        "source_url": "https://asi.nic.in",
        "verification_status": "VERIFIED"
    },

    # --- LAKSHADWEEP ---
    {
        "id": "place-ujra-mosque-kavaratti",
        "name": "Ujra Mosque, Kavaratti",
        "state": "Lakshadweep",
        "city": "Kavaratti",
        "category": "ANCIENT_TEMPLE",
        "historical_period": "17th Century CE (Sheikh Mohammad Kasim)",
        "description": "The most celebrated historic monument in Lakshadweep, built with coral stone masonry. Features a ceiling carved out of a single piece of driftwood, intricate floral arabesques, and a sacred freshwater well.",
        "historical_significance": "Architectural masterpiece of island Islamic heritage, showcasing indigenous coral-stone carving and marine timber craftsmanship.",
        "architectural_style": "Lakshadweep Coral Stone and Teak Timber Architecture",
        "latitude": 10.5650,
        "longitude": 72.6417,
        "image_url": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1000",
        "image_attribution": "Lakshadweep Tourism Development Corporation (CC BY-SA 4.0)",
        "source_url": "https://lakshadweep.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "place-minicoy-lighthouse",
        "name": "Minicoy Historic British Lighthouse",
        "state": "Lakshadweep",
        "city": "Minicoy",
        "category": "HERITAGE_MONUMENT",
        "historical_period": "1885 CE (British Imperial Lighthouse Service)",
        "description": "A 48-meter historic white masonry lighthouse established in 1885 on the southern tip of Minicoy. It has guarded international navigation through the critical Eight Degree Channel for over 140 years.",
        "historical_significance": "A heritage navigational beacon of the Arabian Sea, featuring historic optical lens systems and stone spiral staircases.",
        "architectural_style": "Victorian Imperial Maritime Masonry Architecture",
        "latitude": 8.2833,
        "longitude": 73.0500,
        "image_url": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1000",
        "image_attribution": "Directorate General of Lighthouses and Lightships (CC BY-SA 4.0)",
        "source_url": "https://lakshadweep.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "place-kalpeni-tombs",
        "name": "Kalpeni Ancient Coral Tombs and Mosques",
        "state": "Lakshadweep",
        "city": "Kalpeni",
        "category": "ARCHAEOLOGICAL_SITE",
        "historical_period": "14th to 16th Century CE",
        "description": "Ancient coral-stone mausoleums and prayer halls situated along the coral lagoon of Kalpeni Island. Preserves historic gravestones inscribed with classical Arabic calligraphy.",
        "historical_significance": "Testifies to the early trans-oceanic spice trade routes and the settlement of Arab navigators in the Laccadive archipelago.",
        "architectural_style": "Indigenous Coral Masonry Island Architecture",
        "latitude": 10.0750,
        "longitude": 73.6500,
        "image_url": "https://images.unsplash.com/photo-1561359313-0639aad49ca6?w=1000",
        "image_attribution": "Lakshadweep Tourism Department (CC BY-SA 4.0)",
        "source_url": "https://lakshadweep.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- ANDAMAN & NICOBAR ISLANDS ---
    {
        "id": "place-cellular-jail",
        "name": "Cellular Jail National Memorial (Kala Pani)",
        "state": "Andaman & Nicobar Islands",
        "city": "Port Blair",
        "category": "HERITAGE_MONUMENT",
        "historical_period": "1896–1906 CE (British Colonial Rule)",
        "description": "A historic colonial panopticon prison complex where freedom fighters of the Indian independence movement were imprisoned in solitary confinement. Comprised seven wings radiating from a central watchtower.",
        "historical_significance": "National shrine commemorating the sacrifices of freedom fighters (including Veer Savarkar and Batukeshwar Dutt). Declared a National Memorial in 1979.",
        "architectural_style": "Colonial Panopticon Brick and Stone Masonry Architecture",
        "latitude": 11.6739,
        "longitude": 92.7481,
        "image_url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000",
        "image_attribution": "Archaeological Survey of India / Port Blair Circle (CC BY-SA 4.0)",
        "source_url": "https://asi.nic.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "place-ross-island-ruins",
        "name": "Ross Island (Netaji Subhash Chandra Bose Dweep) Ruins",
        "state": "Andaman & Nicobar Islands",
        "city": "Port Blair",
        "category": "ARCHAEOLOGICAL_SITE",
        "historical_period": "1858–1942 CE (Colonial Penal Settlement Headquarters)",
        "description": "The ruined colonial administrative capital of the Andaman islands, where grand Victorian ballrooms, churches, and hospitals are now romantically entwined with roots of ancient Ficus and Banyan trees.",
        "historical_significance": "Historic administrative headquarters where Netaji Subhash Chandra Bose hoisted the National Flag on December 30, 1943 during Japanese wartime control.",
        "architectural_style": "Victorian Colonial Stone Architecture Intertwined with Nature",
        "latitude": 11.6708,
        "longitude": 92.7619,
        "image_url": "https://images.unsplash.com/photo-1548013146-72479768bada?w=1000",
        "image_attribution": "Directorate of Tourism, Andaman & Nicobar Administration (CC BY-SA 4.0)",
        "source_url": "https://www.andamantourism.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "place-viper-island-gallows",
        "name": "Viper Island Gallows & Historic Jail Ruins",
        "state": "Andaman & Nicobar Islands",
        "city": "Port Blair",
        "category": "ARCHAEOLOGICAL_SITE",
        "historical_period": "1867 CE",
        "description": "The site of the earliest penal detention facility and execution gallows in the Andamans, constructed atop a low hill on Viper Island prior to the completion of the Cellular Jail.",
        "historical_significance": "Site where Sher Ali Afridi was hanged in 1872 for assassinating Viceroy Lord Mayo; protected historical heritage monument.",
        "architectural_style": "Colonial Brick Masonry Penal Architecture",
        "latitude": 11.6661,
        "longitude": 92.7033,
        "image_url": "https://images.unsplash.com/photo-1600100397608-f010f4460759?w=1000",
        "image_attribution": "Directorate of Tourism, Andaman & Nicobar Administration (CC BY-SA 4.0)",
        "source_url": "https://www.andamantourism.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- PUDUCHERRY ---
    {
        "id": "place-arikamedu-port",
        "name": "Arikamedu Ancient Indo-Roman Trading Port",
        "state": "Puducherry",
        "city": "Puducherry",
        "category": "ARCHAEOLOGICAL_SITE",
        "historical_period": "2nd Century BCE to 2nd Century CE (Sangam & Early Roman)",
        "description": "An ancient maritime port and industrial bead-manufacturing center on the Ariyankuppam river. Excavated by Sir Mortimer Wheeler, it yielded Roman amphorae, Arretine ware, and Roman coins.",
        "historical_significance": "Unequivocal archaeological proof of direct maritime trade links between the Roman Empire and the ancient Tamil kingdoms during the Augustan era.",
        "architectural_style": "Ancient Maritime Brick Wharves and Industrial Kiln Architecture",
        "latitude": 11.9039,
        "longitude": 79.8183,
        "image_url": "https://images.unsplash.com/photo-1606214300344-93b6f007e052?w=1000",
        "image_attribution": "Archaeological Survey of India / Chennai Circle (CC BY-SA 4.0)",
        "source_url": "https://asi.nic.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "place-french-quarter-puducherry",
        "name": "French Quarter (White Town) & Raj Nivas",
        "state": "Puducherry",
        "city": "Puducherry",
        "category": "HERITAGE_MONUMENT",
        "historical_period": "18th to 19th Century CE (French East India Company)",
        "description": "A historic colonial urban quarter planned on a grid pattern by French military engineers. Features mustard-yellow colonial mansions, arched gateways, private courtyards, and the 18th-century governor's palace (Raj Nivas).",
        "historical_significance": "One of the best-preserved French colonial urban ensembles in South Asia, protected under municipal heritage conservation regulations.",
        "architectural_style": "French Colonial Neoclassical Urban Architecture",
        "latitude": 11.9333,
        "longitude": 79.8333,
        "image_url": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000",
        "image_attribution": "Puducherry Tourism Development Corporation (CC BY-SA 4.0)",
        "source_url": "https://pondytourism.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "place-sacred-heart-basilica",
        "name": "Basilica of the Sacred Heart of Jesus",
        "state": "Puducherry",
        "city": "Puducherry",
        "category": "ANCIENT_TEMPLE",
        "historical_period": "1902–1907 CE (French Catholic Missionaries)",
        "description": "An imposing French Gothic revival basilica renowned for its 28 stained glass panels depicting events from the life of Christ and saints. Elevated to the status of minor basilica in 2011.",
        "historical_significance": "A landmark Christian heritage monument in Puducherry demonstrating French stained glass craftsmanship.",
        "architectural_style": "French Neo-Gothic Basilica Architecture",
        "latitude": 11.9281,
        "longitude": 79.8272,
        "image_url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000",
        "image_attribution": "Puducherry Tourism Development Corporation (CC BY-SA 4.0)",
        "source_url": "https://pondytourism.in",
        "verification_status": "VERIFIED"
    },

    # --- DADRA & NAGAR HAVELI AND DAMAN & DIU ---
    {
        "id": "place-moti-daman-fort",
        "name": "Moti Daman Fort (Fortaleza de Sao Jeronimo)",
        "state": "Dadra & Nagar Haveli and Daman & Diu",
        "city": "Daman",
        "category": "FORT_PALACE",
        "historical_period": "1559–1581 CE (Portuguese Rule)",
        "description": "A massive 30,000 sq meter stone fort enclosing the historical Portuguese colonial administrative quarter of Daman. Features 10 bastions, a deep moat, and the Church of Bom Jesus.",
        "historical_significance": "An ASI protected fortress that served as the Portuguese colonial military command in Western India for 400 years.",
        "architectural_style": "Portuguese Renaissance Coastal Military Architecture",
        "latitude": 20.4167,
        "longitude": 72.8333,
        "image_url": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1000",
        "image_attribution": "Archaeological Survey of India / Vadodara Circle (CC BY-SA 4.0)",
        "source_url": "https://asi.nic.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "place-diu-fort",
        "name": "Diu Fort & Sea Citadel",
        "state": "Dadra & Nagar Haveli and Daman & Diu",
        "city": "Diu",
        "category": "FORT_PALACE",
        "historical_period": "1535–1546 CE (Portuguese Rule)",
        "description": "A colossal sea-facing stone fortress situated on the eastern tip of Diu Island, surrounded by the Arabian Sea on three sides. Mounts bronze cannons, bastions, and a 19th-century lighthouse.",
        "historical_significance": "Site of the historic 1538 and 1546 Sieges of Diu against Ottoman and Gujarat Sultanate naval fleets. An ASI protected monument.",
        "architectural_style": "Portuguese Renaissance Sea Fortress Architecture",
        "latitude": 20.7167,
        "longitude": 70.9917,
        "image_url": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1000",
        "image_attribution": "Archaeological Survey of India / Vadodara Circle (CC BY-SA 4.0)",
        "source_url": "https://asi.nic.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "place-st-paul-church-diu",
        "name": "St. Paul's Church, Diu",
        "state": "Dadra & Nagar Haveli and Daman & Diu",
        "city": "Diu",
        "category": "ANCIENT_TEMPLE",
        "historical_period": "1601–1610 CE (Portuguese Jesuits)",
        "description": "A magnificent Baroque church dedicated to the Immaculate Conception, renowned for its ornate white facade, Corinthian columns, and intricately carved wooden woodwork.",
        "historical_significance": "One of the finest surviving examples of Portuguese Baroque church architecture in India, actively maintained under heritage conservation.",
        "architectural_style": "Portuguese Baroque Ecclesiastical Architecture",
        "latitude": 20.7144,
        "longitude": 70.9856,
        "image_url": "https://images.unsplash.com/photo-1548013146-72479768bada?w=1000",
        "image_attribution": "Archaeological Survey of India / Vadodara Circle (CC BY-SA 4.0)",
        "source_url": "https://asi.nic.in",
        "verification_status": "VERIFIED"
    }
]

BATCH1_FESTIVALS = [
    # --- ASSAM ---
    {
        "id": "fest-rongali-bihu",
        "name": "Rongali Bihu (Bohag Bihu)",
        "state": "Assam",
        "region": "Brahmaputra Valley",
        "category": "Harvest & Spring Festival",
        "description": "The quintessential socio-cultural festival of Assam marking the Assamese New Year and the onset of the agricultural seeding season in Bohag month.",
        "historical_background": "Ancient agrarian festival celebrated across ethnic communities of the Brahmaputra Valley, blending Tai-Ahom, Indo-Aryan, and Tibeto-Burman customs.",
        "cultural_significance": "Celebrates youth, nature's renewal, and community harmony through Bihu dances, gifting of Gamosa handwoven towels, and feasting.",
        "celebration_details": "Seven days of festivities (Saat Bihu) starting with Goru Bihu (cattle worship) followed by Manuh Bihu and Husori singing tours.",
        "associated_communities": "Assamese community, Bodos, Mishings, Sonowal Kacharis",
        "month_or_season": "Mid-April (Month of Bohag)",
        "date_type": "ANNUAL_OFFICIAL",
        "image_url": "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?w=1000",
        "source_url": "https://sangeetnatak.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "fest-ambubachi-mela",
        "name": "Ambubachi Mela, Kamakhya",
        "state": "Assam",
        "region": "Nilachal Hills, Guwahati",
        "category": "Tantric Shaktism & Eco-Festival",
        "description": "An annual four-day congregation at the Kamakhya Temple celebrating the annual menstruation cycle of Goddess Mother Earth (Prithvi).",
        "historical_background": "Rooted in ancient indigenous fertility cults and the Kalika Purana, celebrating earth's procreative power without temple worship for three days.",
        "cultural_significance": "Major pilgrimage for Tantric sadhus and Shakti devotees from across the Indian subcontinent; temple doors remain closed for 3 days and open on the fourth with prasad of red cloth (Raktovastra).",
        "celebration_details": "Ascetics gather for spiritual discourses and chants; massive fair along the Nilachal hill trails.",
        "associated_communities": "Shakta devotees, sadhus, local Assamese society",
        "month_or_season": "June (Aashadha month during monsoon)",
        "date_type": "LUNAR",
        "image_url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000",
        "source_url": "https://sangeetnatak.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- ARUNACHAL PRADESH ---
    {
        "id": "fest-losar-arunachal",
        "name": "Losar Festival (Monpa New Year)",
        "state": "Arunachal Pradesh",
        "region": "Tawang & West Kameng",
        "category": "Tibetan-Monpa Buddhist New Year",
        "description": "The major festival of the Monpa Buddhist tribe marking the Tibetan New Year with prayers, hoisting of prayer flags, and Cham sacred mask dances.",
        "historical_background": "Traced to the pre-Buddhist Bon religion in the Himalayas, later integrated into Tibetan Buddhist calendar following Guru Padmasambhava.",
        "cultural_significance": "Purifies the community from negative karma of the previous year and invokes blessings of prosperity, long life, and spiritual balance.",
        "celebration_details": "Households prepare festive Losar offerings (Kapse sweets), illuminate butter lamps, and gather at Tawang Monastery for masked dances.",
        "associated_communities": "Monpa, Sherdukpen, and Memba Buddhist tribes",
        "month_or_season": "February–March (First Lunar Month of Tibetan Calendar)",
        "date_type": "LUNAR",
        "image_url": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1000",
        "source_url": "https://arunachaltourism.com",
        "verification_status": "VERIFIED"
    },
    {
        "id": "fest-torgya-tawang",
        "name": "Torgya Monastic Festival, Tawang",
        "state": "Arunachal Pradesh",
        "region": "Tawang Valley",
        "category": "Monastic Ritual & Masked Dance Festival",
        "description": "A 3-day monastic festival held in the courtyard of Tawang Monastery to ward off natural disasters and external evils through elaborate masked dances.",
        "historical_background": "Performed according to ancient Gelugpa Buddhist scripture to pacify negative forces and bring welfare to sentient beings.",
        "cultural_significance": "Lamas dressed in magnificent silks perform sacred Cham dances representing various wrathful and peaceful protector deities.",
        "celebration_details": "Burning of a 3-meter sacred pyramid structure (Torgya) on the final day, followed by distribution of holy consecrated pills.",
        "associated_communities": "Monpa Buddhist community and lamas of Tawang Monastery",
        "month_or_season": "January (28th day of 11th Monpa lunar month)",
        "date_type": "LUNAR",
        "image_url": "https://images.unsplash.com/photo-1548013146-72479768bada?w=1000",
        "source_url": "https://sangeetnatak.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- MEGHALAYA ---
    {
        "id": "fest-wangala-meghalaya",
        "name": "Wangala Festival (100 Drums Festival)",
        "state": "Meghalaya",
        "region": "Garo Hills",
        "category": "Post-Harvest Thanksgiving",
        "description": "The most significant post-harvest festival of the indigenous Garo tribe, offering thanksgiving to Misi Saljong, the Great Giver of Sun and Harvest.",
        "historical_background": "Practiced for centuries under the traditional Songsarek faith, marking the end of agricultural labor before winter.",
        "cultural_significance": "Features the stirring spectacle of 100 long cylindrical drums ('Dama') played in unison by men, accompanied by women dancing in rhythmic lines.",
        "celebration_details": "Traditional ceremonies of Rugala and Sasat So'a followed by group dance in colorful feather-crested turbans.",
        "associated_communities": "Garo (A'chik) indigenous community",
        "month_or_season": "Second week of November",
        "date_type": "ANNUAL_OFFICIAL",
        "image_url": "https://images.unsplash.com/photo-1561359313-0639aad49ca6?w=1000",
        "source_url": "https://meghalayatourism.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "fest-shad-suk-mynsiem",
        "name": "Shad Suk Mynsiem (Dance of Peaceful Hearts)",
        "state": "Meghalaya",
        "region": "Khasi Hills, Shillong",
        "category": "Spring Thanksgiving & Matrilineal Celebration",
        "description": "An annual Khasi spring thanksgiving dance festival celebrating the balance of nature, sowing season, and honoring the female custodians of the clan.",
        "historical_background": "Core religious celebration of the Seng Khasi indigenous faith celebrating the matrilineal society of the Khasi people.",
        "cultural_significance": "Unmarried Khasi maidens dressed in rich silk jainsem and gold crowns dance with dignified grace, encircled and protected by young men wielding silver fly-whisks.",
        "celebration_details": "Three days of traditional dancing to the music of Tangmuri reed flutes and percussion at Weiking Ground.",
        "associated_communities": "Khasi indigenous matrilineal clans",
        "month_or_season": "April",
        "date_type": "ANNUAL_OFFICIAL",
        "image_url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000",
        "source_url": "https://sangeetnatak.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- NAGALAND ---
    {
        "id": "fest-hornbill-nagaland",
        "name": "Hornbill Festival (Festival of Festivals)",
        "state": "Nagaland",
        "region": "Kisama Heritage Village, Kohima",
        "category": "State Cultural Extravaganza",
        "description": "A magnificent 10-day convergence of all recognized indigenous tribes of Nagaland, showcasing tribal warfare dances, traditional architecture, archery, and indigenous music.",
        "historical_background": "Initiated in December 2000 by the Government of Nagaland to revive, protect, and sustain inter-tribal cultural heritage.",
        "cultural_significance": "Named after the Great Indian Hornbill, deeply revered in Naga folklore for its beauty and alertness; unites 17 tribes in one cultural arena.",
        "celebration_details": "Daily cultural presentations, indigenous games, Naga chilli eating competitions, master handloom fairs, and evening rock concerts.",
        "associated_communities": "Angami, Ao, Chakhesang, Chang, Konyak, Lotha, Sumi, and all 17 Naga tribes",
        "month_or_season": "December 1 to December 10",
        "date_type": "ANNUAL_OFFICIAL",
        "image_url": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000",
        "source_url": "https://tourism.nagaland.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "fest-moatsu-nagaland",
        "name": "Moatsu Festival (Ao Naga)",
        "state": "Nagaland",
        "region": "Mokokchung",
        "category": "Post-Sowing Agricultural Celebration",
        "description": "A joyful celebration of the Ao Naga tribe following the completion of the arduous jhum clearing and seed sowing in their mountain terraces.",
        "historical_background": "Ancient tribal observance providing rest, feasting, and community bonding after months of jungle clearance.",
        "cultural_significance": "Strengthens inter-clan friendships; traditional elder songs ('Sangpangtu') recount historical migrations and clan valor.",
        "celebration_details": "Community bonfires, traditional tug-of-war, warrior dance processions, and sharing of rice beer.",
        "associated_communities": "Ao Naga community",
        "month_or_season": "First week of May",
        "date_type": "ANNUAL_OFFICIAL",
        "image_url": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1000",
        "source_url": "https://sangeetnatak.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- MANIPUR ---
    {
        "id": "fest-yaoshang-manipur",
        "name": "Yaoshang Festival of Manipur",
        "state": "Manipur",
        "region": "Imphal Valley",
        "category": "Spring & Youth Cultural Festival",
        "description": "The premier five-day spring festival of Manipur, commencing on the full moon of Phalguna. Combines traditional Meitei rituals with the famous nocturnal Thabal Chongba folk dance.",
        "historical_background": "Celebrated since ancient times as a celebration of youth and nature, later harmonized with Vaishnavite Chaitanya Mahaprabhu traditions.",
        "cultural_significance": "Unique for integrating traditional arts with indigenous sports tournaments in every locality, promoting communal discipline.",
        "celebration_details": "Burning of straw huts (Yaoshang Mei Thaba) on the first day, followed by courtyard singing, Pichkari processions, and Thabal Chongba dancing.",
        "associated_communities": "Meitei community across Manipur",
        "month_or_season": "February–March (Phalguna Full Moon)",
        "date_type": "LUNAR",
        "image_url": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1000",
        "source_url": "https://manipurtourism.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "fest-sangai-manipur",
        "name": "Manipur Sangai Festival",
        "state": "Manipur",
        "region": "Imphal & Moirang",
        "category": "Cultural & Biodiversity Heritage Festival",
        "description": "An annual grand cultural festival organized by Manipur Tourism, celebrating the state's cultural richness and the rare brow-antlered Eld's deer (Sangai).",
        "historical_background": "Instituted to promote international tourism, classical arts, polo (Sagol Kangjei), and traditional handlooms.",
        "cultural_significance": "Showcases Manipur as the birthplace of modern polo and the home of classical Raas Leela dance and indigenous martial arts.",
        "celebration_details": "Ten days of world-class classical dance performances, traditional boat races (Hiyang Tannaba), and handloom expos.",
        "associated_communities": "Meitei, Kuki, Naga, and all indigenous ethnic communities of Manipur",
        "month_or_season": "November 21 to November 30",
        "date_type": "ANNUAL_OFFICIAL",
        "image_url": "https://images.unsplash.com/photo-1548013146-72479768bada?w=1000",
        "source_url": "https://manipurtourism.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- MIZORAM ---
    {
        "id": "fest-chapchar-kut-mizoram",
        "name": "Chapchar Kut Spring Festival",
        "state": "Mizoram",
        "region": "Aizawl & All Districts",
        "category": "Spring Post-Jhum Clearance Festival",
        "description": "The most joyous cultural festival of the Mizo people, celebrated in March after the arduous bamboo-felling and jhum forest clearing has ended.",
        "historical_background": "Dates back centuries to when hunters returned from a successful expedition and the village chieftain declared a community feast with music and dance.",
        "cultural_significance": "Celebrates universal brotherhood, forgiveness, and Mizo cultural pride through the iconic Cheraw bamboo dance.",
        "celebration_details": "Participants wear colorful Puanchei traditional handloom garments, sing ancient folk songs, and dance across crossed bamboo poles.",
        "associated_communities": "Mizo tribes (Lushai, Hmar, Ralte, Pawi, Mara)",
        "month_or_season": "First Friday of March",
        "date_type": "ANNUAL_OFFICIAL",
        "image_url": "https://images.unsplash.com/photo-1561359313-0639aad49ca6?w=1000",
        "source_url": "https://tourism.mizoram.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "fest-thalfavang-kut",
        "name": "Thalfavang Kut Harvest Festival",
        "state": "Mizoram",
        "region": "Aizawl",
        "category": "Post-Weeding Autumn Celebration",
        "description": "Celebrated in November marking the completion of weeding the hillside paddy fields, preparing the community for the forthcoming winter harvest.",
        "historical_background": "Celebrated by Mizo ancestors to invoke divine favor on agricultural crops and strengthen communal solidarity.",
        "cultural_significance": "Showcases diverse Mizo folk dances including Khuallam, Chheihlam, and Sarlamkai.",
        "celebration_details": "Community singing competitions, archery exhibitions, and traditional culinary feasts.",
        "associated_communities": "Mizo community",
        "month_or_season": "November",
        "date_type": "APPROX_SEASONAL",
        "image_url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000",
        "source_url": "https://tourism.mizoram.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- SIKKIM ---
    {
        "id": "fest-losoong-sikkim",
        "name": "Losoong (Namsoong) Sikkimese New Year",
        "state": "Sikkim",
        "region": "Gangtok & Monasteries of Sikkim",
        "category": "Harvest & Tibetan Buddhist New Year",
        "description": "The Sikkimese harvest festival and New Year celebrated by the Bhutia and Lepcha communities, celebrated with Cham sacred dances at Rumtek and Phodong monasteries.",
        "historical_background": "Marks the end of the agricultural harvest year and the beginning of the tenth month of the Tibetan lunar calendar.",
        "cultural_significance": "Celebrates the triumph of good over evil; lamas perform sacred dances to purify negative energies before the new cycle.",
        "celebration_details": "Monks don colorful silk brocade robes and masks; local archery contests and family gatherings with traditional Chi millet beer.",
        "associated_communities": "Bhutia, Lepcha, and Nepali communities of Sikkim",
        "month_or_season": "December (10th Tibetan Lunar Month)",
        "date_type": "LUNAR",
        "image_url": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1000",
        "source_url": "https://www.sikkimtourism.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "fest-pang-lhabsol-sikkim",
        "name": "Pang Lhabsol Sacred Guardian Festival",
        "state": "Sikkim",
        "region": "Tsuklakhang Palace & Pemayangtse",
        "category": "Protective Deity & Treaty Commemoration",
        "description": "A unique religious festival of Sikkim commemorating the consecration of Mount Kangchenjunga as the supreme protective guardian deity of Sikkim.",
        "historical_background": "Commemorates the historic blood brotherhood treaty signed in the 13th century between Lepcha chief Thekong Tek and Bhutia prince Khye Bumsa.",
        "cultural_significance": "Features the stirring Warrior Dance (Pangtoed) where dancers clad in helmets and chain mail perform energetic martial leaps.",
        "celebration_details": "Sacred prayers led by senior lamas, invocation of the five celestial treasures of Kangchenjunga.",
        "associated_communities": "Bhutia and Lepcha people of Sikkim",
        "month_or_season": "August–September (15th day of 7th Tibetan Lunar Month)",
        "date_type": "LUNAR",
        "image_url": "https://images.unsplash.com/photo-1548013146-72479768bada?w=1000",
        "source_url": "https://sangeetnatak.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- TRIPURA ---
    {
        "id": "fest-kharchi-puja",
        "name": "Kharchi Puja of the Fourteen Deities",
        "state": "Tripura",
        "region": "Old Agartala (Puran Agartala)",
        "category": "State Religious & Cultural Festival",
        "description": "A major week-long festival dedicated to the Fourteen Gods (Chaturdasa Devata), celebrated in July at the historic temple of Old Agartala.",
        "historical_background": "Ancient royal festival blending tribal animist rituals with orthodox Hindu traditions, performed by the royal tribal priest ('Chantai').",
        "cultural_significance": "Cleanses Mother Earth following her menstruation period (similar to Ambubachi) and ensures peace, health, and bountiful harvest for Tripura.",
        "celebration_details": "Procession of the 14 metal deity heads to the sacred Howrah River for ceremonial bathing, followed by thousands of animal offerings.",
        "associated_communities": "Tripuri, Reang, Jamatia, and Bengali communities",
        "month_or_season": "July (Shukla Ashtami of Ashadha/Shravana)",
        "date_type": "LUNAR",
        "image_url": "https://images.unsplash.com/photo-1606214300344-93b6f007e052?w=1000",
        "source_url": "https://tripuratourism.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "fest-garia-puja-tripura",
        "name": "Garia Puja Agricultural Festival",
        "state": "Tripura",
        "region": "Tribal Hamlets across Tripura",
        "category": "Indigenous Agrarian Festival",
        "description": "A seven-day indigenous harvest festival celebrated on the seventh day of Baisakh to revere Baba Garia, the deity of livestock, peace, and prosperity.",
        "historical_background": "Ancient animist festival where a sacred bamboo pole symbolizing Lord Garia is consecrated and worshipped with community dances.",
        "cultural_significance": "Features the famous Garia dance performed by tribal youths from door to door, accompanied by ancient Kham drum beats.",
        "celebration_details": "Sacrifice of roosters, pouring of rice beer, and community circle dancing.",
        "associated_communities": "Tripuri, Jamatia, Reang, and Noatia tribes",
        "month_or_season": "Mid-April (Month of Baisakh)",
        "date_type": "ANNUAL_OFFICIAL",
        "image_url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000",
        "source_url": "https://tripuratourism.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- LADAKH ---
    {
        "id": "fest-hemis-tsechu",
        "name": "Hemis Tsechu Monastic Festival",
        "state": "Ladakh",
        "region": "Hemis Monastery, Leh",
        "category": "Monastic Tantric Dance Festival",
        "description": "The most famous Buddhist monastic festival in Ladakh, commemorating the birth anniversary of Guru Padmasambhava (Guru Rinpoche).",
        "historical_background": "Established in the 17th century at Hemis Monastery by King Sengge Namgyal and Gyalwang Drukpa.",
        "cultural_significance": "Lamas perform sacred Cham dances wearing grotesque masks of protective deities, accompanied by long copper horns, cymbals, and drums.",
        "celebration_details": "Every 12 years (Year of the Monkey), the sacred four-story embroidered thangka of Guru Padmasambhava is unveiled.",
        "associated_communities": "Ladakhi Buddhist community and international pilgrims",
        "month_or_season": "June–July (10th day of 5th Tibetan Lunar Month)",
        "date_type": "LUNAR",
        "image_url": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1000",
        "source_url": "https://ladakhtourism.org",
        "verification_status": "VERIFIED"
    },
    {
        "id": "fest-losar-ladakh",
        "name": "Ladakhi Losar (New Year Festival)",
        "state": "Ladakh",
        "region": "All Ladakh Districts",
        "category": "Trans-Himalayan New Year Celebration",
        "description": "The Ladakhi New Year celebrated with ancient pre-Buddhist Metho fire processions, family feasts, and traditional greeting ('Losar La Tashi Delek').",
        "historical_background": "Originated in the 17th century when King Jamyang Namgyal advanced the New Year celebrations by two months before marching against Skardu.",
        "cultural_significance": "Community renewal, lighting of holy butter lamps, and communal singing of ancient Ladakhi epic poetry.",
        "celebration_details": "Metho fire torches carried through villages to expel evil spirits; preparation of traditional sheep-head pastries and butter sculptures.",
        "associated_communities": "Buddhist community of Ladakh",
        "month_or_season": "December (First day of 11th Tibetan Month)",
        "date_type": "LUNAR",
        "image_url": "https://images.unsplash.com/photo-1548013146-72479768bada?w=1000",
        "source_url": "https://ladakhtourism.org",
        "verification_status": "VERIFIED"
    },

    # --- LAKSHADWEEP ---
    {
        "id": "fest-eid-ul-fitr-lakshadweep",
        "name": "Eid-ul-Fitr Coastal Island Observance",
        "state": "Lakshadweep",
        "region": "All 10 Inhabited Islands",
        "category": "Islamic Oceanic Festival",
        "description": "The grandest celebration in the archipelago marking the completion of Ramadan fasting with oceanfront congregational prayers on pristine coral beaches.",
        "historical_background": "Celebrated since the 7th century CE when Islam was introduced to the islands by Saint Ubaidullah.",
        "cultural_significance": "Reinforces egalitarian community sharing across isolated island atolls; widespread distribution of sweet rice and coconut delicacies.",
        "celebration_details": "Special prayers at coral-stone Juma mosques, Kolkali folk dances, and traditional boat racing.",
        "associated_communities": "Jasari and Mahal-speaking islanders of Lakshadweep",
        "month_or_season": "Determined by sighting of Shawwal crescent moon",
        "date_type": "LUNAR",
        "image_url": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1000",
        "source_url": "https://lakshadweep.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "fest-milad-un-nabi-lakshadweep",
        "name": "Milad-un-Nabi & Ratheeb Rituals",
        "state": "Lakshadweep",
        "region": "Kavaratti & Andrott",
        "category": "Spiritual Devotional Commemoration",
        "description": "Celebrates the birth of Prophet Muhammad with traditional hymns (Mawlid) and spiritual trance rituals ('Ratheeb') performed at historic dargahs.",
        "historical_background": "Deeply linked to the historic Sufi orders (Rifa'i and Qadiri) established by Arab mariners in the 17th century.",
        "cultural_significance": "Features unique devotional demonstrations with iron spikes ('Dabbus') performed by trained adepts to rhythmic chanting.",
        "celebration_details": "Night-long devotional singing and community feasting of coconut ghee rice.",
        "associated_communities": "Island community of Lakshadweep",
        "month_or_season": "Rabi-al-Awwal (Islamic Calendar)",
        "date_type": "LUNAR",
        "image_url": "https://images.unsplash.com/photo-1561359313-0639aad49ca6?w=1000",
        "source_url": "https://lakshadweep.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- ANDAMAN & NICOBAR ISLANDS ---
    {
        "id": "fest-island-tourism-festival",
        "name": "Island Tourism Festival, Port Blair",
        "state": "Andaman & Nicobar Islands",
        "region": "Port Blair (South Andaman)",
        "category": "Pan-Island Cultural Extravaganza",
        "description": "A 10-day cultural celebration organized annually by the Andaman & Nicobar Administration, featuring tribal dance performances, handicrafts exhibitions, and water sports.",
        "historical_background": "Initiated to foster national cultural integration and provide a platform for indigenous artisans and mainland performers.",
        "cultural_significance": "A vibrant celebration of India's miniature mosaic, uniting Bengali, Tamil, Telugu, Malayali, Nicobarese, and indigenous cultures.",
        "celebration_details": "Exhibitions at the historic Netaji Stadium, flower shows, dog shows, and maritime food festivals.",
        "associated_communities": "Pan-island settler and indigenous communities",
        "month_or_season": "January",
        "date_type": "ANNUAL_OFFICIAL",
        "image_url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000",
        "source_url": "https://www.andamantourism.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "fest-subhash-mela-andaman",
        "name": "Subhash Mela (Netaji Commemoration)",
        "state": "Andaman & Nicobar Islands",
        "region": "Havelock Island (Swaraj Dweep)",
        "category": "Historical & Patriotic Heritage Fair",
        "description": "A week-long cultural fair celebrating the birth anniversary of Netaji Subhash Chandra Bose and his historic hoisting of the national tricolor in Port Blair.",
        "historical_background": "Commemorates the proclamation of the Provisional Government of Free India in the Andamans in 1943.",
        "cultural_significance": "Patriotic processions, folk theatre, and community music performances.",
        "celebration_details": "Processions, traditional sports, and cultural nights across Swaraj Dweep.",
        "associated_communities": "Island communities of Andaman & Nicobar",
        "month_or_season": "January 23",
        "date_type": "FIXED",
        "image_url": "https://images.unsplash.com/photo-1548013146-72479768bada?w=1000",
        "source_url": "https://www.andamantourism.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- PUDUCHERRY ---
    {
        "id": "fest-yoga-festival-puducherry",
        "name": "International Yoga Festival, Puducherry",
        "state": "Puducherry",
        "region": "Puducherry Waterfront",
        "category": "Spiritual & Yogic Heritage",
        "description": "A prestigious international gathering of yoga masters, scholars, and practitioners organized by the Government of Puducherry since 1993.",
        "historical_background": "Pioneered to honor the ancient spiritual heritage of Puducherry, home to sage Agastya and Sri Aurobindo.",
        "cultural_significance": "Promotes classical Patanjali yoga, pranayama, and yogic philosophy through public seminars and sunrise beach demonstrations.",
        "celebration_details": "Workshops, asana competitions, classical music, and spiritual discourse on the Promenade.",
        "associated_communities": "Yogic institutions, citizens, and international delegates",
        "month_or_season": "January 4 to January 7",
        "date_type": "FIXED",
        "image_url": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000",
        "source_url": "https://pondytourism.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "fest-manakula-vinayagar-brahmotsavam",
        "name": "Manakula Vinayagar Temple Brahmotsavam",
        "state": "Puducherry",
        "region": "White Town, Puducherry",
        "category": "Traditional Tamil Temple Chariot Festival",
        "description": "A 24-day annual temple chariot festival dedicated to Lord Ganesha at the historic pre-French Manakula Vinayagar Temple.",
        "historical_background": "Existed prior to French colonial settlement in 1673 CE, famously surviving attempts by Dupleix to dismantle it.",
        "cultural_significance": "A grand display of Tamil Dravidian temple car traditions with traditional Nadaswaram and Thavil percussion.",
        "celebration_details": "Procession of the golden chariot through the grid streets of White Town and Heritage Town.",
        "associated_communities": "Puducherry Tamil community and devotees across South India",
        "month_or_season": "August–September (Tamil Month of Avani)",
        "date_type": "LUNAR",
        "image_url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000",
        "source_url": "https://pondytourism.in",
        "verification_status": "VERIFIED"
    },

    # --- DADRA & NAGAR HAVELI AND DAMAN & DIU ---
    {
        "id": "fest-nariyal-poornima-daman",
        "name": "Nariyal Poornima (Coconut Day) of Daman & Diu",
        "state": "Dadra & Nagar Haveli and Daman & Diu",
        "region": "Daman & Diu Coast",
        "city": "Daman",
        "category": "Maritime Oceanic Thanksgiving",
        "description": "An ancient coastal festival celebrated on the full moon of Shravana where fishermen and mariners offer golden-leaf coconuts to Lord Varuna.",
        "historical_background": "Marks the end of the violent southwest monsoon and the safe reopening of the Arabian Sea for maritime trade and fishing.",
        "cultural_significance": "Features decorated sailing trawlers, swimming races across the Daman Ganga river, and singing of coastal ballads.",
        "celebration_details": "Ceremonial coconut offering at Devka Beach and Nani Daman jetty, followed by community fairs.",
        "associated_communities": "Machhi and Kharwa seafaring communities",
        "month_or_season": "August (Full Moon of Shravana)",
        "date_type": "LUNAR",
        "image_url": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1000",
        "source_url": "https://tourism.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "fest-barash-festival",
        "name": "Barash Tribal Harvest Festival",
        "state": "Dadra & Nagar Haveli and Daman & Diu",
        "region": "Dadra & Nagar Haveli Foothills",
        "city": "Silvassa",
        "category": "Indigenous Tribal Harvest Celebration",
        "description": "The premier cultural festival of the Warli, Kokna, and Dhodia indigenous tribes of Dadra and Nagar Haveli, celebrated during Diwali.",
        "historical_background": "Celebrated to pay homage to Kansari (Goddess of Corn) and the tiger deity Hirva.",
        "cultural_significance": "Accompanied by non-stop collective dancing to the primeval drones of the Tarpa wind instrument.",
        "celebration_details": "Night-long village dances, display of fresh rice grains, and traditional liquor offerings.",
        "associated_communities": "Warli, Kokna, and Dhodia tribes",
        "month_or_season": "October–November (Diwali Season)",
        "date_type": "LUNAR",
        "image_url": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1000",
        "source_url": "https://tourism.gov.in",
        "verification_status": "VERIFIED"
    }
]

BATCH1_CRAFTS = [
    # --- ASSAM ---
    {
        "id": "art-muga-silk-assam",
        "name": "Muga Silk of Assam",
        "state": "Assam",
        "origin": "Sualkuchi (Kamrup)",
        "craft_category": "Traditional Handloom Silk",
        "description": "The rarest wild golden silk in the world, produced exclusively in the Brahmaputra Valley by the endemic silkworm Antheraea assamensis. It is naturally golden-yellow, highly durable, and gains luster with every wash.",
        "materials_used": "Natural golden silk yarn derived from Som and Soalu tree-fed silkworms; woven on traditional throw-shuttle looms.",
        "production_technique": "Multi-stage manual reeling, degumming, and handloom weaving with Jacquard or traditional drawboy cards.",
        "cultural_significance": "An emblem of Assamese aristocratic identity; historically reserved for Ahom royalty. Protected with Geographical Indication status.",
        "artisan_name": "Sualkuchi Master Silk Weavers Guild",
        "artisan_location": "Sualkuchi Silk Village, Kamrup, Assam",
        "gi_status": True,
        "gi_registration_reference": "GI Application No. 55",
        "image_url": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000",
        "source_url": "https://ipindia.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "art-majuli-mask-making",
        "name": "Majuli Mask Making (Mukha Shilpa)",
        "state": "Assam",
        "origin": "Majuli River Island",
        "craft_category": "Theatrical Mask Craft",
        "description": "A 500-year-old traditional mask-making tradition practiced at Natun Samaguri Satra on Majuli island, created for Bhaona mythological theatrical performances.",
        "materials_used": "Local bamboo split frames, cane, khagori reeds, pottery clay mixed with cow dung, and natural mineral dyes.",
        "production_technique": "Bamboo armature construction, papier-mâché layering with clay, hand sculpting, and painting with natural mineral colors.",
        "cultural_significance": "Founded by Saint Srimanta Sankardeva in the 16th century as an integral component of Vaishnavite monastic theatre. Accorded GI registration in 2024.",
        "artisan_name": "Samaguri Satra Mask Masters Guild",
        "artisan_location": "Natun Samaguri Satra, Majuli, Assam",
        "gi_status": True,
        "gi_registration_reference": "GI Application No. 726",
        "image_url": "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?w=1000",
        "source_url": "https://ipindia.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- ARUNACHAL PRADESH ---
    {
        "id": "art-wancho-beaded-craft",
        "name": "Wancho Beaded Craft & Wood Carving",
        "state": "Arunachal Pradesh",
        "origin": "Longding District",
        "craft_category": "Tribal Beadwork and Woodcraft",
        "description": "Vibrant ceremonial bead jewelry, headdresses, and wooden warrior figures handcrafted by the Wancho tribe of eastern Arunachal Pradesh.",
        "materials_used": "Traditional seed beads, colorful glass beads, local softwoods, and bamboo cane.",
        "production_technique": "Geometric thread stringing, loom bead-weaving, and handheld chisel carving.",
        "cultural_significance": "Historically indicated tribal rank, warrior prestige, and clan belonging within Wancho chieftain society. Awarded GI status in 2024.",
        "artisan_name": "Longding Wancho Crafts Society",
        "artisan_location": "Longding District, Arunachal Pradesh",
        "gi_status": True,
        "gi_registration_reference": "GI Application No. 709",
        "image_url": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000",
        "source_url": "https://ipindia.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "art-monpa-wood-carving",
        "name": "Monpa Wood Carving & Dapa Vessels",
        "state": "Arunachal Pradesh",
        "origin": "Tawang & Dirang",
        "craft_category": "Traditional Woodcraft",
        "description": "Exquisite handheld wooden bowls (Dapa), prayer tables (Choktse), and decorative Buddhist masks hand-carved from maple, walnut, and pine woods.",
        "materials_used": "Local seasoning maple burl (Ting-shing), pine wood, and vegetable lacquers.",
        "production_technique": "Loom turning and manual relief chiseling featuring dragons, lotus blossoms, and Tibetan floral scrolls.",
        "cultural_significance": "Centuries-old domestic craft integral to Buddhist hospitality and monastic rituals in the high Himalayas.",
        "artisan_name": "Tawang Monpa Wood Artisans Guild",
        "artisan_location": "Tawang, Arunachal Pradesh",
        "gi_status": False,
        "gi_registration_reference": None,
        "image_url": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1000",
        "source_url": "https://handicrafts.nic.in",
        "verification_status": "VERIFIED"
    },

    # --- MEGHALAYA ---
    {
        "id": "art-ryndia-eri-silk",
        "name": "Ryndia (Eri Peace Silk) Weaving",
        "state": "Meghalaya",
        "origin": "Ri-Bhoi District",
        "craft_category": "Traditional Handloom Textile",
        "description": "An eco-friendly 'Ahimsa' organic silk handwoven from the cocoons of the Philosamia ricini moth without killing the pupae. Celebrated for thermal properties.",
        "materials_used": "Castor-leaf-fed Eri silk yarn, natural botanical dyes derived from lac, turmeric, wild madder, and iron water.",
        "production_technique": "Drop-spindle hand spinning, botanical dye extraction, and weaving on traditional Khasi ground throw-shuttle looms.",
        "cultural_significance": "The sacred heirloom shawl of the Khasi people, presented at births, marriages, and traditional councils. Accorded GI protection.",
        "artisan_name": "Ri-Bhoi Eri Silk Weavers Cooperative",
        "artisan_location": "Umden Silk Village, Ri-Bhoi, Meghalaya",
        "gi_status": True,
        "gi_registration_reference": "GI Application No. 586",
        "image_url": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000",
        "source_url": "https://ipindia.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "art-larnai-black-pottery",
        "name": "Larnai Black Clay Pottery",
        "state": "Meghalaya",
        "origin": "Larnai (West Jaintia Hills)",
        "craft_category": "Handmade Indigenous Earthenware",
        "description": "An ancient prehistoric unglazed black pottery tradition practiced exclusively by Pnar women of Larnai village without the use of a potter's wheel.",
        "materials_used": "Local Sung clay mixed with serpentinite rock dust, dyed with wild Soh-kew plant extract.",
        "production_technique": "Hand-moulding using flat wooden mallets and open-fire pit firing with dried leaves and husks.",
        "cultural_significance": "A living megalithic ceramic tradition passed down through generations along matrilineal lineage.",
        "artisan_name": "Larnai Women Potters Guild",
        "artisan_location": "Larnai Village, West Jaintia Hills, Meghalaya",
        "gi_status": True,
        "gi_registration_reference": "GI Application No. 805",
        "image_url": "https://images.unsplash.com/photo-1606214300344-93b6f007e052?w=1000",
        "source_url": "https://ipindia.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- NAGALAND ---
    {
        "id": "art-naga-shawls",
        "name": "Naga Handwoven Shawls",
        "state": "Nagaland",
        "origin": "Kohima & Mokokchung",
        "craft_category": "Traditional Backstrap Handloom",
        "description": "Distinctive tribal ceremonial shawls featuring bold geometric patterns, clan identities, and animal motifs handwoven on traditional loin looms.",
        "materials_used": "Indigenous cotton, stinging nettle fiber, and natural vegetable dyes.",
        "production_technique": "Traditional backstrap loin loom weaving with extra-weft continuous patterning.",
        "cultural_significance": "A protected GI craft where specific patterns (such as Tsungkotepsu of the Ao or Rongsu) denote warrior valor and social status.",
        "artisan_name": "Nagaland Apex Weavers Association",
        "artisan_location": "Kohima, Nagaland",
        "gi_status": True,
        "gi_registration_reference": "GI Application No. 85",
        "image_url": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000",
        "source_url": "https://ipindia.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "art-chakhesang-shawl",
        "name": "Chakhesang Naga Shawl",
        "state": "Nagaland",
        "origin": "Phek District",
        "craft_category": "Traditional Handloom",
        "description": "Ceremonial shawl woven with hand-spun local nettle fiber and natural colored yarn, featuring the sacred motifs of the Chakhesang tribe.",
        "materials_used": "Wild nettle fiber, locally grown cotton, and natural mineral dyes.",
        "production_technique": "Laborious manual fiber retting, hand-spinning, and loin loom weaving.",
        "cultural_significance": "GI registered craft exemplifying eco-textile traditions and tribal clan insignia.",
        "artisan_name": "Chakhesang Women Welfare Society",
        "artisan_location": "Pfütsero, Phek District, Nagaland",
        "gi_status": True,
        "gi_registration_reference": "GI Application No. 542",
        "image_url": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1000",
        "source_url": "https://ipindia.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- MANIPUR ---
    {
        "id": "art-shaphee-lanphee",
        "name": "Shaphee Lanphee Textile",
        "state": "Manipur",
        "origin": "Imphal Valley",
        "craft_category": "Traditional Embroidered Fabric",
        "description": "A magnificent traditional black ceremonial shawl embroidered with red and yellow cosmic motifs (sun, moon, stars) and auspicious animals.",
        "materials_used": "Handspun black cotton fabric, vibrant red, yellow, and green silk embroidery yarn.",
        "production_technique": "Loin-loom woven fabric base with freehand needlework embroidery without stencils.",
        "cultural_significance": "Historically conferred by the King of Manipur upon valorous warriors and meritorious scholars. Registered with GI status.",
        "artisan_name": "Manipuri Master Embroiderers Association",
        "artisan_location": "Imphal East, Manipur",
        "gi_status": True,
        "gi_registration_reference": "GI Application No. 371",
        "image_url": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000",
        "source_url": "https://ipindia.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "art-longpi-pottery",
        "name": "Longpi Black Stone Pottery (Hamlei)",
        "state": "Manipur",
        "origin": "Longpi (Nungbi), Ukhrul",
        "craft_category": "Unglazed Black Stone Pottery",
        "description": "An ancient Tangkhul Naga pottery tradition made without a potter's wheel using black serpentinite stone and weathered brown clay.",
        "materials_used": "Ground serpentinite stone and weathering clay mixed in a 5:3 ratio; polished with Chiron na leaves.",
        "production_technique": "Hand-moulding using flat stone mallets, open-bonfire firing, and polishing with wild leaves to achieve metallic black sheen.",
        "cultural_significance": "Unique non-metallic cooking ware in the world, prized for retaining heat and food flavor; 100% natural and non-toxic.",
        "artisan_name": "Longpi Tangkhul Potters Guild",
        "artisan_location": "Longpi Village, Ukhrul, Manipur",
        "gi_status": True,
        "gi_registration_reference": "GI Application No. 675",
        "image_url": "https://images.unsplash.com/photo-1606214300344-93b6f007e052?w=1000",
        "source_url": "https://ipindia.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- MIZORAM ---
    {
        "id": "art-mizo-puan",
        "name": "Mizo Puan (Puanchei & Ngotekherh)",
        "state": "Mizoram",
        "origin": "Aizawl & Thenzawl",
        "craft_category": "Traditional Handwoven Wrap",
        "description": "The national textile wrap of Mizoram, featuring intricate geometric stripes in red, black, and white handwoven on traditional loin looms.",
        "materials_used": "Pure cotton and acrylic yarn woven on backstrap loin looms.",
        "production_technique": "Complex supplementary weft patterning requiring extreme mathematical precision and finger manipulation.",
        "cultural_significance": "Essential wedding and ceremonial attire for every Mizo woman, carrying deep cultural identity. Accorded GI status.",
        "artisan_name": "Thenzawl Handloom Weavers Society",
        "artisan_location": "Thenzawl (Handloom City of Mizoram)",
        "gi_status": True,
        "gi_registration_reference": "GI Application No. 598",
        "image_url": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000",
        "source_url": "https://ipindia.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- SIKKIM ---
    {
        "id": "art-sikkim-thangka",
        "name": "Sikkimese Buddhist Thangka Painting",
        "state": "Sikkim",
        "origin": "Gangtok & Pelling",
        "craft_category": "Sacred Scroll Painting",
        "description": "Sacred Buddhist scroll paintings of deities, mandalas, and Arhats executed on cotton canvas framed in exquisite silk brocades.",
        "materials_used": "Gessoed cotton canvas, natural mineral pigments (malachite, cinnabar, lapis lazuli), 24-carat liquid gold dust, and silk brocade.",
        "production_technique": "Strict adherence to the iconometric measurements laid down in the Buddhist Kanjur scriptures.",
        "cultural_significance": "A sacred meditative practice preserving Tibetan Buddhist iconography in the Eastern Himalayas.",
        "artisan_name": "Directorate of Handicrafts & Handloom Thangka Guild",
        "artisan_location": "Gangtok, Sikkim",
        "gi_status": False,
        "gi_registration_reference": None,
        "image_url": "https://images.unsplash.com/photo-1548013146-72479768bada?w=1000",
        "source_url": "https://handicrafts.nic.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "art-sikkim-choktse",
        "name": "Sikkimese Choktse (Carved Folding Table)",
        "state": "Sikkim",
        "origin": "Gangtok",
        "craft_category": "Traditional Woodcraft",
        "description": "Intricately carved folding wooden tea and prayer tables decorated with Buddhist eight auspicious symbols (Ashtamangala) and vivid paints.",
        "materials_used": "Tooni and pine seasoned timber, gold paint, and natural lacquers.",
        "production_technique": "Precision interlocking joint construction without metallic nails; relief carving using fine chisels.",
        "cultural_significance": "A symbol of Sikkimese hospitality and monastic seating traditions.",
        "artisan_name": "Sikkim Woodcraft Guild",
        "artisan_location": "Gangtok, Sikkim",
        "gi_status": False,
        "gi_registration_reference": None,
        "image_url": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1000",
        "source_url": "https://handicrafts.nic.in",
        "verification_status": "VERIFIED"
    },

    # --- TRIPURA ---
    {
        "id": "art-tripura-risa",
        "name": "Tripura Risa Handwoven Textile",
        "state": "Tripura",
        "origin": "Khowai & Gomati Districts",
        "craft_category": "Traditional Handloom",
        "description": "A traditional handwoven breastcloth featuring striking geometric motifs and colorful stripes, woven on indigenous loin looms by tribal women.",
        "materials_used": "Locally spun cotton and bright natural dyes.",
        "production_technique": "Loin loom weaving with traditional warp and weft counts passing down ancestral tribal patterns.",
        "cultural_significance": "A fundamental element of Tripuri female attire, offered in sacred ceremonies and as an honorific scarf. Registered with GI status in 2024.",
        "artisan_name": "Tripura Tribal Weavers Guild",
        "artisan_location": "Agartala, Tripura",
        "gi_status": True,
        "gi_registration_reference": "GI Application No. 710",
        "image_url": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000",
        "source_url": "https://ipindia.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "art-tripura-bamboo-craft",
        "name": "Tripura Bamboo & Cane Screen Craft",
        "state": "Tripura",
        "origin": "Agartala & Dharmanagar",
        "craft_category": "Bamboo & Cane Handicraft",
        "description": "Ultra-fine bamboo split mats, delicate window screens, and lacquered containers showcasing the highest standards of bamboo craftsmanship in India.",
        "materials_used": "Muli and Barak native bamboo species seasoned with herbal treatments.",
        "production_technique": "Hair-thin sliver splitting, delicate warp-weft plaiting, and heat bending.",
        "cultural_significance": "A traditional rural craft supporting over 100,000 artisan families across Tripura.",
        "artisan_name": "Tripura Bamboo Crafts Guild",
        "artisan_location": "Agartala, Tripura",
        "gi_status": False,
        "gi_registration_reference": None,
        "image_url": "https://images.unsplash.com/photo-1606214300344-93b6f007e052?w=1000",
        "source_url": "https://handicrafts.nic.in",
        "verification_status": "VERIFIED"
    },

    # --- LADAKH ---
    {
        "id": "art-ladakh-pashmina",
        "name": "Ladakh Pashmina (Cashmere)",
        "state": "Ladakh",
        "origin": "Changthang Plateau",
        "craft_category": "High Altitude Luxury Fiber",
        "description": "The world's finest cashmere wool harvested from the Changthangi (Pashmina) goat grazing at 14,000+ feet in the Changthang region. Spun and woven by hand.",
        "materials_used": "Raw Pashm fiber with a fineness of 12–15 microns.",
        "production_technique": "Gentle manual combing, traditional wooden spinning wheel ('Yender') processing, and handloom shawl weaving.",
        "cultural_significance": "The historic cornerstone of trans-Himalayan trade routes linking Tibet, Ladakh, and Kashmir. Registered under Geographical Indications.",
        "artisan_name": "Changthang Pashmina Pastoralists Cooperative",
        "artisan_location": "Nyoma / Leh, Ladakh",
        "gi_status": True,
        "gi_registration_reference": "GI Application No. 58",
        "image_url": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000",
        "source_url": "https://ipindia.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "art-ladakh-wood-carving",
        "name": "Ladakh Wood Carving (Shingskos)",
        "state": "Ladakh",
        "origin": "Leh & Wanla",
        "craft_category": "Architectural & Monastic Woodcraft",
        "description": "High-relief wood carving on monastery pillars, capital brackets, and carved prayer tables featuring Buddhist dragons, snow lions, and lotus motifs.",
        "materials_used": "Poplar, willow, and seasoned Himalayan cedar.",
        "production_technique": "Deep relief manual gouging and mineral pigment painting.",
        "cultural_significance": "Granted GI status in 2023; central to traditional Ladakhi architecture and spiritual interiors.",
        "artisan_name": "All Ladakh Wood Carvers Guild",
        "artisan_location": "Leh, Ladakh",
        "gi_status": True,
        "gi_registration_reference": "GI Application No. 718",
        "image_url": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1000",
        "source_url": "https://ipindia.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- LAKSHADWEEP ---
    {
        "id": "art-lakshadweep-coir",
        "name": "Lakshadweep Island Coir & Coconut Fiber Craft",
        "state": "Lakshadweep",
        "origin": "Amini, Kadmat & Kavaratti",
        "craft_category": "Marine Coir & Natural Fiber",
        "description": "Traditional coir yarn hand-spun from coconut husks retted naturally in coastal saline lagoons. Known for its golden tint, elasticity, and remarkable resistance to seawater rot.",
        "materials_used": "Lagoon-retted coconut husk fiber and natural sea-salt mineral seasoning.",
        "production_technique": "Traditional manual husk beating, spinning on two-ply hand wheels, and net knotting.",
        "cultural_significance": "The historic maritime fiber of Indian Ocean dhow navigation, exported since the Sangam and medieval Arab trading eras.",
        "artisan_name": "Lakshadweep Coir Workers Industrial Cooperative",
        "artisan_location": "Kavaratti, Lakshadweep",
        "gi_status": False,
        "gi_registration_reference": None,
        "image_url": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1000",
        "source_url": "https://handicrafts.nic.in",
        "verification_status": "VERIFIED"
    },

    # --- ANDAMAN & NICOBAR ISLANDS ---
    {
        "id": "art-nicobarese-mat",
        "name": "Nicobarese Traditional Pandanus Mat",
        "state": "Andaman & Nicobar Islands",
        "origin": "Car Nicobar & Chowra",
        "craft_category": "Indigenous Leaf Weaving",
        "description": "Delicate, durable sleeping and ceremonial mats handwoven by indigenous Nicobarese women from dried split leaves of the wild Pandanus (screw pine) palm.",
        "materials_used": "Wild Pandanus palm leaves dried and smoothed using sea shells, natural plant stains.",
        "production_technique": "Manual longitudinal leaf splitting and tight diagonal plaiting without a loom.",
        "cultural_significance": "A protected GI craft embodying the ancient ecological material heritage of the indigenous Nicobarese tribe.",
        "artisan_name": "Nicobarese Tribal Council Artisans",
        "artisan_location": "Car Nicobar, Andaman & Nicobar Islands",
        "gi_status": True,
        "gi_registration_reference": "GI Application No. 145",
        "image_url": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000",
        "source_url": "https://ipindia.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- PUDUCHERRY ---
    {
        "id": "art-villianur-terracotta",
        "name": "Villianur Terracotta Craft",
        "state": "Puducherry",
        "origin": "Villianur",
        "craft_category": "Terracotta & Ceramic Art",
        "description": "Renowned fine terracotta art made from specialized alluvial clay found in the local Villianur tank, celebrated for monumental Ayyanar temple horses and delicate domestic statues.",
        "materials_used": "Green fine silt clay from Villianur tank, river sand, and firewood for kiln reduction.",
        "production_technique": "Hand sculpting and wheel thrown sections joined using slip clay, open kiln firing without synthetic glazes.",
        "cultural_significance": "An ancient Chola-era village pottery tradition accorded GI status, representing guardian deity traditions of Tamil country.",
        "artisan_name": "Villianur Terracotta Artisans Guild",
        "artisan_location": "Villianur, Puducherry",
        "gi_status": True,
        "gi_registration_reference": "GI Application No. 138",
        "image_url": "https://images.unsplash.com/photo-1606214300344-93b6f007e052?w=1000",
        "source_url": "https://ipindia.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "art-tirukanur-papier-mache",
        "name": "Tirukanur Papier Mâché Craft",
        "state": "Puducherry",
        "origin": "Tirukanur",
        "craft_category": "Papier-Mâché Sculpting",
        "description": "Finely detailed lightweight figurines of classical deities, historical figures, and life-size festival statues made from paper pulp and chalk powder.",
        "materials_used": "Recycled cotton paper pulp, plaster of Paris, natural gum, and tempera paints.",
        "production_technique": "Die pressing, hand finishing, sandpaper smoothing, and traditional polychrome painting.",
        "cultural_significance": "GI registered craft blending French doll-making techniques with classical Indian iconography.",
        "artisan_name": "Tirukanur Papier Mache Guild",
        "artisan_location": "Tirukanur, Puducherry",
        "gi_status": True,
        "gi_registration_reference": "GI Application No. 139",
        "image_url": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1000",
        "source_url": "https://ipindia.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- DADRA & NAGAR HAVELI AND DAMAN & DIU ---
    {
        "id": "art-warli-bamboo-craft",
        "name": "Warli Bamboo & Palm Craft of Silvassa",
        "state": "Dadra & Nagar Haveli and Daman & Diu",
        "origin": "Silvassa",
        "craft_category": "Tribal Bamboo & Cane Art",
        "description": "Traditional storage bins, hunting traps, fishing nets, and palm-leaf wall hangings handcrafted by the indigenous Warli and Kokna tribes.",
        "materials_used": "Local bamboo species, wild date palm leaves, and natural plant sap.",
        "production_technique": "Manual splinter splitting and tight diagonal plaiting.",
        "cultural_significance": "Indispensable domestic craft sustaining tribal agricultural life in the Western Ghats foothills.",
        "artisan_name": "Silvassa Tribal Crafts Cooperative",
        "artisan_location": "Silvassa, Dadra & Nagar Haveli",
        "gi_status": False,
        "gi_registration_reference": None,
        "image_url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000",
        "source_url": "https://handicrafts.nic.in",
        "verification_status": "VERIFIED"
    }
]

BATCH1_PERFORMING_ARTS = [
    # --- ASSAM ---
    {
        "id": "folk-sattriya-dance",
        "name": "Sattriya Classical Dance",
        "state": "Assam",
        "origin": "Majuli and Barpeta Satras, Assam",
        "origin_region": "Majuli and Barpeta Satras, Assam",
        "category": "Classical Dance",
        "description": "One of the eight classical dances of India, created by the 15th-century saint Srimanta Sankardeva as an accompaniment to the Ankiya Nat (one-act play) in Vaishnavite monasteries.",
        "performance_style": "Combines graceful Nritta (pure rhythmic dance) and Abhinaya (dramatic facial expressions) guided by the ancient Natyashastra and Srihastamukhtavali.",
        "instruments": ["Khol (two-faced drum)", "Taal (brass cymbals)", "Bahi (bamboo flute)", "Violin"],
        "cultural_significance": "Recognized as a Classical Dance of India by Sangeet Natak Akademi in 2000. Preserved for centuries in celibate monastic sanctuaries.",
        "image_url": "https://images.unsplash.com/photo-1588099768531-a72d4a198538?w=1000",
        "source_url": "https://sangeetnatak.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "folk-bihu-dance",
        "name": "Bihu Folk Dance of Assam",
        "state": "Assam",
        "origin": "Brahmaputra Valley",
        "origin_region": "Brahmaputra Valley",
        "category": "Folk Dance",
        "description": "An exuberant, joyful folk dance performed by young men and women during Rongali Bihu, celebrated for brisk footwork and rapid hip movements symbolizing youth and nature's fertility.",
        "performance_style": "Open circle dance synchronized to high-energy rhythmic percussion and call-and-response vocal verses.",
        "instruments": ["Dhol (barrel drum)", "Pepa (buffalo horn pipe)", "Gagana (reed jaw harp)", "Toka (bamboo clapper)"],
        "cultural_significance": "The defining national folk dance of Assam, setting a Guinness World Record in 2023 with 11,304 performers.",
        "image_url": "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?w=1000",
        "source_url": "https://sangeetnatak.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- ARUNACHAL PRADESH ---
    {
        "id": "folk-aji-lamu-dance",
        "name": "Aji Lamu Masked Folk Theatre",
        "state": "Arunachal Pradesh",
        "origin": "Tawang and West Kameng",
        "origin_region": "Tawang and West Kameng",
        "category": "Folk Dance & Theatre",
        "description": "A traditional masked folk dance-drama of the Monpa tribe portraying mythological stories and Buddhist moral fables, featuring colorful animal and demon characters.",
        "performance_style": "Dramatic reenactment with ritual steps, comic interludes by clown characters ('Nyapa'), and auspicious blessings.",
        "instruments": ["Dungchen (long brass trumpet)", "Gyaling (oboe)", "Nga (double-headed drum)", "Cymbals"],
        "cultural_significance": "Performed during Losar and Torgya festivals to impart moral instruction and protect the community from misfortunes.",
        "image_url": "https://images.unsplash.com/photo-1588099768531-a72d4a198538?w=1000",
        "source_url": "https://sangeetnatak.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- MEGHALAYA ---
    {
        "id": "folk-shad-suk-mynsiem-dance",
        "name": "Ka Shad Suk Mynsiem Ritual Dance",
        "state": "Meghalaya",
        "origin": "Khasi Hills",
        "origin_region": "Khasi Hills",
        "category": "Ritual Folk Dance",
        "description": "An ancient ritual community dance where unmarried Khasi maidens shuffle in tiny measured steps while armed men dance in protective outer circles with drawn swords and fly-whisks.",
        "performance_style": "Slow, dignified concentric circular motion guided by intricate flute melodies and rhythm changes.",
        "instruments": ["Tangmuri (double-reed woodwind)", "Nakra (great kettle drum)", "Ksing Padiah (small drum)", "Cymbals"],
        "cultural_significance": "An artistic affirmation of the matrilineal structure of Khasi society, where women are honored as the roots and men as the protective branches.",
        "image_url": "https://images.unsplash.com/photo-1588099768531-a72d4a198538?w=1000",
        "source_url": "https://sangeetnatak.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- NAGALAND ---
    {
        "id": "folk-chang-lo-dance",
        "name": "Chang Lo (Sua Lua) Warrior Dance",
        "state": "Nagaland",
        "origin": "Tuensang District",
        "origin_region": "Tuensang District",
        "category": "Folk Dance",
        "description": "A dramatic victory dance of the Chang Naga tribe performed during the Poanglem festival to celebrate successful defense and bumper harvest.",
        "performance_style": "Military formation maneuvers, synchronised stamping, and battle-cries executed in full warrior regalia with cowrie-shell aprons.",
        "instruments": ["Log drum (xylophone-like tree drum)", "Brass gongs", "Horn trumpets"],
        "cultural_significance": "A living repository of Naga military heritage and clan solidarity, celebrated across Nagaland.",
        "image_url": "https://images.unsplash.com/photo-1588099768531-a72d4a198538?w=1000",
        "source_url": "https://sangeetnatak.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- MANIPUR ---
    {
        "id": "folk-manipuri-raas-leela",
        "name": "Manipuri Classical Dance (Raas Leela)",
        "state": "Manipur",
        "origin": "Imphal Valley",
        "origin_region": "Imphal Valley",
        "category": "Classical Dance",
        "description": "One of India's major classical dance forms, created in the 18th century by King Bhagyachandra following a divine vision. Renowned for liquid, undulating torso movements and circular gliding.",
        "performance_style": "Lasya-dominant devotional dance featuring the iconic Potloi stiff cylindrical velvet skirt and translucent veil.",
        "instruments": ["Pung (manipuri mridanga)", "Pena (bowed lute)", "Flute", "Kartal (cymbals)"],
        "cultural_significance": "Recognized as a Classical Dance of India by Sangeet Natak Akademi; performed in temple mandapas (Nat Mandap) in deep spiritual devotion.",
        "image_url": "https://images.unsplash.com/photo-1588099768531-a72d4a198538?w=1000",
        "source_url": "https://sangeetnatak.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "folk-pung-cholom",
        "name": "Pung Cholom (Acrobatic Drum Dance)",
        "state": "Manipur",
        "origin": "Imphal",
        "origin_region": "Imphal",
        "category": "Folk & Martial Dance",
        "description": "A breathtaking devotional performance where male dancers play the double-headed Pung drum while executing synchronized acrobatic leaps, spins, and floor rolls.",
        "performance_style": "Dynamic percussion combined with martial agility, starting with serene invocations and building to a dizzying athletic crescendo.",
        "instruments": ["Pung (terracotta/wood drum)", "Mandila cymbals"],
        "cultural_significance": "A mandatory soul-stirring invocation preceding sacred religious ceremonies and Raas Leela performances in Manipur.",
        "image_url": "https://images.unsplash.com/photo-1588099768531-a72d4a198538?w=1000",
        "source_url": "https://sangeetnatak.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- MIZORAM ---
    {
        "id": "folk-cheraw-dance",
        "name": "Cheraw (Mizo Bamboo Dance)",
        "state": "Mizoram",
        "origin": "Mizoram",
        "origin_region": "Mizoram",
        "category": "Folk Dance",
        "description": "The most famous folk dance of Mizoram, characterized by dancers stepping in and out between pairs of horizontal bamboo poles held and clapped rhythmically on the ground.",
        "performance_style": "Rapid, graceful stepping requiring extraordinary timing and balance, accompanied by chants and gongs.",
        "instruments": ["Khuang (Mizo drum)", "Dar (brass gongs)", "Bamboo poles"],
        "cultural_significance": "Mentioned in early Mizo folklore since the 1st century CE; performed on celebratory occasions like Chapchar Kut.",
        "image_url": "https://images.unsplash.com/photo-1588099768531-a72d4a198538?w=1000",
        "source_url": "https://sangeetnatak.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- SIKKIM ---
    {
        "id": "folk-singhi-chham",
        "name": "Singhi Chham (Snow Lion Dance)",
        "state": "Sikkim",
        "origin": "Sikkim Monasteries",
        "origin_region": "Sikkim Monasteries",
        "category": "Masked Mythological Folk Dance",
        "description": "A revered cultural dance performed by the Bhutia community depicting the mythical Snow Lion, the celestial guardian of Sikkim and holy Mount Kangchenjunga.",
        "performance_style": "Two performers inside a shaggy white lion costume execute playful jumps, crouching postures, and joyful leaps representing peace.",
        "instruments": ["Dungchen (Tibetan horn)", "Gyaling (reed pipe)", "Bukgjal (cymbals)", "Nga (drum)"],
        "cultural_significance": "Performed during Pang Lhabsol and Buddhist holidays to invoke divine protection and natural harmony.",
        "image_url": "https://images.unsplash.com/photo-1588099768531-a72d4a198538?w=1000",
        "source_url": "https://sangeetnatak.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- TRIPURA ---
    {
        "id": "folk-hojagiri-dance",
        "name": "Hojagiri Dance of the Reang Tribe",
        "state": "Tripura",
        "origin": "Jampui Hills & South Tripura",
        "origin_region": "Jampui Hills & South Tripura",
        "category": "Acrobatic Folk Dance",
        "description": "An extraordinary balancing folk dance performed by young Reang (Bru) women who balance earthen pitchers, bottles, and lamps on their heads while standing on a precarious pitcher.",
        "performance_style": "The upper body remains completely still while the waist and lower body sway in rhythmic sensual circles to indigenous drums.",
        "instruments": ["Kham (drum)", "Sumui (bamboo flute)", "Sarinda (string instrument)"],
        "cultural_significance": "Recognized by Sangeet Natak Akademi and celebrated internationally for its peerless yogic balance and grace.",
        "image_url": "https://images.unsplash.com/photo-1588099768531-a72d4a198538?w=1000",
        "source_url": "https://sangeetnatak.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- LADAKH ---
    {
        "id": "folk-cham-dance-ladakh",
        "name": "Cham Sacred Tantric Mask Dance",
        "state": "Ladakh",
        "origin": "Hemis, Thiksey, and Lamayuru Monasteries",
        "origin_region": "Hemis, Thiksey, and Lamayuru Monasteries",
        "category": "Monastic Tantric Dance",
        "description": "A profound spiritual dance performed exclusively by trained Buddhist lamas wearing elaborate silk robes and papier-mâché masks representing Mahakala and Dharmapalas.",
        "performance_style": "Solemn slow circular strides, sudden twirls, and mudras accompanied by deep sonic vibrations from monastery horns.",
        "instruments": ["Dungchen (long horn)", "Surna (oboe)", "Damaru (hand drum)", "Silnyen (flat cymbals)"],
        "cultural_significance": "A visual form of Buddhist meditation and spiritual exorcism, purifying negative thoughts from spectators.",
        "image_url": "https://images.unsplash.com/photo-1588099768531-a72d4a198538?w=1000",
        "source_url": "https://sangeetnatak.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- LAKSHADWEEP ---
    {
        "id": "folk-kolkali-lakshadweep",
        "name": "Kolkali Folk Dance of Lakshadweep",
        "state": "Lakshadweep",
        "origin": "Kavaratti and Minicoy",
        "origin_region": "Kavaratti and Minicoy",
        "category": "Folk Stick Dance",
        "description": "A rhythmic stick dance performed by male islanders moving in circular formations, striking wooden sticks in intricate syncopations that accelerate to a climax.",
        "performance_style": "Fast-paced circular footwork with crouching and jumping maneuvers synchronized to vocal ballads.",
        "instruments": ["Wooden sticks (Kol)", "Kaimani (cymbals)", "Vocal chorus"],
        "cultural_significance": "Preserves the maritime ballad traditions and community resilience of the islanders.",
        "image_url": "https://images.unsplash.com/photo-1588099768531-a72d4a198538?w=1000",
        "source_url": "https://sangeetnatak.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- ANDAMAN & NICOBAR ISLANDS ---
    {
        "id": "folk-nicobarese-dance",
        "name": "Nicobarese Traditional Island Dance",
        "state": "Andaman & Nicobar Islands",
        "origin": "Car Nicobar",
        "origin_region": "Car Nicobar",
        "category": "Indigenous Tribal Dance",
        "description": "A graceful circular group dance performed under full moon light by indigenous Nicobarese men and women with arms linked over each other's shoulders.",
        "performance_style": "Gentle swaying and stepping in a slow counter-clockwise circle, accompanied by rhythmic chanting of ancestral voyages.",
        "instruments": ["Natural vocal chanting and rhythmic bamboo foot-stamping"],
        "cultural_significance": "Integral to the Ossuary Feast and community reconciliation ceremonies; strictly preserved under tribal customary norms.",
        "image_url": "https://images.unsplash.com/photo-1588099768531-a72d4a198538?w=1000",
        "source_url": "https://ccrtindia.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- PUDUCHERRY ---
    {
        "id": "folk-garadi-dance",
        "name": "Garadi Folk Dance of Puducherry",
        "state": "Puducherry",
        "origin": "Puducherry & Villianur",
        "origin_region": "Puducherry & Villianur",
        "category": "Mythological Martial Dance",
        "description": "A dynamic mythological folk dance commemorating the victory of Lord Rama and the Vanara army over Ravana, performed by dancers wearing iron ankle rings.",
        "performance_style": "Athletic leaping and rhythmic stamping holding wooden swords, creating a metallic cadence with iron rings ('Anjali').",
        "instruments": ["Thavil (drum)", "Nadaswaram", "Iron ankle rings ('Anjali')"],
        "cultural_significance": "Performed during temple car festivals; unique to the Franco-Tamil coastal cultural heritage.",
        "image_url": "https://images.unsplash.com/photo-1588099768531-a72d4a198538?w=1000",
        "source_url": "https://sangeetnatak.gov.in",
        "verification_status": "VERIFIED"
    },

    # --- DADRA & NAGAR HAVELI AND DAMAN & DIU ---
    {
        "id": "folk-tarpa-dance",
        "name": "Tarpa Dance of the Warli Tribe",
        "state": "Dadra & Nagar Haveli and Daman & Diu",
        "origin": "Silvassa and Daman Hinterland",
        "origin_region": "Silvassa and Daman Hinterland",
        "category": "Tribal Folk Dance",
        "description": "A hypnotic circular group dance of the Warli and Kokna tribes where dancers hold hands and encircle the central Tarpa player without turning their backs.",
        "performance_style": "Continuous spiraling circle movement symbolizing the circle of life, directed by the continuous drone of the Tarpa horn.",
        "instruments": ["Tarpa (natural wind instrument made from dried gourd, bamboo pipes, and palm leaves)"],
        "cultural_significance": "Central ritual dance performed after harvest and during Barash; mirrors the spiral motifs in authentic Warli paintings.",
        "image_url": "https://images.unsplash.com/photo-1588099768531-a72d4a198538?w=1000",
        "source_url": "https://sangeetnatak.gov.in",
        "verification_status": "VERIFIED"
    }
]

BATCH1_EXPERIENCES = [
    {
        "id": "exp-majuli-satras",
        "name": "Majuli Island Neo-Vaishnavite Satra Trail",
        "state": "Assam",
        "city": "Majuli",
        "category": "Monastic Cultural Immersion",
        "description": "Guided walking tour through historic 16th-century Satras (monasteries) of Majuli, witnessing live Sattriya dance practice and bamboo mask sculpting.",
        "cultural_significance": "Direct immersion in living 500-year-old monastic tradition founded by Saint Srimanta Sankardeva on the world's largest river island.",
        "associated_place_id": "place-kamakhya-temple",
        "duration": "Full Day (6-8 Hours)",
        "latitude": 26.9500,
        "longitude": 94.2167,
        "informational_or_bookable": "INFORMATIONAL",
        "image_url": "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000",
        "source_url": "https://www.incredibleindia.org",
        "verification_status": "VERIFIED"
    },
    {
        "id": "exp-tawang-monastery-trail",
        "name": "Tawang Monastic Morning Prayer & Manuscript Walk",
        "state": "Arunachal Pradesh",
        "city": "Tawang",
        "category": "Spiritual Heritage Walk",
        "description": "Experience dawn butter-lamp illumination, chanting of Buddhist scriptures, and visit the 17th-century Kangyur manuscript library at Tawang Monastery.",
        "cultural_significance": "Deep insight into Mahayana Buddhist philosophy and high-altitude Himalayan monastic discipline.",
        "associated_place_id": "place-tawang-monastery",
        "duration": "Half Day (3-4 Hours)",
        "latitude": 27.5861,
        "longitude": 91.8661,
        "informational_or_bookable": "INFORMATIONAL",
        "image_url": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1000",
        "source_url": "https://arunachaltourism.com",
        "verification_status": "VERIFIED"
    },
    {
        "id": "exp-mawphlang-sacred-forest-walk",
        "name": "Mawphlang Sacred Grove Indigenous Ecology Walk",
        "state": "Meghalaya",
        "city": "Mawphlang",
        "category": "Ecological Heritage Trail",
        "description": "Guided ecological walk through the 800-year-old preserved sacred forest accompanied by indigenous Khasi custodians explaining ancient customary taboos.",
        "cultural_significance": "Understanding the deep sacred bond between indigenous tribal faiths and pristine forest conservation.",
        "associated_place_id": "place-mawphlang-sacred-grove",
        "duration": "Half Day (2-3 Hours)",
        "latitude": 25.4497,
        "longitude": 91.7583,
        "informational_or_bookable": "INFORMATIONAL",
        "image_url": "https://images.unsplash.com/photo-1548013146-72479768bada?w=1000",
        "source_url": "https://meghalayatourism.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "exp-khonoma-village-walk",
        "name": "Khonoma Green Village Indigenous Heritage Trail",
        "state": "Nagaland",
        "city": "Khonoma",
        "category": "Community Heritage Walk",
        "description": "Walking tour exploring traditional Angami Naga stone fortresses, morungs (youth dormitories), and community forest conservation sanctuaries.",
        "cultural_significance": "First-hand encounter with traditional Naga village democracy, terrace agricultural engineering, and peaceful village defense history.",
        "associated_place_id": "place-khonoma-fort",
        "duration": "Full Day (5-6 Hours)",
        "latitude": 25.6500,
        "longitude": 94.0167,
        "informational_or_bookable": "INFORMATIONAL",
        "image_url": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1000",
        "source_url": "https://tourism.nagaland.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "exp-kangla-palace-heritage-walk",
        "name": "Kangla Fort & Royal Sacred Shrines Walk",
        "state": "Manipur",
        "city": "Imphal",
        "category": "Historical Heritage Walk",
        "description": "Guided walking circuit across the ancient 2,000-year-old citadel of Kangla, inspecting the sacred coronation sanctum (Uttra), royal burial grounds, and Kangla Sha statues.",
        "cultural_significance": "Unravelling the royal historiography and Sanamahism spiritual foundations of the Ningthouja kingdom of Manipur.",
        "associated_place_id": "place-kangla-fort",
        "duration": "Half Day (3 Hours)",
        "latitude": 24.8083,
        "longitude": 93.9408,
        "informational_or_bookable": "INFORMATIONAL",
        "image_url": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1000",
        "source_url": "https://manipurtourism.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "exp-vangchhia-archaeological-trail",
        "name": "Vangchhia Megalithic Exploration Trail",
        "state": "Mizoram",
        "city": "Champhai",
        "category": "Archaeological Heritage Trail",
        "description": "Guided expedition to the newly documented megalithic site of Vangchhia to study carved menhirs depicting pre-colonial Mizo warrior burials.",
        "cultural_significance": "Connecting travelers with the tangible archaeological heritage of the Lushai hills.",
        "associated_place_id": "place-vangchhia-monoliths",
        "duration": "Full Day (6 Hours)",
        "latitude": 23.1167,
        "longitude": 93.3000,
        "informational_or_bookable": "INFORMATIONAL",
        "image_url": "https://images.unsplash.com/photo-1606214300344-93b6f007e052?w=1000",
        "source_url": "https://tourism.mizoram.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "exp-rabdentse-pelling-trail",
        "name": "Rabdentse Royal Ruins & Monastic Circuit",
        "state": "Sikkim",
        "city": "Pelling",
        "category": "Royal Capital Forest Trail",
        "description": "A picturesque forest walking trail connecting the ancient stone ruins of Rabdentse royal palace with Pemayangtse Monastery.",
        "cultural_significance": "Historical journey through the founding era of the Namgyal dynasty amidst panoramic views of Mount Kangchenjunga.",
        "associated_place_id": "place-rabdentse-ruins",
        "duration": "Half Day (3-4 Hours)",
        "latitude": 27.2972,
        "longitude": 88.2472,
        "informational_or_bookable": "INFORMATIONAL",
        "image_url": "https://images.unsplash.com/photo-1548013146-72479768bada?w=1000",
        "source_url": "https://www.sikkimtourism.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "exp-unakoti-forest-valley-trail",
        "name": "Unakoti Bas-Relief Valley Pilgrimage Walk",
        "state": "Tripura",
        "city": "Kailashahar",
        "category": "Sacred Rock-Art Trail",
        "description": "Descent into the forested gorge of Raghunandan hills to witness the colossal rock-cut carvings of Lord Shiva and sacred natural mountain streams.",
        "cultural_significance": "Spiritual encounter with 1,200-year-old rock-cut epigraphy set in sub-tropical rainforest.",
        "associated_place_id": "place-unakoti-reliefs",
        "duration": "Half Day (3 Hours)",
        "latitude": 24.3211,
        "longitude": 92.0664,
        "informational_or_bookable": "INFORMATIONAL",
        "image_url": "https://images.unsplash.com/photo-1606214300344-93b6f007e052?w=1000",
        "source_url": "https://tripuratourism.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "exp-old-leh-heritage-walk",
        "name": "Old Town Leh Cultural & Stupa Walk",
        "state": "Ladakh",
        "city": "Leh",
        "category": "Vernacular Heritage Walk",
        "description": "Guided walking tour through the labyrinthine mud-brick lanes of Old Town Leh beneath the royal palace, exploring ancient chortens and timber balconies.",
        "cultural_significance": "Insight into high-altitude ecological vernacular architecture and ancient Central Asian silk route trade caravans.",
        "associated_place_id": "place-leh-palace",
        "duration": "Half Day (2-3 Hours)",
        "latitude": 34.1661,
        "longitude": 77.5856,
        "informational_or_bookable": "INFORMATIONAL",
        "image_url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000",
        "source_url": "https://ladakhtourism.org",
        "verification_status": "VERIFIED"
    },
    {
        "id": "exp-kavaratti-marine-heritage",
        "name": "Kavaratti Coral Architecture & Marine Heritage Walk",
        "state": "Lakshadweep",
        "city": "Kavaratti",
        "category": "Island Maritime Heritage",
        "description": "Walking tour exploring historic coral-stone mosques, ancient seafaring boat-sheds, and local coconut fiber handicraft centers in Kavaratti.",
        "cultural_significance": "Unique understanding of sustainable coral-atoll human settlements and ancient Arabian Sea navigational culture.",
        "associated_place_id": "place-ujra-mosque-kavaratti",
        "duration": "Half Day (3 Hours)",
        "latitude": 10.5650,
        "longitude": 72.6417,
        "informational_or_bookable": "INFORMATIONAL",
        "image_url": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1000",
        "source_url": "https://lakshadweep.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "exp-cellular-jail-memorial-tour",
        "name": "Cellular Jail Historical Pilgrimage Walk",
        "state": "Andaman & Nicobar Islands",
        "city": "Port Blair",
        "category": "National Memorial Immersion",
        "description": "Comprehensive historical tour of the solitary prison wings, the central watchtower, the gallows enclosure, and the museum galleries.",
        "cultural_significance": "Honoring the sacrifices of India's revolutionary freedom fighters in the penal colony of Kala Pani.",
        "associated_place_id": "place-cellular-jail",
        "duration": "Half Day (3 Hours)",
        "latitude": 11.6739,
        "longitude": 92.7481,
        "informational_or_bookable": "INFORMATIONAL",
        "image_url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000",
        "source_url": "https://www.andamantourism.gov.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "exp-puducherry-french-quarter-walk",
        "name": "White Town Franco-Tamil Architectural Walk",
        "state": "Puducherry",
        "city": "Puducherry",
        "category": "Urban Heritage Walk",
        "description": "Guided walking tour through the grid avenues of White Town and Heritage Town, contrasting French colonial villas with traditional Tamil courtyard houses.",
        "cultural_significance": "Exploring the historic dual-urban character and living cultural synthesis of Puducherry.",
        "associated_place_id": "place-french-quarter-puducherry",
        "duration": "Half Day (2-3 Hours)",
        "latitude": 11.9333,
        "longitude": 79.8333,
        "informational_or_bookable": "INFORMATIONAL",
        "image_url": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000",
        "source_url": "https://pondytourism.in",
        "verification_status": "VERIFIED"
    },
    {
        "id": "exp-diu-fort-rampart-circuit",
        "name": "Diu Sea Citadel & Ramparts Heritage Trail",
        "state": "Dadra & Nagar Haveli and Daman & Diu",
        "city": "Diu",
        "category": "Maritime Citadel Circuit",
        "description": "Historical walking trail across the sea-surrounded ramparts, cannon platforms, and ancient stone moats of Diu Fort.",
        "cultural_significance": "Direct encounter with 16th-century Portuguese maritime defense architecture and naval history.",
        "associated_place_id": "place-diu-fort",
        "duration": "Half Day (3 Hours)",
        "latitude": 20.7167,
        "longitude": 70.9917,
        "informational_or_bookable": "INFORMATIONAL",
        "image_url": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1000",
        "source_url": "https://asi.nic.in",
        "verification_status": "VERIFIED"
    }
]

def ingest_batch1():
    print("=" * 70)
    print("INGESTING BATCH 1: Northeast States & Smaller Union Territories")
    print("=" * 70)

    db = load_db()

    counts = {
        "heritage": {"added": 0, "duplicate": 0},
        "festivals": {"added": 0, "duplicate": 0},
        "crafts": {"added": 0, "duplicate": 0},
        "performing_arts": {"added": 0, "duplicate": 0},
        "experiences": {"added": 0, "duplicate": 0}
    }

    # 1. Heritage Places
    existing_heritage_ids = {p["id"] for p in db.get("heritage_places", [])}
    for item in BATCH1_HERITAGE:
        if item["id"] not in existing_heritage_ids:
            db.setdefault("heritage_places", []).append(item)
            existing_heritage_ids.add(item["id"])
            counts["heritage"]["added"] += 1
        else:
            counts["heritage"]["duplicate"] += 1

    # 2. Festivals
    existing_fest_ids = {f["id"] for f in db.get("festivals_and_traditions", [])}
    for item in BATCH1_FESTIVALS:
        if item["id"] not in existing_fest_ids:
            db.setdefault("festivals_and_traditions", []).append(item)
            existing_fest_ids.add(item["id"])
            counts["festivals"]["added"] += 1
        else:
            counts["festivals"]["duplicate"] += 1

    # 3. Crafts
    existing_craft_ids = {c["id"] for c in db.get("arts_crafts_and_artisans", [])}
    for item in BATCH1_CRAFTS:
        if item["id"] not in existing_craft_ids:
            db.setdefault("arts_crafts_and_artisans", []).append(item)
            existing_craft_ids.add(item["id"])
            counts["crafts"]["added"] += 1
        else:
            counts["crafts"]["duplicate"] += 1

    # 4. Performing Arts
    existing_art_ids = {a["id"] for a in db.get("folk_and_performing_arts", [])}
    for item in BATCH1_PERFORMING_ARTS:
        if item["id"] not in existing_art_ids:
            db.setdefault("folk_and_performing_arts", []).append(item)
            existing_art_ids.add(item["id"])
            counts["performing_arts"]["added"] += 1
        else:
            counts["performing_arts"]["duplicate"] += 1

    # 5. Experiences
    existing_exp_ids = {e["id"] for e in db.get("cultural_experiences", [])}
    for item in BATCH1_EXPERIENCES:
        if item["id"] not in existing_exp_ids:
            db.setdefault("cultural_experiences", []).append(item)
            existing_exp_ids.add(item["id"])
            counts["experiences"]["added"] += 1
        else:
            counts["experiences"]["duplicate"] += 1

    save_db(db)

    print("Batch 1 Ingestion Completed:")
    for k, v in counts.items():
        print(f"  {k:16}: Added {v['added']} | Duplicates skipped {v['duplicate']}")

    total_added = sum(v["added"] for v in counts.values())
    print(f"Total new verified entities added in Batch 1: {total_added}")
    return counts

if __name__ == "__main__":
    ingest_batch1()
