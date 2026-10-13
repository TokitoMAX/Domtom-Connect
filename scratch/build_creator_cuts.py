import os
import subprocess
import imageio_ffmpeg

ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
os.makedirs('scratch/creator_audio', exist_ok=True)
os.makedirs('assets/audio', exist_ok=True)

# 1. Short 60s Cut snippets (Straight to the point):
parts_60 = [
    's1_hook.wav',
    's3_virement.wav',
    's4_delais.wav',
    's5_charges_banque.wav',
    's6_sante.wav',
    's7_verrous_intro.wav',
    's8_v1_acompte.wav',
    's9_v1_pas_acompte.wav',
    's11_v2_avancement.wav',
    's12_v3_relances.wav',
    's15_copilote.wav',
    's16_anamnese.wav',
    's17_calendly.wav',
    's18_stay_co.wav'
]

concat_60_txt = 'scratch/creator_audio/concat_60.txt'
with open(concat_60_txt, 'w', encoding='utf-8') as f:
    for p in parts_60:
        full_p = os.path.abspath(os.path.join('scratch/cut_test', p)).replace('\\', '/')
        f.write(f"file '{full_p}'\n")

raw_60 = 'scratch/creator_audio/raw_60.wav'
subprocess.run([ffmpeg, '-y', '-f', 'concat', '-safe', '0', '-i', concat_60_txt, raw_60], check=True)

# Apply pro broadcast voice filter:
# - highpass=f=80 (clean rumble)
# - equalizer=f=3000:t=q:w=1.5:g=3 (vocal presence & clarity)
# - compand (punchy broadcast loudness, smooth dynamics)
# - volume=1.25 (+25% volume)
out_60 = 'assets/audio/video4_realvoice_creator_60s.mp3'
subprocess.run([
    ffmpeg, '-y', '-i', raw_60,
    '-filter:a', 'highpass=f=80,equalizer=f=3000:t=q:w=1.5:g=3,compand=attacks=0.02:decays=0.2:points=-60/-60|-24/-12|0/-1,volume=1.25',
    '-b:a', '192k', out_60
], check=True)

res60 = subprocess.run([ffmpeg, '-i', out_60], stderr=subprocess.PIPE, text=True)
for l in res60.stderr.splitlines():
    if 'Duration:' in l:
        print('60s Cut Duration:', l.split('Duration:')[1].split(',')[0].strip())

# 2. Dynamic 90s Cut:
parts_90 = [
    's1_hook.wav', 's2_tabou.wav',
    's3_virement.wav', 's4_delais.wav', 's5_charges_banque.wav', 's6_sante.wav',
    's7_verrous_intro.wav', 's8_v1_acompte.wav', 's9_v1_pas_acompte.wav',
    's10_v2_intro.wav', 's11_v2_avancement.wav',
    's12_v3_relances.wav', 's13_v3_suspension.wav',
    's14_mal_imposer.wav', 's15_copilote.wav',
    's16_anamnese.wav', 's17_calendly.wav', 's18_stay_co.wav'
]

concat_90_txt = 'scratch/creator_audio/concat_90.txt'
with open(concat_90_txt, 'w', encoding='utf-8') as f:
    for p in parts_90:
        full_p = os.path.abspath(os.path.join('scratch/cut_test', p)).replace('\\', '/')
        f.write(f"file '{full_p}'\n")

raw_90 = 'scratch/creator_audio/raw_90.wav'
subprocess.run([ffmpeg, '-y', '-f', 'concat', '-safe', '0', '-i', concat_90_txt, raw_90], check=True)

out_90 = 'assets/audio/video4_realvoice_creator_90s.mp3'
subprocess.run([
    ffmpeg, '-y', '-i', raw_90,
    '-filter:a', 'highpass=f=80,equalizer=f=3000:t=q:w=1.5:g=3,compand=attacks=0.02:decays=0.2:points=-60/-60|-24/-12|0/-1,volume=1.25',
    '-b:a', '192k', out_90
], check=True)

res90 = subprocess.run([ffmpeg, '-i', out_90], stderr=subprocess.PIPE, text=True)
for l in res90.stderr.splitlines():
    if 'Duration:' in l:
        print('90s Cut Duration:', l.split('Duration:')[1].split(',')[0].strip())

print("SUCCESS: Both creator voice masters created!")
