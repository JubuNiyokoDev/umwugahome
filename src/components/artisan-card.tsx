'use client';

import type { Artisan } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Link from "next/link";
import { Star } from "lucide-react";
import { motion } from 'framer-motion';

interface ArtisanCardProps {
  artisan: Artisan;
}

export function ArtisanCard({ artisan }: ArtisanCardProps) {
  const profileImage = PlaceHolderImages.find(p => p.id === artisan.profileImageId);

  return (
    <motion.div whileHover={{ y: -8, boxShadow: "0 10px 20px -5px hsl(var(--primary) / 0.1)" }} transition={{ duration: 0.3, ease: 'easeOut' }}>
    <Card className="flex flex-col overflow-hidden h-full border-0 shadow-lg shadow-black/20">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden">
          {profileImage && (
            <motion.div className="h-full w-full" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <Image
                src={profileImage.imageUrl}
                alt={artisan.name}
                fill
                className="object-cover"
                data-ai-hint={profileImage.imageHint}
              />
            </motion.div>
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
    </motion.div>
  )
}
