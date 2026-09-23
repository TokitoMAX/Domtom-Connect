import urllib.request
import json

url = "https://recherche-entreprises.api.gouv.fr/search?departement=971&per_page=10"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        print(f"Total résultats trouvés en Guadeloupe : {data.get('total_results')}")
        for r in data.get("results", [])[:5]:
            print(f"- {r.get('nom_complet')} | SIREN: {r.get('siren')} | Ville: {r.get('siege', {}).get('commune')}")
except Exception as e:
    print(f"Erreur : {e}")
