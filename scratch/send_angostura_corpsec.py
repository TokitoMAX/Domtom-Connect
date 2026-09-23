import smtplib
from email.mime.text import MIMEText
from email.header import Header
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 465
EMAIL_USER = "domtomconnect@gmail.com"
EMAIL_PASS = "esbmvnvpvxdqphci"

to_email = "corpsec@angostura.com"
subject = "Heritage and daily operations / Angostura"
body = """Hello,

Angostura is such an iconic name across the Caribbean and globally, carrying Trinidadian craftsmanship to tables around the world.

Operating at this scale from Port of Spain comes with real everyday logistics to keep pace with international demand while staying true to your roots.

We regularly connect with leaders across the Caribbean and regional businesses to hear firsthand about what matters most on the ground. At your level, what is currently the biggest operational bottleneck or daily friction your team navigates ?

Would you be open to a brief ten minute chat sometime this week just to share your perspective ?

Warm regards,

Loic Villeronce
Founder — Domtom Connect"""

msg = MIMEText(body, "plain", "utf-8")
msg["Subject"] = Header(subject, "utf-8")
msg["From"] = f"Loïc Villeronce <{EMAIL_USER}>"
msg["To"] = to_email
msg["Reply-To"] = EMAIL_USER

with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
    server.login(EMAIL_USER, EMAIL_PASS)
    server.sendmail(EMAIL_USER, [to_email], msg.as_string())

print("Envoyé à corpsec@angostura.com !")
