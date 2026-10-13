import os
import time
from playwright.sync_api import sync_playwright

os.makedirs('assets/video', exist_ok=True)

def record_9x16():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(
            record_video_dir='assets/video',
            record_video_size={'width': 720, 'height': 1280},
            viewport={'width': 720, 'height': 1280}
        )
        page = context.new_page()
        page.goto('http://localhost:8088/video-studio.html')
        page.wait_for_timeout(1000)
        
        # Switch to 9:16 mode
        page.click('#btn-9-16')
        page.wait_for_timeout(500)
        
        # Click play button
        page.click('#play-btn')
        print("Recording 9:16 started...")
        
        # Audio is ~38 seconds
        page.wait_for_timeout(39000)
        
        # Close to save video
        context.close()
        video_path = page.video.path()
        final_9x16 = os.path.join('assets/video', 'DOMTOM_CONNECT_TestB_9x16.webm')
        if os.path.exists(final_9x16):
            os.remove(final_9x16)
        os.rename(video_path, final_9x16)
        print("Saved 9:16 to:", final_9x16)
        browser.close()

if __name__ == '__main__':
    record_9x16()
