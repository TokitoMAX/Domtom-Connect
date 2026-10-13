import os
import subprocess
import imageio_ffmpeg
from playwright.sync_api import sync_playwright

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
print("FFmpeg executable:", ffmpeg_exe)

def test_quick_record():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(
            record_video_dir='scratch',
            record_video_size={'width': 1280, 'height': 720},
            viewport={'width': 1280, 'height': 720}
        )
        page = ctx.new_page()
        page.goto('http://localhost:8088/render-longue.html?format=16-9')
        page.wait_for_load_state('networkidle')
        page.evaluate("document.querySelector('audio').play()")
        page.wait_for_timeout(3000)
        ctx.close()
        video_path = page.video.path()
        print("Quick test video captured:", video_path)
        browser.close()

if __name__ == '__main__':
    test_quick_record()
