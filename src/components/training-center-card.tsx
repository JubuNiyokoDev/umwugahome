import type { TrainingCenter } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "./ui/button";
import Link from "next/link";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface TrainingCenterCardProps {
  center: TrainingCenter;
}

export function TrainingCenterCard({ center }: TrainingCenterCardProps) {
  const image = PlaceHolderImages.find(p => p.id === center.imageId);

  return (
    <motion.div whileHover={{ y: -8, boxShadow: "0 10px 20px -5px hsl(var(--primary) / 0.1)" }} transition={{ duration: 0.3, ease: 'easeOut' }}>
    <Card className="flex flex-col overflow-hidden transition-all duration-300 h-full border-0 shadow-lg shadow-black/20">
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
