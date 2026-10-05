"""
Script de recherche d'emails vérifiés sur les sites officiels des entreprises cibles.
Stratégies utilisées :
  1. Scraping de la page /contact, /contactez-nous, /about, /mentions-legales du site
  2. Extraction de tous les emails trouvés par regex
  3. Vérification MX du domaine de l'email trouvé
  4. Filtrage des emails blacklistés (noreply, no-reply, etc.)
"""

import re
import subprocess
import sys
import json
import urllib.request
import urllib.error

sys.stdout.reconfigure(encoding='utf-8')

CONTACT_PATHS = [
    '/contact', '/contactez-nous', '/contact-us', '/nous-contacter',
    '/about', '/a-propos', '/mentions-legales', '/cgv', '/informations-legales',
    '/qui-sommes-nous', '/equipe', '/footer', ''
]

BLACKLIST_PATTERNS = [
    'noreply', 'no-reply', 'donotreply', 'postmaster', 'webmaster',
    'mailer-daemon', 'bounce', 'spam', 'abuse', 'support@google',
    'example.com', 'test.com'
]

def extract_emails_from_text(text):
    """Extract all emails from raw text using regex."""
    pattern = r'[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}'
    return list(set(re.findall(pattern, text)))

def is_valid_email(email):
    """Filter out blacklisted and system emails."""
    email_lower = email.lower()
    for bl in BLACKLIST_PATTERNS:
        if bl in email_lower:
            return False
    return True

def check_mx(domain):
    """Check MX record via nslookup."""
    try:
        p = subprocess.run(['nslookup', '-type=mx', domain], capture_output=True, text=True, timeout=5)
        return 'mail exchanger' in p.stdout.lower() or 'mx' in p.stdout.lower()
    except Exception:
        return False

def fetch_page(url, timeout=8):
    """Fetch a URL and return text content."""
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read()
            # Try UTF-8 first, then latin-1
            try:
                return raw.decode('utf-8')
            except UnicodeDecodeError:
                return raw.decode('latin-1', errors='replace')
    except Exception:
        return ''

def find_email_for_company(company_name, base_url):
    """Try to find a real email for a company from its website."""
    print(f"\n  Recherche email pour: {company_name} ({base_url})")
    
    found_emails = []
    
    for path in CONTACT_PATHS:
        url = base_url.rstrip('/') + path
        text = fetch_page(url)
        if not text:
            continue
        
        emails = extract_emails_from_text(text)
        valid = [e for e in emails if is_valid_email(e)]
        if valid:
            found_emails.extend(valid)
            print(f"    -> Emails trouvés sur {path}: {valid}")
            if len(found_emails) >= 3:
                break
    
    # Deduplicate and score
    seen = set()
    unique_emails = []
    for e in found_emails:
        if e.lower() not in seen:
            seen.add(e.lower())
            unique_emails.append(e)
    
    if not unique_emails:
        print(f"    !! Aucun email trouvé sur le site")
        return None
    
    # Prefer specific department emails over generic ones
    priority_prefixes = ['direction', 'directeur', 'pdg', 'dg', 'gerant',
                         'fondateur', 'president', 'commercial', 'contact',
                         'info', 'hello', 'bonjour']
    
    def score_email(email):
        prefix = email.split('@')[0].lower()
        for i, p in enumerate(priority_prefixes):
            if p in prefix:
                return i
        return 99
    
    unique_emails.sort(key=score_email)
    best_email = unique_emails[0]
    
    # Verify MX
    domain = best_email.split('@')[1]
    mx_ok = check_mx(domain)
    
    if mx_ok:
        print(f"    => BEST EMAIL: {best_email} (MX OK)")
        return best_email
    else:
        print(f"    => Email trouvé mais MX FAILED: {best_email}")
        # Try next email with valid MX
        for e in unique_emails[1:]:
            d = e.split('@')[1]
            if check_mx(d):
                print(f"    => FALLBACK EMAIL: {e} (MX OK)")
                return e
        return None

# ============================================================
# LISTE DES CIBLES POUR BATCH 36
# Entreprises indépendantes DOM-TOM avec sites officiels connus
# ============================================================
TARGETS = [
    ("Karambole Restaurant (La Réunion)", "https://www.karambole.re"),
    ("Mafate Pizza (La Réunion)", "https://www.mafatepizza.re"),
    ("Le Reflet des Îles (Paris - Restaurant créole)", "https://www.refletdesiles.com"),
    ("La Biguine (Martinique - SPA & bien-être)", "https://www.labiguine.com"),
    ("Guanabana (Guadeloupe - Restaurant)", "https://www.guanabana.fr"),
    ("Le Phare Bleu Marina (Grenade - Caraïbes)", "https://www.pharebleu.com"),
    ("Savane des Pétrifications (Martinique - excursions)", "https://www.savanedespetifications.fr"),
    ("Zarlor Vacances (Martinique - locations)", "https://www.zarlor.com"),
    ("Ti'Punch Bar (Martinique - cocktails)", "https://www.tipunchbar.com"),
    ("Boutique Caret (La Réunion - artisanat)", "https://www.boutique-caret.re"),
    ("Chocolaterie Yves Thuriès (La Réunion)", "https://www.thuriesreunion.com"),
    ("La Cayenne (Guyane - restaurant)", "https://www.lacayenne.fr"),
]

results = []

for company, url in TARGETS:
    email = find_email_for_company(company, url)
    results.append({
        "company": company,
        "url": url,
        "found_email": email,
        "status": "OK" if email else "NOT_FOUND"
    })

print("\n\n=== RESUME FINAL ===")
for r in results:
    status = "✅" if r['found_email'] else "❌"
    print(f"{status} {r['company']} -> {r['found_email'] or 'NON TROUVÉ'}")

# Save results
with open('email_research_batch36.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print(f"\nRésultats sauvegardés dans email_research_batch36.json")
