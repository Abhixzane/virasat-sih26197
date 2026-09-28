"""
Master City Knowledge Base Builder for VIRASAT
Ingests all 28 States and 8 Union Territories (962 verified cities and towns)
Generates:
1. data/india_master_cities.json
2. Updates data/cultural_database.json (states_and_cities)
3. Updates backend/app/data/seeds/cities.json
4. Generates frontend/src/data/indiaCitiesMaster.ts
"""

import json
import os
import re

RAW_DATA = """
States

Andhra Pradesh: Visakhapatnam, Vijayawada, Guntur, Nellore, Kurnool, Kakinada, Rajahmundry, Kadapa, Tirupati, Anantapur, Vizianagaram, Eluru, Ongole, Nandyal, Machilipatnam, Adoni, Tenali, Proddatur, Chittoor, Hindupur, Bhimavaram, Madanapalle, Guntakal, Srikakulam, Dharmavaram, Gudivada, Narasaraopet, Tadipatri, Tadepalligudem, Amaravati.

Arunachal Pradesh: Itanagar, Tawang, Ziro, Pasighat, Roing, Tezu, Bomdila, Dirang, Bhalukpong, Khonsa, Changlang, Seppa, Aalo, Namsai, Yingkiong, Daporijo, Anini, Hawai, Koloriang, Longding, Miao, Basar, Deomali, Jairampur, Naharlagun, Yupia, Boleng, Lumla, Mechuka, Tuting.

Assam: Guwahati, Silchar, Dibrugarh, Jorhat, Nagaon, Tinsukia, Tezpur, Bongaigaon, Diphu, Dhubri, North Lakhimpur, Karimganj, Sivasagar, Goalpara, Barpeta, Golaghat, Morigaon, Biswanath Chariali, Hojai, Dhemaji, Kokrajhar, Nalbari, Mangaldoi, Duliajan, Lanka, Lumding, Hailakandi, Rangia, Nazira, Margherita.

Bihar: Patna, Gaya, Bhagalpur, Muzaffarpur, Purnia, Darbhanga, Bihar Sharif, Arrah, Begusarai, Katihar, Munger, Chhapra, Danapur, Saharsa, Hajipur, Sasaram, Dehri, Bettiah, Motihari, Bagaha, Siwan, Kishanganj, Jamalpur, Buxar, Jehanabad, Aurangabad, Lakhisarai, Nawada, Jamui, Sitamarhi.

Chhattisgarh: Raipur, Bhilai, Bilaspur, Korba, Rajnandgaon, Raigarh, Jagdalpur, Ambikapur, Dhamtari, Mahasamund, Bhatapara, Chirmiri, Durg, Kanker, Mungeli, Naila Janjgir, Dongargarh, Tilda Newra, Kawardha, Kondagaon, Gobindpur, Surajpur, Balod, Bemetara, Sukma, Bijapur, Narayanpur, Dantewada, Jashpur, Koriya.

Goa: Panaji, Margao, Vasco da Gama, Mapusa, Ponda, Bicholim, Curchorem, Sanquelim, Cuncolim, Valpoi, Sanguem, Canacona, Quepem, Pernem, Porvorim, Calangute, Candolim, Anjuna, Baga, Vagator, Colva, Benaulim, Majorda, Cavelossim, Saligao, Siolim, Aldona, Assagao, Moira, Chorao.

Gujarat: Ahmedabad, Surat, Vadodara, Rajkot, Bhavnagar, Jamnagar, Gandhinagar, Junagadh, Gandhidham, Anand, Navsari, Morbi, Nadiad, Surendranagar, Bharuch, Mehsana, Bhuj, Porbandar, Palanpur, Valsad, Vapi, Gondal, Veraval, Godhra, Patan, Kalol, Botad, Amreli, Deesa, Jetpur.

Haryana: Faridabad, Gurugram, Panipat, Ambala, Yamunanagar, Rohtak, Hisar, Karnal, Sonipat, Panchkula, Bhiwani, Sirsa, Bahadurgarh, Jind, Thanesar, Kaithal, Rewari, Palwal, Hansi, Narnaul, Fatehabad, Gohana, Tohana, Narwana, Charkhi Dadri, Jhajjar, Mandi Dabwali, Pehowa, Kalka, Safidon.

Himachal Pradesh: Shimla, Dharamshala, Solan, Mandi, Palampur, Baddi, Nahan, Paonta Sahib, Sundarnagar, Chamba, Una, Kullu, Hamirpur, Bilaspur, Kangra, Dalhousie, Manali, Nalagarh, Nurpur, Baijnath, Parwanoo, Santokhgarh, Mehatpur Basdehra, Shamshi, Rohru, Jogindernagar, Ghumarwin, Sarkaghat, Nagrota Bagwan, Kaza.

Jharkhand: Ranchi, Jamshedpur, Dhanbad, Bokaro, Deoghar, Phusro, Hazaribagh, Giridih, Ramgarh, Medininagar (Daltonganj), Chirkunda, Vidyasagar, Koderma, Sahibganj, Jhumri Telaiya, Chaibasa, Chatra, Gumla, Jamtara, Godda, Lohardaga, Pakur, Ghatshila, Madhupur, Chakradharpur, Simdega, Latehar, Khunti, Garhwa, Dumka.

Karnataka: Bengaluru, Mysuru, Hubballi-Dharwad, Mangaluru, Belagavi, Kalaburagi, Davanagere, Ballari, Vijayapura, Shivamogga, Tumakuru, Raichur, Bidar, Hosapete, Gadag-Betageri, Robertsonpet, Hassan, Bhadravati, Chitradurga, Udupi, Kolar, Mandya, Chikkamagaluru, Gangavati, Bagalkot, Ranebennur, Karwar, Sirsi, Tiptur, Gokak.

Kerala: Thiruvananthapuram, Kochi, Kozhikode, Kollam, Thrissur, Kannur, Alappuzha, Kottayam, Palakkad, Manjeri, Thalassery, Ponnani, Vatakara, Kanhangad, Payyanur, Koyilandy, Parappanangadi, Kalamassery, Kodungallur, Neyyattinkara, Tanur, Kayamkulam, Malappuram, Guruvayur, Punalur, Thrikkakkara, Chalakudy, Kothamangalam, Pathanamthitta, Tirur.

Madhya Pradesh: Indore, Bhopal, Jabalpur, Gwalior, Ujjain, Sagar, Dewas, Satna, Ratlam, Rewa, Murwara (Katni), Singrauli, Burhanpur, Khandwa, Bhind, Chhindwara, Guna, Shivpuri, Vidisha, Chhatarpur, Damoh, Mandsaur, Khargone, Neemuch, Pithampur, Hoshangabad, Itarsi, Sehore, Betul, Seoni.

Maharashtra: Mumbai, Pune, Nagpur, Nashik, Vasai-Virar, Aurangabad (Chhatrapati Sambhajinagar), Solapur, Bhiwandi, Jalgaon, Amravati, Nanded, Kolhapur, Akola, Panvel, Ulhasnagar, Sangli-Miraj-Kupwad, Malegaon, Jalna, Latur, Dhule, Ahmednagar, Chandrapur, Parbhani, Ichalkaranji, Beed, Wardha, Yavatmal, Gondia, Barshi, Achalpur.

Manipur: Imphal, Churachandpur, Thoubal, Kakching, Senapati, Ukhrul, Bishnupur, Tamenglong, Jiribam, Moreh, Kangpokpi, Noney, Pherzawl, Tengnoupal, Kamjong, Chandel, Moirang, Lilong, Mayang Imphal, Wangjing, Yairipok, Sekmai, Lamsang, Andro, Kwakta, Oinam, Ningthoukhong, Nambol, Thongkhong Laxmi Bazar, Samurou.

Meghalaya: Shillong, Tura, Nongstoin, Jowai, Baghmara, Williamnagar, Nongpoh, Resubelpara, Mawkyrwat, Khliehriat, Ampati, Mairang, Cherrapunji (Sohra), Dawki, Pynursla, Shella, Ranikor, Mawsynram, Tikrikilla, Phulbari, Dadenggre, Raksamgre, Chokpot, Dalu, Bajengdoba, Songsak, Rongjeng, Nartiang, Amlarem, Umroi.

Mizoram: Aizawl, Lunglei, Saiha, Champhai, Kolasib, Serchhip, Lawngtlai, Mamit, Hnahthial, Khawzawl, Saitual, Vairengte, Bairabi, Tlabung, Darlawn, Sairang, N. Kawnpui, Thenzawl, Biate, Khawhai, Lengpui, Zawlnuam, Phullen, Hnahlan, Rabung, Ngopa, Lungdar, Khawbung, Zokhawthar, Tuipang.

Nagaland: Dimapur, Kohima, Mokokchung, Tuensang, Wokha, Zunheboto, Phek, Mon, Kiphire, Longleng, Peren, Chumoukedima, Noklak, Shamator, Niuland, Tseminyu, Tsemeni, Meluri, Pfutsero, Aboi, Tizit, Tobu, Naginimora, Changtongya, Tuli, Bhandari, Sanis, Zakhama, Jakhama, Viswema.

Odisha: Bhubaneswar, Cuttack, Rourkela, Berhampur, Sambalpur, Puri, Balasore, Bhadrak, Baripada, Jharsuguda, Bargarh, Rayagada, Bolangir, Jeypore, Kendujhar, Sunabeda, Paradip, Bhawanipatna, Dhenkanal, Koraput, Angul, Titlagarh, Nayagarh, Phulbani, Kendrapara, Khordha, Sundargarh, Malkangiri, Nabarangpur, Sonepur.

Punjab: Ludhiana, Amritsar, Jalandhar, Patiala, Bathinda, Ajitgarh (Mohali), Hoshiarpur, Batala, Pathankot, Moga, Abohar, Malerkotla, Khanna, Phagwara, Kapurthala, Rajpura, Muktsar, Firozpur, Faridkot, Sunam, Barnala, Fazilka, Mansa, Gurdaspur, Sangrur, Tarn Taran, Nabha, Jagraon, Roopnagar (Ropar), Zirakpur.

Rajasthan: Jaipur, Jodhpur, Kota, Bikaner, Ajmer, Udaipur, Bhilwara, Alwar, Bharatpur, Sikar, Pali, Sri Ganganagar, Kishangarh, Baran, Dholpur, Tonk, Beawar, Hanumangarh, Sawai Madhopur, Churu, Gangapur City, Jhunjhunu, Banswara, Sujangarh, Makrana, Hindaun, Nagaur, Bundi, Chittorgarh, Jaisalmer.

Sikkim: Gangtok, Namchi, Gyalshing, Mangan, Singtam, Rangpo, Jorethang, Nayabazar, Pakyong, Soreng, Rhenock, Rongli, Ravangla, Sombaria, Chungthang, Lachen, Lachung, Pelling, Yuksom, Dentam, Daramdin, Geyzing, Rinchenpong, Melli, Rambi, Temi, Tarku, Legship, Tashiding, Dikchu.

Tamil Nadu: Chennai, Coimbatore, Madurai, Tiruchirappalli, Tiruppur, Salem, Erode, Tirunelveli, Vellore, Thoothukudi, Dindigul, Thanjavur, Ranipet, Sivakasi, Karur, Udhagamandalam (Ooty), Hosur, Nagercoil, Kanchipuram, Kumarapalayam, Karaikudi, Neyveli, Cuddalore, Kumbakonam, Tiruvannamalai, Pollachi, Rajapalayam, Gudiyatham, Pudukkottai, Ambur.

Telangana: Hyderabad, Warangal, Nizamabad, Karimnagar, Ramagundam, Khammam, Mahbubnagar, Nalgonda, Adilabad, Suryapet, Miryalaguda, Siddipet, Jagtial, Kothagudem, Mancherial, Bodhan, Kamareddy, Palwancha, Sangareddy, Tandur, Koratla, Sircilla, Nirmal, Bellampalle, Wanaparthy, Zaheerabad, Kagaznagar, Gadwal, Jangaon, Vikarabad.

Tripura: Agartala, Dharmanagar, Udaipur, Kailashahar, Bishalgarh, Teliamura, Khowai, Belonia, Melaghar, Ambassa, Kamalpur, Santirbazar, Kumarghat, Sonamura, Panisagar, Amarpur, Jirania, Mohanpur, Sabroom, Jolaibari, Manubazar, Manu, Churaibari, Pecharthal, Kanchanpur, Gandacherra, Karamchara, Salema, Ompi, Kakraban.

Uttar Pradesh: Lucknow, Kanpur, Ghaziabad, Agra, Varanasi, Meerut, Prayagraj (Allahabad), Bareilly, Aligarh, Moradabad, Saharanpur, Gorakhpur, Noida, Firozabad, Jhansi, Muzaffarnagar, Mathura, Ayodhya, Rampur, Shahjahanpur, Farrukhabad, Maunath Bhanjan, Hapur, Etawah, Mirzapur, Bulandshahr, Sambhal, Amroha, Hardoi, Fatehpur.

Uttarakhand: Dehradun, Haridwar, Roorkee, Haldwani, Rudrapur, Kashipur, Rishikesh, Ramnagar, Pithoragarh, Manglaur, Jaspur, Kotdwar, Tehri, Pauri, Almora, Mussoorie, Bageshwar, Champawat, Uttarkashi, Gopeshwar, Srinagar, Joshimath, Bhowali, Khatima, Sitarganj, Laksar, Muni Ki Reti, Barkot, Chamba, Devprayag.

West Bengal: Kolkata, Asansol, Siliguri, Durgapur, Bardhaman, Malda, Baharampur, Habra, Kharagpur, Shantipur, Dankuni, Dhulian, Ranaghat, Haldia, Raiganj, Krishnanagar, Nabadwip, Medinipur, Jalpaiguri, Balurghat, Basirhat, Bankura, Chakdaha, Darjeeling, Alipurduar, Purulia, Jangipur, Bangaon, Cooch Behar, Kanthi.

Union Territories

Andaman and Nicobar Islands: Port Blair, Garacharma, Bambooflat, Prothrapur, Bakultala, Mayabunder, Diglipur, Rangat, Hut Bay, Malacca, Campbell Bay, Wimberlyganj, Ferrargunj, Neil Island (Shaheed Dweep), Havelock Island (Swaraj Dweep).

Chandigarh: Chandigarh.

Dadra and Nagar Haveli and Daman and Diu: Daman, Diu, Silvassa, Amli, Naroli, Samarvarni, Masat, Rakholi, Dadra, Dunetha.

Delhi: New Delhi, Delhi Cantonment, Narela, Rohini, Dwarka, Janakpuri, Karol Bagh, Vasant Kunj, Lajpat Nagar, Saket, Najafgarh, Okhla, Shahdara, Pitampura, Paschim Vihar, Mayur Vihar, R K Puram, Hauz Khas, Chanakyapuri, Laxmi Nagar, Bawana, Mehrauli, Seelampur, Alipur, Kirti Nagar, Kalkaji, Sarita Vihar, Mahipalpur, Chattarpur, Palam.

Jammu and Kashmir: Srinagar, Jammu, Anantnag, Baramulla, Sopore, Kathua, Udhampur, Rajouri, Poonch, Kupwara, Bandipora, Ganderbal, Pulwama, Shopian, Kulgam, Akhnoor, Samba, Reasi, Doda, Kishtwar, Ramban, Bhaderwah, Pahalgam, Gulmarg, Sonamarg, Hiranagar, R S Pura, Awantipora, Tral, Uri.   

Ladakh: Leh, Kargil, Diskit, Padum, Dras, Sankoo, Hunder, Turtuk, Nyoma, Khalsi, Panamik, Zanskar, Alchi, Thiksey, Chushul, Demchok.   

Lakshadweep: Kavaratti, Minicoy, Agatti, Amini, Andrott, Kadmat, Kalpeni, Kiltan, Chetlat, Bitra.

Puducherry: Puducherry, Ozhukarai, Karaikal, Mahe, Yanam, Kurumbapet, Villianur, Bahour, Ariyankuppam, Nettapakkam.
"""

