import subprocess
import os

html = """<!DOCTYPE html>
<html>
<head>
<style>
@page { size: A4; margin: 20mm; }
@page :first { margin: 0; }
@page no-margin { 
    margin: 0; 
    @bottom-right { content: normal; } 
    @bottom-left { content: normal; } 
}
.back-cover {
    page: no-margin;
    page-break-before: always;
    width: 100%;
    height: 100vh;
    background: #090d16;
}
</style>
</head>
<body>
<div style="width:100%;height:100vh;background:#090d16;color:white;">Page 1 (Couverture)</div>
<div style="page-break-before:always;">Page 2 (Texte avec marge)</div>
<div class="back-cover" style="color:white;">Page 3 (4eme de couverture sans marge)</div>
</body>
</html>"""

with open("scratch/test_page.html", "w", encoding="utf-8") as f:
    f.write(html)

chrome = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
subprocess.run([
    chrome,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--print-to-pdf=scratch/test_page.pdf",
    "file:///" + os.path.abspath("scratch/test_page.html").replace("\\", "/")
], check=True)
print("[OK] Test PDF created: scratch/test_page.pdf")
