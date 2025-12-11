import os
from PIL import Image
import rawpy

def convert_cr2_to_jpg(input_folder, output_folder):
    """Convertit tous les fichiers CR2 en JPG"""
    
    # Créer le dossier de sortie s'il n'existe pas
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    # Liste des fichiers qui sont en fait des CR2 (renommés en .jpg)
    target_files = [
        'artisant_yomugiti_image_1.jpg',
        'artisant_yomugiti_image_2.jpg', 
        'event_image1_edition3.jpg',
        'event_image2_edition3.jpg',
        'event_image3_edition3.jpg',
        'event_image4_edition3.jpg',
        'event_image5_edition3.jpg',
        'ibirato_image_1.jpg',
        'ibirato_image_2.jpg',
        'ibirato_image_3.jpg',
        'ibirato_image_achat.jpg'
    ]
    
    cr2_files = [f for f in target_files if os.path.exists(os.path.join(input_folder, f))]
    
    if not cr2_files:
        print("Aucun fichier cible trouvé dans le dossier.")
        return
    
    print(f"Trouvé {len(cr2_files)} fichiers CR2 à convertir...")
    
    for filename in cr2_files:
        input_path = os.path.join(input_folder, filename)
        output_filename = filename  # Garder le même nom
        output_path = os.path.join(output_folder, output_filename)
        
        try:
            print(f"Conversion de {filename}...")
            
            # Lire le fichier RAW
            with rawpy.imread(input_path) as raw:
                # Convertir en RGB
                rgb = raw.postprocess()
            
            # Créer une image PIL
            image = Image.fromarray(rgb)
            
            # Redimensionner pour le web (max 800px de largeur)
            if image.width > 800:
                ratio = 800 / image.width
                new_height = int(image.height * ratio)
                image = image.resize((800, new_height), Image.Resampling.LANCZOS)
            
            # Sauvegarder en JPG avec compression
            image.save(output_path, 'JPEG', quality=85, optimize=True)
            print(f"OK {output_filename} cree avec succes")
            
        except Exception as e:
            print(f"ERREUR lors de la conversion de {filename}: {e}")

if __name__ == "__main__":
    # Dossier contenant les fichiers CR2 originaux
    input_folder = "public"  # Dossier actuel avec les fichiers .jpg (qui sont en fait des CR2)
    output_folder = "public/converted"  # Nouveau dossier pour les vrais JPG
    
    print("Conversion des fichiers CR2 en JPG...")
    convert_cr2_to_jpg(input_folder, output_folder)
    print("Conversion terminée !")