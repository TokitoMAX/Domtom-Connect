import os
import time
import subprocess
import imageio_ffmpeg
from playwright.sync_api import sync_playwright

os.makedirs('assets/video', exist_ok=True)
os.makedirs('scratch/recordings', exist_ok=True)

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()

def record_and_merge_9x16():
    print("--- [DOMTOM CONNECT] Launching Video 3 9:16 Vertical Recording ---", flush=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(
            record_video_dir='scratch/recordings',
            record_video_size={'width': 720, 'height': 1280},
            viewport={'width': 720, 'height': 1280}
        )
        page = ctx.new_page()
        
        t_nav_start = time.time()
        page.goto('http://localhost:8088/render-video3.html?format=9-16')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(1000)
        
        t_play_start = time.time()
        page.evaluate("document.querySelector('audio').play()")
        offset = t_play_start - t_nav_start
        print(f"Audio started at offset: {offset:.2f}s", flush=True)
        
        # Duration: 302 seconds
        print("Recording in progress (302 seconds)...", flush=True)
        page.wait_for_timeout(302000)
        
        ctx.close()
        raw_video = page.video.path()
        browser.close()
        print("Raw WebM vertical recording saved to:", raw_video, flush=True)

    # Merge with FFmpeg
    output_mp4 = os.path.join('assets/video', 'DOMTOM_CONNECT_Video3_9x16.mp4')
    audio_path = 'assets/audio/video3_complete.mp3'
    print(f"Muxing video with audio (offset: {offset:.2f}s) to {output_mp4}...", flush=True)
    
    cmd = [
        ffmpeg_exe,
        "-y",
        "-ss", str(round(offset, 2)),
        "-i", raw_video,
        "-i", audio_path,
        "-c:v", "libx264",
        "-preset", "fast",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        output_mp4
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if res.returncode == 0:
        size_mb = os.path.getsize(output_mp4) / (1024 * 1024)
        print(f"SUCCESS: {output_mp4} created ({size_mb:.2f} MB)", flush=True)
    else:
        print("FFmpeg error:", res.stderr.decode('utf-8', errors='ignore')[-500:], flush=True)

if __name__ == '__main__':
    record_and_merge_9x16()
