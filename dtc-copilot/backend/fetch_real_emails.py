import imaplib
import email
from email.header import decode_header
import json
import sys

sys.stdout.reconfigure(encoding="utf-8")

EMAIL_USER = "domtomconnect@gmail.com"
EMAIL_PASS = "geqpuqluimxdjxeo"

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

def get_real_inbox_messages(limit=15):
    try:
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(EMAIL_USER, EMAIL_PASS)
        mail.select('INBOX')

        status, data = mail.search(None, 'ALL')
        if not data or not data[0]:
            mail.close()
            mail.logout()
            return []

        ids = data[0].split()
        selected_ids = ids[-limit:]
        selected_ids.reverse()

        messages = []
        for num in selected_ids:
            try:
                s, d = mail.fetch(num, '(RFC822)')
                if not d or not d[0]:
                    continue
                msg = email.message_from_bytes(d[0][1])

                sender = clean_header(msg.get("From"))
                subj = clean_header(msg.get("Subject"))
                mid = msg.get("Message-ID") or ""
                in_reply = msg.get("In-Reply-To") or ""
                date_str = msg.get("Date") or ""

                body = ""
                if msg.is_multipart():
                    for part in msg.walk():
                        if part.get_content_type() == "text/plain":
                            payload = part.get_payload(decode=True)
                            if payload:
                                body = payload.decode("utf-8", errors="ignore")
                                break
                else:
                    payload = msg.get_payload(decode=True)
                    if payload:
                        body = payload.decode("utf-8", errors="ignore")

                # Filter out noisy mailer-daemon / automated google security
                is_spam = any(k in sender.lower() for k in ["mailer-daemon", "no-reply", "noreply", "googlecommunityteam", "notifications@google"])

                messages.append({
                    "id": num.decode(),
                    "sender": sender,
                    "subject": subj,
                    "date": date_str,
                    "message_id": mid,
                    "in_reply_to": in_reply,
                    "snippet": body[:300].strip(),
                    "body": body[:2000].strip(),
                    "is_spam": is_spam
                })
            except Exception as e:
                continue

        mail.close()
        mail.logout()
        return messages
    except Exception as e:
        print(f"Erreur IMAP : {e}", file=sys.stderr)
        return []

if __name__ == "__main__":
    msgs = get_real_inbox_messages(10)
    print(json.dumps(msgs, ensure_ascii=False, indent=2))
