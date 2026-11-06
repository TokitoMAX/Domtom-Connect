"""
Repère les liens internes cassés du site (pages HTML publiques) et, avec --apply, applique les corrections de REMAP.

Utilisation
    python tools/liens_casses.py            -> rapport
    python tools/liens_casses.py --apply    -> corrige les liens connus (REMAP)
"""
import collections, glob, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP = ("node_modules", "scratch", "brain", "dtc-copilot", "templates", "slide_images", "deep_audit_results", "scripts", ".git", "admin", "tools", "api")
SKIP_FILES = re.compile(r"^(render-|video-studio|carousel-|FICHES_BRIEFING|anamnese-dossier-print|index-v2)")

# adresse cassée -> bonne adresse (rempli après lecture du rapport)
REMAP = {
    "/blog/assets/images/favicon.ico": "/assets/images/logo-domtomconnect.png",
    "/assets/images/favicon.ico": "/assets/images/logo-domtomconnect.png",
    "/blog/blog": "/blog",
    "/faq/index.html": "/#faq",
    "/registration/cofounder.html": "/register-choice",
    "/landing/webinaire/index.html": "/tremplin",
    "/landing/webinaire": "/tremplin",
    "/lead-magnets/checklist-projet/index.html": "/guide-entrepreneur",
    "/marketplace/solutions.html": "/marketplace",
    "/services": "/entreprises",
    "/tarifs": "/#solutions",
    "/mon-projet": "/mon-espace",
    "/landing/porteurs-projets/index.html": "/tremplin",
    "/legal/terms.html": "/legal/conditions-generales",
}

def exists(url):
    path = url.split("#")[0].split("?")[0]
    if not path or path == "/":
        return True
    p = path.lstrip("/")
    if "/assets/" in "/" + p:  # réécriture Vercel /(.*)/assets/ -> /assets/
        p = "assets/" + p.split("assets/", 1)[1]
    if p.startswith(("assets/", "api/")) and os.path.exists(os.path.join(ROOT, p)):
        return True
    cands = [p, p.rstrip("/") + ".html", os.path.join(p.rstrip("/"), "index.html")]
    if p.endswith(".html"):
        cands.append(p[:-5] + "/index.html")
    return any(os.path.isfile(os.path.join(ROOT, c)) for c in cands)

def pages():
    for f in glob.glob(os.path.join(ROOT, "**/*.html"), recursive=True):
        rel = os.path.relpath(f, ROOT).replace("\\", "/")
        if rel.startswith(SKIP) or SKIP_FILES.match(os.path.basename(rel)):
            continue
        yield f, rel

def absolute(href, rel):
    if href.startswith("/"):
        return href
    base = os.path.dirname("/" + rel)
    return os.path.normpath(os.path.join(base, href)).replace("\\", "/")

HREF = re.compile(r'href="([^"#:?][^"]*)"')

if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    apply = "--apply" in sys.argv
    broken = collections.defaultdict(set)
    changed = 0
    for f, rel in pages():
        s = open(f, encoding="utf-8", errors="replace").read()
        if apply and REMAP:
            def fix(m):
                h = m.group(1)
                key = absolute(h, rel).split("#")[0]
                return f'href="{REMAP[key]}"' if key in REMAP else m.group(0)
            n = HREF.sub(fix, s)
            if n != s:
                open(f, "w", encoding="utf-8").write(n)
                changed += 1
                s = n
        for h in HREF.findall(s):
            if re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", h) or h.startswith(("//", "{", "$")) or "${" in h or "{{" in h or "' +" in h:
                continue
            a = absolute(h, rel)
            if not exists(a):
                broken[a.split("#")[0]].add(rel)
    if apply:
        print(changed, "fichiers corrigés")
    total = sum(len(v) for v in broken.values())
    print(f"{len(broken)} adresses cassées, {total} pages concernées")
    for k, v in sorted(broken.items(), key=lambda x: -len(x[1])):
        print(f"{len(v):>4}  {k}   ex {sorted(v)[0]}")
