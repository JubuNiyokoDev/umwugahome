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
import { Skeleton } from "./ui/skeleton";

interface ArtisanCardProps {
  artisan: Artisan | null;
}

export function ArtisanCard({ artisan }: ArtisanCardProps) {
  if (!artisan) {
    return (
      <Card className="flex flex-col overflow-hidden h-full shadow-lg">
        <Skeleton className="h-48 w-full" />
        <CardContent className="flex-grow p-4 space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    )
  }
  
  return (
    <motion.div whileHover={{ y: -8, boxShadow: "var(--tw-shadow-xl)" }} transition={{ duration: 0.3, ease: 'easeOut' }}>
      <Card className="flex flex-col overflow-hidden h-full shadow-lg bg-card/80 backdrop-blur-sm">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full overflow-hidden">
            {artisan.profileImageId && (
              <motion.div className="h-full w-full" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <Image
                  src={artisan.profileImageId}
                  alt={artisan.name}
                  fill
                  className="object-cover"
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