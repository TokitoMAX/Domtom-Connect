import os
import re

blog_dir = r'c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\blog'

def simplify_header(html):
    # Regex to find the entire <nav class="navbar"> block and replace it
    # We will replace it with a simple navbar containing just the Logo and a back button to align with the SaaS minimalism
    nav_pattern = re.compile(r'<nav class="navbar">.*?</nav>', re.DOTALL)
    
    simple_nav = """<nav class="navbar">
<div class="container" style="display:flex; justify-content:space-between; align-items:center; width:100%;">
    <a class="nav-brand" href="../" id="logo-home" title="Accueil Domtom Connect">
        <img alt="Domtom Connect" class="nav-logo" src="../assets/images/logo-domtomconnect.png" style="height:40px;"/>
        <span class="nav-brand-name" style="margin-left:10px; font-weight:800; color:#0f172a;">Domtom Connect</span>
    </a>
    <div class="nav-actions" id="nav-actions-container">
        <a class="cta-button secondary" href="../" style="text-decoration:none; color:#64748b; font-weight:600;">← Retour au site</a>
    </div>
</div>
</nav>"""
    
    return re.sub(nav_pattern, simple_nav, html)

def remove_popup(html):
    # Remove popup.css link
    html = re.sub(r'<link[^>]*href="[^"]*popup\.css[^"]*"[^>]*>\s*', '', html)
    # Remove exit-intent.js script
    html = re.sub(r'<script[^>]*src="[^"]*exit-intent\.js[^"]*"[^>]*></script>\s*', '', html)
    return html

count = 0
for root, dirs, files in os.walk(blog_dir):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = remove_popup(content)
            
            # Only simplify header for blog/index.html (articles usually use their own simple header without the massive links, but we can simplify them too if needed)
            if 'blogGrid' in new_content or filepath == os.path.join(blog_dir, 'index.html'):
                new_content = simplify_header(new_content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                count += 1

print(f"Updated {count} HTML files in blog directory (removed popups and simplified header).")
