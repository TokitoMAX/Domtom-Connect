import edge_tts
import asyncio
import json
import os

with open('scripts/script_youtube_video3_methode.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Filter out markdown headers, notes, timestamps
text_blocks = []
in_script = False
for line in lines:
    line_s = line.strip()
    if not line_s:
        continue
    if "### Script complet de la voix off" in line_s:
        in_script = True
        continue
    if not in_script:
        continue
    if line_s.startswith('#') or line_s.startswith('>') or line_s.startswith('---'):
        continue
    text_blocks.append(line_s)

full_script = "\n\n".join(text_blocks)
print(f"Total script length: {len(full_script)} characters, {len(full_script.split())} words.")

async def generate():
    # Natural, confident, direct tone
    tts = edge_tts.Communicate(full_script, 'fr-FR-HenriNeural', rate='+4%')
    cues = []
    os.makedirs('assets/audio', exist_ok=True)
    
    mp3_path = 'assets/audio/video3_complete.mp3'
    sync_path = 'assets/audio/video3_sync.json'
    
    with open(mp3_path, 'wb') as f:
        async for chunk in tts.stream():
            if chunk['type'] == 'audio':
                f.write(chunk['data'])
            elif chunk['type'] == 'SentenceBoundary':
                start_sec = chunk['offset'] / 10_000_000.0
                dur_sec = chunk['duration'] / 10_000_000.0
                cues.append({
                    'start': round(start_sec, 2),
                    'end': round(start_sec + dur_sec, 2),
                    'text': chunk['text']
                })
                
    with open(sync_path, 'w', encoding='utf-8') as jf:
        json.dump(cues, jf, ensure_ascii=False, indent=2)
        
    print(f"Audio generated: {mp3_path}")
    print(f"Sync cues saved: {sync_path} (Total cues: {len(cues)})")
    if cues:
        print(f"Total duration: {cues[-1]['end']} seconds ({cues[-1]['end'] / 60:.2f} minutes)")

if __name__ == '__main__':
    asyncio.run(generate())
