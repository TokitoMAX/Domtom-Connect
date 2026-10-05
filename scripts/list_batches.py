import glob, json, os

batch_files = glob.glob("scripts/batch_*.json")
print(f"Batch files trouvés: {len(batch_files)}")
for bf in sorted(batch_files):
    with open(bf, "r", encoding="utf-8") as f:
        data = json.load(f)
        print(f"{os.path.basename(bf)} : {len(data)} leads")
