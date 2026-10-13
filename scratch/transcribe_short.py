import imageio_ffmpeg
import subprocess
import speech_recognition as sr

ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
subprocess.run([ffmpeg, '-y', '-i', 'scratch/short_loic.webm', '-ar', '16000', '-ac', '1', 'scratch/short_loic.wav'], check=True)

r = sr.Recognizer()
with sr.AudioFile('scratch/short_loic.wav') as source:
    audio = r.record(source)
    text = r.recognize_google(audio, language='fr-FR')
    print("TRANSCRIPT:")
    print(text)
