import urllib.request
import json

def test_itinerary(destination, days):
    url = 'http://localhost:8000/api/itinerary/generate'
    payload = json.dumps({
        "state_or_destination": destination,
        "days": days
    }).encode('utf-8')
    
    print(f"=== Testing Itinerary: {destination} ({days} days) ===")
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'}, method='POST')
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read().decode('utf-8'))
            print('Title:', data.get('itinerary_title'))
            print('Overview:', data.get('overview'))
            days_list = data.get('days', [])
            print('Total days generated:', len(days_list))
            for day in days_list:
                theme = day.get('theme', 'Exploration')
                places = day.get('heritage_places', [])
                exps = day.get('cultural_experiences', [])
                print(f"\n  Day {day.get('day_number')}: {theme}")
                print(f"    Heritage Places ({len(places)}):")
                for p in places:
                    h = p.get('opening_hours') or "Not available"
                    f = p.get('entry_fee') or "Not available"
                    print(f"      * {p.get('name')} ({p.get('city')}, {p.get('state')}) | Hours: {h} | Fee: {f}")
                print(f"    Cultural Experiences ({len(exps)}):")
                for e in exps:
                    h = e.get('opening_hours') or "Not available"
                    f = e.get('entry_fee') or "Not available"
                    print(f"      * {e.get('name')} ({e.get('city')}, {e.get('state')}) | Hours: {h} | Fee: {f}")
                print(f"    Explanation: {day.get('cultural_explanation')[:120]}...")
            return data
    except Exception as e:
        print('Error:', e)
        return None

res1 = test_itinerary('Rajasthan', 3)
print("\n" + "="*70 + "\n")
res2 = test_itinerary('Tamil Nadu', 2)
