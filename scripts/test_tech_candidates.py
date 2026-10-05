import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from email_validator import verify_email_target
from dedup_engine import is_domain_or_company_duplicate

sys.stdout.reconfigure(encoding='utf-8')

candidates = [
    # Guadeloupe & Martinique & Guyane
    ("Caraïbes Web Solutions (CWS)", "contact@cws.gp", "Guadeloupe", "https://cws.gp"),
    ("Damedia Agency", "contact@damedia-agency.com", "Guadeloupe", "https://damedia-agency.com"),
    ("Digital Natives Solutions", "dns21.contact@gmail.com", "Guadeloupe", "https://digital-natives-solutions.com"),
    ("Karukrea", "contact@karukrea.com", "Guadeloupe", "https://karukrea.com"),
    ("Kawuk", "contact@kawuk.com", "Guadeloupe", "https://kawuk.com"),
    ("Creawebstudio", "willy@creawebstudio.com", "Guadeloupe", "https://creawebstudio.com"),
    ("MJ Metrix", "direction@mjmetrix.com", "Guadeloupe", "https://mjmetrix.com"),
    ("Altitude GP", "contact@altitudegp.com", "Guadeloupe", "https://altitudegp.com"),
    ("Cyber Formation", "contact@cyberformation.fr", "Guadeloupe", "https://cyberformation.fr"),
    ("Exelcia IT", "contact@exelcia-it.com", "Guadeloupe", "https://exelcia-it.com"),
    ("18.19 Digital", "contact@1819digital.fr", "Martinique", "https://1819digital.fr"),
    ("BPM-AD", "contact@bpm-ad.fr", "Martinique", "Annuaire Martinique Digitale"),
    ("Coclico Media", "info@coclicomedia.com", "Martinique", "Annuaire Martinique Digitale"),
    ("COM JM", "hello@comjm.fr", "Martinique", "Annuaire Martinique Digitale"),
    ("Comwebsolutions", "contact@comwebsolutions.com", "Martinique", "Annuaire Martinique Digitale"),
    ("DBNG", "contact@dbng.fr", "Martinique", "Annuaire Martinique Digitale"),
    ("Del Caribe", "contact@del-caribe.com", "Martinique", "https://del-caribe.com"),
    ("Digital Creative Agency", "contact@creative-digital-agency.fr", "Martinique", "Annuaire Martinique Digitale"),
    ("Digital Freedom Caraïbe", "contact@digitalfreedomcaraibe.com", "Martinique", "Annuaire Martinique Digitale"),
    ("Digital Xpress", "bonjour@digitalxpress.fr", "Martinique", "Annuaire Martinique Digitale"),
    ("Agence BeeCee", "contact@beecee.fr", "Martinique", "https://beecee.fr"),
    ("Agence NASDY", "contact@nasdy.com", "Martinique", "https://nasdy.com"),
    ("Agence Web Guyane", "contact@agencewebguyane.fr", "Guyane", "https://agencewebguyane.fr"),
    ("Primo-Studio", "contact@primo-studio.com", "Guyane", "https://primo-studio.com"),
    ("Web2Web Guyane", "guyane@web2web.fr", "Guyane", "https://web2web.fr"),
    ("ARIAS Informatique", "contact@ariasnet.com", "Guyane", "https://ariasnet.com"),
    
    # La Réunion & Mayotte
    ("VIZION Réunion", "contact@vizion.re", "La Réunion", "https://vizion.re"),
    ("ADITEC Réunion", "contact@myaditec.com", "La Réunion", "https://aditec.re"),
    ("Agence Web Mayotte", "contact@agence-web-mayotte.fr", "Mayotte", "https://agence-web-mayotte.fr"),
    ("UWEZO", "contact@uwezo.fr", "Mayotte", "https://uwezo.fr"),
    ("Mahaba Info Tech", "contact@mahabainfotech.yt", "Mayotte", "https://mahabainfotech.yt"),
    ("Reflex Strategy", "contact@reflexstrategy.fr", "Mayotte", "https://reflexstrategy.fr"),
    ("MPJ Digital", "contact@mpj.digital", "Mayotte", "https://mpj.digital"),
    ("Duckreative", "contact@duckreative.com", "Mayotte", "https://duckreative.com"),
    ("Mascareign Digital", "contact@mascareign-digital.re", "Mayotte / Réunion", "https://mascareign-digital.re"),
    
    # Afrique (Sénégal, Côte d'Ivoire, Cameroun, Bénin, Togo)
    ("NOLA Agence Web", "contact@nola.sn", "Sénégal", "https://nola.sn"),
    ("Offbeat Hub", "contact@offbeat.sn", "Sénégal", "https://offbeat.sn"),
    ("TekkiTechno", "contact@tekkitechno.sn", "Sénégal", "https://tekkitechno.sn"),
    ("DIGITPRO", "contact@digissol.com", "Sénégal", "https://digitpro.sn"),
    ("SKYSOFT CI", "hello@skysoft.ci", "Côte d'Ivoire", "https://skysoft.ci"),
    ("Agence Digitale Iroko CI", "ali@iroko.io", "Côte d'Ivoire", "https://iroko.io"),
    ("BEONWEB", "contact@beonweb.cm", "Cameroun", "https://beonweb.cm"),
    ("Media System", "contact@mediasystem.cm", "Cameroun", "https://mediasystem.cm"),
    ("Agence Performance", "hello@agenceperformance.cm", "Cameroun", "https://agenceperformance.cm"),
    ("Promillys", "contact@promillys.com", "Cameroun", "https://promillys.cm"),
    ("Alain Web-creator", "info@alainwebcreator.cm", "Cameroun", "https://alainwebcreator.cm"),
    ("Onebiz", "one@onebiz.cm", "Cameroun", "https://onebiz.cm"),
    ("Actual Solutions", "contact@actual-solutions.cm", "Cameroun", "https://actual-solutions.cm"),
    ("TENET", "contact@tenet.cm", "Cameroun", "https://tenet.cm"),
    ("KMR Start-up Hub", "contact@kmrstart-up-hub.cm", "Cameroun", "https://kmrstart-up-hub.cm"),
    ("Digital Innovation", "contact@digitalinnovation.bj", "Bénin", "https://digitalinnovation.bj"),
    ("SGTIC", "info@sgtic.bj", "Bénin", "https://sgtic.bj"),
    ("GoSocial BJ", "contact@gosocial.bj", "Bénin", "https://gosocial.bj"),
    ("Digital Valley", "hello@digitalvalley.bj", "Bénin", "https://digitalvalley.bj"),
    ("BloLab", "contact@blolab.bj", "Bénin", "https://blolab.bj"),
    ("Future Studio", "info@futurestudio.bj", "Bénin", "https://futurestudio.bj"),
    ("Bobo Création", "solimcpaka@gmail.com", "Togo", "CFE Togo")
]

valid = []
for c, e, t, s in candidates:
    ok, msg = verify_email_target(e)
    if not ok:
        print(f"FAIL MX: {c} ({e}) - {msg}", flush=True)
        continue
    dup, reason = is_domain_or_company_duplicate(e, c)
    if dup:
        print(f"DUP: {c} ({e}) - {reason}", flush=True)
        continue
    valid.append((c, e, t, s))
    print(f"VALIDE [{len(valid)}]: {c} ({e}) [{t}]", flush=True)

print(f"\nBilan : {len(valid)} / {len(candidates)} valides.", flush=True)
