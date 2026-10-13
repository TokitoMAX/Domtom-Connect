import edge_tts
import asyncio
import json
import os

with open('scripts/script_youtube_argumentation.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Filter out markdown headers and notes
text_blocks = []
current_block = []
for line in lines:
    line_s = line.strip()
    if not line_s:
        continue
    if line_s.startswith('#') or line_s.startswith('>') or line_s.startswith('---') or line_s.startswith('|'):
        continue
    text_blocks.append(line_s)

full_script = "\n\n".join(text_blocks)
print(f"Total script length: {len(full_script)} characters, {len(full_script.split())} words.")

async def generate():
    # Cadence énergique, posée, terre-à-terre
    tts = edge_tts.Communicate(full_script, 'fr-FR-HenriNeural', rate='+6%')
    cues = []
    os.makedirs('assets/audio', exist_ok=True)
    
    with open('assets/audio/argumentation_complete.mp3', 'wb') as f:
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
                
    with open('assets/audio/argumentation_sync.json', 'w', encoding='utf-8') as jf:
        json.dump(cues, jf, ensure_ascii=False, indent=2)
        
    print(f"Audio generated successfully! Total cues: {len(cues)}")
    if cues:
        print(f"Estimated duration: {cues[-1]['end']} seconds ({cues[-1]['end'] / 60:.1f} minutes)")

if __name__ == '__main__':
    asyncio.run(generate())
