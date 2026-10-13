import os
import time
import subprocess
import imageio_ffmpeg
from playwright.sync_api import sync_playwright

os.makedirs('assets/video', exist_ok=True)
os.makedirs('scratch/recordings', exist_ok=True)

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
audio_path = 'assets/audio/video4_realvoice_master.mp3'

def record_both_formats():
    # 1. Format 16:9
    print("--- [DOMTOM CONNECT] Recording Real Voice Video 4 (16:9) ---", flush=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(
            record_video_dir='scratch/recordings',
            record_video_size={'width': 1280, 'height': 720},
            viewport={'width': 1280, 'height': 720}
        )
        page = ctx.new_page()
        
        t_nav_start = time.time()
        page.goto('http://localhost:8088/render-video4-realvoice.html?record=1&format=16-9')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(1000)
        
        t_play_start = time.time()
        page.evaluate("document.querySelector('audio').play()")
        offset = t_play_start - t_nav_start
        print(f"Audio started at offset: {offset:.2f}s", flush=True)
        
        print("Recording in progress (142 seconds)...", flush=True)
        page.wait_for_timeout(142000)
        
        ctx.close()
        raw_video_16 = page.video.path()
        browser.close()

    output_16 = os.path.join('assets/video', 'DOMTOM_CONNECT_Video4_VoixReelle_16x9.mp4')
    cmd_16 = [
        ffmpeg_exe, "-y",
        "-ss", str(round(offset, 2)),
        "-i", raw_video_16,
        "-i", audio_path,
        "-c:v", "libx264", "-preset", "fast", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest", output_16
    ]
    subprocess.run(cmd_16, check=True)
    print(f"SUCCESS: {output_16} created ({os.path.getsize(output_16)/(1024*1024):.2f} MB)", flush=True)

    # 2. Format 9:16
    print("--- [DOMTOM CONNECT] Recording Real Voice Video 4 (9:16) ---", flush=True)
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
        offset_9 = t_play_start - t_nav_start
        
        print("Recording in progress (142 seconds)...", flush=True)
        page.wait_for_timeout(142000)
        
        ctx.close()
        raw_video_9 = page.video.path()
        browser.close()

    output_9 = os.path.join('assets/video', 'DOMTOM_CONNECT_Video4_VoixReelle_9x16.mp4')
    cmd_9 = [
        ffmpeg_exe, "-y",
        "-ss", str(round(offset_9, 2)),
        "-i", raw_video_9,
        "-i", audio_path,
        "-c:v", "libx264", "-preset", "fast", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest", output_9
    ]
    subprocess.run(cmd_9, check=True)
    print(f"SUCCESS: {output_9} created ({os.path.getsize(output_9)/(1024*1024):.2f} MB)", flush=True)

if __name__ == '__main__':
    record_both_formats()
