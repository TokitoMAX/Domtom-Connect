import os
import re

workspace = r'c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect'

# 1. Create candidature-tremplin.html from candidature-incubateur.html
with open(os.path.join(workspace, 'candidature-incubateur.html'), 'r', encoding='utf-8') as f:
    form_html = f.read()

form_html = form_html.replace('Candidature Programme Tremplin', 'Candidature Programme Tremplin')
form_html = form_html.replace('incubateur.html', 'tremplin.html')
# The original incubateur form had some accent color --accent: #10b981; We change it to Tremplin color #f59e0b
form_html = form_html.replace('--accent: #10b981;', '--accent: #f59e0b;')
form_html = form_html.replace('background: #059669;', 'background: #d97706;') # hover color
form_html = form_html.replace('Le Programme Tremplin est tres selectif.', 'Le Programme Tremplin est très sélectif (4 à 5 porteurs maximum).')

# In the script, it redirects to incubateur.html. We change it to tremplin.html
form_html = form_html.replace("window.location.href = 'incubateur.html';", "window.location.href = 'tremplin.html';")

with open(os.path.join(workspace, 'candidature-tremplin.html'), 'w', encoding='utf-8') as f:
    f.write(form_html)

# 2. Update tremplin.html CTA link
with open(os.path.join(workspace, 'tremplin.html'), 'r', encoding='utf-8') as f:
    tremplin_html = f.read()

# Replace mailto: link with candidature-tremplin.html
tremplin_html = re.sub(
    r'<a href="mailto:[^"]+".*?class="cta-button".*?>Candidater au Tremplin \(Payant\)</a>',
    '<a href="candidature-tremplin.html" class="cta-button">Candidater au Tremplin (Payant)</a>',
    tremplin_html
)

with open(os.path.join(workspace, 'tremplin.html'), 'w', encoding='utf-8') as f:
    f.write(tremplin_html)

print("Form and Tremplin CTA updated successfully.")
