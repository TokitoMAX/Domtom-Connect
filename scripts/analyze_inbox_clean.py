import imaplib
import email
from email.header import decode_header
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

EMAIL_ACCOUNT = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

def clean_header(val):
    if not val:
        return ""
    decoded = decode_header(val)
    res = []
    for text, enc in decoded:
        if isinstance(text, bytes):
            res.append(text.decode(enc or "utf-8", errors="ignore"))
        else:
            res.append(str(text))
    return " ".join(res)

def get_body(msg):
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
    return text.strip()

def main():
    mail = imaplib.IMAP4_SSL("imap.gmail.com")
    mail.login(EMAIL_ACCOUNT, APP_PASSWORD)
    mail.select("INBOX")

    status, search_data = mail.search(None, 'ALL')
    msg_ids = search_data[0].split()
    total = len(msg_ids)
    print(f"Total messages INBOX: {total}")

    # Let's inspect the last 50 messages
    subset = msg_ids[-50:]

    direct_human_emails = []
    calendly_events = []
    bounces = []
    system_notifications = []
    marketing_newsletters = []

    marketing_senders = [
        "adobe", "instagram", "facebook", "tiktok", "skool", "entrepreneurs.com",
        "hunter.io", "rachel finance", "natiye", "circle.so", "systeme.io", "openai",
        "zapier", "brevo", "mailchimp", "canva", "google play", "google workspace"
    ]

    for mid in reversed(subset):
        s, data = mail.fetch(mid, '(BODY.PEEK[])')
        if s != 'OK' or not data or not data[0]:
            continue
        raw = data[0][1]
        if not isinstance(raw, bytes):
            continue
        msg = email.message_from_bytes(raw)

        sender = clean_header(msg.get("From"))
        subj = clean_header(msg.get("Subject"))
        date_str = msg.get("Date")
        mid_str = mid.decode('ascii')
        msg_id_header = msg.get("Message-ID", "")
        in_reply_to = msg.get("In-Reply-To", "")

        body = get_body(msg)

        # Categorize
        sender_lower = sender.lower()
        subj_lower = subj.lower()

        if "mailer-daemon" in sender_lower or "delivery status" in subj_lower or "undelivered" in subj_lower:
            m = re.search(r'([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)', body)
            target = m.group(1) if m else "Inconnu"
            bounces.append({
                "id": mid_str,
                "date": date_str,
                "subject": subj,
                "target": target,
                "body_snippet": body[:200].replace('\n', ' ')
            })
        elif "calendly" in sender_lower or "calendly" in subj_lower or "nouveau rendez-vous" in subj_lower or "invitation :" in subj_lower or "événement :" in subj_lower:
            calendly_events.append({
                "id": mid_str,
                "date": date_str,
                "from": sender,
                "subject": subj,
                "body_snippet": body[:300]
            })
        elif any(mk in sender_lower for mk in marketing_senders):
            marketing_newsletters.append({
                "id": mid_str,
                "date": date_str,
                "from": sender,
                "subject": subj
            })
        elif any(sys_kw in sender_lower for sys_kw in ["supabase", "stripe", "github", "vercel", "cloudflare", "ovh", "hostinger", "sentry"]):
            system_notifications.append({
                "id": mid_str,
                "date": date_str,
                "from": sender,
                "subject": subj
            })
        else:
            # Likely a real human / direct prospect email
            direct_human_emails.append({
                "id": mid_str,
                "date": date_str,
                "from": sender,
                "subject": subj,
                "message_id": msg_id_header,
                "in_reply_to": in_reply_to,
                "body": body
            })

    print("\n" + "="*80)
    print(f"🎯 1. EMAILS DIRECTS / PROSPECTS / CONTACTS HUMAINS ({len(direct_human_emails)})")
    print("="*80)
    for email_item in direct_human_emails:
        print(f"\n[ID {email_item['id']}] Date: {email_item['date']}")
        print(f"De: {email_item['from']}")
        print(f"Sujet: {email_item['subject']}")
        print(f"Message-ID: {email_item['message_id']}")
        print(f"In-Reply-To: {email_item['in_reply_to']}")
        print("-" * 40)
        lines = [line.strip() for line in email_item['body'].splitlines() if line.strip()]
        for line in lines[:20]:
            print(f"  {line}")
        print("=" * 80)

    print("\n" + "="*80)
    print(f"📅 2. CALENDLY & RENDEZ-VOUS ({len(calendly_events)})")
    print("="*80)
    for c in calendly_events:
        print(f"\n[ID {c['id']}] Date: {c['date']} | De: {c['from']}")
        print(f"Sujet: {c['subject']}")
        print(f"Détails: {c['body_snippet'][:200]}...")

    print("\n" + "="*80)
    print(f"⚠️ 3. REBONDS / MAILER-DAEMON ({len(bounces)})")
    print("="*80)
    for b in bounces:
        print(f"[ID {b['id']}] Date: {b['date']} | Cible: {b['target']} | Sujet: {b['subject']}")

    print("\n" + "="*80)
    print(f"⚙️ 4. NOTIFICATIONS SYSTÈME TECH ({len(system_notifications)})")
    print("="*80)
    for s in system_notifications:
        print(f"[ID {s['id']}] Date: {s['date']} | De: {s['from']} | Sujet: {s['subject']}")

    print("\n" + "="*80)
    print(f"📰 5. NEWSLETTERS & MARKETING ({len(marketing_newsletters)})")
    print("="*80)
    for m in marketing_newsletters[:15]:
        print(f"[ID {m['id']}] Date: {m['date']} | De: {m['from']} | Sujet: {m['subject']}")

    mail.logout()

if __name__ == "__main__":
    main()
