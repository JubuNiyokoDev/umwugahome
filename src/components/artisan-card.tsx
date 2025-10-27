import type { Artisan } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Link from "next/link";
import { Star } from "lucide-react";

interface ArtisanCardProps {
  artisan: Artisan;
}

export function ArtisanCard({ artisan }: ArtisanCardProps) {
  const profileImage = PlaceHolderImages.find(p => p.id === artisan.profileImageId);

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          {profileImage && (
            <Image
              src={profileImage.imageUrl}
              alt={artisan.name}
              fill
              className="object-cover"
              data-ai-hint={profileImage.imageHint}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <Badge variant="secondary" className="mb-2">{artisan.craft}</Badge>
        <h3 className="text-lg font-bold font-headline">{artisan.name}</h3>
        <p className="text-sm text-muted-foreground">{artisan.province}</p>
        <div className="flex items-center gap-1 mt-2">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-bold">{artisan.rating}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/artisans/${artisan.id}`}>Voir le profil</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
