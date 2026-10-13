import os
import time
import subprocess
import imageio_ffmpeg
from playwright.sync_api import sync_playwright

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
audio_path = 'assets/audio/cours_marketing_01_master.mp3'

with sync_playwright() as p:
    browser = p.chromium.launch()
    ctx = browser.new_context(
        record_video_dir='scratch/recordings',
        record_video_size={'width': 1280, 'height': 720},
        viewport={'width': 1280, 'height': 720}
    )
    page = ctx.new_page()
    t_start = time.time()
    page.goto('http://localhost:8088/render-video4-realvoice.html?record=1&format=16-9')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1000)
    page.evaluate("document.querySelector('audio').play()")
    offset = time.time() - t_start
    page.wait_for_timeout(88000)
    ctx.close()
    raw_video = page.video.path()
    browser.close()

out_16 = 'assets/video/DOMTOM_CONNECT_CoursMarketing01_16x9.mp4'
cmd = [
    ffmpeg_exe, '-y',
    '-ss', str(round(offset, 2)),
    '-i', raw_video,
    '-i', audio_path,
    '-c:v', 'libx264', '-preset', 'fast', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k',
    '-shortest', out_16
]
subprocess.run(cmd, check=True)
print(f"SUCCESS: {out_16} created ({os.path.getsize(out_16)/(1024*1024):.2f} MB)")
