import os

base_dir = r"c:\Users\Silen\.gemini\antigravity-ide\scratch\Domtom-Connect\blog"

replacements = [
    (
        r"startups-climat-incubateur-caraibes\index.html",
        "Innovez et faites-vous financer grâce à Domtom Connect.",
        "Innovez et rejoignez une communauté d'entrepreneurs engagés grâce à l'Incubateur Domtom Connect."
    ),
    (
        r"paris-business-angels-diaspora\index.html",
        "ou rejoignez le panel d'investisseurs de notre Incubateur pour financer les projets les plus ambitieux.",
        "ou rejoignez l'Incubateur pour collaborer avec les porteurs de projets et construire un écosystème d'affaires sain."
    ),
    (
        r"lyon-diaspora-antillaise-innovation\index.html",
        "ou rejoindre notre pôle d'investisseurs pour financer des startups incubées.",
        "ou rejoindre notre réseau pour collaborer avec des startups incubées et créer des synergies."
    ),
    (
        r"createurs-antillais-visibilite-communaute\index.html",
        "ou même postuler à l'Incubateur pour financer votre premier restaurant.",
        "ou même postuler à l'Incubateur pour vous entourer des bons partenaires et passer à l'action."
    ),
    (
        r"index.html",
        "Innovez et faites-vous financer grâce à Domtom Connect.",
        "Innovez et rejoignez une communauté d'entrepreneurs engagés."
    )
]

for file_rel, old_text, new_text in replacements:
    path = os.path.join(base_dir, file_rel)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if old_text in content:
            content = content.replace(old_text, new_text)
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed {file_rel}")
        else:
            print(f"Text not found in {file_rel}")
    else:
        print(f"File not found: {path}")

