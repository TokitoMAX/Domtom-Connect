import subprocess
import imageio_ffmpeg
import os

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
print("Using FFmpeg:", ffmpeg_exe)

def merge_synced(video_in, audio_in, video_offset, output_mp4):
    print(f"\nProcessing {output_mp4} (trimming video by {video_offset}s)...")
    cmd = [
        ffmpeg_exe,
        "-y",
        "-ss", str(video_offset),
        "-i", video_in,
        "-i", audio_in,
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
        print(f"SUCCESS: {output_mp4} ({os.path.getsize(output_mp4)} bytes)")
    else:
        print("ERROR:", res.stderr.decode('utf-8', errors='ignore')[-500:])

if __name__ == '__main__':
    # 16:9 video had 3.75s of initial browser page load
    merge_synced(
        'assets/video/DOMTOM_CONNECT_TestB_16x9.webm',
        'assets/audio/test_b_audio.mp3',
        3.75,
        'assets/video/DOMTOM_CONNECT_TestB_16x9.mp4'
    )
    # 9:16 video had 0.1s
    merge_synced(
        'assets/video/DOMTOM_CONNECT_TestB_9x16.webm',
        'assets/audio/test_b_audio.mp3',
        0.10,
        'assets/video/DOMTOM_CONNECT_TestB_9x16.mp4'
    )
