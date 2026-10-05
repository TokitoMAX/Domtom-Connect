import imaplib, email, sys

sys.stdout.reconfigure(encoding='utf-8')

mail = imaplib.IMAP4_SSL('imap.gmail.com')
mail.login('domtomconnect@gmail.com', 'geqpuqluimxdjxeo')
mail.select('"[Gmail]/Tous les messages"')

for mid in [b'5102', b'5103']:
    status, d = mail.fetch(mid, '(RFC822)')
    msg = email.message_from_bytes(d[0][1])
    print('MID:', mid.decode(), '| Message-ID:', msg.get('Message-ID'), '| Subject:', msg.get('Subject'))

print("\n--- Check if any new email arrived from Nissi or Binnur since 03:00 ---")
for t in ['mastergrill.barresto@gmail.com', 'binnur.alkan@boussolepatrimoine.fr']:
    status, data = mail.search(None, f'(FROM "{t}")')
    print(f"From {t}: {data[0].split()}")
    for new_id in data[0].split():
        st, d = mail.fetch(new_id, '(RFC822)')
        m = email.message_from_bytes(d[0][1])
        print(f"  ID {new_id.decode()} Date: {m.get('Date')} Subj: {m.get('Subject')}")

mail.close()
mail.logout()
