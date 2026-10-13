import os
import re
import json
import subprocess
from gtts import gTTS
import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()

script_path = 'scripts/script_youtube_video4_loi_8020_marketing.md'
with open(script_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

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

print(f"Total script blocks: {len(text_blocks)}")

chunks_dir = 'scratch/v4_8020_chunks'
os.makedirs(chunks_dir, exist_ok=True)
os.makedirs('assets/audio', exist_ok=True)

cues = []
current_time = 0.0
concat_list_path = 'scratch/v4_8020_concat.txt'
chunk_files = []

for idx, block in enumerate(text_blocks):
    raw_chunk = f"{chunks_dir}/raw_{idx:03d}.mp3"
    tempo_chunk = f"{chunks_dir}/chunk_{idx:03d}.mp3"
    
    # Generate TTS
    tts = gTTS(block, lang='fr', tld='fr')
    tts.save(raw_chunk)
    
    # Tempo filter (+7% dynamic speedup)
    cmd_tempo = [
        ffmpeg_exe, '-y', '-i', raw_chunk,
        '-filter:a', 'atempo=1.07',
        '-vn', tempo_chunk
    ]
    subprocess.run(cmd_tempo, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    
    # Duration calculation
    cmd_dur = [ffmpeg_exe, '-i', tempo_chunk]
    res = subprocess.run(cmd_dur, stderr=subprocess.PIPE, stdout=subprocess.PIPE, text=True)
    m = re.search(r'Duration:\s*(\d+):(\d+):(\d+\.\d+)', res.stderr)
    if m:
        dur = int(m.group(1))*3600 + int(m.group(2))*60 + float(m.group(3))
    else:
        dur = 3.0
        
    start_sec = round(current_time, 2)
    end_sec = round(current_time + dur, 2)
    cues.append({
        'index': idx,
        'start': start_sec,
        'end': end_sec,
        'text': block
    })
    
    chunk_files.append(tempo_chunk)
    current_time = end_sec + 0.25 # 250ms pause

# Silence file
silence_file = f"{chunks_dir}/silence_250ms.mp3"
subprocess.run([
    ffmpeg_exe, '-y', '-f', 'lavfi', '-i', 'anullsrc=r=24000:cl=mono',
    '-t', '0.25', '-q:a', '9', '-acodec', 'libmp3lame', silence_file
], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

with open(concat_list_path, 'w', encoding='utf-8') as cf:
    for i, c_file in enumerate(chunk_files):
        cf.write(f"file '{os.path.abspath(c_file).replace(chr(92), '/')}'\n")
        if i < len(chunk_files) - 1:
            cf.write(f"file '{os.path.abspath(silence_file).replace(chr(92), '/')}'\n")

mp3_output = 'assets/audio/video4_8020_complete.mp3'
sync_output = 'assets/audio/video4_8020_sync.json'

cmd_concat = [
    ffmpeg_exe, '-y', '-f', 'concat', '-safe', '0',
    '-i', concat_list_path,
    '-c', 'copy', mp3_output
]
subprocess.run(cmd_concat, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

with open(sync_output, 'w', encoding='utf-8') as jf:
    json.dump(cues, jf, ensure_ascii=False, indent=2)

print(f"Audio generated: {mp3_output}")
print(f"Total cues: {len(cues)}")
print(f"Total duration: {cues[-1]['end']} seconds ({cues[-1]['end']/60:.2f} minutes)")
