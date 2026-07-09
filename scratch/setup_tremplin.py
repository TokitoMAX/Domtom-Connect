import os
from bs4 import BeautifulSoup
import datetime

workspace = r'c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect'

# 1. Update incubateur.html
incubateur_path = os.path.join(workspace, 'incubateur.html')
with open(incubateur_path, 'r', encoding='utf-8') as f:
    incubateur_html = f.read()

# Replace Tremplin specific text with Incubator text
incubateur_html = incubateur_html.replace(
    "<title>Le Programme Tremplin | L'Incubateur Domtom Connect</title>",
    "<title>L'Incubateur | Domtom Connect</title>"
)
incubateur_html = incubateur_html.replace(
    "Le Programme Tremplin : 1 an d'accompagnement intensif, un acces au reseau d'investisseurs et des masterminds prives.",
    "Rejoignez un écosystème d'entrepreneurs pour collaborer, passer à l'action massivement et structurer votre projet ensemble."
)
incubateur_html = incubateur_html.replace(
    "Rejoignez un groupe intime de 4 a 5 porteurs de projets pour vous entraider chaque semaine.",
    "Collaborez avec d'autres fondateurs ambitieux pour résoudre vos problèmes en communauté."
)

with open(incubateur_path, 'w', encoding='utf-8') as f:
    f.write(incubateur_html)

# 2. Create tremplin.html
tremplin_html = """<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Le Programme Tremplin | Domtom Connect</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <link rel="stylesheet" href="assets/css/style.css">

    <style>
        :root {
            --premium-bg: #020617;
            --premium-surface: #0f172a;
            --accent: #f59e0b; /* Gold/Amber for premium */
            --accent-hover: #d97706;
        }

        body {
            background-color: var(--premium-bg);
            color: #ffffff;
            font-family: 'Plus Jakarta Sans', sans-serif;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
        }

        .hero {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 20px;
            position: relative;
            background: radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.15) 0%, transparent 60%);
        }

        .logo-container {
            margin-bottom: 40px;
        }

        .logo-container img {
            height: 40px;
            filter: brightness(0) invert(1);
        }

        .badge {
            background: rgba(245, 158, 11, 0.1);
            color: var(--accent);
            border: 1px solid var(--accent);
            padding: 8px 16px;
            border-radius: 100px;
            font-size: 0.85rem;
            font-weight: 800;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            margin-bottom: 24px;
        }

        h1 {
            font-size: clamp(2.5rem, 6vw, 4.5rem);
            font-weight: 900;
            line-height: 1.1;
            letter-spacing: -0.04em;
            margin-bottom: 24px;
            max-width: 900px;
            color: #ffffff;
        }

        .subtitle {
            font-size: clamp(1.1rem, 2vw, 1.3rem);
            color: #94a3b8;
            max-width: 600px;
            line-height: 1.6;
            margin-bottom: 40px;
        }

        .cta-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: var(--accent);
            color: #ffffff;
            padding: 18px 36px;
            border-radius: 16px;
            font-size: 1.1rem;
            font-weight: 800;
            text-decoration: none;
            transition: all 0.3s ease;
            box-shadow: 0 10px 25px rgba(245, 158, 11, 0.3);
            border: none;
            cursor: pointer;
        }

        .cta-button:hover {
            transform: translateY(-2px);
            background: var(--accent-hover);
            box-shadow: 0 15px 35px rgba(245, 158, 11, 0.4);
        }

        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
            max-width: 1100px;
            margin: 0 auto;
            padding: 60px 20px;
        }

        .feature-card {
            background: var(--premium-surface);
            border: 1px solid rgba(255, 255, 255, 0.05);
            padding: 32px;
            border-radius: 24px;
            text-align: left;
        }

        .feature-icon {
            font-size: 2.5rem;
            margin-bottom: 20px;
            color: var(--accent);
        }

        .feature-card h3 {
            font-size: 1.3rem;
            font-weight: 800;
            margin-bottom: 12px;
            color: #ffffff;
        }

        .feature-card p {
            color: #94a3b8;
            line-height: 1.5;
            font-size: 0.95rem;
        }
    </style>
</head>
<body>

    <section class="hero">
        <div class="logo-container">
            <a href="index.html">
                <img src="assets/images/logo-domtomconnect.png" alt="Domtom Connect">
            </a>
        </div>

        <div class="badge">Sélection de 4 à 5 projets maximum</div>
        
        <h1>Le Programme Tremplin</h1>
        
        <p class="subtitle">
            Un programme intensif de 1 an. 1 masterclass par semaine, 1 session 1-1 par mois. Pour les entrepreneurs qui ont déjà des revenus et qui veulent faire des mini-coups pour une action massive.
        </p>

        <a href="mailto:contact@domtomconnect.com?subject=Candidature%20Tremplin" class="cta-button">Candidater au Tremplin (Payant)</a>
        
        <a href="index.html" style="margin-top: 24px; color: #64748b; font-weight: 600; text-decoration: none;">Retour à l'accueil</a>
    </section>

    <section class="features">
        <div class="feature-card">
            <div class="feature-icon"><i class="fas fa-calendar-check"></i></div>
            <h3>1 An d'Intensité</h3>
            <p>Ce n'est pas un sprint, c'est un marathon structuré. Sur 12 mois, nous mettons en place des mini-coups stratégiques pour assurer votre croissance continue.</p>
        </div>
        <div class="feature-card">
            <div class="feature-icon"><i class="fas fa-users"></i></div>
            <h3>Groupe Très Restreint</h3>
            <p>Strictement limité à 4 ou 5 personnes. Vous n'êtes pas un numéro. Vous êtes entouré de pairs qui sont déjà passés à l'action et qui génèrent déjà du chiffre d'affaires.</p>
        </div>
        <div class="feature-card">
            <div class="feature-icon"><i class="fas fa-video"></i></div>
            <h3>Masterclass & 1-on-1</h3>
            <p>Une masterclass chaque semaine pour l'exécution technique et stratégique. Plus une session de coaching individuel (1-1) par mois pour résoudre vos problématiques précises.</p>
        </div>
    </section>

</body>
</html>"""

