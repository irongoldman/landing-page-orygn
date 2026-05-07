import os
import glob
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    import subprocess
    import sys
    print("Pillow no está instalado. Instalando...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image

def convert_to_webp(folder_path="assets/images"):
    # Convert absolute or relative path
    target_dir = Path(folder_path)
    if not target_dir.exists():
        print(f"Directory {folder_path} not found.")
        return
        
    image_files = []
    image_files.extend(target_dir.glob("*.png"))
    image_files.extend(target_dir.glob("*.jpg"))
    image_files.extend(target_dir.glob("*.jpeg"))
    
    count = 0
    for img_path in image_files:
        webp_path = img_path.with_suffix('.webp')
        
        # Omitir si ya existe y es más reciente
        if webp_path.exists() and webp_path.stat().st_mtime >= img_path.stat().st_mtime:
            print(f"Skipping {img_path.name}, webp is up to date.")
            continue
            
        try:
            with Image.open(img_path) as img:
                # Si la imagen tiene transparencia y la convertimos a formato que no soporta, Pillow se quejará
                # WebP soporta RGBA
                img.save(webp_path, "webp", quality=85)
                print(f"Convirtió: {img_path.name} -> {webp_path.name}")
                count += 1
        except Exception as e:
            print(f"Error al convertir {img_path.name}: {e}")
            
    print(f"Se convirtieron {count} imágenes con éxito.")

if __name__ == "__main__":
    convert_to_webp()
