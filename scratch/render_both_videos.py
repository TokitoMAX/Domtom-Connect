import os
import time
import subprocess
import imageio_ffmpeg
from playwright.sync_api import sync_playwright

os.makedirs('assets/video', exist_ok=True)
os.makedirs('scratch/recordings', exist_ok=True)

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
audio_path = 'assets/audio/video3_complete.mp3'

def record_format(name, width, height, format_param):
    output_mp4 = os.path.join('assets/video', f'DOMTOM_CONNECT_Video3_{name}.mp4')
    print(f"\n=======================================================", flush=True)
    print(f"--- [DOMTOM CONNECT] Starting Recording: {name} ({width}x{height}) ---", flush=True)
    print(f"=======================================================", flush=True)
    
    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(
            record_video_dir='scratch/recordings',
            record_video_size={'width': width, 'height': height},
            viewport={'width': width, 'height': height}
        )
        t_page_start = time.time()
        page = ctx.new_page()
        
        page.goto(f'http://localhost:8088/render-video3.html?format={format_param}')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(500)
        
        t_play_start = time.time()
        page.evaluate("document.querySelector('audio').play()")
        offset = t_play_start - t_page_start
        print(f"[{name}] Audio started at offset: {offset:.2f}s", flush=True)
        
        # 302 seconds playback
        print(f"[{name}] Recording in progress (302 seconds)...", flush=True)
        page.wait_for_timeout(302000)
        
        ctx.close()
        raw_video = page.video.path()
        browser.close()
        print(f"[{name}] Raw recording saved to: {raw_video}", flush=True)

    print(f"[{name}] Muxing with FFmpeg to {output_mp4}...", flush=True)
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
        print(f"[{name}] SUCCESS: {output_mp4} created ({size_mb:.2f} MB)", flush=True)
    else:
        print(f"[{name}] FFmpeg error:", res.stderr.decode('utf-8', errors='ignore')[-500:], flush=True)

if __name__ == '__main__':
    record_format('16x9', 1280, 720, '16-9')
    record_format('9x16', 720, 1280, '9-16')
    print("\nALL RECORDINGS COMPLETE!", flush=True)
