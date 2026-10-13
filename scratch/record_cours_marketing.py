import os
import time
import subprocess
import imageio_ffmpeg
from playwright.sync_api import sync_playwright

os.makedirs('assets/video', exist_ok=True)
os.makedirs('scratch/recordings', exist_ok=True)

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
audio_path = 'assets/audio/cours_marketing_01_master.mp3'

def record_cours_marketing():
    print("--- [DOMTOM CONNECT] Recording Cours Marketing #1 (9:16 Shorts) ---", flush=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(
            record_video_dir='scratch/recordings',
            record_video_size={'width': 720, 'height': 1280},
            viewport={'width': 720, 'height': 1280}
        )
        page = ctx.new_page()
        
        t_nav_start = time.time()
        page.goto('http://localhost:8088/render-video4-realvoice.html?record=1')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(1000)
        
        t_play_start = time.time()
        page.evaluate("document.querySelector('audio').play()")
        offset = t_play_start - t_nav_start
        
        # 87 seconds duration
        print("Recording in progress (88 seconds)...", flush=True)
        page.wait_for_timeout(88000)
        
        ctx.close()
        raw_video = page.video.path()
        browser.close()

    output_916 = os.path.join('assets/video', 'DOMTOM_CONNECT_CoursMarketing01_9x16.mp4')
    cmd = [
        ffmpeg_exe, "-y",
        "-ss", str(round(offset, 2)),
        "-i", raw_video,
        "-i", audio_path,
        "-c:v", "libx264", "-preset", "fast", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest", output_916
    ]
    subprocess.run(cmd, check=True)
    print(f"SUCCESS: {output_916} created ({os.path.getsize(output_916)/(1024*1024):.2f} MB)", flush=True)

if __name__ == '__main__':
    record_cours_marketing()
