"use client";

import type { TrainingCenter } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "./ui/button";
import Link from "next/link";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "./ui/skeleton";

interface TrainingCenterCardProps {
  center: TrainingCenter | null;
}

export function TrainingCenterCard({ center }: TrainingCenterCardProps) {
  if (!center) {
    return (
      <Card className="flex flex-col overflow-hidden h-full shadow-lg">
        <Skeleton className="h-48 w-full" />
        <CardContent className="flex-grow p-4 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    )
  }

  const image = PlaceHolderImages.find(p => p.id === center.imageId);

  return (
    <motion.div whileHover={{ y: -8, boxShadow: "var(--tw-shadow-xl)" }} transition={{ duration: 0.3, ease: 'easeOut' }}>
    <Card className="flex flex-col overflow-hidden transition-all duration-300 h-full shadow-lg">
       <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          {image && (
             <motion.div className="h-full w-full" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <Image
                src={image.imageUrl}
                alt={center.name}
                fill
                className="object-cover"
                data-ai-hint={image.imageHint}
              />
            </motion.div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="font-headline text-lg">{center.name}</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">{center.province}</p>
        <CardDescription className="mt-2 text-sm line-clamp-3">{center.description}</CardDescription>
        <div className="flex items-center gap-1 mt-2">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-bold">{center.rating}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/training/${center.id}`}>Voir les formations</Link>
        </Button>
      </CardFooter>
    </Card>
    </motion.div>
  )
}