import imaplib, email, sys, re

sys.stdout.reconfigure(encoding='utf-8')

m = imaplib.IMAP4_SSL('imap.gmail.com')
m.login('domtomconnect@gmail.com', 'geqpuqluimxdjxeo')
m.select('"[Gmail]/Messages envoy&AOk-s"')

s, data = m.search(None, 'ALL')
ids = data[0].split()[-100:]
in_replies = set()
to_addrs = set()

for mid in ids:
    res, hdata = m.fetch(mid, '(BODY.PEEK[HEADER.FIELDS (TO IN-REPLY-TO REFERENCES DATE)])')
    if res == 'OK' and hdata and hdata[0]:
        msg = email.message_from_string(hdata[0][1].decode('utf-8', errors='ignore'))
        irt = msg.get('In-Reply-To', '').strip()
        ref = msg.get('References', '').strip()
        to_hdr = msg.get('To', '').strip().lower()
        if irt:
            in_replies.add(irt)
        if ref:
            for r in ref.split():
                in_replies.add(r.strip())
        # extract email
        emails_found = re.findall(r'[\w\.-]+@[\w\.-]+', to_hdr)
        for e in emails_found:
            to_addrs.add(e.lower())

print(f"Trouvé {len(in_replies)} Message-IDs déjà répondus.")
print(f"Trouvé {len(to_addrs)} adresses déjà répondues.")
print("Exemples d'adresses déjà répondues :", list(to_addrs)[:10])
m.logout()
