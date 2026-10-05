import imaplib
import email
from email.header import decode_header
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

EMAIL_ACCOUNT = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

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

def get_text_body(msg):
    text = ""
    if msg.is_multipart():
        for part in msg.walk():
            ctype = part.get_content_type()
            cdispo = str(part.get('Content-Disposition'))
            if ctype == 'text/plain' and 'attachment' not in cdispo:
                payload = part.get_payload(decode=True)
                if payload:
                    text += payload.decode('utf-8', errors='ignore')
            elif ctype == 'text/html' and not text and 'attachment' not in cdispo:
                payload = part.get_payload(decode=True)
                if payload:
                    text += payload.decode('utf-8', errors='ignore')
    else:
        payload = msg.get_payload(decode=True)
        if payload:
            text = payload.decode('utf-8', errors='ignore')
    return text

def main():
    mail = imaplib.IMAP4_SSL("imap.gmail.com")
    mail.login(EMAIL_ACCOUNT, APP_PASSWORD)
    mail.select("INBOX")

    status, search_data = mail.search(None, 'ALL')
    msg_ids = search_data[0].split()
    total = len(msg_ids)
    print(f"Total messages in INBOX: {total}")

    # Inspect messages from 2700 to total (the very latest 60 messages)
    start_idx = max(0, total - 65)
    target_ids = msg_ids[start_idx:]

    bounces = []
    replies = []
    newsletters_or_notifications = []

    for mid in target_ids:
        try:
            status, fetch_data = mail.fetch(mid, '(BODY.PEEK[])')
            if status != 'OK' or not fetch_data or not fetch_data[0]:
                continue
            raw_email = fetch_data[0][1]
            if not isinstance(raw_email, bytes):
                continue
            msg = email.message_from_bytes(raw_email)

            from_hdr = decode_mime(msg.get("From", ""))
            subject_hdr = decode_mime(msg.get("Subject", ""))
            date_hdr = msg.get("Date", "")
            mid_str = mid.decode('ascii')

            body = get_text_body(msg)

            if "mailer-daemon" in from_hdr.lower() or "delivery status" in subject_hdr.lower():
                # Extract bounced email if possible
                m = re.search(r'([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)', body)
                bounced_addr = m.group(1) if m else "Inconnu"
                # Check reason
                reason = "Unknown"
                if "550" in body:
                    reason = "550 (Rejeté / Bloqué / Inexistant)"
                elif "timed out" in body.lower():
                    reason = "Timeout connexion serveur"
                elif "temporaire" in body.lower() or "Delay" in subject_hdr:
                    reason = "Délai temporaire"
                bounces.append({
                    "id": mid_str,
                    "date": date_hdr,
                    "subject": subject_hdr,
                    "bounced_addr": bounced_addr,
                    "reason": reason,
                    "body_excerpt": body[:300].strip()
                })
            elif any(k in from_hdr.lower() for k in ["luma", "calendly", "openai", "zapier", "supabase", "brevo", "testmonapp", "ritmo", "tiktok", "skool", "femmentrepreneur", "entrepreneurs.com"]):
                newsletters_or_notifications.append({
                    "id": mid_str,
                    "date": date_hdr,
                    "from": from_hdr,
                    "subject": subject_hdr
                })
            else:
                replies.append({
                    "id": mid_str,
                    "date": date_hdr,
                    "from": from_hdr,
                    "subject": subject_hdr,
                    "body": body
                })

        except Exception as e:
            print(f"Error on ID {mid}: {e}")

    print("\n" + "="*80)
    print("=== 1. VRAIES RÉPONSES PROSPECTS / CONTACTS REÇUES ===")
    print("="*80)
    for r in replies:
        print(f"\n[ID {r['id']}] Date: {r['date']}")
        print(f"De: {r['from']}")
        print(f"Sujet: {r['subject']}")
        print("--- Corps du message ---")
        lines = [line.strip() for line in r['body'].splitlines() if line.strip()]
        for line in lines[:25]:
            print(f"  {line}")
        print("-" * 50)

    print("\n" + "="*80)
    print(f"=== 2. REBONDS ET NOTIFICATIONS DE NON-DISTRIBUTION ({len(bounces)}) ===")
    print("="*80)
    for b in bounces:
        print(f"- [ID {b['id']}] {b['date'][:25]} | {b['subject']} | Cible: {b['bounced_addr']} ({b['reason']})")

    print("\n" + "="*80)
    print(f"=== 3. NOTIFICATIONS SAAS & ÉVÉNEMENTS ({len(newsletters_or_notifications)}) ===")
    print("="*80)
    for n in newsletters_or_notifications:
        print(f"- [ID {n['id']}] {n['date'][:25]} | De: {n['from']} | Sujet: {n['subject']}")

    mail.logout()

if __name__ == "__main__":
    main()
