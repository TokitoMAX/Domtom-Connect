# -*- coding: utf-8 -*-
import subprocess
import os

chrome = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
html_path = os.path.abspath("scratch/guide-tome1-print.html")

with open(html_path, "r", encoding="utf-8") as f:
    full_html = f.read()

# 1. Aperçu Sommaire (masquer couverture et garde)
sommaire_html = full_html.replace('class="page-cover"', 'style="display:none;"').replace('class="page-garde"', 'style="display:none;"')
with open("scratch/preview_sommaire.html", "w", encoding="utf-8") as f:
    f.write(sommaire_html)

out_sommaire = os.path.abspath("assets/ebooks/preview_sommaire.png")
subprocess.run([
    chrome, "--headless=new", "--disable-gpu",
    "--window-size=1000,1200",
    f"--screenshot={out_sommaire}",
    "file:///" + os.path.abspath("scratch/preview_sommaire.html").replace("\\", "/")
])

# 2. Aperçu Chapitre avec Carnet d'Exercice (Avant-propos & Chapitre 1)
# Masquer couverture, garde et sommaire
chap_html = full_html.replace('class="page-cover"', 'style="display:none;"').replace('class="page-garde"', 'style="display:none;"').replace('class="page-toc"', 'style="display:none;"')
with open("scratch/preview_chapitre.html", "w", encoding="utf-8") as f:
    f.write(chap_html)

out_chap = os.path.abspath("assets/ebooks/preview_chapitre.png")
subprocess.run([
    chrome, "--headless=new", "--disable-gpu",
    "--window-size=1000,1300",
    f"--screenshot={out_chap}",
    "file:///" + os.path.abspath("scratch/preview_chapitre.html").replace("\\", "/")
])

print("Aperçus générés avec succès.")
