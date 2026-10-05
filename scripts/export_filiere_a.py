import sys, os, json
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from build_filiere_a_test import valid_list

sys.stdout.reconfigure(encoding='utf-8')

print(f"Total valid A: {len(valid_list)}")
top_50 = valid_list[:50]
for i, item in enumerate(top_50):
    print(f"{i+1}. {item['company']} | {item['email']} | {item['territory']}")

out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "filiere_a_50.json")
with open(out_path, "w", encoding="utf-8") as out:
    json.dump(top_50, out, indent=2, ensure_ascii=False)
print("Saved to scripts/filiere_a_50.json successfully.")
