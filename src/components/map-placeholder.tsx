import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

export function MapPlaceholder() {
  const mapImage = PlaceHolderImages.find(img => img.id === 'map-burundi');

  if (!mapImage) return null;

  return (
    <Card className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-lg shadow-lg">
      <Image
        src={mapImage.imageUrl}
        alt={mapImage.description}
        fill
        className="object-cover"
        data-ai-hint={mapImage.imageHint}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
        <h3 className="text-3xl md:text-4xl font-bold font-headline mb-4 drop-shadow-md">
          Explorez les Métiers du Burundi
        </h3>
        <p className="max-w-2xl mb-6 drop-shadow">
          Trouvez des artisans et des centres de formation près de chez vous sur notre carte interactive.
        </p>
        <Button size="lg">Lancer la carte interactive</Button>
      </div>
    </Card>
  );
}
