import json
import os
import re

# Load validated candidates
with open("batch_65_candidates_validated.json", "r", encoding="utf-8") as f:
    candidates = json.load(f)

# Keep the first 50 candidates
batch_targets = candidates[:50]
print(f"Selected {len(batch_targets)} targets for Batch 65.")

batch_leads = []

for c in batch_targets:
    comp = c["company"]
    em = c["email"]
    country = c["country"]
    sector = c["sector"]
    source = c["source"]
    
    # Template Selection based on sector
    if any(k in sector.lower() for k in ["chocolat", "café", "terroir", "rhum", "mode", "dnvb"]):
        # Axe DTC Pulse & Vente Directe
        subject = f"Canaux de vente directe et visibilité qualifiée pour {comp}"
        body = f"""Bonjour,

J'espère que vous allez bien.

Je me permets de vous contacter car nous suivons avec un vif intérêt l'excellence des créations développées par {comp} à {country}.

Domtom Connect déploie des dispositifs de mise en avant et de commercialisation directe ciblant activement une communauté qualifiée d'acheteurs et de professionnels répartis sur toute la Caraïbe, le continent africain et sa diaspora.

À travers notre canal DTC Pulse et nos outils de visibilité ciblée, nous permettons aux marques emblématiques d'accéder sans intermédiaire à ces marchés captifs et demandeurs de produits d'exception.

Seriez-vous ouvert à un bref échange d'une quinzaine de minutes afin d'envisager comment activer de nouvelles opportunités de diffusion pour {comp} ?

Vous pouvez me joindre directement au 07 45 61 74 97 ou réserver le créneau qui vous convient sur calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur, Domtom Connect
07 45 61 74 97
calendly.com/domtomconnect/30min"""

    elif any(k in sector.lower() for k in ["chambre de commerce", "patronat", "agence", "barreau", "consulaire"]):
        # Axe Institutions, Chambres & Patronats
        subject = f"Passerelles économiques régionales et synergies d'affaires / {comp}"
        body = f"""Bonjour,

J'espère que vous vous portez bien.

Je prends l'attache de votre organisation car nous suivons avec attention le rôle moteur que joue {comp} dans le rayonnement et le dynamisme économique de {country}.

Domtom Connect développe une infrastructure d'interconnexion B2B reliant décideurs, investisseurs et entreprises répartis sur toute la Caraïbe, le continent africain et sa diaspora.

Nous collaborons régulièrement avec les acteurs économiques de référence afin d'offrir à leurs membres de nouveaux canaux d'exportation, de mise en relation ciblée et d'accès aux marchés caribéens et panafricains.

Seriez-vous disponible pour un court entretien exploratoire d'une quinzaine de minutes afin d'étudier de possibles passerelles institutionnelles ?

Je reste à votre disposition au 07 45 61 74 97 ou via le lien calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur, Domtom Connect
07 45 61 74 97
calendly.com/domtomconnect/30min"""

    elif any(k in sector.lower() for k in ["hôtellerie", "hotel", "resort"]):
        # Axe Hôtellerie de Prestige
        subject = f"Clientèle d'affaires et visibilité ciblée / {comp}"
        body = f"""Bonjour,

J'espère que vous allez bien.

Je vous contacte car nous admirons la qualité des prestations hôtelières offertes par {comp} à {country}.

Domtom Connect anime un réseau privé de dirigeants, d'investisseurs et de professionnels voyageant régulièrement sur toute la Caraïbe, le continent africain et sa diaspora.

Nous mettons en place des référencements privilégiés pour orienter directement cette clientèle qualifiée vers des établissements d'exception, sans passer par les intermédiaires habituels.

Seriez-vous ouvert à un échange téléphonique rapide afin d'étudier comment orienter ces flux de séjours professionnels vers {comp} ?

Vous pouvez me contacter au 07 45 61 74 97 ou choisir un moment qui vous arrange sur calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur, Domtom Connect
07 45 61 74 97
calendly.com/domtomconnect/30min"""

    elif any(k in sector.lower() for k in ["transit", "logistique", "fret"]):
        # Axe Logistique & Fret
        subject = f"Flux logistiques régionaux et partenariats d'affaires / {comp}"
        body = f"""Bonjour,

J'espère que vous allez bien.

Je me permets de vous écrire car nous observons l'expertise reconnue de {comp} sur les liaisons maritimes, aériennes et le transit de marchandises à {country}.

Domtom Connect fédère un écosystème grandissant d'acteurs économiques, d'importateurs et d'exportateurs situés sur toute la Caraïbe, le continent africain et sa diaspora.

Nos membres recherchent activement des partenaires logistiques fiables pour fluidifier leurs échanges commerciaux et sécuriser leurs flux de fret transfrontaliers.

Seriez-vous disposé à échanger une quinzaine de minutes pour examiner ensemble des opportunités de synergie opérationnelle ?

Je suis joignable au 07 45 61 74 97 ou disponible via calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur, Domtom Connect
07 45 61 74 97
calendly.com/domtomconnect/30min"""

    else:
        # Axe Avocats d'affaires, FinTech & Services Stratégiques
        subject = f"Synergies professionnelles et collaborations d'affaires / {comp}"
        body = f"""Bonjour,

J'espère que vous allez bien.

Je me permets de vous contacter au vu du positionnement d'excellence de {comp} dans le domaine du conseil stratégique et juridique à {country}.

Domtom Connect structure une plateforme d'affaires rassemblant dirigeants, porteurs de projets et investisseurs connectés sur toute la Caraïbe, le continent africain et sa diaspora.

Nos membres ont des besoins récurrents en accompagnement juridique, structuration d'opérations transfrontalières et conformité régionale pour sécuriser leur développement.

Seriez-vous ouvert à un premier contact de 15 minutes afin d'envisager des synergies d'apport d'affaires et de mise en relation pour {comp} ?

Vous pouvez me contacter directement au 07 45 61 74 97 ou sélectionner un créneau sur calendly.com/domtomconnect/30min

Bien cordialement,

Loïc Villeronce
Fondateur, Domtom Connect
07 45 61 74 97
calendly.com/domtomconnect/30min"""

    batch_leads.append({
        "company": comp,
        "email": em,
        "country": country,
        "sector": sector,
        "source": source,
        "subject": subject,
        "body": body
    })