with open(os.path.join(workspace, 'tremplin.html'), 'w', encoding='utf-8') as f:
    f.write(tremplin_html)

# 3. Add link to Footer in index.html
index_path = os.path.join(workspace, 'index.html')
with open(index_path, 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

footer_links = soup.find('div', class_='footer-col')
if footer_links:
    new_li = soup.new_tag('li')
    new_a = soup.new_tag('a', href='tremplin.html')
    new_a.string = 'Programme Tremplin'
    new_li.append(new_a)
    # find the ul and append
    ul = footer_links.find('ul')
    if ul:
        ul.append(new_li)

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(str(soup))

# 4. Generate the Article about Tremplin
blog_dir = os.path.join(workspace, 'blog')
blog_index_path = os.path.join(blog_dir, 'index.html')
today = datetime.datetime.now().strftime('%d %B %Y')
iso_today = datetime.datetime.now().strftime('%Y-%m-%d')

tremplin_article = {
    'slug': 'programme-tremplin-action-massive',
    'title': 'Faire des mini-coups pour une action massive : Le Programme Tremplin',
    'category': 'Accompagnement',
    'category_slug': 'accompagnement',
    'image': 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&q=80&w=800',
    'excerpt': 'Découvrez le Programme Tremplin : une année pour structurer votre croissance avec des Masterclass, du 1-1 et un groupe restreint de 4-5 entrepreneurs ambitieux.',
    'content': '''
    <p>Lorsque vous commencez à générer vos premiers revenus, un nouveau défi apparaît : comment maintenir cette dynamique sans s'épuiser, et surtout, comment passer à l'étape supérieure ? C'est exactement pour répondre à cette problématique que nous avons créé le <strong>Programme Tremplin</strong>.</p>
    
    <h2>La philosophie des "Mini-Coups"</h2>
    <p>L'erreur que font beaucoup d'entrepreneurs est d'essayer de faire "le gros coup" qui va transformer leur entreprise du jour au lendemain. Dans le Programme Tremplin, nous vous apprenons à réaliser des <strong>mini-coups</strong> : des actions précises, mesurables et rentables, répétées de manière constante. C'est l'accumulation de ces mini-coups sur une durée d'un an qui crée une véritable action massive.</p>
    
    <h2>Pourquoi une sélection stricte de 4 à 5 porteurs de projets ?</h2>
    <p>Pour avancer vite, il faut être bien entouré. Ce programme n'est pas fait pour ceux qui en sont encore au stade de l'idée. Il s'adresse aux personnes qui sont déjà passées à l'action. En limitant le groupe à 4 ou 5 membres, nous garantissons :</p>
    <ul>
        <li>Une qualité d'échange exceptionnelle (Masterclass hebdomadaires).</li>
        <li>Un suivi sur-mesure pour chaque entreprise.</li>
        <li>Une session de <strong>coaching 1-1 mensuelle</strong> dédiée à vos blocages.</li>
    </ul>

    <h2>Un programme rémunéré pour s'engager à fond</h2>
    <p>Le Tremplin est une offre premium payante. Pourquoi ? Parce que l'investissement financier garantit votre engagement sur 1 an. Quand on paie, on fait les efforts nécessaires pour obtenir un retour sur investissement massif. Si vous êtes prêt à agir, l'écosystème Domtom Connect vous propulsera vers vos objectifs.</p>
    '''
}

article_dir = os.path.join(blog_dir, tremplin_article['slug'])
os.makedirs(article_dir, exist_ok=True)
template_html = """<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | Domtom Connect Blog</title>
    <link rel="stylesheet" href="../../assets/css/style.css">
    <link rel="stylesheet" href="../../assets/css/blog.css">
    <style>
        .article-hero {{ padding: 120px 5% 60px; background: linear-gradient(135deg, rgba(26,31,44,0.95) 0%, rgba(10,15,25,0.98) 100%), url('{image}') center/cover; color: white; text-align: center; }}
        .article-container {{ max-width: 800px; margin: -40px auto 60px; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); position: relative; }}
        .article-content h2 {{ color: var(--primary-color); margin-top: 30px; margin-bottom: 15px; }}
        .article-content p {{ line-height: 1.8; color: #4a5568; margin-bottom: 20px; font-size: 1.1rem; }}
        .article-content ul {{ margin-bottom: 20px; padding-left: 20px; }}
        .article-content li {{ line-height: 1.8; color: #4a5568; margin-bottom: 10px; font-size: 1.1rem; }}
    </style>
</head>
<body>
    <header class="article-hero">
        <span class="article-category">{category}</span>
        <h1 style="margin: 20px 0;">{title}</h1>
    </header>
    <main class="article-container">
        <div class="article-content">
            {content}
            <div style="margin-top: 50px; padding: 30px; background: #fef3c7; border-radius: 8px; text-align: center;">
                <h3 style="color: #d97706; margin-bottom: 15px;">Prêt à rejoindre l'élite ?</h3>
                <a href="../../tremplin.html" class="cta-button" style="background:#f59e0b; color:white; padding: 12px 30px; border-radius: 30px; text-decoration: none; display: inline-block;">Découvrir le Programme Tremplin</a>
            </div>
        </div>
    </main>
</body>
</html>"""

with open(os.path.join(article_dir, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(template_html.format(**tremplin_article))

with open(blog_index_path, 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')
blog_grid = soup.find('div', id='blogGrid')
if blog_grid:
    card = soup.new_tag('article', attrs={'class': 'blog-card', 'data-category': tremplin_article['category_slug'], 'data-date': iso_today})
    img_div = soup.new_tag('div', attrs={'class': 'blog-card-image'})
    a_img = soup.new_tag('a', href=f"/blog/{tremplin_article['slug']}/")
    img = soup.new_tag('img', src=tremplin_article['image'], alt=tremplin_article['title'])
    a_img.append(img)
    img_div.append(a_img)
    
    cat_div = soup.new_tag('div', attrs={'class': 'blog-card-category'})
    cat_div.string = tremplin_article['category']
    img_div.append(cat_div)
    
    content_div = soup.new_tag('div', attrs={'class': 'blog-card-content'})
    h3 = soup.new_tag('h3')
    a_title = soup.new_tag('a', href=f"/blog/{tremplin_article['slug']}/")
    a_title.string = tremplin_article['title']
    h3.append(a_title)
    
    p_exc = soup.new_tag('p')
    p_exc.string = tremplin_article['excerpt']
    
    content_div.append(h3)
    content_div.append(p_exc)
    
    card.append(img_div)
    card.append(content_div)
    
    blog_grid.insert(0, card)

with open(blog_index_path, 'w', encoding='utf-8') as f:
    f.write(str(soup))
