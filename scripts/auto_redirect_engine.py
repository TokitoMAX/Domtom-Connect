import imaplib
import email
from email.header import decode_header
import smtplib
import ssl
import json
import time
import re
import os
import sys
from bs4 import BeautifulSoup
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from email_validator import verify_email_target
from dedup_engine import is_domain_or_company_duplicate

sys.stdout.reconfigure(encoding='utf-8')

EMAIL_ACCOUNT = "domtomconnect@gmail.com"
APP_PASSWORD = "esbmvnvpvxdqphci"
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTACTS_DB_FILE = os.path.join(BASE_DIR, "contacts_deja_contactes.json")
EXCLUSIONS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "exclusions.json")

def decode_mime(header_val):
    if not header_val:
        return ""
    decoded_parts = decode_header(header_val)
    res = ""
    for part, enc in decoded_parts:
        if isinstance(part, bytes):
            res += part.decode(enc or 'utf-8', errors='ignore')
        else:
            res += str(part)
    return res

def extract_body(msg):
    body = ""
    for part in msg.walk():
        ctype = part.get_content_type()
        if ctype == 'text/plain':
            b = part.get_payload(decode=True)
            if b:
                body = b.decode('utf-8', errors='ignore')
                break
    if not body:
        for part in msg.walk():
            if part.get_content_type() == 'text/html':
                b = part.get_payload(decode=True)
                if b:
                    soup = BeautifulSoup(b.decode('utf-8', errors='ignore'), 'html.parser')
                    body = soup.get_text('\n')
                    break
    return body

def find_redirected_emails(text, sender_email):
    # Regex pour capturer les emails proposés en alternative / réorientation
    email_pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
    found = re.findall(email_pattern, text)
    
    # Filtrer les emails du système et l'expéditeur lui-même
    ignored = {
        "domtomconnect@gmail.com",
        sender_email.lower().strip(),
        "mailer-daemon@googlemail.com",
        "mailer-daemon@google.com",
        "nobody@gmail.com"
    }
    
    candidates = []
    text_lower = text.lower()
    
    # Mots clés signalant une réorientation ou indisponibilité
    redirect_triggers = [
        "veuillez", "contacter", "envoyer", "transférer", "nouvelle adresse", 
        "congés", "absent", "remplacé", "joindre", "adresse actuelle", "modifiée",
        "adresser", "contactez", "écrire à", "tourner vers", "demande de réservation"
    ]
    
    has_trigger = any(t in text_lower for t in redirect_triggers)
    
    for em in found:
        em_clean = em.lower().strip().rstrip(".")
        if em_clean in ignored:
            continue
        if any(em_clean.endswith(x) for x in ["png", "jpg", "jpeg", "gif", "webp"]):
            continue
        if em_clean not in candidates and has_trigger:
            candidates.append(em_clean)
            
    return candidates

def scan_and_auto_redirect(dry_run=True):
    print("=== DÉTECTION ET REDIRECTION AUTOMATIQUE DES CONTACTS ENTRANTS ===")
    mail = imaplib.IMAP4_SSL("imap.gmail.com")
    mail.login(EMAIL_ACCOUNT, APP_PASSWORD)
    mail.select("INBOX")
    
    status, search_data = mail.search(None, 'SINCE 25-Sep-2026')
    msg_ids = search_data[0].split()
    print(f"Messages analysés depuis le 25-Sep : {len(msg_ids)}")
    
    with open(CONTACTS_DB_FILE, "r", encoding="utf-8") as f:
        db = json.load(f)
    known_emails = set(c["email"].lower().strip() for c in db.get("contacts", []))
    
    redirects_found = []
    
    for mid in reversed(msg_ids):
        res, data = mail.fetch(mid, '(RFC822)')
        if res != 'OK':
            continue
        msg = email.message_from_bytes(data[0][1])
        from_hdr = decode_mime(msg.get("From", "")).strip()
        subj_hdr = decode_mime(msg.get("Subject", "")).strip()
        body = extract_body(msg)
        
        # Ignorer newsletters ou delivery status
        if any(x in from_hdr.lower() for x in ["mailer-daemon", "tiktok", "luma", "zapier", "openai", "support@google"]):
            continue
            
        m_from = re.search(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', from_hdr)
        sender_email = m_from.group(0) if m_from else ""
        
        alt_emails = find_redirected_emails(body, sender_email)
        for alt in alt_emails:
            if alt not in known_emails:
                redirects_found.append({
                    "original_sender": from_hdr,
                    "sender_email": sender_email,
                    "target_email": alt,
                    "subject": subj_hdr,
                    "body_snippet": body[:300].replace("\n", " ")
                })
                
    mail.logout()
    
    print(f"\nNouvelles redirections détectées : {len(redirects_found)}")
    for r in redirects_found:
        print(f"\n-> Prospect d'origine : {r['original_sender']}")
        print(f"   Nouvelle adresse indiquée : {r['target_email']}")
        print(f"   Contexte : {r['body_snippet'][:150]}...")
        
        # Validation technique
        ok, msg = verify_email_target(r['target_email'])
        dup, reason = is_domain_or_company_duplicate(r['target_email'], r['target_email'])
        print(f"   Validation DNS/MX : {ok} ({msg}) | Statut Dedup : {not dup} ({reason})")

if __name__ == "__main__":
    is_dry = "--live" not in sys.argv
    scan_and_auto_redirect(dry_run=is_dry)
