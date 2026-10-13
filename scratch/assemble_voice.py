import os
import subprocess
import imageio_ffmpeg

ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
os.makedirs('scratch/loic_clean', exist_ok=True)
os.makedirs('assets/audio', exist_ok=True)

# 1. Clean cut B1
subprocess.run([ffmpeg, '-y', '-ss', '0.7', '-to', '19.5', '-i', 'scratch/loic_takes/raw_block_1.wav', 'scratch/loic_clean/c1.wav'], check=True)

# 2. Clean cut B2 (combine 4.8-22.4 and 39.8-60.0)
subprocess.run([ffmpeg, '-y', '-ss', '4.8', '-to', '22.4', '-i', 'scratch/loic_takes/raw_block_2.wav', 'scratch/loic_clean/c2_a.wav'], check=True)
subprocess.run([ffmpeg, '-y', '-ss', '39.8', '-to', '60.0', '-i', 'scratch/loic_takes/raw_block_2.wav', 'scratch/loic_clean/c2_b.wav'], check=True)

# 3. Clean cut B3 (0.8-23.5 + 24.5-26.1 + 28.0-57.5)
subprocess.run([ffmpeg, '-y', '-ss', '0.8', '-to', '23.5', '-i', 'scratch/loic_takes/raw_block_3.wav', 'scratch/loic_clean/c3_a.wav'], check=True)
subprocess.run([ffmpeg, '-y', '-ss', '24.5', '-to', '26.1', '-i', 'scratch/loic_takes/raw_block_3.wav', 'scratch/loic_clean/c3_b.wav'], check=True)
subprocess.run([ffmpeg, '-y', '-ss', '28.0', '-to', '57.5', '-i', 'scratch/loic_takes/raw_block_3.wav', 'scratch/loic_clean/c3_c.wav'], check=True)

# 4. Clean cut B4 (1.5-41.0)
subprocess.run([ffmpeg, '-y', '-ss', '1.5', '-to', '41.0', '-i', 'scratch/loic_takes/raw_block_4.wav', 'scratch/loic_clean/c4.wav'], check=True)

# Concat all clean parts
concat_txt = 'scratch/loic_clean/concat.txt'
parts = ['c1.wav', 'c2_a.wav', 'c2_b.wav', 'c3_a.wav', 'c3_b.wav', 'c3_c.wav', 'c4.wav']
with open(concat_txt, 'w', encoding='utf-8') as f:
    for p in parts:
        full_p = os.path.abspath(os.path.join('scratch/loic_clean', p)).replace('\\', '/')
        f.write(f"file '{full_p}'\n")

out_wav = 'assets/audio/video4_realvoice_master.wav'
subprocess.run([ffmpeg, '-y', '-f', 'concat', '-safe', '0', '-i', concat_txt, '-c', 'copy', out_wav], check=True)

out_mp3 = 'assets/audio/video4_realvoice_master.mp3'
subprocess.run([ffmpeg, '-y', '-i', out_wav, '-b:a', '192k', out_mp3], check=True)

res = subprocess.run([ffmpeg, '-i', out_mp3], stderr=subprocess.PIPE, text=True)
for line in res.stderr.splitlines():
    if 'Duration' in line:
        print(line)

print("Master clean audio ready:", out_mp3)
