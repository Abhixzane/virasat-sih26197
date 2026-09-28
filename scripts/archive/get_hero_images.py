import json

with open('backend/data/cultural_database.json', encoding='utf-8') as f:
    d = json.load(f)

places = d.get('heritage_places', [])
names = ['Taj Mahal', 'Brihadisvara', 'Khajuraho', 'Konark', 'Meenakshi', 'Hampi', 'Qutb', 'Ellora', 'Ajanta', 'Amber', 'Varanasi', 'Red Fort', 'Sanchi']

found = {}
for p in places:
    pname = p.get('name', '')
    url = p.get('image_url', '')
    for n in names:
        if n.lower() in pname.lower() and url and 'placeholder' not in url:
            if n not in found:
                found[n] = (pname, url)

for k, (pn, u) in found.items():
    print(f"'{u}', // {pn}")
