import urllib.request
import json

# Filtrer sur les sociétés commerciales (SAS, SARL) basées localement
url = "https://recherche-entreprises.api.gouv.fr/search?departement=972&nature_juridique=5710,5499&per_page=10"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        print(f"Total sociétés commerciales en Martinique : {data.get('total_results')}")
        for r in data.get("results", []):
            siege = r.get("siege", {})
            dirigeants = r.get("dirigeants", [])
            lead_name = dirigeants[0].get("prenom", "") + " " + dirigeants[0].get("nom", "") if dirigeants else "Dirigeant"
            print(f"- {r.get('nom_complet')} ({siege.get('commune')}) | Dirigeant: {lead_name} | Activité: {r.get('activite_principale')}")
except Exception as e:
    print(f"Erreur : {e}")
