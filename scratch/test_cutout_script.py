from PIL import Image
import numpy as np

def make_cutout(img_path, out_path):
    img = Image.open(img_path).convert("RGBA")
    data = np.array(img, dtype=np.float32)
    
    # Calculate brightness / luminance
    r, g, b = data[:,:,0], data[:,:,1], data[:,:,2]
    luminance = 0.299 * r + 0.587 * g + 0.114 * b
    
    # The background is very dark (luminance < 35) except near the character edges where there is emerald green rim
    # We create a smooth alpha ramp between luminance 15 and 65
    alpha = np.clip((luminance - 15) / 50.0, 0.0, 1.0) * 255.0
    
    # But wait, character dark hair or dark pants might have low luminance!
    # Let's check: character pants are dark grey/black, shoes are black.
    # So a simple luminance key would make his pants semi-transparent!
    print("Character pants could be affected by pure luminance threshold.")

make_cutout("assets/images/loic_professor_presenting.jpg", "scratch/test_cutout.png")
