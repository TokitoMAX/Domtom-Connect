import os
import datetime
from bs4 import BeautifulSoup

blog_dir = r'c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\blog'
sitemap_path = r'c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\sitemap.xml'
blog_index_path = os.path.join(blog_dir, 'index.html')

today = datetime.datetime.now().strftime('%d %B %Y')
iso_today = datetime.datetime.now().strftime('%Y-%m-%d')

new_articles = [
    {
        'slug': 'offre-copilotage-startup-outremer',
        'title': 'Solopreneur en Outre-mer : Pourquoi avoir une idée ne suffit pas (Offre de Copilotage)',
        'category': 'Accompagnement',
        'category_slug': 'accompagnement',
        'image': 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&q=80&w=800',
        'excerpt': 'Seul face aux tâches qui vous ralentissent ? Découvrez comment notre offre de Copilotage agit comme un véritable associé technique et stratégique.',
        'content': '''
        <p>L'un des plus grands défis de l'entrepreneuriat, particulièrement dans les DOM-TOM (Guadeloupe, Martinique, Guyane, Réunion) ou dans la diaspora, est <strong>l'isolement</strong>. Avoir une brillante idée est une chose, mais devoir tout gérer de front — le marketing, la tech, la prospection, l'administratif — en est une autre.</p>
        
        <h2>La solitude de l'entrepreneur : le goulot d'étranglement</h2>
        <p>Souvent, le porteur de projet devient lui-même le goulot d'étranglement de sa propre entreprise. Vous passez vos journées à régler des problèmes techniques, à comprendre comment fonctionne un CRM, ou à chercher comment digitaliser vos processus au lieu de vous concentrer sur votre cœur de métier et vos ventes.</p>
        
        <h2>La différence entre "1-1" et "Copilotage"</h2>
        <p>Sur Domtom Connect, nous avons bien compris que l'entrepreneur a besoin de deux types de soutien :</p>
        <ul>
            <li><strong>L'accompagnement 1-1 :</strong> Vous prenez rendez-vous, nous analysons vos problématiques spécifiques, et nous vous donnons les stratégies et les solutions clés en main. Vous repartez avec un plan d'action clair pour avancer de votre côté.</li>
            <li><strong>Le Copilotage :</strong> C'est notre offre premium où nous rentrons dans l'opérationnel. Nous devenons littéralement votre <strong>associé externalisé</strong>. Vous détestez mettre en place la technique ? Vous bloquez sur l'implémentation de vos tunnels de vente ou votre stratégie digitale ? <em>Nous prenons le volant pour ces tâches chronophages et "chiantes".</em> On travaille ensemble, main dans la main, pour passer à l'action massivement.</li>
        </ul>

        <h2>Pourquoi choisir le Copilotage avec Domtom Connect ?</h2>
        <p>Notre but est simple : libérer votre temps. Que vous soyez une startup SaaS à la Réunion ou une entreprise logistique en Guyane, notre offre de copilotage s'adapte à votre besoin d'exécution. Nous nous intégrons à votre projet pour résoudre les problèmes profonds qui freinent votre croissance.</p>
        <p>N'hésitez pas à nous contacter directement via la plateforme pour discuter des modalités et voir comment nous pouvons "copiloter" votre réussite.</p>
        '''
    },
    {
        'slug': 'optimiser-logistique-export-guyane',
        'title': 'Optimiser votre logistique et vos exports depuis la Guyane',
        'category': 'Logistique',
        'category_slug': 'logistique',
        'image': 'https://images.unsplash.com/photo-1586528116311-ad8ed7c1590a?auto=format&fit=crop&q=80&w=800',
        'excerpt': 'Découvrez les défis spécifiques de la logistique en Guyane et comment Domtom Connect vous aide à structurer vos exports.',
        'content': '''
        <p>La Guyane, de par sa position géographique stratégique en Amérique du Sud et son statut de département français, offre des opportunités uniques d'exportation. Toutefois, la réalité du terrain est complexe : infrastructures parfois limitées, délais d'expédition, coûts du fret maritime et aérien, et complexités douanières.</p>

        <h2>Les problématiques de la chaîne d'approvisionnement guyanaise</h2>
        <p>Pour un entrepreneur en Guyane cherchant à exporter ses produits vers l'Hexagone, les Antilles ou l'Amérique latine, les obstacles sont nombreux. Comment négocier les tarifs de fret ? Comment assurer la traçabilité des expéditions ? Et surtout, comment trouver les bons partenaires sur place ?</p>

        <h2>Le Copilotage Domtom Connect pour la logistique</h2>
        <p>C'est ici qu'intervient l'offre de <strong>Copilotage</strong> de Domtom Connect. Si la gestion logistique vous empêche de vous concentrer sur la vente de vos produits, notre équipe peut agir comme votre associé opérationnel. Nous vous aidons à :</p>
        <ul>
            <li>Structurer vos processus d'expédition et digitaliser votre suivi.</li>
            <li>Mettre en place un CRM B2B pour gérer vos partenaires de transport.</li>
            <li>Trouver les bons contacts dans la diaspora et les autres îles pour faciliter l'import/export.</li>
        </ul>
        <p>À travers notre <strong>Accompagnement 1-1</strong>, nous répondons à vos problématiques douanières et stratégiques, tandis que notre Copilotage s'assure que l'exécution technique et digitale suit le rythme de vos ambitions.</p>
        '''
    },
    {
        'slug': 'digitalisation-commerce-reunion-budget',
        'title': 'Comment digitaliser son commerce local à la Réunion sans exploser son budget',
        'category': 'Tech & SaaS',
        'category_slug': 'tech-saas',
        'image': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
        'excerpt': 'Les solutions pratiques pour les commerçants réunionnais qui souhaitent passer au digital efficacement.',
        'content': '''
        <p>La Réunion est un marché dynamique, mais le passage au numérique reste un défi de taille pour de nombreux commerces de proximité. Création de site web, gestion de stock synchronisée, présence sur les réseaux sociaux, fidélisation client via CRM... Par où commencer quand on a un budget limité ?</p>

        <h2>Le piège de la digitalisation isolée</h2>
        <p>Beaucoup de commerçants essaient de tout faire eux-mêmes et finissent par s'épuiser. Apprendre à utiliser WordPress ou Shopify, configurer des campagnes publicitaires Facebook, tout cela prend un temps fou qui n'est pas consacré aux clients en boutique.</p>

        <h2>Domtom Connect : Votre Associé Digital (Copilotage)</h2>
        <p>Grâce à notre plateforme SaaS, nous offrons déjà les outils de base (CRM, annuaire B2B, devis) à un prix très accessible. Mais la vraie valeur ajoutée réside dans notre offre de <strong>Copilotage</strong>.</p>
        <p>Au lieu de vous battre avec la technique, nous devenons votre associé digital. Nous gérons l'implémentation, configurons vos outils, et mettons en place des processus automatisés. Les tâches "chiantes" de la digitalisation, c'est nous qui les gérons en passant à l'action massivement avec vous. Vous avez des questions précises sur votre stratégie ? Prenez un <strong>Accompagnement 1-1</strong> et nous débloquerons la situation ensemble en mode consulting.</p>
        '''
    },
    {
        'slug': 'financement-startup-tech-martinique',
        'title': 'Trouver des financements quand on lance une startup Tech en Martinique',
        'category': 'Finance',
        'category_slug': 'finance',
        'image': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800',
        'excerpt': 'Business Angels, aides régionales, BPI : le guide pour lever des fonds et financer sa startup tech depuis la Martinique.',
        'content': '''
        <p>Lancer une startup technologique en Martinique nécessite des capitaux pour financer le développement de l'application, le marketing, et l'acquisition utilisateur. Heureusement, l'écosystème local et national (Bpifrance, French Tech, aides FEDER) offre de nombreuses pistes.</p>

        <h2>Le labyrinthe administratif</h2>
        <p>Le principal problème n'est pas le manque d'argent, mais la complexité des dossiers de financement. Rédiger un business plan parfait, préparer un pitch deck convaincant, et comprendre le jargon des investisseurs peut décourager les fondateurs les plus motivés.</p>

        <h2>Comment le Copilotage vous propulse</h2>
        <p>En rejoignant Domtom Connect, vous bénéficiez de notre réseau de Business Angels de la diaspora et des acteurs locaux. Mais surtout, si la rédaction de dossiers ou la structuration de votre modèle financier n'est pas votre fort, notre service de <strong>Copilotage</strong> prend le relais. Nous devenons votre associé temporaire pour accomplir ces tâches pénibles.</p>
        <p>Dans une session de <strong>1-1</strong>, nous répondons à vos problématiques de valorisation et de stratégie d'investissement. Laissez-nous gérer ce qui vous ralentit via le copilotage pour que vous puissiez vous concentrer sur la création de votre produit !</p>
        '''
    },
    {
        'slug': 'expansion-internationale-guadeloupe-afrique-canada',
        'title': 'Expansion internationale : Exporter son SaaS de la Guadeloupe vers l\'Afrique et le Canada',
        'category': 'International',
        'category_slug': 'international',
        'image': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
        'excerpt': 'Stratégies d\'internationalisation pour les entreprises guadeloupéennes visant les marchés francophones et nord-américains.',
        'content': '''
        <p>La Guadeloupe regorge de talents tech et de projets SaaS innovants. Pourtant, le marché insulaire peut rapidement sembler étroit pour une solution digitale scalable. L'expansion vers l'Afrique francophone ou le Canada (notamment le Québec) représente une opportunité de croissance exceptionnelle.</p>

        <h2>Les défis de l'internationalisation</h2>
        <p>Comment adapter son produit à des cultures d'entreprise différentes ? Comment gérer les paiements internationaux, les fuseaux horaires pour le service client, ou encore le référencement (SEO) localisé ? Ce sont des problèmes complexes qui nécessitent une exécution chirurgicale.</p>

        <h2>Un Copilote pour votre conquête internationale</h2>
        <p>Entrer sur un nouveau marché ne s'improvise pas. Domtom Connect agit comme le tremplin de la diaspora ultramarine vers l'international. Avec notre service de <strong>Copilotage</strong>, nous vous accompagnons dans l'exécution technique de votre internationalisation (mise en place de tunnels de conversion multidevises, stratégies de croissance ciblées). Nous rentrons dans les tâches complexes et mettons les mains dans le cambouis avec vous.</p>
        <p>Nos séances d'<strong>Accompagnement 1-1</strong> vous permettent également de poser toutes vos questions stratégiques à nos experts qui connaissent les dynamiques de ces marchés de destination.</p>
        '''
    }
]