# Strict Verification Checks
print("\n--- RUNNING STRICT RULES AUDIT ---")
errors = []
for i, lead in enumerate(batch_leads):
    comp = lead["company"]
    em = lead["email"]
    subj = lead["subject"]
    body = lead["body"]
    
    # Rule 4: Zero colons
    if ":" in subj:
        errors.append(f"[{i+1}] {comp}: Colon found in SUBJECT: {subj}")
    if ":" in body:
        errors.append(f"[{i+1}] {comp}: Colon found in BODY")
        
    # Rule 7: Zero hyphens in middle of sentence
    if re.search(r'\w\s+-\s+\w', subj):
        errors.append(f"[{i+1}] {comp}: Mid-sentence hyphen in SUBJECT")
    if re.search(r'\w\s+-\s+\w', body):
        errors.append(f"[{i+1}] {comp}: Mid-sentence hyphen in BODY")
        
    # Sacred formula
    if "toute la Caraïbe, le continent africain et sa diaspora" not in body:
        errors.append(f"[{i+1}] {comp}: Missing sacred formula")
        
    # Banned words
    if "entraide" in body.lower() or "entraide" in subj.lower():
        errors.append(f"[{i+1}] {comp}: Banned word 'entraide' found")
        
    # DTC Pulse verification
    if "ddc" in body.lower() or "ddc" in subj.lower():
        errors.append(f"[{i+1}] {comp}: Found forbidden typo 'DDC'")

if errors:
    print(f"FAILED WITH {len(errors)} ERRORS:")
    for err in errors:
        print(f"  {err}")
    sys.exit(1)
else:
    print("ALL 50 LEADS PASSED STRICT QUALITY & COMPLIANCE AUDIT WITH ZERO ERRORS!")

output_filename = "batch_65_pancaribeen_afrique_50.json"
with open(output_filename, "w", encoding="utf-8") as f:
    json.dump(batch_leads, f, indent=2, ensure_ascii=False)

print(f"\nGenerated successfully: {output_filename} with {len(batch_leads)} targets.")
