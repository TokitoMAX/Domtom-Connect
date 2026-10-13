import os
import time
from playwright.sync_api import sync_playwright

os.makedirs('assets/video', exist_ok=True)

def record():
    with sync_playwright() as p:
        # 16:9 recording
        browser = p.chromium.launch()
        context = browser.new_context(
            record_video_dir='assets/video',
            record_video_size={'width': 1280, 'height': 720},
            viewport={'width': 1280, 'height': 720}
        )
        page = context.new_page()
        page.goto('http://localhost:8088/video-studio.html')
        page.wait_for_timeout(1000)
        
        # Click play button
        page.click('#play-btn')
        print("Recording 16:9 started...")
        
        # Audio is ~38 seconds
        page.wait_for_timeout(39000)
        
        # Close to save video
        context.close()
        video_path = page.video.path()
        final_16x9 = os.path.join('assets/video', 'DOMTOM_CONNECT_TestB_16x9.webm')
        if os.path.exists(final_16x9):
            os.remove(final_16x9)
        os.rename(video_path, final_16x9)
        print("Saved 16:9 to:", final_16x9)
        browser.close()

if __name__ == '__main__':
    record()