template_html = """<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    
    <title>{title} | Domtom Connect Blog</title>
    <meta name="description" content="{excerpt}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{excerpt}">
    <meta property="og:image" content="{image}">
    <meta property="og:type" content="article">
    
    <link rel="stylesheet" href="../../assets/css/style.css">
    <link rel="stylesheet" href="../../assets/css/blog.css">
    
    <style>
        .article-hero {{
            padding: 120px 5% 60px;
            background: linear-gradient(135deg, rgba(26,31,44,0.95) 0%, rgba(10,15,25,0.98) 100%), url('{image}') center/cover;
            color: white;
            text-align: center;
        }}
        .article-container {{
            max-width: 800px;
            margin: -40px auto 60px;
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            position: relative;
        }}
        .article-content h2 {{
            color: var(--primary-color);
            margin-top: 30px;
            margin-bottom: 15px;
        }}
        .article-content p {{
            line-height: 1.8;
            color: #4a5568;
            margin-bottom: 20px;
            font-size: 1.1rem;
        }}
        .article-content ul {{
            margin-bottom: 20px;
            padding-left: 20px;
        }}
        .article-content li {{
            line-height: 1.8;
            color: #4a5568;
            margin-bottom: 10px;
            font-size: 1.1rem;
        }}
    </style>
</head>
<body>

    <!-- Hero Section -->
    <header class="article-hero">
        <span class="article-category">{category}</span>
        <h1 style="margin: 20px 0;">{title}</h1>
        <div class="article-meta">
            <span><i class="far fa-calendar"></i> {today}</span>
            <span style="margin-left: 15px;"><i class="far fa-clock"></i> 4 min de lecture</span>
        </div>
    </header>

    <!-- Main Content -->
    <main class="article-container">
        <div class="article-content">
            {content}
            
            <div style="margin-top: 50px; padding: 30px; background: #f8fafc; border-radius: 8px; text-align: center;">
                <h3 style="color: var(--primary-color); margin-bottom: 15px;">Passez à l'action massive avec Domtom Connect</h3>
                <p style="margin-bottom: 20px;">Vous avez besoin d'un Copilote pour débloquer votre croissance ou d'une session 1-1 pour résoudre vos problèmes ?</p>
                <a href="../../register-choice.html" class="cta-button primary" style="padding: 12px 30px; border-radius: 30px; text-decoration: none; display: inline-block;">Découvrir nos offres d'accompagnement</a>
            </div>
        </div>
    </main>

    <footer class="site-footer">
        <p>&copy; 2026 Domtom Connect. Tous droits réservés.</p>
    </footer>

</body>
</html>"""

