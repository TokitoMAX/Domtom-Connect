import os
import time
from playwright.sync_api import sync_playwright

os.makedirs('assets/video', exist_ok=True)

def record_both_pure_videos():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        
        # 1. RECORD PURE 16:9
        print("Starting Pure 16:9 recording...")
        ctx_16 = browser.new_context(
            record_video_dir='assets/video',
            record_video_size={'width': 1280, 'height': 720},
            viewport={'width': 1280, 'height': 720}
        )
        page_16 = ctx_16.new_page()
        page_16.goto('http://localhost:8088/render-frame.html?format=16-9')
        page_16.click('body') # Trigger play
        page_16.wait_for_timeout(39000)
        ctx_16.close()
        
        v16_path = page_16.video.path()
        final_16 = os.path.join('assets/video', 'DOMTOM_CONNECT_TestB_16x9.webm')
        if os.path.exists(final_16):
            os.remove(final_16)
        os.rename(v16_path, final_16)
        print("Pure 16:9 saved to:", final_16)
        
        # 2. RECORD PURE 9:16
        print("Starting Pure 9:16 vertical recording...")
        ctx_9 = browser.new_context(
            record_video_dir='assets/video',
            record_video_size={'width': 720, 'height': 1280},
            viewport={'width': 720, 'height': 1280}
        )
        page_9 = ctx_9.new_page()
        page_9.goto('http://localhost:8088/render-frame.html?format=9-16')
        page_9.click('body') # Trigger play
        page_9.wait_for_timeout(39000)
        ctx_9.close()
        
        v9_path = page_9.video.path()
        final_9 = os.path.join('assets/video', 'DOMTOM_CONNECT_TestB_9x16.webm')
        if os.path.exists(final_9):
            os.remove(final_9)
        os.rename(v9_path, final_9)
        print("Pure 9:16 saved to:", final_9)
        
        browser.close()

if __name__ == '__main__':
    record_both_pure_videos()
