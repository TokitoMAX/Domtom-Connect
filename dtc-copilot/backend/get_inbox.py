import imaplib
import email
from email.header import decode_header
import json
import sys
import os
import re
import base64

sys.stdout.reconfigure(encoding='utf-8')

EMAIL_ACCOUNT = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

def decode_mime(header_val):
    if not header_val:
        return ""
    try:
        parts = decode_header(header_val)
        res = ""
        for part, enc in parts:
            if isinstance(part, bytes):
                res += part.decode(enc or 'utf-8', errors='ignore')
            else:
                res += str(part)
        return res
    except:
        return str(header_val)

def extract_email(text):
    m = re.findall(r'[\w\.-]+@[\w\.-]+', text or "")
    return m[0].lower() if m else ""

def is_noise_or_bot(from_hdr, subj_hdr, body=""):
    from_l = from_hdr.lower()
    subj_l = subj_hdr.lower()
    body_l = body.lower()

    # Plateformes marketing, SaaS et expéditeurs automatisés
    noise_domains = [
        "mailer-daemon", "postmaster", "google", "openai", "calendly", "luma",
        "zapier", "supabase", "brevo", "tiktok", "skool", "instagram", "facebook",
        "adobe", "womanbusinesspassion", "natiyeacademie", "libertywebi", "systeme.io",
        "mailinblack", "noreply", "no-reply", "notification", "digest", "newsletter",
        "mailchimp", "hunter.io", "rachelfinance", "williamangora", "paypal",
        "barnes-mauritius", "entrepreneurs.com", "local.fr", "adobe.com"
    ]
    if any(k in from_l for k in noise_domains):
        return True

    # Sujets systèmes ou notifications automatiques
    noise_subjects = [
        "delivery status", "failure", "undelivered", "security alert", "connexion",
        "warning", "code de vérification", "version d’essai", "webinaire", "absence", "congé",
        "reponse automatique", "réponse automatique", "automatic reply", "conditions générales",
        "workshop invitation", "c'est terminé pour toi"
    ]
    if any(k in subj_l for k in noise_subjects):
        return True

    # Répondeurs d'absence ou anti-spam captcha dans le texte
    if any(k in body_l for k in [
        "mailinblack", "réponse automatique", "reponse automatique", "message automatique",
        "automatic reply", "actuellement absent", "je serai de retour", "en congé"
    ]):
        return True

    return False

def is_polite_refusal(body=""):
    body_l = body.lower()
    refusal_keywords = [
        "ne pouvons donner suite",
        "ne pouvons pas donner suite",
        "ne pourrons pas donner suite",
        "pas intéressé",
        "pas intéressée",
        "pas intéressés",
        "pas donner suite",
        "ne correspond pas à nos besoins",
        "restructuration de direction",
        "cessation d'activité",
        "ne pas nous recontacter",
        "pas de besoin",
        "pas de besoins"
    ]
    return any(k in body_l for k in refusal_keywords)

def generate_ai_draft(sender, subject, snippet, in_reply_to):
    clean_sender = sender.split("<")[0].replace('"', '').strip()
    first_name = clean_sender.split()[0] if clean_sender else "Bonjour"
    if "@" in first_name:
        first_name = ""

    greeting = f"Bonjour {first_name}," if first_name else "Bonjour,"

    draft = f"""{greeting}

Merci pour votre retour et pour l'intérêt porté à nos échanges.

Je fais suite à votre message concernant Domtom Connect. L'objectif est précisément de vous accompagner dans vos réflexions et de lever les freins opérationnels de votre développement.

Le plus direct est que nous échangions de vive voix pendant 30 minutes afin de faire connaissance et voir ensemble si notre méthode d'accompagnement a du sens pour votre structure.

Vous pouvez choisir le créneau qui vous convient le mieux directement sur mon agenda,
https://calendly.com/domtomconnect/30min

Au plaisir d'échanger,

Loïc Villeronce
Fondateur de Domtom Connect
+33 6 20 78 33 77"""

    draft = draft.replace(" :", ",").replace(":", ",")
    return draft