# Generate article files
for art in new_articles:
    article_dir = os.path.join(blog_dir, art['slug'])
    os.makedirs(article_dir, exist_ok=True)
    with open(os.path.join(article_dir, 'index.html'), 'w', encoding='utf-8') as f:
        html = template_html.format(
            title=art['title'],
            excerpt=art['excerpt'],
            image=art['image'],
            category=art['category'],
            content=art['content'],
            today=today
        )
        f.write(html)

# Read blog index.html
with open(blog_index_path, 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

# Find the blog grid
blog_grid = soup.find('div', id='blogGrid')

if blog_grid:
    # Create HTML elements for the new articles and insert them at the top
    for art in reversed(new_articles): # reversed so they appear in correct order when prepended
        card = soup.new_tag('article', attrs={'class': 'blog-card', 'data-category': art['category_slug'], 'data-date': iso_today})
        
        img_div = soup.new_tag('div', attrs={'class': 'blog-card-image'})
        a_img = soup.new_tag('a', href=f"/blog/{art['slug']}/")
        img = soup.new_tag('img', src=art['image'], alt=art['title'])
        a_img.append(img)
        img_div.append(a_img)
        
        cat_div = soup.new_tag('div', attrs={'class': 'blog-card-category'})
        cat_div.string = art['category']
        img_div.append(cat_div)
        
        content_div = soup.new_tag('div', attrs={'class': 'blog-card-content'})
        h3 = soup.new_tag('h3')
        a_title = soup.new_tag('a', href=f"/blog/{art['slug']}/")
        a_title.string = art['title']
        h3.append(a_title)
        
        p_exc = soup.new_tag('p')
        p_exc.string = art['excerpt']
        
        meta_div = soup.new_tag('div', attrs={'class': 'blog-card-meta'})
        span_date = soup.new_tag('span')
        i_cal = soup.new_tag('i', attrs={'class': 'far fa-calendar'})
        span_date.append(i_cal)
        span_date.append(f" {today}")
        meta_div.append(span_date)
        
        content_div.append(h3)
        content_div.append(p_exc)
        content_div.append(meta_div)
        
        card.append(img_div)
        card.append(content_div)
        
        blog_grid.insert(0, card)

# Save blog index
with open(blog_index_path, 'w', encoding='utf-8') as f:
    f.write(str(soup))

# Update Sitemap
with open(sitemap_path, 'r', encoding='utf-8') as f:
    sitemap_content = f.read()

sitemap_entries = ""
for art in new_articles:
    url = f"https://domtomconnect.com/blog/{art['slug']}"
    sitemap_entries += f"""
    <url>
        <loc>{url}</loc>
        <lastmod>{iso_today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>"""

if "</urlset>" in sitemap_content:
    sitemap_content = sitemap_content.replace("</urlset>", sitemap_entries + "\n</urlset>")
    with open(sitemap_path, 'w', encoding='utf-8') as f:
        f.write(sitemap_content)

print(f"Successfully generated {len(new_articles)} new articles and updated blog index and sitemap.")
