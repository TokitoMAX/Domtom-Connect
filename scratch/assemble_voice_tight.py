import os
import subprocess
import imageio_ffmpeg

ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
os.makedirs('scratch/loic_tight', exist_ok=True)
os.makedirs('assets/audio', exist_ok=True)

# 1. Block 1 (0.8s to 19.3s)
subprocess.run([
    ffmpeg, '-y', '-ss', '0.8', '-to', '19.3',
    '-i', 'scratch/loic_takes/raw_block_1.wav',
    'scratch/loic_tight/t1.wav'
], check=True)

# 2. Block 2:
# 2A: 4.9s to 17.2s ("Combien de fois tu t'es retrouvé à attendre un virement...")
subprocess.run([
    ffmpeg, '-y', '-ss', '4.9', '-to', '17.2',
    '-i', 'scratch/loic_takes/raw_block_2.wav',
    'scratch/loic_tight/t2_a.wav'
], check=True)

# 2B: 18.0s to 22.3s ("Le pire dans nos territoires, c'est qu'on n'ose pas être fermes.")
subprocess.run([
    ffmpeg, '-y', '-ss', '18.0', '-to', '22.3',
    '-i', 'scratch/loic_takes/raw_block_2.wav',
    'scratch/loic_tight/t2_b.wav'
], check=True)

# 2C: 39.8s to 51.0s ("On a peur de braquer le client. Pendant ce temps, tes charges tombent à date fixe, tes fournisseurs n'attendent pas...")
subprocess.run([
    ffmpeg, '-y', '-ss', '39.8', '-to', '51.0',
    '-i', 'scratch/loic_takes/raw_block_2.wav',
    'scratch/loic_tight/t2_c.wav'
], check=True)

# 2D: 56.1s to 59.8s ("Et c'est toi qui fais la banque pour tout le monde avec ta propre santé.") -> CUTR OUT THE REPETITION AT 52-56s!
subprocess.run([
    ffmpeg, '-y', '-ss', '56.1', '-to', '59.8',
    '-i', 'scratch/loic_takes/raw_block_2.wav',
    'scratch/loic_tight/t2_d.wav'
], check=True)

# 3. Block 3:
# 3A: 0.8s to 23.2s ("Pour stopper cette hémorragie... Verrou 1 : 40% acompte...")
subprocess.run([
    ffmpeg, '-y', '-ss', '0.8', '-to', '23.2',
    '-i', 'scratch/loic_takes/raw_block_3.wav',
    'scratch/loic_tight/t3_a.wav'
], check=True)

# 3B: 24.5s to 26.0s ("Deuxième verrou :")
subprocess.run([
    ffmpeg, '-y', '-ss', '24.5', '-to', '26.0',
    '-i', 'scratch/loic_takes/raw_block_3.wav',
    'scratch/loic_tight/t3_b.wav'
], check=True)

# 3C: 28.0s to 37.2s ("facturer à l'avancement. Si une étape n'est pas réglée, la suite ne démarre pas.") -> CUT OUT "facturer à l'avance"!
subprocess.run([
    ffmpeg, '-y', '-ss', '28.0', '-to', '37.2',
    '-i', 'scratch/loic_takes/raw_block_3.wav',
    'scratch/loic_tight/t3_c.wav'
], check=True)

# 3D: 38.2s to 56.8s ("Troisième verrou : un protocole de relance systématique à 7 jours et 15 jours, poli mais strict...")
subprocess.run([
    ffmpeg, '-y', '-ss', '38.2', '-to', '56.8',
    '-i', 'scratch/loic_takes/raw_block_3.wav',
    'scratch/loic_tight/t3_d.wav'
], check=True)

# 4. Block 4:
# 4A: 1.5s to 40.8s ("Si tu as du mal à imposer ces règles... Stay co.")
subprocess.run([
    ffmpeg, '-y', '-ss', '1.5', '-to', '40.8',
    '-i', 'scratch/loic_takes/raw_block_4.wav',
    'scratch/loic_tight/t4.wav'
], check=True)

# Concat all segments into seamless master
parts = ['t1.wav', 't2_a.wav', 't2_b.wav', 't2_c.wav', 't2_d.wav', 't3_a.wav', 't3_b.wav', 't3_c.wav', 't3_d.wav', 't4.wav']
concat_txt = 'scratch/loic_tight/concat.txt'
with open(concat_txt, 'w', encoding='utf-8') as f:
    for p in parts:
        full_p = os.path.abspath(os.path.join('scratch/loic_tight', p)).replace('\\', '/')
        f.write(f"file '{full_p}'\n")

out_wav = 'assets/audio/video4_realvoice_tight.wav'
subprocess.run([ffmpeg, '-y', '-f', 'concat', '-safe', '0', '-i', concat_txt, out_wav], check=True)

# Master output: tightened, slight dynamic warmth
out_mp3 = 'assets/audio/video4_realvoice_master.mp3'
subprocess.run([
    ffmpeg, '-y', '-i', out_wav,
    '-filter:a', 'volume=1.2',
    '-b:a', '192k', out_mp3
], check=True)

res = subprocess.run([ffmpeg, '-i', out_mp3], stderr=subprocess.PIPE, text=True)
for line in res.stderr.splitlines():
    if 'Duration' in line:
        print(line)

print("Tightened master voice created successfully:", out_mp3)
