import os
from PIL import Image
import rawpy

def convert_cr2_to_jpg(input_folder, output_folder):
    """Convertit tous les fichiers CR2 en JPG"""
    
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    cr2_files = [f for f in os.listdir(input_folder) if f.lower().endswith('.cr2')]
    
    if not cr2_files:
        print(f"Aucun fichier CR2 trouvé dans {input_folder}")
        return
    
    print(f"Trouvé {len(cr2_files)} fichiers CR2 à convertir...")
    
    for filename in cr2_files:
        input_path = os.path.join(input_folder, filename)
        output_filename = filename.replace('.CR2', '.jpg').replace('.cr2', '.jpg')
        output_path = os.path.join(output_folder, output_filename)
        
        try:
            print(f"Conversion de {filename}...")
            
            with rawpy.imread(input_path) as raw:
                rgb = raw.postprocess()
            
            image = Image.fromarray(rgb)
            
            if image.width > 800:
                ratio = 800 / image.width
                new_height = int(image.height * ratio)
                image = image.resize((800, new_height), Image.Resampling.LANCZOS)
            
            image.save(output_path, 'JPEG', quality=85, optimize=True)
            print(f"OK {output_filename} cree avec succes")
            
        except Exception as e:
            print(f"ERREUR lors de la conversion de {filename}: {e}")

def combine_images():
    """Combine les images du dossier RC2 et converted"""
    
    # Convertir les nouveaux fichiers CR2
    convert_cr2_to_jpg("public/RC2", "public/converted")
    
    # Copier toutes les images converties vers public
    converted_files = [f for f in os.listdir("public/converted") if f.lower().endswith('.jpg')]
    
    print(f"Copie de {len(converted_files)} images vers public/")
    
    for filename in converted_files:
        src = os.path.join("public/converted", filename)
        dst = os.path.join("public", filename)
        
        try:
            with open(src, 'rb') as f_src:
                with open(dst, 'wb') as f_dst:
                    f_dst.write(f_src.read())
            print(f"Copie: {filename}")
        except Exception as e:
            print(f"Erreur copie {filename}: {e}")

if __name__ == "__main__":
    print("Conversion et combinaison des images...")
    combine_images()
    print("Terminé!")