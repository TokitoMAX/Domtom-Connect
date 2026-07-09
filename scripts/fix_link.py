import re

with open('d:/DomtomConnect-Website/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the tally.so link and target="_blank"
html = html.replace('href="https://tally.so/r/nrlkE2" target="_blank"', 'href="register-choice.html?intent=incubator"')

with open('d:/DomtomConnect-Website/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