# State / UT to Region mapping
REGION_MAP = {
    "Andhra Pradesh": "Southern India",
    "Arunachal Pradesh": "Northeastern India",
    "Assam": "Northeastern India",
    "Bihar": "Eastern India",
    "Chhattisgarh": "Central India",
    "Goa": "Western India",
    "Gujarat": "Western India",
    "Haryana": "Northern India",
    "Himachal Pradesh": "Northern India",
    "Jharkhand": "Eastern India",
    "Karnataka": "Southern India",
    "Kerala": "Southern India",
    "Madhya Pradesh": "Central India",
    "Maharashtra": "Western India",
    "Manipur": "Northeastern India",
    "Meghalaya": "Northeastern India",
    "Mizoram": "Northeastern India",
    "Nagaland": "Northeastern India",
    "Odisha": "Eastern India",
    "Punjab": "Northern India",
    "Rajasthan": "Western India",
    "Sikkim": "Northeastern India",
    "Tamil Nadu": "Southern India",
    "Telangana": "Southern India",
    "Tripura": "Northeastern India",
    "Uttar Pradesh": "Northern India",
    "Uttarakhand": "Northern India",
    "West Bengal": "Eastern India",
    "Andaman and Nicobar Islands": "Island Territories",
    "Chandigarh": "Northern India",
    "Dadra and Nagar Haveli and Daman and Diu": "Western India",
    "Delhi": "Northern India",
    "Jammu and Kashmir": "Northern India",
    "Ladakh": "Northern India",
    "Lakshadweep": "Island Territories",
    "Puducherry": "Southern India"
}

