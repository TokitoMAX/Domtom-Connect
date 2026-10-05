import json, sys
sys.stdout.reconfigure(encoding='utf-8')

path = r"C:\Users\Silen\.gemini\antigravity-ide\brain\ec099166-0b17-4cdd-b418-2082fdc87435\.system_generated\logs\transcript_full.jsonl"
with open(path, "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if i in [0, 1, 31, 32, 33]:
            data = json.loads(line)
            print(f"=== FULL LINE {i} ({data.get('type')}/{data.get('source')}) ===")
            print("CONTENT:")
            print(str(data.get('content'))[:2000])
            if 'thought' in data:
                print("THOUGHT:")
                print(str(data.get('thought'))[:2000])
