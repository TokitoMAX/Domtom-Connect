import os
import time
import subprocess
import imageio_ffmpeg
from playwright.sync_api import sync_playwright

os.makedirs('assets/video', exist_ok=True)
os.makedirs('scratch/recordings', exist_ok=True)

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()

def record_and_merge_16x9():
    print("--- [DOMTOM CONNECT] Launching Video 4 80/20 16:9 Recording ---", flush=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(
            record_video_dir='scratch/recordings',
            record_video_size={'width': 1280, 'height': 720},
            viewport={'width': 1280, 'height': 720}
        )
        page = ctx.new_page()
        
        html_path = os.path.abspath('render-video4-8020.html').replace('\\', '/')
        t_nav_start = time.time()
        page.goto(f'file:///{html_path}?format=16-9')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(1000)
        
        t_play_start = time.time()
        page.evaluate("document.querySelector('audio').play()")
        offset = t_play_start - t_nav_start
        print(f"Audio started at offset: {offset:.2f}s", flush=True)
        
        # Duration: 334 seconds
        print("Recording in progress (334 seconds)...", flush=True)
        page.wait_for_timeout(334000)
        
        ctx.close()
        raw_video = page.video.path()
        browser.close()
        print("Raw WebM recording saved to:", raw_video, flush=True)

    # Merge with FFmpeg
    output_mp4 = os.path.join('assets/video', 'DOMTOM_CONNECT_Video4_8020_16x9.mp4')
    audio_path = 'assets/audio/video4_8020_complete.mp3'
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
    subprocess.run(cmd, check=True)
    print(f"--- [SUCCESS] Video 4 16:9 ready at: {output_mp4} ---", flush=True)

if __name__ == '__main__':
    record_and_merge_16x9()
