"""
Remplace les bleus, bleus nuit, gris bleutés et violets du site par la charte Domtom Connect
(noir, blanc, vert). Le rouge reste réservé aux alertes.

Utilisation
    python tools/chasse_au_bleu.py           -> rapport seul
    python tools/chasse_au_bleu.py --apply   -> applique
"""
import glob, os, re, sys, collections

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXCLUDE_DIRS = ("node_modules", "scratch", "brain", "dtc-copilot", "templates", "slide_images", "deep_audit_results", "scripts", ".git")
EXCLUDE_FILES = re.compile(r"^(render-|video-studio|carousel-|vesteris|FICHES_BRIEFING|anamnese-dossier-print)")

# Fonds et bordures bleu nuit (Tailwind slate et navy) -> noirs neutres légèrement verts
HEX = {
    "#020617": "#070908", "#030712": "#070908", "#0a1124": "#0b0f0d", "#0f1a36": "#0e1311", "#142247": "#121916",
    "#0f172a": "#0c100e", "#111827": "#0e1311", "#1e293b": "#1b2420", "#1f2937": "#1b2420", "#334155": "#2b3632",
    "#374151": "#2b3632", "#475569": "#56615c", "#4b5563": "#56615c", "#64748b": "#717c77", "#6b7280": "#717c77",
    "#94a3b8": "#a7b0ac", "#9ca3af": "#a7b0ac", "#cbd5e1": "#d4dad7", "#d1d5db": "#d4dad7", "#e2e8f0": "#e6eae8",
    "#e5e7eb": "#e6eae8", "#f1f5f9": "#f1f4f2", "#f8fafc": "#f6f8f7",
    # vrais bleus, cyans et violets -> verts de la charte
    "#3b82f6": "#10b981", "#2563eb": "#059669", "#1d4ed8": "#047857", "#1e40af": "#065f46", "#60a5fa": "#34d399",
    "#93c5fd": "#6ee7b7", "#bfdbfe": "#a7f3d0", "#dbeafe": "#d1fae5", "#0ea5e9": "#10b981", "#0284c7": "#059669",
    "#38bdf8": "#34d399", "#7dd3fc": "#6ee7b7", "#06b6d4": "#10b981", "#22d3ee": "#34d399", "#6366f1": "#10b981",
    "#4f46e5": "#059669", "#818cf8": "#34d399", "#8b5cf6": "#10b981", "#7c3aed": "#059669", "#a78bfa": "#34d399",
    "#a855f7": "#10b981", "#c084fc": "#34d399", "#3b5998": "#10b981", "#1877f2": "#10b981", "#0a66c2": "#10b981",
}
# rgba() bleus
RGB = {
    (2, 6, 23): (7, 9, 8), (3, 7, 18): (7, 9, 8), (8, 14, 30): (8, 11, 10), (10, 17, 36): (11, 15, 13), (15, 23, 42): (14, 19, 17),
    (15, 26, 54): (14, 19, 17), (20, 34, 71): (18, 25, 22), (17, 24, 39): (14, 19, 17), (30, 41, 59): (27, 36, 32),
    (51, 65, 85): (43, 54, 50), (71, 85, 105): (86, 97, 92), (100, 116, 139): (113, 124, 119), (148, 163, 184): (167, 176, 172),
    (59, 130, 246): (16, 185, 129), (37, 99, 235): (5, 150, 105), (96, 165, 250): (52, 211, 153), (14, 165, 233): (16, 185, 129),
    (56, 189, 248): (52, 211, 153), (99, 102, 241): (16, 185, 129), (139, 92, 246): (16, 185, 129), (168, 85, 247): (16, 185, 129),
    (6, 182, 212): (16, 185, 129),
}

GREENS = [(4, 120, 87), (5, 150, 105), (16, 185, 129), (52, 211, 153), (110, 231, 183), (167, 243, 208)]

def neutralize(r, g, b):
    """Toute couleur à dominante bleue ou violette devient un gris neutre (si terne) ou un vert de la charte (si vive)."""
    if b - max(r, g) < 12 and not (b - g >= 25 and r - g >= 25):
        return None
    sat = max(r, g, b) - min(r, g, b)
    lum = round(0.3 * r + 0.59 * g + 0.11 * b)
    if sat > 90 and lum > 60:
        target = 0.3 * r + 0.59 * g + 0.11 * b + 40
        return min(GREENS, key=lambda c: abs((0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2]) - target))
    gray = max(0, min(255, round((r + g + b) / 3)))
    return (max(0, gray - 1), min(255, gray + 2), gray)

def files():
    for pat in ("**/*.html", "assets/css/*.css", "assets/js/**/*.js"):
        for p in glob.glob(os.path.join(ROOT, pat), recursive=True):
            rel = os.path.relpath(p, ROOT).replace("\\", "/")
            if rel.startswith(EXCLUDE_DIRS) or EXCLUDE_FILES.match(os.path.basename(rel)):
                continue
            yield p, rel

def recolor(s, stats):
    def hx(m):
        k = m.group(0).lower()
        if k in HEX:
            stats[k] += 1
            return HEX[k]
        n = neutralize(int(k[1:3], 16), int(k[3:5], 16), int(k[5:7], 16))
        if n:
            stats["auto " + k] += 1
            return "#%02x%02x%02x" % n
        return m.group(0)
    s = re.sub(r"#[0-9a-fA-F]{6}\b", hx, s)
    def rg(m):
        r, g, b = int(m.group(2)), int(m.group(3)), int(m.group(4))
        if (r, g, b) in RGB:
            stats[f"rgb{(r, g, b)}"] += 1
            nr, ng, nb = RGB[(r, g, b)]
            return f"{m.group(1)}({nr}, {ng}, {nb}{m.group(5)}"
        n = neutralize(r, g, b)
        if n:
            stats[f"auto rgb{(r, g, b)}"] += 1
            return f"{m.group(1)}({n[0]}, {n[1]}, {n[2]}{m.group(5)}"
        return m.group(0)
    s = re.sub(r"(rgba?)\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*([,)])", rg, s)
    return s

if __name__ == "__main__":
    apply = "--apply" in sys.argv
    total, touched, stats = 0, 0, collections.Counter()
    for p, rel in files():
        try:
            s = open(p, encoding="utf-8").read()
        except UnicodeDecodeError:
            continue
        n = recolor(s, stats)
        total += 1
        if n != s:
            touched += 1
            if apply:
                open(p, "w", encoding="utf-8").write(n)
    print(f"{touched} fichiers sur {total} contiennent du bleu", "(corrigés)" if apply else "(rapport seul)")
    for k, v in stats.most_common(15):
        print(f"  {v:>5}  {k}")
