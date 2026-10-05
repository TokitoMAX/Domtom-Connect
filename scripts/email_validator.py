import subprocess
import socket
import re

def verify_domain_mx(domain):
    """
    Verifie qu'un domaine existe et possede des serveurs MX valides.
    Retourne (bool, message).
    """
    domain = domain.lower().strip()
    if not domain or '.' not in domain:
        return False, f"Domaine invalide : '{domain}'"

    # 1. Verification resolution DNS de base
    try:
        socket.gethostbyname(domain)
    except socket.gaierror:
        # Essayer quand meme nslookup mx car certains domaines n'ont pas de A record mais ont un MX
        pass

    # 2. Verification enregistrement MX via nslookup
    try:
        res = subprocess.run(
            ['nslookup', '-type=mx', domain],
            capture_output=True,
            text=True,
            timeout=5
        )
        stdout = res.stdout.lower()
        if 'mail exchanger' in stdout or 'mx preference' in stdout:
            # Extraire les serveurs MX trouves
            mx_lines = [l.strip() for l in res.stdout.split('\n') if 'mail exchanger' in l.lower() or 'mx' in l.lower()]
            return True, f"MX valide(s) pour {domain} : {mx_lines[:2]}"
        
        # Si aucun MX trouve, verifier si au moins une IP A existe (fallback RFC pour SMTP)
        try:
            ip = socket.gethostbyname(domain)
            return True, f"Pas de MX explicite mais IP A resolue pour {domain} ({ip})"
        except socket.gaierror:
            return False, f"Domaine {domain} INTROUVABLE (ni MX ni IP DNS)"
            
    except subprocess.TimeoutExpired:
        return False, f"Timeout lors de la resolution MX pour {domain}"
    except Exception as e:
        return False, f"Erreur resolution {domain} : {e}"

def verify_email_target(email):
    """
    Verifie le format et l'existence DNS/MX du domaine de l'email.
    Retourne (bool, message).
    """
    if not email or '@' not in email:
        return False, "Email invalide ou incomplet"
    
    parts = email.strip().split('@')
    if len(parts) != 2:
        return False, "Format email incorrect"
    
    user, domain = parts
    if not re.match(r'^[a-zA-Z0-9_.+-]+$', user):
        return False, f"Partie locale invalide : '{user}'"
        
    return verify_domain_mx(domain)

if __name__ == '__main__':
    tests = [
        "contact@cabinet-romana.fr",
        "contact@cga-guadeloupe.fr",
        "reunion@deloitte.fr",
        "contact@gmail.com",
        "fake@domaine-qui-existe-vraiment-pas-12345.fr"
    ]
    print("--- TEST EMAIL VALIDATOR ---")
    for t in tests:
        ok, msg = verify_email_target(t)
        print(f"[{'VALIDE' if ok else 'REJETE'}] {t} -> {msg}")
