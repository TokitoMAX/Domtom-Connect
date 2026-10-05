import imaplib
import email
from email.header import decode_header
import json
import re
import os

EMAIL_ACCOUNT = "domtomconnect@gmail.com"
APP_PASSWORD = "geqpuqluimxdjxeo"

try:
    print(f"Connexion à imap.gmail.com avec {EMAIL_ACCOUNT}...")
    mail = imaplib.IMAP4_SSL("imap.gmail.com")
    mail.login(EMAIL_ACCOUNT, APP_PASSWORD)
    print("Connexion réussie !")
    
    status, folders = mail.list()
    print("Dossiers disponibles :")
    for f in folders:
        print(f.decode('utf-8', errors='ignore'))
        
    mail.logout()
except Exception as e:
    print(f"Erreur : {e}")
