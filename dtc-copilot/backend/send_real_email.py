import smtplib
from email.mime.text import MIMEText
from email.header import Header
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 465
EMAIL_USER = "domtomconnect@gmail.com"
EMAIL_PASS = "geqpuqluimxdjxeo"

def send_real_email(to_email, subject, body, in_reply_to=None, references=None):
    if not to_email or not body:
        return {"success": False, "error": "Destinataire ou corps manquant"}

    # Strict compliance check : zero colons
    if ":" in body:
        # Auto-clean just in case
        body = body.replace(" :", ",").replace(":", ",")

    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = Header(subject, "utf-8")
    msg["From"] = f"Loïc Villeronce <{EMAIL_USER}>"
    msg["To"] = to_email

    if in_reply_to:
        msg["In-Reply-To"] = in_reply_to
    if references:
        msg["References"] = references

    try:
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
            server.login(EMAIL_USER, EMAIL_PASS)
            server.sendmail(EMAIL_USER, [to_email], msg.as_string())
        return {"success": True, "recipient": to_email}
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) > 1:
        try:
            payload = json.loads(sys.argv[1])
            res = send_real_email(
                payload.get("to"),
                payload.get("subject"),
                payload.get("body"),
                payload.get("inReplyTo"),
                payload.get("references")
            )
            print(json.dumps(res))
        except Exception as e:
            print(json.dumps({"success": False, "error": str(e)}))
    else:
        print(json.dumps({"success": False, "error": "Aucun argument reçu"}))