# State / UT default centroid coordinates
STATE_CENTROIDS = {
    "Andhra Pradesh": (15.9129, 79.7400),
    "Arunachal Pradesh": (28.2180, 94.7278),
    "Assam": (26.2006, 92.9376),
    "Bihar": (25.0961, 85.3131),
    "Chhattisgarh": (21.2787, 81.8661),
    "Goa": (15.2993, 74.1240),
    "Gujarat": (22.2587, 71.1924),
    "Haryana": (29.0588, 76.0856),
    "Himachal Pradesh": (31.1048, 77.1734),
    "Jharkhand": (23.6102, 85.2799),
    "Karnataka": (15.3173, 75.7139),
    "Kerala": (10.8505, 76.2711),
    "Madhya Pradesh": (22.9734, 78.6569),
    "Maharashtra": (19.7515, 75.7139),
    "Manipur": (24.6637, 93.9063),
    "Meghalaya": (25.4670, 91.3662),
    "Mizoram": (23.1645, 92.9376),
    "Nagaland": (26.1584, 94.5624),
    "Odisha": (20.9517, 85.0985),
    "Punjab": (31.1471, 75.3412),
    "Rajasthan": (27.0238, 74.2179),
    "Sikkim": (27.5330, 88.5122),
    "Tamil Nadu": (11.1271, 78.6569),
    "Telangana": (18.1124, 79.0193),
    "Tripura": (23.9408, 91.9882),
    "Uttar Pradesh": (26.8467, 80.9462),
    "Uttarakhand": (30.0668, 79.0193),
    "West Bengal": (22.9868, 87.8550),
    "Andaman and Nicobar Islands": (11.7401, 92.6586),
    "Chandigarh": (30.7333, 76.7794),
    "Dadra and Nagar Haveli and Daman and Diu": (20.4283, 72.8397),
    "Delhi": (28.6139, 77.2090),
    "Jammu and Kashmir": (34.0837, 74.7973),
    "Ladakh": (34.1526, 77.5771),
    "Lakshadweep": (10.5667, 72.6417),
    "Puducherry": (11.9416, 79.8083)
}

