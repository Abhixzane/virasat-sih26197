import urllib.request, urllib.parse, json, ssl
ctx = ssl._create_unverified_context()

def search(q):
    params = {'action': 'query', 'generator': 'search', 'gsrsearch': q, 'gsrnamespace': '6', 'prop': 'imageinfo', 'iiprop': 'url', 'iiurlwidth': '800', 'format': 'json', 'gsrlimit': '5'}
    url = f'https://commons.wikimedia.org/w/api.php?{urllib.parse.urlencode(params)}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Virasat/2.0'})
    with urllib.request.urlopen(req, context=ctx) as r:
        d = json.loads(r.read().decode('utf-8'))
        print(f"=== Results for '{q}' ===")
        for pid, p in d.get('query', {}).get('pages', {}).items():
            print(" ", p.get('title'))

search('Chinese fishing nets Kochi')
search('Kaziranga rhinoceros')
search('Baisakhi celebration')
