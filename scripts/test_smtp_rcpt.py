import smtplib
import sys

sys.stdout.reconfigure(encoding='utf-8')

test_cases = [
    ("madiana.com", "madiana-com.mail.protection.outlook.com", "contact@madiana.com"),
    ("sunzil.com", "sunzil-com.mail.protection.outlook.com", "oceanindien@sunzil.com"),
    ("cofinacorp.com", "cofinacorp-com.mail.protection.outlook.com", "service-client.sn@cofinacorp.com"),
    ("freedom.fr", "mta-gw.infomaniak.ch", "radio@freedom.fr"),
    ("viaatv.tv", "smtp.google.com", "contact@viaatv.tv"),
    ("lejournaldemayotte.com", "mx10.alter6-pro.com", "direction@lejournaldemayotte.com")
]

for dom, mx, em in test_cases:
    print(f"Testing {em} on {mx}...")
    try:
        s = smtplib.SMTP(mx, 25, timeout=10)
        s.ehlo("domtomconnect.com")
        code, msg = s.mail("domtomconnect@gmail.com")
        code2, msg2 = s.rcpt(em)
        print(f"  Result: {code2} {msg2.decode('utf-8', errors='ignore')}")
        s.quit()
    except Exception as e:
        print(f"  Error: {e}")
