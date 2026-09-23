import urllib.request
import json

url = "https://recherche-entreprises.api.gouv.fr/search?code_postal=97200&nature_juridique=5710,5499&per_page=10"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        print(f"Total entreprises 100% locales à Fort-de-France (97200) : {data.get('total_results')}")
        for r in data.get("results", []):
            dirigeants = r.get("dirigeants", [])
            lead = f"{dirigeants[0].get('prenom', '')} {dirigeants[0].get('nom', '')}" if dirigeants else "Dirigeant"
            print(f"- {r.get('nom_complet')} | Dirigeant: {lead} | Activité: {r.get('activite_principale')}")
except Exception as e:
    print(f"Erreur : {e}")