def fetch_inbox():
    mail = imaplib.IMAP4_SSL("imap.gmail.com")
    mail.login(EMAIL_ACCOUNT, APP_PASSWORD)

    # Récupérer TOUS les messages récents (Sent + Inbox) pour reconstituer l'historique complet
    mail.select('"[Gmail]/Tous les messages"')
    status, search_data = mail.search(None, 'ALL')
    msg_ids = search_data[0].split()

    target_ids = msg_ids[-160:]

    # Regrouper par fil / correspondant
    conversations = {} # partner_email -> list of msgs in chronological order

    for mid in target_ids:
        mid_str = mid.decode('ascii')
        res, hdata = mail.fetch(mid, '(BODY.PEEK[HEADER.FIELDS (FROM TO SUBJECT DATE MESSAGE-ID IN-REPLY-TO REFERENCES)])')
        if res != 'OK' or not hdata or not hdata[0]:
            continue

        h_text = hdata[0][1].decode('utf-8', errors='ignore')
        msg = email.message_from_string(h_text)

        from_hdr = decode_mime(msg.get("From", "")).strip()
        to_hdr = decode_mime(msg.get("To", "")).strip()
        subj_hdr = decode_mime(msg.get("Subject", "")).strip()
        date_hdr = msg.get("Date", "").strip()
        msg_id_hdr = msg.get("Message-ID", "").strip()
        in_reply_hdr = msg.get("In-Reply-To", "").strip()

        from_email = extract_email(from_hdr)
        to_email = extract_email(to_hdr)

        partner = to_email if from_email == "domtomconnect@gmail.com" else from_email
        if not partner or partner in ["domtomconnect@gmail.com", "noreply", "mailer-daemon"]:
            continue

        if partner not in conversations:
            conversations[partner] = []

        conversations[partner].append({
            "mid": mid,
            "mid_str": mid_str,
            "from_hdr": from_hdr,
            "from_email": from_email,
            "to_hdr": to_hdr,
            "subj_hdr": subj_hdr,
            "date_hdr": date_hdr,
            "msg_id_hdr": msg_id_hdr,
            "in_reply_hdr": in_reply_hdr
        })

    results = []

    for partner, thread in conversations.items():
        last_msg = thread[-1] # Dernier message échangé chronologiquement

        from_hdr = last_msg["from_hdr"]
        subj_hdr = last_msg["subj_hdr"]
        date_hdr = last_msg["date_hdr"]
        msg_id_hdr = last_msg["msg_id_hdr"]
        in_reply_hdr = last_msg["in_reply_hdr"]
        mid = last_msg["mid"]

        # Si le DERNIER message vient de Loïc Villeronce -> DÉJÀ RÉPONDU !
        if last_msg["from_email"] == "domtomconnect@gmail.com":
            results.append({
                "id": f"real-{last_msg['mid_str']}",
                "senderName": partner,
                "senderEmail": partner,
                "subject": subj_hdr,
                "date": date_hdr,
                "snippet": "Dernier message envoyé par Loïc Villeronce. En attente de retour du prospect.",
                "messageId": msg_id_hdr,
                "inReplyTo": in_reply_hdr,
                "type": "lead",
                "typeLabel": "Prospect Répondu",
                "status": "processed",
                "draft": None
            })
            continue

        # Si c'est un message entrant reçu du prospect
        # Récupérer le contenu pour analyser l'intention réelle
        res2, bdata = mail.fetch(mid, '(BODY.PEEK[TEXT]<0.1500>)')
        body_snip = ""
        if res2 == 'OK' and bdata and bdata[0]:
            raw_text = bdata[0][1].decode('utf-8', errors='ignore')
            if "PGh0bWw" in raw_text or "PGRpdi" in raw_text:
                try:
                    m_b64 = re.search(r'([A-Za-z0-9+/=]{40,})', raw_text)
                    if m_b64:
                        raw_text = base64.b64decode(m_b64.group(1)).decode('utf-8', errors='ignore')
                except:
                    pass
            body_snip = re.sub(r'<[^>]+>', ' ', raw_text)
            body_snip = re.sub(r'\s+', ' ', body_snip).strip()

        # 1. Filtre bot / newsletter
        if is_noise_or_bot(from_hdr, subj_hdr, body_snip):
            results.append({
                "id": f"real-{last_msg['mid_str']}",
                "senderName": from_hdr,
                "senderEmail": partner,
                "subject": subj_hdr,
                "date": date_hdr,
                "snippet": body_snip[:250] or "(Notification ou répondeur automatique)",
                "messageId": msg_id_hdr,
                "inReplyTo": in_reply_hdr,
                "type": "spam",
                "typeLabel": "Newsletter / Bot filtré",
                "status": "filtered",
                "draft": None
            })
            continue

        # 2. Détection de refus poli ou clôture
        if is_polite_refusal(body_snip):
            results.append({
                "id": f"real-{last_msg['mid_str']}",
                "senderName": from_hdr,
                "senderEmail": partner,
                "subject": subj_hdr,
                "date": date_hdr,
                "snippet": f"[Refus / Indisponibilité] {body_snip[:250]}",
                "messageId": msg_id_hdr,
                "inReplyTo": in_reply_hdr,
                "type": "lead",
                "typeLabel": "Dossier Classé (Refus poli)",
                "status": "processed",
                "draft": None
            })
            continue

        # 3. VRAI lead en attente d'une réponse de Loïc
        draft = generate_ai_draft(from_hdr, subj_hdr, body_snip, msg_id_hdr)
        results.append({
            "id": f"real-{last_msg['mid_str']}",
            "senderName": from_hdr,
            "senderEmail": partner,
            "subject": subj_hdr,
            "date": date_hdr,
            "snippet": body_snip[:280],
            "messageId": msg_id_hdr,
            "inReplyTo": in_reply_hdr,
            "type": "lead",
            "typeLabel": "Prospect En Attente",
            "status": "pending",
            "draft": draft
        })

    mail.close()
    mail.logout()
    return results

if __name__ == "__main__":
    try:
        data = fetch_inbox()
        print(json.dumps(data, ensure_ascii=False))
    except Exception as e:
        print(json.dumps([{"error": str(e)}]))