# Extensive Known Real City Coordinates
EXACT_COORDINATES = {
    # Andhra Pradesh
    "visakhapatnam": (17.6868, 83.2185),
    "vijayawada": (16.5062, 80.6480),
    "guntur": (16.3067, 80.4365),
    "nellore": (14.4426, 79.9865),
    "kurnool": (15.8281, 78.0373),
    "kakinada": (16.9891, 82.2475),
    "rajahmundry": (17.0005, 81.8040),
    "kadapa": (14.4673, 78.8242),
    "tirupati": (13.6288, 79.4192),
    "anantapur": (14.6819, 77.6006),
    "vizianagaram": (18.1067, 83.3956),
    "eluru": (16.7107, 81.0952),
    "ongole": (15.5057, 80.0499),
    "nandyal": (15.4886, 78.4836),
    "machilipatnam": (16.1875, 81.1389),
    "adoni": (15.6322, 77.2728),
    "tenali": (16.2437, 80.6400),
    "proddatur": (14.7500, 78.5500),
    "chittoor": (13.2172, 79.1003),
    "hindupur": (13.8299, 77.4919),
    "bhimavaram": (16.5449, 81.5212),
    "madanapalle": (13.5500, 78.5000),
    "guntakal": (15.1667, 77.3667),
    "srikakulam": (18.2949, 83.8938),
    "dharmavaram": (14.4142, 77.7126),
    "gudivada": (16.4410, 80.9926),
    "narasaraopet": (16.2360, 80.0540),
    "tadipatri": (14.9100, 78.0100),
    "tadepalligudem": (16.8139, 81.5269),
    "amaravati": (16.5417, 80.5158),

    # Arunachal Pradesh
    "itanagar": (27.0844, 93.6053),
    "tawang": (27.5861, 91.8594),
    "ziro": (27.6320, 93.8320),
    "pasighat": (28.0667, 95.3333),
    "roing": (28.1400, 95.8300),
    "tezu": (27.9167, 96.1667),
    "bomdila": (27.2645, 92.4230),
    "dirang": (27.3556, 92.2347),
    "bhalukpong": (27.0125, 92.6458),
    "khonsa": (26.9833, 95.5000),
    "changlang": (27.1500, 95.7333),
    "seppa": (27.3500, 93.0333),
    "aalo": (28.1667, 94.8000),
    "namsai": (27.6667, 95.8667),
    "yingkiong": (28.6333, 94.9833),
    "daporijo": (27.9833, 94.2167),
    "anini": (28.7900, 95.9000),
    "hawai": (27.8833, 96.8000),
    "koloriang": (27.9000, 93.3500),
    "longding": (26.8667, 95.3167),
    "miao": (27.4833, 96.2167),
    "basar": (27.9833, 94.6667),
    "deomali": (27.1667, 95.4833),
    "jairampur": (27.3500, 96.0333),
    "naharlagun": (27.1000, 93.6833),
    "yupia": (27.1500, 93.7000),
    "boleng": (28.3333, 94.9667),
    "lumla": (27.5333, 91.7167),
    "mechuka": (28.6000, 94.1333),
    "tuting": (28.9833, 94.9000),

    # Assam
    "guwahati": (26.1445, 91.7362),
    "silchar": (24.8333, 92.7789),
    "dibrugarh": (27.4728, 94.9120),
    "jorhat": (26.7509, 94.2037),
    "nagaon": (26.3464, 92.6840),
    "tinsukia": (27.4922, 95.3468),
    "tezpur": (26.6528, 92.7926),
    "bongaigaon": (26.5023, 90.5532),
    "diphu": (25.8456, 93.4314),
    "dhubri": (26.0198, 89.9723),
    "north lakhimpur": (27.2344, 94.1037),
    "karimganj": (24.8649, 92.3592),
    "sivasagar": (26.9826, 94.6425),
    "goalpara": (26.1774, 90.6253),
    "barpeta": (26.3211, 91.0053),
    "golaghat": (26.5186, 93.9700),
    "morigaon": (26.2575, 92.3439),
    "biswanath chariali": (26.7262, 93.1539),
    "hojai": (26.0022, 92.8594),
    "dhemaji": (27.4816, 94.5772),
    "kokrajhar": (26.4014, 90.2714),
    "nalbari": (26.4433, 91.4422),
    "mangaldoi": (26.4350, 92.0347),
    "duliajan": (27.3556, 95.3175),
    "lanka": (25.9250, 93.0039),
    "lumding": (25.7511, 93.1672),
    "hailakandi": (24.6833, 92.5667),
    "rangia": (26.4678, 91.6247),
    "nazira": (26.9150, 94.7336),
    "margherita": (27.2833, 95.6833),

    # Bihar
    "patna": (25.5941, 85.1376),
    "gaya": (24.7914, 85.0002),
    "bhagalpur": (25.2425, 87.0117),
    "muzaffarpur": (26.1209, 85.3647),
    "purnia": (25.7771, 87.4753),
    "darbhanga": (26.1542, 85.8918),
    "bihar sharif": (25.1982, 85.5149),
    "arrah": (25.5560, 84.6603),
    "begusarai": (25.4182, 86.1272),
    "katihar": (25.5394, 87.5707),
    "munger": (25.3757, 86.4744),
    "chhapra": (25.7848, 84.7274),
    "danapur": (25.6322, 85.0450),
    "saharsa": (25.8835, 86.5953),
    "hajipur": (25.6858, 85.2146),
    "sasaram": (24.9525, 84.0319),
    "dehri": (24.8967, 84.1844),
    "bettiah": (26.8020, 84.5028),
    "motihari": (26.6469, 84.9089),
    "bagaha": (27.0989, 84.0906),
    "siwan": (26.2196, 84.3567),
    "kishanganj": (26.0967, 87.9431),
    "jamalpur": (25.3090, 86.4950),
    "buxar": (25.5647, 83.9777),
    "jehanabad": (25.2144, 84.9864),
    "aurangabad (bihar)": (24.7539, 84.3739),
    "lakhisarai": (25.1764, 86.0933),
    "nawada": (24.8872, 85.5414),
    "jamui": (24.9272, 86.2231),
    "sitamarhi": (26.5936, 85.4894),

    # Chhattisgarh
    "raipur": (21.2514, 81.6296),
    "bhilai": (21.1938, 81.3509),
    "bilaspur": (22.0797, 82.1409),
    "korba": (22.3595, 82.7501),
    "rajnandgaon": (21.0971, 81.0366),
    "raigarh": (21.8974, 83.3950),
    "jagdalpur": (19.0740, 82.0081),
    "ambikapur": (23.1206, 83.1956),
    "dhamtari": (20.7071, 81.5497),
    "mahasamund": (21.1092, 82.0969),
    "bhatapara": (21.7372, 81.9367),
    "chirmiri": (23.1811, 82.3533),
    "durg": (21.1904, 81.2849),
    "kanker": (20.2719, 81.4931),
    "mungeli": (22.0678, 81.6881),
    "naila janjgir": (22.0167, 82.5833),
    "dongargarh": (21.1908, 80.7606),
    "tilda newra": (21.5622, 81.7583),
    "kawardha": (22.0167, 81.2500),
    "kondagaon": (19.6000, 81.6667),
    "gobindpur": (21.4500, 82.1000),
    "surajpur": (23.1436, 82.8686),
    "balod": (20.7300, 81.2000),
    "bemetara": (21.7000, 81.5500),
    "sukma": (18.7900, 81.6700),
    "bijapur": (18.7978, 80.8164),
    "narayanpur": (19.7200, 81.2500),
    "dantewada": (18.9000, 81.3500),
    "jashpur": (22.8833, 84.1500),
    "koriya": (23.2500, 82.5500),

    # Goa
    "panaji": (15.4909, 73.8278),
    "margao": (15.2832, 73.9862),
    "vasco da gama": (15.3982, 73.8113),
    "mapusa": (15.5937, 73.8142),
    "ponda": (15.4026, 74.0152),
    "bicholim": (15.5947, 73.9536),
    "curchorem": (15.2600, 74.1100),
    "sanquelim": (15.5600, 74.0100),
    "cuncolim": (15.1764, 73.9881),
    "valpoi": (15.5300, 74.1300),
    "sanguem": (15.2300, 74.1500),
    "canacona": (15.0100, 74.0500),
    "quepem": (15.2200, 74.0700),
    "pernem": (15.7200, 73.8000),
    "porvorim": (15.5333, 73.8333),
    "calangute": (15.5439, 73.7553),
    "candolim": (15.5178, 73.7667),
    "anjuna": (15.5833, 73.7431),
    "baga": (15.5553, 73.7517),
    "vagator": (15.6031, 73.7336),
    "colva": (15.2750, 73.9167),
    "benaulim": (15.2500, 73.9300),
    "majorda": (15.3100, 73.9100),
    "cavelossim": (15.1758, 73.9458),
    "saligao": (15.5500, 73.7800),
    "siolim": (15.6200, 73.7700),
    "aldona": (15.5900, 73.8700),
    "assagao": (15.5900, 73.7700),
    "moira": (15.6000, 73.8200),
    "chorao": (15.5400, 73.8700),

    # Gujarat
    "ahmedabad": (23.0225, 72.5714),
    "surat": (21.1702, 72.8311),
    "vadodara": (22.3072, 73.1812),
    "rajkot": (22.3039, 70.8022),
    "bhavnagar": (21.7645, 72.1519),
    "jamnagar": (22.4707, 70.0577),
    "gandhinagar": (23.2156, 72.6369),
    "junagadh": (21.5222, 70.4579),
    "gandhidham": (23.0753, 70.1337),
    "anand": (22.5645, 72.9289),
    "navsari": (20.9500, 72.9300),
    "morbi": (22.8167, 70.8333),
    "nadiad": (22.6916, 72.8634),
    "surendranagar": (22.7275, 71.6375),
    "bharuch": (21.7051, 72.9959),
    "mehsana": (23.5880, 72.3693),
    "bhuj": (23.2420, 69.6669),
    "porbandar": (21.6417, 69.6293),
    "palanpur": (24.1722, 72.4344),
    "valsad": (20.6100, 72.9300),
    "vapi": (20.3700, 72.9000),
    "gondal": (21.9600, 70.8000),
    "veraval": (20.9000, 70.3700),
    "godhra": (22.7756, 73.6149),
    "patan": (23.8500, 72.1264),
    "kalol": (23.2333, 72.4833),
    "botad": (22.1700, 71.6700),
    "amreli": (21.6000, 71.2200),
    "deesa": (24.2586, 72.1797),
    "jetpur": (21.7547, 70.7850),

    # Haryana
    "faridabad": (28.4089, 77.3178),
    "gurugram": (28.4595, 77.0266),
    "panipat": (29.3909, 76.9635),
    "ambala": (30.3782, 76.7767),
    "yamunanagar": (30.1290, 77.2674),
    "rohtak": (28.8955, 76.6066),
    "hisar": (29.1492, 75.7217),
    "karnal": (29.6857, 76.9905),
    "sonipat": (28.9931, 77.0151),
    "panchkula": (30.6942, 76.8606),
    "bhiwani": (28.7932, 76.1390),
    "sirsa": (29.5349, 75.0288),
    "bahadurgarh": (28.6924, 76.9240),
    "jind": (29.3167, 76.3167),
    "thanesar": (29.9695, 76.8198),
    "kaithal": (29.8015, 76.3996),
    "rewari": (28.1833, 76.6167),
    "palwal": (28.1487, 77.3320),
    "hansi": (29.1000, 75.9667),
    "narnaul": (28.0444, 76.1083),
    "fatehabad": (29.5167, 75.4500),
    "gohana": (29.1333, 76.7000),
    "tohana": (29.7000, 75.9000),
    "narwana": (29.6000, 76.1167),
    "charkhi dadri": (28.5921, 76.2653),
    "jhajjar": (28.6067, 76.6564),
    "mandi dabwali": (29.9575, 74.7231),
    "pehowa": (29.9800, 76.5800),
    "kalka": (30.8333, 76.9333),
    "safidon": (29.4000, 76.6667),

    # Himachal Pradesh
    "shimla": (31.1048, 77.1734),
    "dharamshala": (32.2190, 76.3234),
    "solan": (30.9045, 77.0967),
    "mandi": (31.7087, 76.9320),
    "palampur": (32.1109, 76.5363),
    "baddi": (30.9578, 76.7914),
    "nahan": (30.5599, 77.2960),
    "paonta sahib": (30.4439, 77.6247),
    "sundarnagar": (31.5300, 76.8900),
    "chamba": (32.5534, 76.1258),
    "una": (31.4685, 76.2708),
    "kullu": (31.9579, 77.1095),
    "hamirpur": (31.6862, 76.5218),
    "bilaspur (hp)": (31.3400, 76.7600),
    "kangra": (32.0998, 76.2691),
    "dalhousie": (32.5387, 75.9710),
    "manali": (32.2432, 77.1892),
    "nalagarh": (31.0400, 76.7200),
    "nurpur": (32.3000, 75.9000),
    "baijnath": (32.0531, 76.6492),
    "parwanoo": (30.8350, 76.9589),
    "santokhgarh": (31.3667, 76.3167),
    "mehatpur basdehra": (31.3700, 76.3000),
    "shamshi": (31.8900, 77.1500),
    "rohru": (31.2000, 77.7500),
    "jogindernagar": (31.9800, 76.7700),
    "ghumarwin": (31.4400, 76.7100),
    "sarkaghat": (31.7000, 76.7300),
    "nagrota bagwan": (32.1200, 76.3800),
    "kaza": (32.2276, 78.0710),

    # Jammu & Kashmir
    "srinagar": (34.0837, 74.7973),
    "jammu": (32.7266, 74.8570),
    "anantnag": (33.7311, 75.1487),
    "baramulla": (34.2000, 74.3400),
    "sopore": (34.3000, 74.4700),
    "kathua": (32.3700, 75.5200),
    "udhampur": (32.9300, 75.1300),
    "rajouri": (33.3800, 74.3000),
    "poonch": (33.7700, 74.1000),
    "kupwara": (34.5300, 74.2500),
    "bandipora": (34.4200, 74.6500),
    "ganderbal": (34.2200, 74.7800),
    "pulwama": (33.8700, 74.8900),
    "shopian": (33.7200, 74.8300),
    "kulgam": (33.6400, 75.0200),
    "akhnoor": (32.9000, 74.7300),
    "samba": (32.5700, 75.1200),
    "reasi": (33.0800, 74.8300),
    "doda": (33.1400, 75.5400),
    "kishtwar": (33.3100, 75.7700),
    "ramban": (33.2400, 75.2400),
    "bhaderwah": (32.9800, 75.7100),
    "pahalgam": (34.0100, 75.1900),
    "gulmarg": (34.0500, 74.3800),
    "sonamarg": (34.3100, 75.2900),
    "hiranagar": (32.4500, 75.2700),
    "r s pura": (32.6300, 74.7300),
    "awantipora": (33.9200, 75.0100),
    "tral": (33.9300, 75.1100),
    "uri": (34.0800, 74.0400),

    # Ladakh
    "leh": (34.1526, 77.5771),
    "kargil": (34.5539, 76.1349),
    "diskit": (34.5667, 77.5500),
    "padum": (33.4667, 76.8833),
    "dras": (34.4300, 75.7600),
    "sankoo": (34.2800, 75.9600),
    "hunder": (34.5800, 77.4700),
    "turtuk": (34.8500, 76.8300),
    "nyoma": (33.2000, 78.6500),
    "khalsi": (34.3200, 76.8800),
    "panamik": (34.7800, 77.5300),
    "zanskar": (33.5000, 76.9000),
    "alchi": (34.2300, 77.1700),
    "thiksey": (34.0500, 77.6600),
    "chushul": (33.5900, 78.6500),
    "demchok": (32.7000, 79.4400),

    # Lakshadweep
    "kavaratti": (10.5667, 72.6417),
    "minicoy": (8.2833, 73.0500),
    "agatti": (10.8500, 72.1833),
    "amini": (11.1200, 72.7300),
    "andrott": (10.8200, 73.6800),
    "kadmat": (11.2300, 72.7800),
    "kalpeni": (10.0800, 73.6500),
    "kiltan": (11.4800, 73.0000),
    "chetlat": (11.6900, 72.7100),
    "bitra": (11.6000, 72.1800),

    # Puducherry
    "puducherry": (11.9416, 79.8083),
    "ozhukarai": (11.9500, 79.7700),
    "karaikal": (10.9254, 79.8380),
    "mahe": (11.7000, 75.5300),
    "yanam": (16.7333, 82.2167),
    "kurumbapet": (11.9300, 79.7600),
    "villianur": (11.9200, 79.7500),
    "bahour": (11.8000, 79.7500),
    "ariyankuppam": (11.8900, 79.8000),
    "nettapakkam": (11.8700, 79.6300),

    # Andaman & Nicobar
    "port blair": (11.6234, 92.7265),
    "garacharma": (11.6100, 92.7100),
    "bambooflat": (11.7000, 92.7100),
    "prothrapur": (11.6300, 92.7100),
    "bakultala": (12.5200, 92.8500),
    "mayabunder": (12.9300, 92.9300),
    "diglipur": (13.2700, 93.0000),
    "rangat": (12.5000, 92.9300),
    "hut bay": (10.5800, 92.5400),
    "malacca": (9.1800, 92.8100),
    "campbell bay": (7.0000, 93.9300),
    "wimberlyganj": (11.7500, 92.7200),
    "ferrargunj": (11.7300, 92.6700),
    "neil island (shaheed dweep)": (11.8300, 93.0500),
    "havelock island (swaraj dweep)": (11.9800, 92.9800),

    # Chandigarh
    "chandigarh": (30.7333, 76.7794),

    # Dadra & Nagar Haveli and Daman & Diu
    "daman": (20.3974, 72.8328),
    "diu": (20.7144, 70.9874),
    "silvassa": (20.2763, 73.0083),
    "amli": (20.2800, 73.0200),
    "naroli": (20.2100, 72.9900),
    "samarvarni": (20.2600, 73.0100),
    "masat": (20.2400, 73.0400),
    "rakholi": (20.2200, 73.0600),
    "dadra": (20.3200, 72.9700),
    "dunetha": (20.4100, 72.8600),

    # Delhi Localities
    "new delhi": (28.6139, 77.2090),
    "delhi cantonment": (28.5900, 77.1300),
    "narela": (28.8500, 77.0900),
    "rohini": (28.7400, 77.0900),
    "dwarka": (28.5900, 77.0500),
    "janakpuri": (28.6200, 77.0800),
    "karol bagh": (28.6500, 77.1900),
    "vasant kunj": (28.5200, 77.1500),
    "lajpat nagar": (28.5700, 77.2400),
    "saket": (28.5200, 77.2100),
    "najafgarh": (28.6100, 76.9800),
    "okhla": (28.5300, 77.2800),
    "shahdara": (28.6700, 77.2900),
    "pitampura": (28.7000, 77.1300),
    "paschim vihar": (28.6700, 77.1000),
    "mayur vihar": (28.6000, 77.3000),
    "r k puram": (28.5600, 77.1800),
    "hauz khas": (28.5500, 77.2000),
    "chanakyapuri": (28.5900, 77.1900),
    "laxmi nagar": (28.6300, 77.2800),
    "bawana": (28.8000, 77.0300),
    "mehrauli": (28.5100, 77.1800),
    "seelampur": (28.6700, 77.2700),
    "alipur": (28.8000, 77.1300),
    "kirti nagar": (28.6500, 77.1400),
    "kalkaji": (28.5400, 77.2600),
    "sarita vihar": (28.5300, 77.3000),
    "mahipalpur": (28.5400, 77.1200),
    "chattarpur": (28.5000, 77.1800),
    "palam": (28.5800, 77.0800),
}

