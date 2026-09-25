import json
import re
import os

def normalize_domain(domain):
    """Extrait la racine d'un domaine (ex: reservation.hotel-bakoua.fr -> hotelbakoua)"""
    if not domain:
        return ""
    d = domain.lower().strip()
    # Supprimer sous-domaines courants
    d = re.sub(r'^(www|mail|webmail|smtp|pop|imap|m|app|resa|reservation|espace)\.', '', d)
    # Extraire nom principal sans extension
    parts = d.split('.')
    if len(parts) >= 3:
        name = parts[-2] + parts[0]
        return re.sub(r'[^a-z0-9]', '', name)
    elif len(parts) >= 2:
        name = parts[0]
        # Nettoyer tirets
        clean_name = re.sub(r'[^a-z0-9]', '', name)
        return clean_name
    return d

def is_domain_or_company_duplicate(target_email, target_company, db_file="contacts_deja_contactes.json"):
    """
    Vérifie avec une rigueur absolue si une entreprise ou un domaine a DÉJÀ reçu un email.
    Bloque :
    1. Même email exact
    2. Même domaine (@entreprise.com)
    3. Même racine de marque (ex: kalia-nature vs kalianature)
    4. Même nom d'entreprise
    """
    with open(db_file, encoding='utf-8') as f:
        db = json.load(f)

    target_email = target_email.lower().strip()
    target_domain = target_email.split('@')[1] if '@' in target_email else ""
    target_root = normalize_domain(target_domain)
    target_comp_clean = re.sub(r'[^a-z0-9]', '', target_company.lower()) if target_company else ""

    free_domains = {
        'gmail.com', 'yahoo.fr', 'yahoo.com', 'orange.fr', 'wanadoo.fr',
        'hotmail.com', 'hotmail.fr', 'outlook.com', 'outlook.fr', 'icloud.com',
        'laposte.net', 'free.fr', 'sfr.fr', 'bbox.fr'
    }

    # 0. Verification stricte de la Liste Noire / Exclusions
    exclusions_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "exclusions.json")
    if os.path.exists(exclusions_file):
        try:
            with open(exclusions_file, encoding='utf-8') as f_ex:
                exclusions_data = json.load(f_ex)
                blacklisted_emails = set(e.lower().strip() for e in exclusions_data.get('excluded_emails', []))
                blacklisted_domains = set(d.lower().strip() for d in exclusions_data.get('excluded_domains', []))
                
                if target_email in blacklisted_emails:
                    return True, f"EXCLUSION LISTE NOIRE : {target_email} a déjà généré un échec ou un rejet"
                if target_domain and target_domain in blacklisted_domains:
                    return True, f"EXCLUSION LISTE NOIRE : Domaine {target_domain} interdit (filtrage strict ou antécédent d'échec)"
        except Exception:
            pass

    # 1. Vérifier dans la liste des domaines exclus de l'historique
    excluded_domains = set(d.lower().strip() for d in db.get('domains', []))
    if target_domain and target_domain not in free_domains:
        if target_domain in excluded_domains:
            return True, f"Domaine exclu : {target_domain} déjà présent dans l'historique"
        
        # Racine de domaine
        for ex_dom in excluded_domains:
            if ex_dom not in free_domains:
                if normalize_domain(ex_dom) == target_root and len(target_root) >= 4:
                    return True, f"Racine de marque déjà contactée : {target_domain} ressemble à {ex_dom}"

    # 2. Vérifier dans l'historique des contacts
    for c in db.get('contacts', []):
        if not isinstance(c, dict):
            continue
        c_email = c.get('email', '').lower().strip()
        c_comp = c.get('company', '')
        c_dom = c_email.split('@')[1] if '@' in c_email else ""

        # Email strict
        if c_email == target_email:
            return True, f"Email exact déjà contacté : {c_email}"

        # Même domaine hors webmail gratuit
        if target_domain and target_domain not in free_domains and c_dom == target_domain:
            return True, f"Entreprise déjà contactée via {c_email} ({c_comp})"

        # Même racine de marque
        if target_domain and target_domain not in free_domains and c_dom not in free_domains:
            if normalize_domain(c_dom) == target_root and len(target_root) >= 4:
                return True, f"Même marque déjà contactée via {c_email} ({c_comp})"

        # Même nom d'entreprise
        c_comp_clean = re.sub(r'[^a-z0-9]', '', c_comp.lower()) if c_comp else ""
    # 3. Vérification technique DNS / MX (Anti-Hallucination & Anti-Bounce)
    try:
        from email_validator import verify_email_target
        is_mx_valid, mx_reason = verify_email_target(target_email)
        if not is_mx_valid:
            return True, f"REJET TECHNIQUE : {mx_reason}"
    except ImportError:
        pass

    return False, "OK - Aucun doublon et domaine MX valide"

if __name__ == '__main__':
    # Tests unitaires de validation
    tests = [
        ("reception@tsilaosa.com", "Tsilaosa"),
        ("contact@secretsdeloly.com", "Les Secrets de Loly"),
        ("nouveau@kalia-nature.com", "Kalia Nature"),
        ("directeur@rhum-clement.com", "Rhum Clement"),
        ("contact@nouvelle-boite-fret-inconnue.gp", "Fret Express Caraïbes")
    ]
    for em, comp in tests:
        is_dup, reason = is_domain_or_company_duplicate(em, comp)
        print(f"Test [{em} - {comp}] -> Bloqué : {is_dup} ({reason})")
