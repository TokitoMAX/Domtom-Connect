import json, sys
sys.stdout.reconfigure(encoding='utf-8')

path = r"C:\Users\Silen\.gemini\antigravity-ide\brain\ec099166-0b17-4cdd-b418-2082fdc87435\.system_generated\logs\transcript.jsonl"
with open(path, "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        d = json.loads(line)
        typ = d.get("type")
        src = d.get("source")
        content = d.get("content", "")
        calls = d.get("tool_calls", [])
        if typ == "USER_INPUT":
            print(f"\n=== USER INPUT (line {i}) ===")
            print(content)
        elif src == "MODEL" and content and not calls:
            print(f"\n=== MODEL (line {i}) ===")
            print(content)