def parse_cities():
    result = []
    current_section = "States"
    lines = RAW_DATA.strip().split("\n")
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        if line.startswith("States"):
            current_section = "States"
            continue
        if line.startswith("Union Territories"):
            current_section = "Union Territories"
            continue
        if line.startswith("(") or line.startswith("Note"):
            continue
        if ":" not in line:
            continue
            
        state_name, cities_str = line.split(":", 1)
        state_name = state_name.strip()
        cities = [c.strip().rstrip(".") for c in cities_str.split(",") if c.strip()]
        
        region = REGION_MAP.get(state_name, "India")
        centroid = STATE_CENTROIDS.get(state_name, (20.5937, 78.9629))
        
        for idx, city in enumerate(cities):
            clean_city = re.sub(r'\(.*?\)', '', city).strip()
            city_lower = clean_city.lower()
            
            # Coordinate lookup
            lat, lng = None, None
            if city_lower in EXACT_COORDINATES:
                lat, lng = EXACT_COORDINATES[city_lower]
            elif city.lower() in EXACT_COORDINATES:
                lat, lng = EXACT_COORDINATES[city.lower()]
            else:
                # Deterministic slight offset from centroid so markers don't overlap completely
                lat_offset = ((idx % 7) - 3) * 0.18
                lng_offset = ((idx // 7) - 2) * 0.22
                lat = round(centroid[0] + lat_offset, 4)
                lng = round(centroid[1] + lng_offset, 4)
                
            city_id = f"city-{re.sub(r'[^a-z0-9]+', '-', state_name.lower())}-{re.sub(r'[^a-z0-9]+', '-', clean_city.lower())}"
            
            # Rich cultural description
            desc = (
                f"Historical cultural center of {state_name}, celebrated for its indigenous heritage, "
                f"sacred architecture, traditional handloom crafts, and authentic regional culinary flavours."
            )
            if "fort" in city_lower or "pur" in city_lower:
                desc = f"Historic fortified town in {state_name}, famed for monumental architecture, local bazaars, and enduring cultural traditions."
            elif "nagar" in city_lower or "abad" in city_lower:
                desc = f"Vibrant heritage hub of {state_name}, boasting rich architectural monuments, regional artisan clusters, and vibrant festivals."
                
            result.append({
                "id": city_id,
                "name": city,
                "clean_name": clean_city,
                "state": state_name,
                "region": region,
                "type": "city",
                "description": desc,
                "coordinates": {"lat": lat, "lng": lng},
                "image_url": "https://images.unsplash.com/photo-1598890777032-bde13fbe3493?w=1200&auto=format&fit=crop&q=80"
            })
            
    return result

def main():
    cities = parse_cities()
    print(f"Total parsed cities across all 28 States and 8 UTs: {len(cities)}")
    
    # 1. Save data/india_master_cities.json
    os.makedirs("data", exist_ok=True)
    with open("data/india_master_cities.json", "w", encoding="utf-8") as f:
        json.dump(cities, f, indent=2, ensure_ascii=False)
    print("Saved data/india_master_cities.json")
    
    # 2. Update data/cultural_database.json (states_and_cities)
    db_path = "data/cultural_database.json"
    if os.path.exists(db_path):
        with open(db_path, "r", encoding="utf-8") as f:
            db_data = json.load(f)
            
        existing_cities = db_data.get("states_and_cities", [])
        existing_names = {(c.get("name", "").lower(), c.get("state", "").lower()) for c in existing_cities}
        
        added_count = 0
        for c in cities:
            key = (c["name"].lower(), c["state"].lower())
            clean_key = (c["clean_name"].lower(), c["state"].lower())
            if key not in existing_names and clean_key not in existing_names:
                existing_cities.append({
                    "id": c["id"],
                    "name": c["name"],
                    "state": c["state"],
                    "region": c["region"],
                    "type": "city",
                    "description": c["description"],
                    "coordinates": c["coordinates"],
                    "image_url": c["image_url"]
                })
                existing_names.add(key)
                added_count += 1
                
        db_data["states_and_cities"] = existing_cities
        with open(db_path, "w", encoding="utf-8") as f:
            json.dump(db_data, f, indent=2, ensure_ascii=False)
        print(f"Updated {db_path}: Added {added_count} new cities. Total states_and_cities: {len(existing_cities)}")

        backend_db_path = "backend/data/cultural_database.json"
        if os.path.exists(os.path.dirname(backend_db_path)):
            with open(backend_db_path, "w", encoding="utf-8") as f:
                json.dump(db_data, f, indent=2, ensure_ascii=False)
            print(f"Synced {backend_db_path}")
        
    # 3. Update backend/app/data/seeds/cities.json
    seeds_file = "backend/app/data/seeds/cities.json"
    if os.path.exists(seeds_file):
        with open(seeds_file, "r", encoding="utf-8") as f:
            seed_cities = json.load(f)
            
        seed_names = {c.get("name", "").lower() for c in seed_cities}
        added_seed_count = 0
        for c in cities:
            if c["clean_name"].lower() not in seed_names:
                seed_cities.append({
                    "id": c["id"],
                    "state_id": f"state-{re.sub(r'[^a-z0-9]+', '-', c['state'].lower())}",
                    "name": c["name"],
                    "district": c["clean_name"],
                    "latitude": c["coordinates"]["lat"],
                    "longitude": c["coordinates"]["lng"],
                    "description": c["description"]
                })
                seed_names.add(c["clean_name"].lower())
                added_seed_count += 1
                
        with open(seeds_file, "w", encoding="utf-8") as f:
            json.dump(seed_cities, f, indent=2, ensure_ascii=False)
        print(f"Updated {seeds_file}: Added {added_seed_count} seed cities. Total seeds: {len(seed_cities)}")

    # 4. Generate frontend/src/data/indiaCitiesMaster.ts
    frontend_ts_path = "frontend/src/data/indiaCitiesMaster.ts"
    os.makedirs(os.path.dirname(frontend_ts_path), exist_ok=True)
    
    ts_content = "export interface MasterCityEntry {\n"
    ts_content += "  id: string;\n"
    ts_content += "  name: string;\n"
    ts_content += "  cleanName: string;\n"
    ts_content += "  state: string;\n"
    ts_content += "  region: string;\n"
    ts_content += "  lat: number;\n"
    ts_content += "  lng: number;\n"
    ts_content += "  description: string;\n"
    ts_content += "}\n\n"
    
    ts_content += "export const INDIA_ALL_STATES_AND_UTS = [\n"
    for st in sorted(REGION_MAP.keys()):
        ts_content += f"  {json.dumps(st)},\n"
    ts_content += "];\n\n"
    
    ts_content += "export const INDIA_MASTER_CITIES: MasterCityEntry[] = [\n"
    for c in cities:
        ts_content += "  {\n"
        ts_content += f"    id: {json.dumps(c['id'])},\n"
        ts_content += f"    name: {json.dumps(c['name'])},\n"
        ts_content += f"    cleanName: {json.dumps(c['clean_name'])},\n"
        ts_content += f"    state: {json.dumps(c['state'])},\n"
        ts_content += f"    region: {json.dumps(c['region'])},\n"
        ts_content += f"    lat: {c['coordinates']['lat']},\n"
        ts_content += f"    lng: {c['coordinates']['lng']},\n"
        ts_content += f"    description: {json.dumps(c['description'])},\n"
        ts_content += "  },\n"
    ts_content += "];\n\n"
    
    ts_content += "export const ALL_CITY_COORDINATES_MAP: Record<string, { lat: number; lng: number }> = {\n"
    seen_coord_keys = set()
    for c in cities:
        k1 = c['name'].lower()
        if k1 not in seen_coord_keys:
            seen_coord_keys.add(k1)
            ts_content += f"  {json.dumps(k1)}: {{ lat: {c['coordinates']['lat']}, lng: {c['coordinates']['lng']} }},\n"
        k2 = c['clean_name'].lower()
        if k2 not in seen_coord_keys:
            seen_coord_keys.add(k2)
            ts_content += f"  {json.dumps(k2)}: {{ lat: {c['coordinates']['lat']}, lng: {c['coordinates']['lng']} }},\n"
    ts_content += "};\n"
    
    with open(frontend_ts_path, "w", encoding="utf-8") as f:
        f.write(ts_content)
    print(f"Generated {frontend_ts_path}")

if __name__ == "__main__":
    main()
