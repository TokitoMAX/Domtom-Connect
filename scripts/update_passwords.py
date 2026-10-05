import glob, os

files = glob.glob("scripts/*.py")
count = 0
for f in files:
    with open(f, "r", encoding="utf-8", errors="ignore") as file:
        content = file.read()
    if "geqpuqluimxdjxeo" in content:
        new_content = content.replace("geqpuqluimxdjxeo", "geqpuqluimxdjxeo")
        with open(f, "w", encoding="utf-8") as file:
            file.write(new_content)
        count += 1

print(f"Mise à jour réussie : {count} scripts mis à jour avec le nouveau mot de passe d'application.")
