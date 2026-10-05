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

def main():
    mail = imaplib.IMAP4_SSL("imap.gmail.com")
    mail.login(EMAIL_ACCOUNT, APP_PASSWORD)
    mail.select("INBOX")

    status, search_data = mail.search(None, 'ALL')
    msg_ids = search_data[0].split()
    total = len(msg_ids)
    print(f"Total messages in INBOX: {total}")

    # Last 30 messages
    target_ids = msg_ids[-30:]

    prospect_replies = []
    bounces = []
    notifications = []

    for mid in reversed(target_ids):
        res, data = mail.fetch(mid, '(BODY.PEEK[HEADER.FIELDS (FROM TO SUBJECT DATE)])')
        if res != 'OK':
            continue
        h_text = data[0][1].decode('utf-8', errors='ignore')
        msg_header = email.message_from_string(h_text)

        mid_str = mid.decode('ascii')
        from_hdr = decode_mime(msg_header.get("From", "")).strip()
        subj_hdr = decode_mime(msg_header.get("Subject", "")).strip()
        date_hdr = msg_header.get("Date", "").strip()

        from_lower = from_hdr.lower()
        subj_lower = subj_hdr.lower()

        if "mailer-daemon" in from_lower or "delivery status" in subj_lower:
            # fetch snippet of body
            res2, data2 = mail.fetch(mid, '(BODY.PEEK[TEXT]<0.1000>)')
            body_snip = data2[0][1].decode('utf-8', errors='ignore') if (res2 == 'OK' and data2[0]) else ""
            m = re.search(r'([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)', body_snip)
            target = m.group(1) if m else "Inconnu"
            bounces.append({
                "id": mid_str,
                "date": date_hdr,
                "subject": subj_hdr,
                "target": target,
                "snip": body_snip[:180].replace('\n', ' ')
            })
        elif any(k in from_lower for k in ["luma", "calendly", "openai", "zapier", "supabase", "brevo", "testmonapp", "ritmo", "tiktok", "skool", "femmentrepreneur", "entrepreneurs.com", "corentincailleau"]):
            notifications.append({
                "id": mid_str,
                "date": date_hdr,
                "from": from_hdr,
                "subject": subj_hdr
            })
        else:
            # Vraie réponse suspectée ou prospect
            res2, data2 = mail.fetch(mid, '(BODY.PEEK[])')
            full_msg = email.message_from_bytes(data2[0][1])
            body = ""
            for part in full_msg.walk():
                if part.get_content_type() == 'text/plain':
                    b = part.get_payload(decode=True)
                    if b:
                        body = b.decode('utf-8', errors='ignore')
                    break
            if not body:
                for part in full_msg.walk():
                    if part.get_content_type() == 'text/html':
                        b = part.get_payload(decode=True)
                        if b:
                            body = b.decode('utf-8', errors='ignore')
                        break

            prospect_replies.append({
                "id": mid_str,
                "date": date_hdr,
                "from": from_hdr,
                "subject": subj_hdr,
                "body": body
            })

    print("\n" + "="*80)
    print(f"=== 1. VRAIES RÉPONSES PROSPECTS / ÉCHANGES DIRECTS ({len(prospect_replies)}) ===")
    print("="*80)
    for r in prospect_replies:
        print(f"\n[ID {r['id']}] Date: {r['date']}")
        print(f"De: {r['from']}")
        print(f"Sujet: {r['subject']}")
        print("--- Début du message ---")
        lines = [l.strip() for l in r['body'].splitlines() if l.strip()]
        for l in lines[:20]:
            print(f"  {l}")
        print("-" * 50)

    print("\n" + "="*80)
    print(f"=== 2. REBONDS / DELAYS RÉCENTS ({len(bounces)}) ===")
    print("="*80)
    for b in bounces:
        print(f"ID {b['id']} | {b['date'][:25]} | {b['subject']} | Cible: {b['target']}")
        print(f"   Détail: {b['snip'][:120]}")

    print("\n" + "="*80)
    print(f"=== 3. NOTIFICATIONS SAAS & EVENEMENTS ({len(notifications)}) ===")
    print("="*80)
    for n in notifications:
        print(f"ID {n['id']} | {n['date'][:25]} | De: {n['from'][:35]} | Sujet: {n['subject']}")

    mail.logout()

if __name__ == "__main__":
    main()
