import imaplib
import email
from email.header import decode_header
import sys

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

mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login(EMAIL_ACCOUNT, APP_PASSWORD)

res, folders = mail.list()
print("All folders:")
for f in folders:
    f_str = f.decode('utf-8', errors='ignore')
    print("  ", f_str)

# Check all mailboxes for vestiris or vestir
terms = ['vestiris', 'vestir']
for f in folders:
    f_str = f.decode('utf-8', errors='ignore')
    # extract name inside last quotes or last token
    import re
    m = re.search(r'"([^"]+)"$', f_str)
    if m:
        box_name = f'"{m.group(1)}"'
    else:
        box_name = f_str.split()[-1]
    
    try:
        status, count = mail.select(box_name, readonly=True)
        if status != 'OK':
            continue
        for term in terms:
            status, search_data = mail.search(None, f'TEXT "{term}"')
            if status == 'OK' and search_data[0]:
                ids = search_data[0].split()
                print(f"\n--> Found {len(ids)} matches for '{term}' in {box_name}:")
                for mid in ids[-10:]:
                    _, data = mail.fetch(mid, '(BODY.PEEK[HEADER.FIELDS (FROM TO SUBJECT DATE)])')
                    hdr = email.message_from_string(data[0][1].decode('utf-8', errors='ignore'))
                    print(f"  ID {mid.decode()}: From: {decode_mime(hdr.get('From'))} | To: {decode_mime(hdr.get('To'))} | Subj: {decode_mime(hdr.get('Subject'))} | Date: {hdr.get('Date')}")
    except Exception as e:
        # ignore selectable errors
        pass
